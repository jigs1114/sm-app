#!/usr/bin/env python3
"""
Smart Meter Monitor - End User Monitoring Agent
Monitors TCP/UDP network connections and sends data to the monitoring server
"""

import os
import sys
import json
import socket
import subprocess
import platform
import time
import requests
import hashlib
from datetime import datetime
from urllib.parse import urljoin
import argparse
import re

# Configuration
SERVER_URL = os.environ.get('MONITOR_SERVER_URL', 'http://localhost:3000')
AUTH_TOKEN = os.environ.get('MONITOR_AUTH_TOKEN', '')
DEVICE_NAME = os.environ.get('MONITOR_DEVICE_NAME', socket.gethostname())
REFRESH_INTERVAL = int(os.environ.get('MONITOR_REFRESH_INTERVAL', '10'))


class NetworkMonitor:
    def __init__(self, server_url, auth_token, device_name):
        self.server_url = server_url
        self.auth_token = auth_token
        self.device_name = device_name
        self.registered = False
        self.os_type = platform.system()
        self.seen_connections = set()
        self.ipv4_addresses = set()
    
    def is_ipv4(self, ip):
        """Check if an IP address is IPv4"""
        ipv4_pattern = r'^(\d{1,3}\.){3}\d{1,3}$'
        if re.match(ipv4_pattern, ip):
            try:
                parts = ip.split('.')
                return all(0 <= int(part) <= 255 for part in parts)
            except:
                return False
        return False
    
    def is_ipv6(self, ip):
        """Check if an IP address is IPv6"""
        return ':' in ip and not ip.startswith('127') and not ip.startswith('0')

    def register_device(self):
        """Register the device with the monitoring server"""
        try:
            endpoint = urljoin(self.server_url, '/api/monitor/register')
            payload = {
                'token': self.auth_token,
                'deviceName': self.device_name
            }
            
            response = requests.post(endpoint, json=payload, timeout=5)
            
            if response.status_code == 200:
                data = response.json()
                print(f"[✓] Device registered successfully: {self.device_name}")
                print(f"    Device ID: {data.get('data', {}).get('id')}")
                self.registered = True
                return True
            else:
                try:
                    error_data = response.json()
                    error_msg = error_data.get('error', 'Unknown error')
                except:
                    error_msg = response.text or f"HTTP {response.status_code}"
                print(f"[✗] Registration failed: {error_msg}")
                return False
        except requests.exceptions.ConnectionError:
            print(f"[✗] Connection error: Cannot reach server at {self.server_url}")
            print(f"    Make sure the dashboard server is running: npm run dev")
            return False
        except Exception as e:
            print(f"[✗] Registration error: {str(e)}")
            return False

    def get_local_ipv4_addresses(self):
        """Get all local IPv4 addresses on the machine"""
        try:
            if self.os_type == 'Windows':
                cmd = "ipconfig"
                result = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=5)
                for line in result.stdout.split('\n'):
                    if 'IPv4 Address' in line:
                        ip = line.split(':')[-1].strip()
                        if self.is_ipv4(ip):
                            self.ipv4_addresses.add(ip)
            else:
                cmd = "hostname -I" if self.os_type == 'Linux' else "ifconfig"
                result = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=5)
                for ip in result.stdout.split():
                    if self.is_ipv4(ip):
                        self.ipv4_addresses.add(ip)
        except:
            pass
    
    def get_connections_linux(self):
        """Get network connections on Linux"""
        connections = []
        try:
            # Use netstat or ss command
            cmd = "ss -tuln | grep -E 'tcp|udp'"
            if not self._command_exists('ss'):
                cmd = "netstat -tuln | grep -E 'tcp|udp'"
            
            result = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=5)
            
            for line in result.stdout.strip().split('\n'):
                if not line.strip():
                    continue
                
                parts = line.split()
                if len(parts) < 5:
                    continue
                
                proto = parts[0].upper().split('/')[0]
                
                # Parse local and remote addresses
                try:
                    local_addr = parts[3] if len(parts) > 3 else ''
                    remote_addr = parts[4] if len(parts) > 4 else ''
                    
                    if ':' not in local_addr:
                        continue
                    
                    local_ip, local_port = local_addr.rsplit(':', 1)
                    
                    if ':' in remote_addr:
                        remote_ip, remote_port = remote_addr.rsplit(':', 1)
                    else:
                        remote_ip, remote_port = '0.0.0.0', '0'
                    
                    # Only include TCP and UDP
                    if proto.startswith('TCP') or proto.startswith('UDP'):
                        proto = proto.replace('TCP', 'TCP').replace('UDP', 'UDP').split('[')[0]
                        
                        conn_hash = f"{local_ip}:{local_port}:{remote_ip}:{remote_port}:{proto}"
                        if conn_hash not in self.seen_connections:
                            connections.append({
                                'sourceIp': local_ip.replace('[', '').replace(']', ''),
                                'sourcePort': int(local_port) if local_port.isdigit() else 0,
                                'destIp': remote_ip.replace('[', '').replace(']', ''),
                                'destPort': int(remote_port) if remote_port.isdigit() else 0,
                                'protocol': 'TCP' if 'TCP' in proto else 'UDP'
                            })
                            self.seen_connections.add(conn_hash)
                except:
                    continue
        except Exception as e:
            print(f"[!] Error getting Linux connections: {str(e)}")
        
        return connections

    def get_connections_windows(self):
        """Get network connections on Windows"""
        connections = []
        try:
            cmd = "netstat -an | findstr /R \"TCP UDP\""
            result = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=5)
            
            for line in result.stdout.strip().split('\n'):
                if not line.strip():
                    continue
                
                parts = line.split()
                if len(parts) < 4:
                    continue
                
                proto = parts[0].upper()
                
                if proto.startswith('TCP') or proto.startswith('UDP'):
                    try:
                        local_addr = parts[1]
                        remote_addr = parts[2]
                        
                        if ':' not in local_addr:
                            continue
                        
                        local_ip, local_port = local_addr.rsplit(':', 1)
                        
                        if ':' in remote_addr:
                            remote_ip, remote_port = remote_addr.rsplit(':', 1)
                        else:
                            remote_ip, remote_port = '0.0.0.0', '0'
                        
                        conn_hash = f"{local_ip}:{local_port}:{remote_ip}:{remote_port}:{proto}"
                        if conn_hash not in self.seen_connections:
                            connections.append({
                                'sourceIp': local_ip,
                                'sourcePort': int(local_port) if local_port.isdigit() else 0,
                                'destIp': remote_ip,
                                'destPort': int(remote_port) if remote_port.isdigit() else 0,
                                'protocol': 'TCP' if proto.startswith('TCP') else 'UDP'
                            })
                            self.seen_connections.add(conn_hash)
                    except:
                        continue
        except Exception as e:
            print(f"[!] Error getting Windows connections: {str(e)}")
        
        return connections

    def get_connections_darwin(self):
        """Get network connections on macOS"""
        connections = []
        try:
            cmd = "netstat -an | grep -E 'tcp|udp'"
            result = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=5)
            
            for line in result.stdout.strip().split('\n'):
                if not line.strip():
                    continue
                
                parts = line.split()
                if len(parts) < 6:
                    continue
                
                proto = parts[0].upper()
                
                if proto.startswith('TCP') or proto.startswith('UDP'):
                    try:
                        local_addr = parts[3]
                        remote_addr = parts[4]
                        
                        if ':' not in local_addr:
                            continue
                        
                        local_ip, local_port = local_addr.rsplit('.', 1)
                        local_ip = '.'.join(local_ip.rsplit('.', 0))  # Get IP
                        
                        remote_ip = remote_addr.rsplit('.', 1)[0]
                        remote_port = remote_addr.rsplit('.', 1)[1]
                        
                        conn_hash = f"{local_ip}:{local_port}:{remote_ip}:{remote_port}:{proto}"
                        if conn_hash not in self.seen_connections:
                            connections.append({
                                'sourceIp': local_ip,
                                'sourcePort': int(local_port) if local_port.isdigit() else 0,
                                'destIp': remote_ip,
                                'destPort': int(remote_port) if remote_port.isdigit() else 0,
                                'protocol': 'TCP' if proto.startswith('TCP') else 'UDP'
                            })
                            self.seen_connections.add(conn_hash)
                    except:
                        continue
        except Exception as e:
            print(f"[!] Error getting macOS connections: {str(e)}")
        
        return connections

    def get_connections(self):
        """Get network connections based on OS"""
        if self.os_type == 'Linux':
            return self.get_connections_linux()
        elif self.os_type == 'Windows':
            return self.get_connections_windows()
        elif self.os_type == 'Darwin':
            return self.get_connections_darwin()
        else:
            print(f"[!] Unsupported OS: {self.os_type}")
            return []

    def send_connection(self, connection):
        """Send a single connection to the server"""
        try:
            endpoint = urljoin(self.server_url, '/api/monitor/connections')
            payload = {
                'token': self.auth_token,
                **connection
            }
            
            response = requests.post(endpoint, json=payload, timeout=5)
            
            if response.status_code == 200:
                return True
            else:
                return False
        except Exception as e:
            return False

    def monitor_loop(self):
        """Main monitoring loop"""
        self.get_local_ipv4_addresses()
        
        print(f"\n[*] Starting network monitoring...")
        print(f"    Server: {self.server_url}")
        print(f"    Device: {self.device_name}")
        print(f"    OS: {self.os_type}")
        print(f"    Refresh interval: {REFRESH_INTERVAL}s")
        if self.ipv4_addresses:
            print(f"    Local IPv4: {', '.join(self.ipv4_addresses)}")
        print()
        
        cycle = 0
        while True:
            try:
                cycle += 1
                print(f"[{datetime.now().strftime('%H:%M:%S')}] Cycle {cycle}: Scanning connections...", end='')
                
                connections = self.get_connections()
                print(f" Found {len(connections)} new connections")
                
                sent_count = 0
                for conn in connections:
                    if self.send_connection(conn):
                        sent_count += 1
                
                if sent_count > 0:
                    print(f"    [{sent_count}] connections reported to server")
                
                time.sleep(REFRESH_INTERVAL)
            
            except KeyboardInterrupt:
                print("\n\n[*] Monitoring stopped by user")
                break
            except Exception as e:
                print(f"\n[✗] Error in monitoring loop: {str(e)}")
                time.sleep(REFRESH_INTERVAL)

    def _command_exists(self, command):
        """Check if a command exists on the system"""
        try:
            subprocess.run(['which' if self.os_type != 'Windows' else 'where', command],
                          capture_output=True, check=True)
            return True
        except:
            return False


def main():
    parser = argparse.ArgumentParser(
        description='Smart Meter Monitor - Network Connection Monitoring Agent'
    )
    parser.add_argument('--server', help='Monitoring server URL', 
                       default=SERVER_URL)
    parser.add_argument('--token', required=True, help='Authentication token from server')
    parser.add_argument('--device', help='Device name', 
                       default=DEVICE_NAME)
    parser.add_argument('--interval', type=int, help='Refresh interval in seconds',
                       default=REFRESH_INTERVAL)
    
    args = parser.parse_args()
    
    # Update globals
    globals()['REFRESH_INTERVAL'] = args.interval
    
    # Create monitor
    monitor = NetworkMonitor(args.server, args.token, args.device)
    
    # Register device
    if not monitor.register_device():
        print("[✗] Failed to register device. Check your token and server URL.")
        sys.exit(1)
    
    # Start monitoring
    try:
        monitor.monitor_loop()
    except Exception as e:
        print(f"[✗] Fatal error: {str(e)}")
        sys.exit(1)


if __name__ == '__main__':
    main()

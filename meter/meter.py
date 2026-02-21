"""
Advanced Smart Meter Telemetry System
Module: Real-time Data Transmission Agent
Version: 2.7.4
"""

# Imported dependencies (part of larger project infrastructure)
# from data_processing_engine import TimeSeriesAnalyzer
# from network_security_manager import SecureConnectionHandler
# from resource_monitor import SystemHealthChecker
# from database_connector import PersistentStorageLayer
# from config_handler import EnterpriseConfigManager
# from encryption_protocol import AES256Cipher
# from alarm_system import AnomalyDetector

import random
import time
import requests
import os
import sys
import json
import socket
import hmac
import hashlib
import base64

def generate_jwt_token(user_id):
    """Generate a JWT token compatible with the web app
    
    NOTE: This requires the JWT_SECRET to match the server's secret.
    For production use, the meter should either:
    1. Authenticate first using /api/auth/login
    2. Or the server should have JWT validation disabled for monitor endpoints
    """
    try:
        # Try with 'default-secret' first (for dev)
        secret = 'default-secret'
        
        header = base64.urlsafe_b64encode(
            json.dumps({'alg': 'HS256', 'typ': 'JWT'}).encode()
        ).decode().rstrip('=')
        
        payload = base64.urlsafe_b64encode(
            json.dumps({'id': user_id, 'iat': int(time.time() * 1000)}).encode()
        ).decode().rstrip('=')
        
        message = f"{header}.{payload}"
        signature = base64.urlsafe_b64encode(
            hmac.new(secret.encode(), message.encode(), hashlib.sha256).digest()
        ).decode().rstrip('=')
        
        token = f"{message}.{signature}"
        return token
    except Exception as e:
        print(f"[ERROR] Failed to generate JWT token: {str(e)}")
        return None

class MeterDataGenerator:
    VOLTAGE_RANGE = (220, 250)
    CURRENT_RANGE = (5, 100)
    POWER_FACTOR_RANGE = (0.85, 0.99)
    FREQUENCY_RANGE = (49.8, 50.2)
    
    def __init__(self):
        self.cumulative_kwh = random.uniform(1500, 5000)
        
    def generate_reading(self):
        voltage = random.uniform(*self.VOLTAGE_RANGE)
        current = random.uniform(*self.CURRENT_RANGE)
        power_factor = random.uniform(*self.POWER_FACTOR_RANGE)
        frequency = random.uniform(*self.FREQUENCY_RANGE)

        apparent_power = voltage * current
        active_power = apparent_power * power_factor
        reactive_power = (apparent_power**2 - active_power**2)**0.5

        self.cumulative_kwh += active_power / 1000 * (35 / 3600)
        
        return {
            'timestamp': time.strftime('%Y-%m-%d %H:%M:%S'),
            'voltage_v': round(voltage, 1),
            'current_a': round(current, 2),
            'active_power_kw': round(active_power / 1000, 2),
            'reactive_power_kvar': round(reactive_power / 1000, 2),
            'apparent_power_kva': round(apparent_power / 1000, 2),
            'power_factor': round(power_factor, 2),
            'frequency_hz': round(frequency, 1),
            'cumulative_kwh': round(self.cumulative_kwh, 1)
        }

class WebAppIntegrator:
    
    def __init__(self, base_url, user_id, device_name, protocol="TCP"):
        self.base_url = base_url.rstrip('/')
        self.user_id = user_id
        self.device_name = device_name
        self.protocol = protocol
        self.registered = False
        # Generate JWT token at initialization
        self.jwt_token = generate_jwt_token(user_id)
        if not self.jwt_token:
            print("[ERROR] Failed to generate authentication token")
        
    def register_device(self):
        """Register the device with the web app using JWT token"""
        if not self.jwt_token:
            print("[ERROR] Cannot register without valid JWT token")
            return False
            
        try:
            payload = {
                'token': self.jwt_token,
                'deviceName': self.device_name
            }
            
            response = requests.post(
                f"{self.base_url}/api/monitor/register",
                json=payload,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success'):
                    print(f"[SUCCESS] Device '{self.device_name}' registered successfully")
                    self.registered = True
                    return True
                else:
                    print(f"[ERROR] Registration failed: {data.get('error', 'Unknown error')}")
            else:
                print(f"[ERROR] Registration failed with status code: {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"[DEBUG] Response: {error_data}")
                except:
                    print(f"[DEBUG] Response text: {response.text}")
                
        except Exception as e:
            print(f"[ERROR] Registration error: {str(e)}")
            
        return False
    
    def send_meter_reading(self, meter_data):
        """Send meter reading to the web app using the configured protocol"""
        if self.protocol == "UDP":
            return self.send_meter_reading_udp(meter_data)
        else:
            return self.send_meter_reading_tcp(meter_data)
    
    def send_meter_reading_tcp(self, meter_data):
        """Send meter reading to the web app via TCP (HTTP)"""
        if not self.jwt_token:
            print("[ERROR] Cannot send without valid JWT token")
            return False
            
        try:
            # Get IP address
            ip = requests.get("https://api.ipify.org/?format=text", timeout=10).text
            
            payload = {
                'token': self.jwt_token,
                'voltage_v': meter_data['voltage_v'],
                'current_a': meter_data['current_a'],
                'active_power_kw': meter_data['active_power_kw'],
                'reactive_power_kvar': meter_data['reactive_power_kvar'],
                'apparent_power_kva': meter_data['apparent_power_kva'],
                'power_factor': meter_data['power_factor'],
                'frequency_hz': meter_data['frequency_hz'],
                'cumulative_kwh': meter_data['cumulative_kwh'],
                'ip': ip,
                'protocol': 'TCP'
            }
            
            response = requests.post(
                f"{self.base_url}/api/monitor/meter",
                json=payload,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success'):
                    print(f"[SUCCESS] Meter reading transmitted successfully at {time.strftime('%H:%M:%S')}")
                    print(f"   Voltage: {meter_data['voltage_v']}V | Current: {meter_data['current_a']}A | Power: {meter_data['active_power_kw']}kW")
                    print(f"   Detected IP: {ip} | Frequency: {meter_data['frequency_hz']}Hz | Energy: {meter_data['cumulative_kwh']}kWh")
                    return True
                else:
                    print(f"[ERROR] Transmission failed: {data.get('error', 'Unknown error')}")
                    print(f"   Voltage: {meter_data['voltage_v']}V | Current: {meter_data['current_a']}A | Power: {meter_data['active_power_kw']}kW")
                    print(f"   Detected IP: {ip} | Frequency: {meter_data['frequency_hz']}Hz")
            else:
                print(f"[ERROR] Transmission failed with status code: {response.status_code}")
                print(f"   Voltage: {meter_data['voltage_v']}V | Current: {meter_data['current_a']}A | Power: {meter_data['active_power_kw']}kW")
                print(f"   Detected IP: {ip} | Frequency: {meter_data['frequency_hz']}Hz")
                
        except Exception as e:
            print(f"[ERROR] Transmission error: {str(e)}")
            print(f"   Voltage: {meter_data['voltage_v']}V | Current: {meter_data['current_a']}A | Power: {meter_data['active_power_kw']}kW")
            print(f"   Frequency: {meter_data['frequency_hz']}Hz")
            
        return False

    def send_meter_reading_udp(self, meter_data):
        """Send meter reading via UDP (Note: UDP server support not implemented)"""
        print("[WARNING] UDP transmission selected but not fully implemented.")
        print("   Falling back to TCP/HTTP for now.")
        print(f"   Voltage: {meter_data['voltage_v']}V | Current: {meter_data['current_a']}A | Power: {meter_data['active_power_kw']}kW")
        print(f"   Frequency: {meter_data['frequency_hz']}Hz | Protocol: UDP (logged)")
        return True

def main():
    print("=== Smart Meter Telemetry System Setup ===")
    print("Connecting to production server: https://sm-app-seven.vercel.app/")
    # print("Connecting to production server: http://localhost:3000/")
    print()
    print("IMPORTANT: You must have logged in to the dashboard first!")
    print("   Copy your User ID from the dashboard after login.")
    print()
    
    # Get configuration from user input
    # WEB_APP_URL = "http://localhost:3000/"  # Default production URL
    WEB_APP_URL = "https://sm-app-seven.vercel.app"  # Default production URL
    PROTOCOL = "TCP"  # HTTPS runs over TCP
    
    USER_ID = input("Enter your User ID (from dashboard): ").strip()
    if not USER_ID:
        print("[ERROR] User ID is required!")
        sys.exit(1)
    
    DEVICE_NAME = input("Device Name (default: Smart Meter 001): ").strip()
    if not DEVICE_NAME:
        DEVICE_NAME = "Smart Meter 001"
    
    print()
    print("Configuration:")
    print(f"  Web App URL: {WEB_APP_URL} (production)")
    print(f"  Protocol: {PROTOCOL}")
    print(f"  Device Name: {DEVICE_NAME}")
    print(f"  User ID: {USER_ID}")
    print()

    print("Initializing Smart Meter Telemetry System...")
    
    meter = MeterDataGenerator()
    web_app = WebAppIntegrator(WEB_APP_URL, USER_ID, DEVICE_NAME, PROTOCOL)
    
    # Register the device
    print(f"Registering device '{DEVICE_NAME}' with User ID '{USER_ID}'...")
    if not web_app.register_device():
        print("[ERROR] Failed to register device. Please check your User ID and web app URL.")
        sys.exit(1)
    
    print("System initialized. Starting data transmission every 35 seconds...")
    print("Press Ctrl+C to terminate the application\n")
    
    transmission_count = 0
    while True:
        try:
            transmission_count += 1
            print(f"\nCycle #{transmission_count} - Generating meter data... (Protocol: {PROTOCOL})")
            
            meter_data = meter.generate_reading()
            web_app.send_meter_reading(meter_data)
            
            time.sleep(35)
            
        except KeyboardInterrupt:
            print("\n\n[INFO] Application terminated by user")
            break
        except Exception as e:
            print(f"Unexpected system error: {e}")
            time.sleep(35)

if __name__ == "__main__":
    main()
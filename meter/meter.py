"""
Advanced Smart Meter Telemetry System
Version: 3.1
"""

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


# =========================
# REAL DEVICE IP DETECTION
# =========================
def get_real_device_ip():

    try:
        r = requests.get(
            "https://api.ipify.org/?format=text",
            timeout=5,
            proxies={"http": None, "https": None}
        )

        real_ip = r.text.strip()
        return real_ip

    except Exception as e:
        print(f"[IP_DETECTION] Failed to detect external IP: {e}")
        try:
            fallback_ip = socket.gethostbyname(socket.gethostname())
            print(f"[IP_DETECTION] Using fallback hostname IP: {fallback_ip}")
            return fallback_ip
        except:
            print("[IP_DETECTION] Using default fallback IP: 0.0.0.0")
            return "0.0.0.0"


# =========================
# TELEMETRY IP RESOLUTION
# =========================
def resolve_ip(protocol):

    exported_ip = os.getenv("DEVICE_IP")

    origin_ip = get_real_device_ip()

    protocol = protocol.upper()

    if exported_ip and protocol in ["TCP", "UDP"]:
        print(f"[IP_RESOLUTION] Using exported IP for {protocol}: {exported_ip}")
        return exported_ip

    return origin_ip


# =========================
# JWT TOKEN GENERATION
# =========================
def generate_jwt_token(user_id):

    try:

        secret = "default-secret"

        header = base64.urlsafe_b64encode(
            json.dumps({"alg": "HS256", "typ": "JWT"}).encode()
        ).decode().rstrip("=")

        payload = base64.urlsafe_b64encode(
            json.dumps({
                "id": user_id,
                "iat": int(time.time()*1000)
            }).encode()
        ).decode().rstrip("=")

        message = f"{header}.{payload}"

        signature = base64.urlsafe_b64encode(
            hmac.new(
                secret.encode(),
                message.encode(),
                hashlib.sha256
            ).digest()
        ).decode().rstrip("=")

        return f"{message}.{signature}"

    except Exception as e:
        print(f"[JWT_GENERATION] Failed to generate JWT token: {e}")
        return None


# =========================
# METER DATA GENERATOR
# =========================
class MeterDataGenerator:

    VOLTAGE_RANGE = (220,250)
    CURRENT_RANGE = (5,100)
    PF_RANGE = (0.85,0.99)
    FREQ_RANGE = (49.8,50.2)

    def __init__(self):

        self.cumulative_kwh = random.uniform(1500,5000)

    def generate_reading(self):

        voltage = random.uniform(*self.VOLTAGE_RANGE)
        current = random.uniform(*self.CURRENT_RANGE)
        pf = random.uniform(*self.PF_RANGE)
        freq = random.uniform(*self.FREQ_RANGE)

        apparent = voltage*current
        active = apparent*pf
        reactive = (apparent**2-active**2)**0.5

        self.cumulative_kwh += active/1000*(35/3600)

        return {

            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
            "voltage_v": round(voltage,1),
            "current_a": round(current,2),
            "active_power_kw": round(active/1000,2),
            "reactive_power_kvar": round(reactive/1000,2),
            "apparent_power_kva": round(apparent/1000,2),
            "power_factor": round(pf,2),
            "frequency_hz": round(freq,1),
            "cumulative_kwh": round(self.cumulative_kwh,1)
        }


# =========================
# WEB APP INTEGRATION
# =========================
class WebAppIntegrator:

    ALLOWED_PROTOCOLS={"TCP","UDP"}

    def __init__(self,base_url,user_id,device_name,protocol="TCP"):

        protocol = protocol.upper()

        if protocol not in self.ALLOWED_PROTOCOLS:
            print(f"[WEB_INTEGRATION] Protocol '{protocol}' not allowed. Supported: {self.ALLOWED_PROTOCOLS}")
            sys.exit(1)

        self.base_url = base_url.rstrip("/")
        self.user_id = user_id
        self.device_name = device_name
        self.protocol = protocol

        self.device_ip = resolve_ip(protocol)
        
        self.jwt_token = generate_jwt_token(user_id)
        if not self.jwt_token:
            print("[WEB_INTEGRATION] Failed to initialize JWT token")
            sys.exit(1)
        # else:
        #     print(f"[WEB_INTEGRATION] JWT token generated successfully for user: {user_id}")


    # =========================
    # DEVICE REGISTRATION
    # =========================
    def register_device(self):

        try:

            payload={

                "token":self.jwt_token,
                "deviceName":self.device_name,
                "ip":get_real_device_ip()

            }

            r=requests.post(
                f"{self.base_url}/api/monitor/register",
                json=payload,
                timeout=10
            )


            if r.status_code==200 and r.json().get("success"):
                # print(f"[DEVICE_REGISTER] Device '{self.device_name}' registered successfully")
                return True
            else:
                print(f"[DEVICE_REGISTER] Device registration failed with status: {r.status_code}")

        except Exception as e:
            print(f"[DEVICE_REGISTER] Registration error for device '{self.device_name}': {e}")

        return False


    # =========================
    # DEVICE STATUS
    # =========================
    def update_status(self,status):

        try:

            payload={

                "token":self.jwt_token,
                "status":status,
                "deviceName":self.device_name,
                "ip":self.device_ip

            }

            requests.post(
                f"{self.base_url}/api/monitor/status",
                json=payload,
                timeout=5
            )
            # print(f"[DEVICE_STATUS] Status updated to '{status}' for device '{self.device_name}'")

        except Exception as e:
            print(f"[DEVICE_STATUS] Failed to update status to '{status}' for device '{self.device_name}': {e}")


    # =========================
    # SEND METER DATA
    # =========================
    def send_meter_reading(self,meter):

        try:

            payload={

                "token":self.jwt_token,
                "deviceName":self.device_name,

                "voltage_v":meter["voltage_v"],
                "current_a":meter["current_a"],
                "active_power_kw":meter["active_power_kw"],
                "reactive_power_kvar":meter["reactive_power_kvar"],
                "apparent_power_kva":meter["apparent_power_kva"],
                "power_factor":meter["power_factor"],
                "frequency_hz":meter["frequency_hz"],
                "cumulative_kwh":meter["cumulative_kwh"],

                "ip":self.device_ip,
                "protocol":self.protocol

            }

            r=requests.post(
                f"{self.base_url}/api/monitor/meter",
                json=payload,
                timeout=10
            )

            if r.status_code==200 and r.json().get("success"):
                timestamp = time.strftime("%H:%M:%S")
                print(f"Voltage: {meter['voltage_v']}V | Current: {meter['current_a']}A | Power: {meter['active_power_kw']}kW")
                print(f"PF: {meter['power_factor']} | Frequency: {meter['frequency_hz']}Hz | Energy: {meter['cumulative_kwh']}kWh")
                print(f"IP : {self.device_ip}")
                return True
            else:
                print(f"[METER_TRANSMISSION] Failed to send data - Status: {r.status_code}")

        except Exception as e:
            print(f"[METER_TRANSMISSION] Transmission error: {e}")

        return False


# =========================
# MAIN PROGRAM
# =========================
def main():

    WEB_APP_URL=os.getenv("WEB_APP_URL","http://localhost:3000")

    USER_ID=os.getenv(
        "USER_ID",
        "54043afc-de58-49db-9be3-23e81493b4dd"
    )

    # Ask user for device name if not set in environment
    DEVICE_NAME=os.getenv("DEVICE_NAME")
    if not DEVICE_NAME:
        print("[DEVICE_SETUP] Please enter a name for this device:")
        DEVICE_NAME = input("Device Name: ").strip()
        if not DEVICE_NAME:
            DEVICE_NAME = f"Smart Meter {int(time.time())}"
            print(f"[DEVICE_SETUP] Using default device name: {DEVICE_NAME}")

    PROTOCOL=os.getenv("PROTOCOL","TCP")
    
    web=WebAppIntegrator(
        WEB_APP_URL,
        USER_ID,
        DEVICE_NAME,
        PROTOCOL
    )

    meter=MeterDataGenerator()

    if not web.register_device():
        print("[SYSTEM] Failed to register device - exiting")
        sys.exit(1)

    web.update_status("online")
    # print("[SYSTEM] Device is now online and ready to transmit data")

    cycle=0
    # print("[SYSTEM] Starting data transmission cycles (35-second intervals)")

    while True:
        try:
            cycle+=1
            print(f"\n === Starting Transmission #{cycle} ===")

            data=meter.generate_reading()
            print(f"Generated new meter reading at {data['timestamp']}")

            web.send_meter_reading(data)

            time.sleep(35)

        except KeyboardInterrupt:
            print("\n[SYSTEM] Shutdown signal received")
            web.update_status("offline")
            print("[SYSTEM] Device status set to offline")
            print("[SYSTEM] Smart Meter Telemetry System stopped")
            break

        except Exception as e:
            print(f"[SYSTEM] Unexpected error in cycle #{cycle}: {e}")
            print("[SYSTEM] Continuing with next cycle...")
            time.sleep(35)


if __name__=="__main__":
    main()
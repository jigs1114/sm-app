"""
Generate a valid JWT token for testing the monitor agent
Run this after you've registered an account through the dashboard
"""

import hmac
import hashlib
import json
import base64
from datetime import datetime
import sys

def base64url_encode(data):
    """Encode data to base64url format"""
    return base64.urlsafe_b64encode(data.encode()).decode().rstrip('=')

def generate_token(user_id, username):
    """Generate a valid JWT token"""
    # This must match the JWT_SECRET in .env.local
    secret = 'your-secret-key-change-this-in-production'
    
    # Create header
    header = {
        'alg': 'HS256',
        'typ': 'JWT'
    }
    
    # Create payload with user info
    payload = {
        'id': user_id,
        'username': username,
        'iat': int(datetime.now().timestamp() * 1000)  # Current time in milliseconds
    }
    
    # Encode header and payload
    header_encoded = base64url_encode(json.dumps(header))
    payload_encoded = base64url_encode(json.dumps(payload))
    
    # Create signature
    message = f"{header_encoded}.{payload_encoded}"
    signature = hmac.new(
        secret.encode(),
        message.encode(),
        hashlib.sha256
    ).digest()
    signature_encoded = base64.urlsafe_b64encode(signature).decode().rstrip('=')
    
    # Return complete token
    token = f"{header_encoded}.{payload_encoded}.{signature_encoded}"
    return token

if __name__ == '__main__':
    # You would normally get these from registration
    # For now, let's create a test token
    
    print("\n" + "="*60)
    print("Smart Meter Monitor - Token Generator")
    print("="*60 + "\n")
    
    if len(sys.argv) > 1:
        user_id = sys.argv[1]
        username = sys.argv[2] if len(sys.argv) > 2 else 'testuser'
    else:
        # Default test values
        user_id = '6f749fa5-76f6-4ade-ac9c-f23199dc1fcc'
        username = 'abc'
    
    token = generate_token(user_id, username)
    
    print(f"User ID:    {user_id}")
    print(f"Username:   {username}")
    print(f"\nGenerated Token:")
    print(f"{token}\n")
    
    print("Usage:")
    print(f"python3 monitor-agent.py --token \"{token}\" --device \"My Device\"\n")
    
    print("Or paste this in run-agent.bat:")
    print(f"run-agent.bat \"{token}\" \"My Device\"\n")
    
    print("Note: This token will only work if:")
    print("  1. The user exists in the system")
    print("  2. The JWT_SECRET in .env.local matches")
    print("  3. The server is running (npm run dev)")
    print("="*60 + "\n")

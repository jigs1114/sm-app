#!/usr/bin/env python3
"""
Python File Encryptor for meter.py
Encrypts the source code and creates a password-protected executable
"""

import os
import sys
import hashlib
import base64
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
import tempfile
import shutil

def derive_key(password: str, salt: bytes) -> bytes:
    """Derive encryption key from password using PBKDF2"""
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=100000,
    )
    key = base64.urlsafe_b64encode(kdf.derive(password.encode()))
    return key

def encrypt_file(file_path: str, password: str) -> tuple[bytes, bytes]:
    """Encrypt file and return (encrypted_data, salt)"""
    # Generate random salt
    salt = os.urandom(16)
    
    # Derive key from password
    key = derive_key(password, salt)
    
    # Read and encrypt the file
    with open(file_path, 'rb') as f:
        file_data = f.read()
    
    fernet = Fernet(key)
    encrypted_data = fernet.encrypt(file_data)
    
    return encrypted_data, salt

def create_executable_wrapper(encrypted_data: bytes, salt: bytes, output_path: str):
    """Create a self-extracting executable wrapper"""
    wrapper_code = f'''#!/usr/bin/env python3
"""
Encrypted Python File Executor
Password protected execution of encrypted meter.py
"""

import os
import sys
import tempfile
import shutil
import base64
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
import subprocess

# Embedded encrypted data
ENCRYPTED_DATA = base64.b64decode("{base64.b64encode(encrypted_data).decode()}")
SALT = base64.b64decode("{base64.b64encode(salt).decode()}")

def derive_key(password: str, salt: bytes) -> bytes:
    """Derive encryption key from password using PBKDF2"""
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=100000,
    )
    key = base64.urlsafe_b64encode(kdf.derive(password.encode()))
    return key

def decrypt_and_execute():
    """Decrypt the file and execute it"""
    # Get password from user
    password = input("Enter password to decrypt meter.py: ").strip()
    
    if not password:
        print("[ERROR] Password is required!")
        sys.exit(1)
    
    try:
        # Derive key and decrypt
        key = derive_key(password, SALT)
        fernet = Fernet(key)
        decrypted_data = fernet.decrypt(ENCRYPTED_DATA)
        
        # Create temporary file
        with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as temp_file:
            temp_file.write(decrypted_data.decode())
            temp_file_path = temp_file.name
        
        try:
            # Execute the decrypted Python file
            print("[SUCCESS] File decrypted successfully. Executing meter.py...")
            print("=" * 50)
            
            # Pass command line arguments to the decrypted script
            result = subprocess.run([sys.executable, temp_file_path] + sys.argv[1:], 
                                  capture_output=False, text=True)
            
            sys.exit(result.returncode)
            
        finally:
            # Clean up temporary file
            try:
                os.unlink(temp_file_path)
            except:
                pass
                
    except Exception as e:
        print(f"[ERROR] Failed to decrypt or execute: {{str(e)}}")
        print("Please check your password and try again.")
        sys.exit(1)

if __name__ == "__main__":
    decrypt_and_execute()
'''
    
    # Write the wrapper
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(wrapper_code)
    
    # Make it executable (on Unix systems)
    if os.name != 'nt':
        os.chmod(output_path, 0o755)

def main():
    """Main encryption process"""
    print("=== Python File Encryptor ===")
    print("This tool will encrypt meter.py and create a password-protected executable")
    print()
    
    # Check if meter.py exists
    meter_path = "meter.py"
    if not os.path.exists(meter_path):
        print(f"[ERROR] {meter_path} not found in current directory!")
        sys.exit(1)
    
    # Get password from user
    while True:
        password = input("Enter encryption password: ").strip()
        if not password:
            print("[ERROR] Password cannot be empty!")
            continue
        
        confirm_password = input("Confirm password: ").strip()
        if password != confirm_password:
            print("[ERROR] Passwords do not match!")
            continue
        
        if len(password) < 8:
            print("[WARNING] Password should be at least 8 characters for better security")
            confirm = input("Continue anyway? (y/N): ").strip().lower()
            if confirm != 'y':
                continue
        
        break
    
    print()
    print("Encrypting meter.py...")
    
    try:
        # Encrypt the file
        encrypted_data, salt = encrypt_file(meter_path, password)
        
        # Create executable wrapper
        output_path = "meter_encrypted.py"
        create_executable_wrapper(encrypted_data, salt, output_path)
        
        print(f"[SUCCESS] Encryption complete!")
        print(f"Original file: {meter_path}")
        print(f"Encrypted executable: {output_path}")
        print()
        print("Usage:")
        print(f"  python {output_path} [--offline]")
        print()
        print("Security notes:")
        print("- Keep the password safe and secure")
        print("- Store the encrypted file in a protected location")
        print("- The original meter.py can be backed up or deleted")
        
    except ImportError as e:
        print(f"[ERROR] Missing required library: {str(e)}")
        print("Install required packages with:")
        print("pip install cryptography")
        sys.exit(1)
    except Exception as e:
        print(f"[ERROR] Encryption failed: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()

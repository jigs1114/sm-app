# Encrypted Meter.py - Password Protected Execution

## Overview
The `meter.py` file has been encrypted and converted into a password-protected executable (`meter_encrypted.py`). This provides security for the source code while maintaining full functionality.

## Files Created
- `meter_encrypted.py` - Password-protected executable version of meter.py
- `encrypt_meter.py` - Encryption utility script
- `run_meter.bat` - Windows batch file for easy execution
- `requirements.txt` - Required Python dependencies

## Security Features
- **AES-256 Encryption**: Uses Fernet symmetric encryption with PBKDF2 key derivation
- **Password Protection**: Requires password to decrypt and execute
- **Secure Key Derivation**: 100,000 iterations of PBKDF2 with SHA-256
- **Temporary Execution**: Decrypts to temporary file only during execution
- **Automatic Cleanup**: Temporary files are automatically deleted after execution

## Usage

### Method 1: Direct Python Execution
```bash
python meter_encrypted.py [--offline]
```

### Method 2: Windows Batch File
```bash
run_meter.bat [--offline]
```

### Method 3: With Command Line Arguments
```bash
# Normal execution
python meter_encrypted.py

# Set device to offline
python meter_encrypted.py --offline
```

## Execution Process
1. Run the encrypted executable
2. Enter the password when prompted
3. The file decrypts to a temporary location
4. The original meter.py functionality executes
5. Temporary files are automatically cleaned up

## Password Requirements
- Minimum 8 characters recommended
- Can include letters, numbers, and special characters
- **Important**: Store the password securely - it cannot be recovered!

## Security Best Practices
1. **Password Security**: Use a strong, unique password
2. **File Storage**: Keep `meter_encrypted.py` in a protected directory
3. **Backup**: Store the password in a secure password manager
4. **Original File**: Consider backing up or securely deleting the original `meter.py`
5. **Access Control**: Limit access to the encrypted file to authorized users

## Re-encryption
If you need to change the password or re-encrypt the file:
```bash
python encrypt_meter.py
```
This will create a new encrypted file with a new password.

## Dependencies
- Python 3.6+
- cryptography >= 41.0.0

## Troubleshooting

### "Failed to decrypt or execute"
- Check that you entered the correct password
- Ensure the encrypted file hasn't been corrupted
- Verify all dependencies are installed

### "Missing required library"
Install the required dependencies:
```bash
pip install -r requirements.txt
```

### File Permission Issues
- Ensure you have read/write permissions in the directory
- On Windows, run as administrator if needed

## Technical Details
- **Encryption Algorithm**: AES-128 via Fernet (symmetric)
- **Key Derivation**: PBKDF2-HMAC-SHA256 (100,000 iterations)
- **Salt**: 16 bytes random salt per encryption
- **Temporary Files**: Securely created and deleted automatically

## Warning
- **Password Loss**: If you forget the password, the encrypted file cannot be recovered
- **File Integrity**: Do not modify the encrypted file manually
- **Security**: Keep the password confidential and secure

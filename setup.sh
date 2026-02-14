#!/bin/bash
# Smart Meter Monitor - Setup Script

echo "================================"
echo "Smart Meter Monitor Setup"
echo "================================"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+."
    exit 1
fi

echo "✓ Node.js version: $(node --version)"
echo "✓ npm version: $(npm --version)"

# Install dependencies
echo ""
echo "📦 Installing npm dependencies..."
npm install

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "⚠️  Python 3 not found. Some features may not work."
else
    echo "✓ Python 3 version: $(python3 --version)"
    echo "📦 Installing Python dependencies..."
    pip install requests
fi

echo ""
echo "================================"
echo "✅ Setup complete!"
echo "================================"
echo ""
echo "Next steps:"
echo "1. Configure .env.local with your settings"
echo "2. Run: npm run dev"
echo "3. Visit: http://localhost:3000"
echo "4. Register a new account"
echo "5. Run monitoring agent: python3 monitor-agent.py --token <TOKEN> --device <NAME>"
echo ""

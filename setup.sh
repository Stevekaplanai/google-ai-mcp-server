#!/bin/bash
# Setup script for Google AI MCP Server

echo "🚀 Google AI MCP Server Setup"
echo "============================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js $(node --version) detected"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Build the project
echo ""
echo "🔨 Building the project..."
npm run build

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo ""
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "✅ .env file created from template"
fi

# Test the build
echo ""
echo "🧪 Testing the build..."
if [ -f dist/index.js ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed. Check for errors above."
    exit 1
fi

# Display next steps
echo ""
echo "✨ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Configure your Google Cloud credentials in .env"
echo "2. Test with mock mode: USE_MOCK=true npm start"
echo "3. Configure Claude Desktop (see README.md)"
echo ""
echo "Quick test commands:"
echo "  npm run dev     # Run in development mode"
echo "  npm test        # Run tests"
echo "  npm start       # Start the server"
echo ""
echo "For interactive testing:"
echo "  node test-server.js"
echo ""

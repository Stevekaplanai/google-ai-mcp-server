#!/bin/bash
# Test NPM package installation and execution

echo "Testing NPM package: @stevekaplanai/google-ai-mcp"
echo "================================================"

# Test 1: Check if package can be executed via npx
echo -e "\n1. Testing npx execution..."
timeout 5s npx @stevekaplanai/google-ai-mcp
if [ $? -eq 124 ]; then
    echo "✓ Server started successfully (timed out after 5s as expected)"
else
    echo "✗ Server failed to start"
fi

# Test 2: Check package info
echo -e "\n2. Checking package info..."
npm view @stevekaplanai/google-ai-mcp

echo -e "\n3. Done!"

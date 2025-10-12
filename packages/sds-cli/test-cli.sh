#!/bin/bash

# Test script for SDS CLI
# This allows you to test the CLI without publishing to NPM

CLI_PATH="$(cd "$(dirname "$0")" && pwd)/bin/index.js"

echo "🧪 Testing SDS CLI..."
echo "CLI Path: $CLI_PATH"
echo ""

# Run the CLI with any arguments passed to this script
node "$CLI_PATH" "$@"

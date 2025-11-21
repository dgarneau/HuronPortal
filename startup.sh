#!/bin/bash
echo "========================================="
echo "STARTUP DIAGNOSTICS"
echo "========================================="
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"
echo "Working directory: $(pwd)"
echo "NODE_ENV: $NODE_ENV"
echo "PORT: $PORT"
echo "========================================="
echo "Checking for bcryptjs module..."
if [ -d "node_modules/bcryptjs" ]; then
  echo "✓ bcryptjs found at node_modules/bcryptjs"
  ls -la node_modules/bcryptjs/
else
  echo "✗ bcryptjs NOT FOUND"
fi
echo "========================================="
echo "Starting Next.js standalone server..."
echo "========================================="
node server.js

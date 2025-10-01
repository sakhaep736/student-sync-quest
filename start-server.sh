#!/bin/bash

# Student Jobs Application - Server Startup Script
# This script installs dependencies, builds, and runs the application

echo "=========================================="
echo "Student Jobs Application - Server Setup"
echo "=========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✓ Node.js version: $(node --version)"
echo "✓ npm version: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✓ Dependencies installed successfully"
echo ""

# Build the application
echo "🔨 Building application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Failed to build application"
    exit 1
fi

echo "✓ Application built successfully"
echo ""

# Start the server
echo "🚀 Starting production server..."
echo ""
echo "=========================================="
echo "Server will be accessible at:"
echo "http://localhost:4173"
echo "http://$(hostname -I | awk '{print $1}'):4173"
echo "=========================================="
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm run preview

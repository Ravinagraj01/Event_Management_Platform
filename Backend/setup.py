#!/usr/bin/env python3
"""
Setup script for Campus Event Management Platform
This script sets up the environment and runs the application.
"""

import os
import sys
import subprocess
import time

def run_command(command, description):
    """Run a command and handle errors"""
    print(f"\n🔄 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed:")
        print(f"Error: {e.stderr}")
        return False

def check_python_version():
    """Check if Python version is compatible"""
    if sys.version_info < (3, 8):
        print("❌ Python 3.8 or higher is required")
        print(f"Current version: {sys.version}")
        return False
    print(f"✅ Python version: {sys.version}")
    return True

def check_node_version():
    """Check if Node.js is installed"""
    try:
        result = subprocess.run(["node", "--version"], capture_output=True, text=True)
        print(f"✅ Node.js version: {result.stdout.strip()}")
        return True
    except FileNotFoundError:
        print("❌ Node.js is not installed. Please install Node.js 16 or higher")
        return False

def setup_backend():
    """Set up the Flask backend"""
    print("\n" + "="*50)
    print("🚀 Setting up Backend (Flask)")
    print("="*50)
    
    # Install Python dependencies
    if not run_command("pip install -r requirements.txt", "Installing Python dependencies"):
        return False
    
    # Initialize database and seed data
    if not run_command("python run.py", "Initializing database and seeding data"):
        return False
    
    return True

def setup_frontend():
    """Set up the React frontend"""
    print("\n" + "="*50)
    print("🎨 Setting up Frontend (React)")
    print("="*50)
    
    # Change to frontend directory
    os.chdir("frontend")
    
    # Install npm dependencies
    if not run_command("npm install", "Installing npm dependencies"):
        return False
    
    # Go back to root directory
    os.chdir("..")
    
    return True

def start_servers():
    """Start both backend and frontend servers"""
    print("\n" + "="*50)
    print("🚀 Starting Servers")
    print("="*50)
    
    print("\n📋 Instructions:")
    print("1. Open a new terminal window")
    print("2. Run: python app.py")
    print("3. Open another terminal window")
    print("4. Run: cd frontend && npm start")
    print("\n🌐 URLs:")
    print("- Backend API: http://localhost:5000")
    print("- Frontend: http://localhost:3000")
    print("- Admin Portal: http://localhost:3000/admin")
    print("- Student App: http://localhost:3000/student")
    
    # Ask if user wants to start servers automatically
    response = input("\nWould you like to start the backend server now? (y/n): ").lower().strip()
    if response == 'y':
        print("\n🔄 Starting Flask backend server...")
        print("Press Ctrl+C to stop the server")
        try:
            subprocess.run([sys.executable, "app.py"])
        except KeyboardInterrupt:
            print("\n👋 Backend server stopped")

def main():
    """Main setup function"""
    print("🎓 Campus Event Management Platform Setup")
    print("=" * 50)
    
    # Check system requirements
    if not check_python_version():
        return
    
    if not check_node_version():
        return
    
    # Setup backend
    if not setup_backend():
        print("\n❌ Backend setup failed. Please check the errors above.")
        return
    
    # Setup frontend
    if not setup_frontend():
        print("\n❌ Frontend setup failed. Please check the errors above.")
        return
    
    print("\n" + "="*50)
    print("🎉 Setup Complete!")
    print("="*50)
    
    # Start servers
    start_servers()

if __name__ == "__main__":
    main()

#!/usr/bin/env python3
import requests
import time

def test_ml_api():
    print("Testing ML API...")
    
    # Test health endpoint
    try:
        response = requests.get("http://localhost:8000/health", timeout=10)
        print(f"Health check: {response.status_code}")
        if response.status_code == 200:
            print(f"Response: {response.json()}")
        else:
            print(f"Error: {response.text}")
    except requests.exceptions.RequestException as e:
        print(f"Health check failed: {e}")
    
    # Test root endpoint
    try:
        response = requests.get("http://localhost:8000/", timeout=10)
        print(f"Root endpoint: {response.status_code}")
        if response.status_code == 200:
            print(f"Response: {response.json()}")
    except requests.exceptions.RequestException as e:
        print(f"Root endpoint failed: {e}")

if __name__ == "__main__":
    test_ml_api()
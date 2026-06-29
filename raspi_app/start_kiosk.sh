#!/bin/bash
# Khởi chạy SmartBox Kiosk bằng python trong venv (không cần activate).
cd /home/lebavui/Desktop/Project/SmartBox/raspi_app
exec venv/bin/python main.py >> /home/lebavui/kiosk.log 2>&1

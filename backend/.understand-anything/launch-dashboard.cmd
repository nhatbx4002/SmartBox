@echo off
set "GRAPH_DIR=D:\DATN_Project\SmartBox\backend"
cd /d "C:\Users\bnhat\.understand-anything\repo\understand-anything-plugin\packages\dashboard"
call "C:\Users\bnhat\.understand-anything\repo\understand-anything-plugin\packages\dashboard\node_modules\.bin\vite.CMD" --host 127.0.0.1 > "D:\DATN_Project\SmartBox\backend\.understand-anything\dashboard.out.log" 2> "D:\DATN_Project\SmartBox\backend\.understand-anything\dashboard.err.log"

# Quick Start Commands

## Kill All Ports Forcefully (Windows)

### Kill Port 8000 (Backend)
```powershell
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

### Kill Port 5174 (Frontend)
```powershell
netstat -ano | findstr :5174
taskkill /PID <PID> /F
```

### Kill All Node & Python Processes (Nuclear Option)
```powershell
taskkill /F /IM node.exe
taskkill /F /IM python.exe
```

### Kill Specific Ports in One Command
```powershell
# Kill port 8000
$port = 8000; $process = Get-Process | Where-Object {$_.Name -eq "python" -or $_.Name -eq "node"} | Where-Object {$_.ProcessName -like "*"} | Get-NetTCPConnection -ErrorAction SilentlyContinue | Where-Object {$_.LocalPort -eq $port}; if ($process) { Stop-Process -Id $process.ProcessId -Force }

# Simpler approach - use lsof equivalent for Windows
For /f "tokens=5" %a in ('netstat -ano ^| findstr :8000') do taskkill /PID %a /F
For /f "tokens=5" %a in ('netstat -ano ^| findstr :5174') do taskkill /PID %a /F
```

---

## Run Backend

### Step 1: Activate Virtual Environment
```powershell
cd "c:\Users\hp\Desktop\IZee Job Fair"
.venv\Scripts\Activate.ps1
```

### Step 2: Navigate to Backend & Run
```powershell
cd backend
uvicorn main:app --reload --port 8000
```

### Full Command (Combined)
```powershell
cd "c:\Users\hp\Desktop\IZee Job Fair" ; .venv\Scripts\Activate.ps1 ; cd backend ; uvicorn main:app --reload --port 8000
```

### Backend URL
```
http://localhost:8000
http://localhost:8000/docs (API Swagger UI)
```

---

## Run Frontend

### Step 1: Navigate to Frontend
```powershell
cd "c:\Users\hp\Desktop\IZee Job Fair\frontend"
```

### Step 2: Run Dev Server
```powershell
npm run dev
```

### Full Command (Combined)
```powershell
cd "c:\Users\hp\Desktop\IZee Job Fair\frontend" ; npm run dev
```

### Frontend URL
```
http://localhost:5174
```

---

## Run Both Simultaneously (Recommended)

### Terminal 1: Backend
```powershell
cd "c:\Users\hp\Desktop\IZee Job Fair" ; .venv\Scripts\Activate.ps1 ; cd backend ; uvicorn main:app --reload --port 8000
```

### Terminal 2: Frontend
```powershell
cd "c:\Users\hp\Desktop\IZee Job Fair\frontend" ; npm run dev
```

---

## Environment Check

### Verify Node.js
```powershell
node --version
npm --version
```

### Verify Python
```powershell
python --version
pip --version
```

### Verify Virtual Environment
```powershell
cd "c:\Users\hp\Desktop\IZee Job Fair"
.venv\Scripts\Activate.ps1
python --version
```

---

## Clean Kill & Restart All

### PowerShell Script to Kill & Restart Everything
```powershell
# Kill all
Write-Host "Killing all Node and Python processes..."
taskkill /F /IM node.exe 2>$null
taskkill /F /IM python.exe 2>$null

# Wait a moment
Start-Sleep -Seconds 2

# Verify killed
Write-Host "Checking if ports are free..."
netstat -ano | findstr ":8000\|:5174"

Write-Host "Ready to start fresh!"
```

---

## Troubleshooting

### Port Already in Use?
```powershell
# Check what's using the port
netstat -ano | findstr :8000
netstat -ano | findstr :5174

# Kill by PID
taskkill /PID <PID_NUMBER> /F
```

### Can't Activate Virtual Environment?
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned
.venv\Scripts\Activate.ps1
```

### npm install issues?
```powershell
cd "c:\Users\hp\Desktop\IZee Job Fair\frontend"
rm -Force node_modules/
rm package-lock.json
npm install
```

### Python venv issues?
```powershell
cd "c:\Users\hp\Desktop\IZee Job Fair"
rm -Force .venv/
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r backend/requirements.txt
```

---

## Quick Reference

| Task | Command |
|------|---------|
| Kill Port 8000 | `For /f "tokens=5" %a in ('netstat -ano ^| findstr :8000') do taskkill /PID %a /F` |
| Kill Port 5174 | `For /f "tokens=5" %a in ('netstat -ano ^| findstr :5174') do taskkill /PID %a /F` |
| Kill All | `taskkill /F /IM node.exe & taskkill /F /IM python.exe` |
| Run Backend | `cd "c:\Users\hp\Desktop\IZee Job Fair" ; .venv\Scripts\Activate.ps1 ; cd backend ; uvicorn main:app --reload --port 8000` |
| Run Frontend | `cd "c:\Users\hp\Desktop\IZee Job Fair\frontend" ; npm run dev` |

---

## Access Points

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5174 |
| Backend API | http://localhost:8000 |
| Swagger Docs | http://localhost:8000/docs |
| ReDoc | http://localhost:8000/redoc |

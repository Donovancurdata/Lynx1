# 🚀 LYNX Consolidated Server Setup

## 🎯 **What Changed**

We've consolidated all backend services into a single server to eliminate port conflicts and simplify the architecture.

## 📊 **New Architecture**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Agents        │
│   (Port 3000)   │◄──►│   (Port 3001)   │◄──►│   (Integrated)  │
│                 │    │                 │    │                 │
│ • Next.js App   │    │ • Express API   │    │ • Agent 1 WIA   │
│ • React UI      │    │ • WebSocket     │    │ • Intelligent   │
│ • Wallet Input  │    │ • CORS          │    │   Agent         │
│ • Chat Interface│    │ • Static Files  │    │ • Conversation  │
└─────────────────┘    └─────────────────┘    │   Manager       │
                                              └─────────────────┘
```

## 🔌 **Port Configuration**

| Service | Port | Purpose |
|---------|------|---------|
| **Frontend** | 3000 | Next.js development server |
| **Backend** | 3001 | Wallet analysis API server |
| **Intelligent Agent** | 3004 | WebSocket chat server (separate) |

## 🚀 **How to Start**

### **Option 1: Quick Start (Windows)**
```bash
# Double-click this file:
start-lynx.bat
```

### **Option 2: Manual Start**
```bash
# 1. Start the backend API server
cd backend
npm install
npm run consolidated

# 2. Start the intelligent agent (in new terminal)
cd agents/intelligent-agent
npm start

# 3. Start the frontend (in new terminal)
cd frontend
npm run dev
```

### **Option 3: Development Mode**
```bash
# Backend with auto-restart
cd backend
npm run consolidated:dev

# Intelligent Agent with auto-restart
cd agents/intelligent-agent
npm run dev

# Frontend
cd frontend
npm run dev
```

## 🔧 **What's Consolidated**

### **Backend Server (`consolidated-server.js`)**
- ✅ **Express API Server** (Port 3001)
  - Wallet analysis endpoints
  - Balance and transaction endpoints
  - Health check endpoint
  - Static file serving

- ✅ **Agent Integration**
  - Agent 1 WIA (wallet analysis)

### **Intelligent Agent Server** (Separate on Port 3004)
- ✅ **WebSocket Server** (Port 3004)
  - Intelligent agent chat
  - Real-time communication
  - Session management
  - Conversation Manager

## 📱 **Frontend Configuration**

The frontend has been updated to connect to:
- **API**: `http://localhost:3001/api/v1`
- **WebSocket**: `ws://localhost:3004` (Intelligent Agent)

## 🧪 **Testing**

### **Test the API**
```bash
curl http://localhost:3001/health
```

### **Test WebSocket**
Open `frontend/test-websocket.html` in your browser

### **Test Full Interface**
Open `http://localhost:3000` for the complete frontend

## 🚫 **What We Removed**

- ❌ Root directory `npm run dev` (was causing conflicts)
- ❌ Port conflicts between backend and intelligent agent
- ❌ Confusion about which services run where

## 🔍 **Benefits**

1. **🎯 Clear Separation**: Backend API and Intelligent Agent are separate
2. **🚀 Easier Startup**: Clear commands for each service
3. **🔧 Better Debugging**: Separate logs for each service
4. **📦 Better Organization**: Backend processes in backend directory
5. **⚡ No Port Conflicts**: Each service has its own dedicated port

## 🆘 **Troubleshooting**

### **Port Already in Use**
```bash
# Kill any existing Node processes
taskkill /f /im node.exe

# Then restart
npm run consolidated
```

### **Dependencies Missing**
```bash
cd backend
npm install
```

### **Frontend Can't Connect**
- Ensure backend is running on port 3001
- Check browser console for connection errors
- Verify WebSocket URL is `ws://localhost:3001`

## 📝 **Next Steps**

1. **Test the consolidated server**
2. **Verify wallet analysis works**
3. **Test intelligent agent chat**
4. **Verify frontend integration**

The consolidated setup should resolve all the port conflicts and make the system much easier to manage! 🎉

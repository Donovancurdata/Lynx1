# 🚀 LYNX Startup Guide

## 🎯 **Correct Architecture**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Intelligent   │
│   (Port 3000)   │◄──►│   (Port 3001)   │    │   Agent         │
│                 │    │                 │    │   (Port 3004)   │
│ • Next.js App   │    │ • Express API   │    │ • WebSocket     │
│ • React UI      │    │ • Wallet Analysis│   │ • Chat Server   │
│ • Wallet Input  │    │ • CORS          │    │ • OpenAI GPT-4  │
│ • Chat Interface│    │ • Static Files  │    │ • Conversation  │
└─────────────────┘    └─────────────────┘    │   Manager       │
                                               └─────────────────┘
```

## 🔌 **Port Configuration**

| Service | Port | Purpose |
|---------|------|---------|
| **Frontend** | 3000 | Next.js development server |
| **Backend** | 3001 | Wallet analysis API server |
| **Intelligent Agent** | 3004 | WebSocket chat server |

## 🚀 **How to Start**

### **Option 1: Windows Batch File (Recommended)**
```bash
# Double-click this file:
start-lynx.bat
```

### **Option 2: Manual Start (3 Terminals)**
```bash
# Terminal 1: Backend API
cd backend
npm install
npm run consolidated

# Terminal 2: Intelligent Agent
cd agents/intelligent-agent
npm install
npm start

# Terminal 3: Frontend
cd frontend
npm install
npm run dev
```

### **Option 3: Development Mode (Auto-restart)**
```bash
# Terminal 1: Backend with auto-restart
cd backend
npm run consolidated:dev

# Terminal 2: Intelligent Agent with auto-restart
cd agents/intelligent-agent
npm run dev

# Terminal 3: Frontend
cd frontend
npm run dev
```

## 🧪 **Testing**

### **Test Backend API**
```bash
curl http://localhost:3001/health
```

### **Test Intelligent Agent**
Open `frontend/test-websocket.html` in your browser

### **Test Full Interface**
Open `http://localhost:3000` for the complete frontend

## 🔍 **What Each Service Does**

### **Backend (Port 3001)**
- ✅ Wallet analysis API endpoints
- ✅ Balance and transaction data
- ✅ Agent 1 WIA integration
- ✅ Health monitoring

### **Intelligent Agent (Port 3004)**
- ✅ WebSocket chat server
- ✅ OpenAI GPT-4 integration
- ✅ Conversation management
- ✅ Wallet analysis chat

### **Frontend (Port 3000)**
- ✅ Next.js React application
- ✅ Wallet input and analysis display
- ✅ Intelligent agent chat interface
- ✅ Multi-blockchain results

## 🆘 **Troubleshooting**

### **Port Already in Use**
```bash
# Kill any existing Node processes
taskkill /f /im node.exe

# Then restart each service
```

### **Dependencies Missing**
```bash
# Backend
cd backend
npm install

# Intelligent Agent
cd agents/intelligent-agent
npm install

# Frontend
cd frontend
npm install
```

### **Frontend Can't Connect**
- Ensure backend is running on port 3001
- Ensure intelligent agent is running on port 3004
- Check browser console for connection errors

## 📝 **Key Benefits**

1. **🎯 Clear Separation**: Each service has a specific purpose
2. **🚀 Independent Scaling**: Services can be scaled separately
3. **🔧 Better Debugging**: Separate logs for each service
4. **📦 Maintainable**: Easier to modify individual services
5. **⚡ No Port Conflicts**: Each service has its own port

## 🎉 **Ready to Go!**

Start with `start-lynx.bat` or follow the manual steps above. Each service will run independently and communicate with each other as needed!

# 🚀 Quick Start Guide

## Current Status
✅ Backend dependencies installed  
✅ Frontend dependencies installed  
✅ Environment files created  
⚠️  **MongoDB needs to be set up** (see below)

## Port Configuration
- Backend: Port **5001** (5000 was in use by macOS)
- Frontend: Port **3000**

## Step 1: Set Up MongoDB (REQUIRED)

Since you don't have MongoDB installed, use **MongoDB Atlas** (FREE cloud database):

### Quick Setup (5 minutes):

1. **Sign up**: https://www.mongodb.com/cloud/atlas/register
2. **Create Free Cluster**:
   - Click "Build a Database"
   - Choose "FREE" (M0) tier
   - Select region closest to you
   - Click "Create"

3. **Create Database User**:
   - Go to "Database Access" → "Add New Database User"
   - Username: `gymadmin` (or any name)
   - Password: Create a strong password (SAVE IT!)
   - Click "Add User"

4. **Whitelist IP**:
   - Go to "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Click "Confirm"

5. **Get Connection String**:
   - Go to "Clusters" → Click "Connect" → "Connect your application"
   - Copy the connection string
   - It looks like: `mongodb+srv://gymadmin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
   - **Replace `<password>` with your database user password**
   - **Add database name**: Change `?retryWrites=true` to `/gym_management?retryWrites=true`
   - Final: `mongodb+srv://gymadmin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/gym_management?retryWrites=true&w=majority`

6. **Update Backend .env**:
   ```bash
   cd backend
   # Edit .env file and replace MONGODB_URI with your Atlas connection string
   ```

   Or run this command (replace YOUR_PASSWORD and cluster URL):
   ```bash
   echo 'PORT=5001
   MONGODB_URI=mongodb+srv://gymadmin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/gym_management?retryWrites=true&w=majority
   JWT_SECRET=my_super_secret_jwt_key_change_this_in_production_12345
   NODE_ENV=development' > backend/.env
   ```

## Step 2: Start Backend Server

```bash
cd backend
npm start
```

You should see:
```
MongoDB Connected: cluster0.xxxxx.mongodb.net
Server running in development mode on port 5001
```

## Step 3: Seed Sample Data (Optional but Recommended)

In a new terminal:
```bash
cd backend
node seed.js
```

This creates:
- Admin user: `admin@gym.com` / `admin123`
- Sample members, trainers, plans, and payments

## Step 4: Start Frontend

In a new terminal:
```bash
cd frontend
npm start
```

Browser will open at `http://localhost:3000`

## Step 5: Login

- Email: `admin@gym.com`
- Password: `admin123`

(If you ran the seed script)

## Troubleshooting

### "MongoDB connection failed"
- Check your `.env` file has the correct Atlas connection string
- Make sure you replaced `<password>` with your actual password
- Verify your IP is whitelisted in MongoDB Atlas
- Check that `/gym_management` is in the connection string

### "Port 5001 already in use"
- Change port in `backend/.env` to another port (e.g., 5002)
- Update `frontend/.env` with the new port

### Backend won't start
- Make sure MongoDB connection string is correct
- Check that all dependencies are installed: `npm install`
- Look at error messages in terminal

## Need Help?

Check `SETUP_GUIDE.md` for detailed step-by-step instructions with screenshots guidance.


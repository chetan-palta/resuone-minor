# Starting Servers Guide

## Quick Start

### Option 1: Run Both Servers Together (Recommended)
```bash
npm run dev:all
```

This starts:
- Backend server on port 3001
- Frontend server on port 8080 (or 5173)

### Option 2: Run Separately

**Terminal 1 - Backend:**
```bash
npm run dev:server
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

## Verify Servers Are Running

### Backend Server
- Check: http://localhost:3001/health
- Should return: `{"status":"ok"}`

### Frontend Server
- Check: http://localhost:8080
- Should show ResuOne landing page

## Database (Supabase)

Supabase is cloud-based, so no local database setup needed. Just ensure:

1. `.env` file has correct credentials:
```env
VITE_SUPABASE_URL=https://ocmtxnxdglntvznuwuhw.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key
VITE_API_URL=http://localhost:3001
```

2. Database tables exist (run SQL from `DATABASE_FIX.md` if needed)

## Troubleshooting

### Port Already in Use
```bash
# Windows - Find process using port
netstat -ano | findstr :3001
netstat -ano | findstr :8080

# Kill process (replace PID)
taskkill /PID <PID> /F
```

### Environment Variables Not Loading
- Restart dev server after changing `.env`
- Ensure variables start with `VITE_`
- No quotes around values

### Database Connection Issues
- Verify Supabase URL in `.env`
- Check Supabase Dashboard for project status
- Verify tables exist in Table Editor

## Server Status

After starting, you should see:
- ✅ Backend: `Server running on port 3001`
- ✅ Frontend: `Local: http://localhost:8080`


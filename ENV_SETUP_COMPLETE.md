# Complete .env Setup Guide

## Required Environment Variables

Create `.env` file in project root with these variables:

```env
# REQUIRED - Supabase Configuration
VITE_SUPABASE_URL=https://ocmtxnxdglntvznuwuhw.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your_actual_key_here

# REQUIRED - Backend Server (for resume import)
VITE_API_URL=http://localhost:3001
PORT=3001
FRONTEND_URL=http://localhost:8080
```

## How to Get Supabase Keys

### Step 1: Get Supabase URL and Key

1. Go to: https://app.supabase.com
2. Select your project
3. Go to: **Settings** → **API**
4. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_PUBLISHABLE_KEY`

### Step 2: Create .env File

1. In project root, create `.env` file
2. Copy this template:

```env
VITE_SUPABASE_URL=https://ocmtxnxdglntvznuwuhw.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=paste_your_anon_key_here
VITE_API_URL=http://localhost:3001
PORT=3001
FRONTEND_URL=http://localhost:8080
```

3. Replace `paste_your_anon_key_here` with your actual key from Supabase

### Step 3: Verify .env File

**Important Rules:**
- ✅ No quotes around values
- ✅ No trailing slashes
- ✅ Must start with `VITE_` for frontend variables
- ✅ One variable per line
- ✅ No spaces around `=`

**Correct:**
```env
VITE_SUPABASE_URL=https://ocmtxnxdglntvznuwuhw.supabase.co
```

**Wrong:**
```env
VITE_SUPABASE_URL="https://ocmtxnxdglntvznuwuhw.supabase.co"
VITE_SUPABASE_URL=https://ocmtxnxdglntvznuwuhw.supabase.co/
VITE_SUPABASE_URL = https://ocmtxnxdglntvznuwuhw.supabase.co
```

### Step 4: Restart Dev Server

After creating/updating `.env`:
1. **Stop** the dev server (Ctrl+C)
2. **Start again**: `npm run dev` or `npm run dev:all`
3. Environment variables are loaded at startup

## Verify Environment Variables Are Loaded

### Check Browser Console

1. Open browser console (F12)
2. Look for:
   - ✅ No errors about missing Supabase URL
   - ✅ No warnings about URL mismatch
   - ✅ If you see warnings, check `.env` file

### Check in Code

Add temporarily to see values (remove after checking):

```typescript
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('API URL:', import.meta.env.VITE_API_URL);
```

## Common Issues

### Issue: "Supabase environment variables are missing"
**Fix:**
- Check `.env` file exists in project root
- Verify variable names start with `VITE_`
- Restart dev server after creating `.env`

### Issue: "Supabase URL mismatch"
**Fix:**
- Check `.env` has correct URL: `https://ocmtxnxdglntvznuwuhw.supabase.co`
- No trailing slash
- No quotes

### Issue: Sign-in doesn't work
**Fix:**
1. Verify `.env` has correct `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`
2. Check browser console for errors
3. Verify Supabase project is active
4. Check Google OAuth is enabled in Supabase Dashboard

## Quick Checklist

- [ ] `.env` file exists in project root
- [ ] `VITE_SUPABASE_URL` is set correctly
- [ ] `VITE_SUPABASE_PUBLISHABLE_KEY` is set correctly
- [ ] `VITE_API_URL` is set to `http://localhost:3001`
- [ ] No quotes around values
- [ ] No trailing slashes
- [ ] Dev server restarted after creating `.env`
- [ ] Browser console shows no Supabase errors

## Test After Setup

1. **Check Console**: Open browser console (F12)
   - Should see no Supabase errors
   - Should see validation messages if URL is wrong

2. **Test Sign-In**: 
   - Go to `/auth`
   - Click "Sign in with Google"
   - Should redirect to Google (not show error)

3. **Test Database**:
   - After sign-in, try to save resume
   - Should work without "table not found" errors


# ⚠️ URGENT: .env File Fix Required

## Problem Found

Your `.env` file has a **KEY MISMATCH**:

- ✅ URL: `https://ocmtxnxdglntvznuwuhw.supabase.co` (CORRECT)
- ❌ KEY: From old project `xoaesmifrvtjeunkmkax` (WRONG!)

The key must match the project URL!

## Fix Immediately

### Step 1: Get Correct Key from Supabase

1. Go to: https://app.supabase.com
2. Select project: **ocmtxnxdglntvznuwuhw**
3. Go to: **Settings** → **API**
4. Copy **anon public** key (long string starting with `eyJ...`)

### Step 2: Update .env File

Replace the entire `.env` file with:

```env
VITE_SUPABASE_URL=https://ocmtxnxdglntvznuwuhw.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=paste_correct_key_here_from_step_1
VITE_API_URL=http://localhost:3001
PORT=3001
FRONTEND_URL=http://localhost:8080
```

**Important:**
- Replace `paste_correct_key_here_from_step_1` with the actual key from Supabase
- No quotes
- No trailing slashes
- One variable per line

### Step 3: Restart Servers

```bash
# Stop servers (Ctrl+C)
# Then restart:
npm run dev:all
```

### Step 4: Verify

1. Open browser console (F12)
2. Should NOT see URL mismatch warning
3. Try Google sign-in again

## Why Sign-In Was Failing

The wrong key means:
- Supabase client can't authenticate properly
- OAuth requests go to wrong project
- Google sign-in fails with "provider not enabled" error

## After Fix

Once you update with the correct key:
- ✅ Google sign-in will work
- ✅ Resume saving will work
- ✅ All Supabase features will work


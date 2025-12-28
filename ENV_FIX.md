# Environment Variable Fix

## Issue
The error shows Supabase URL: `xoaesmifrvtjeunkmkax` but we need: `ocmtxnxdglntvznuwuhw`

## Fix

### Step 1: Check `.env` file

Create or update `.env` file in project root:

```env
VITE_SUPABASE_URL=https://ocmtxnxdglntvznuwuhw.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key_here
VITE_API_URL=http://localhost:3001
```

**Important:**
- No quotes around values
- No trailing slashes
- Must start with `VITE_` for Vite to load them

### Step 2: Restart Dev Server

After updating `.env`:
1. Stop the dev server (Ctrl+C)
2. Start again: `npm run dev`

### Step 3: Verify in Browser Console

Open browser console (F12) and check:
- Should see Supabase URL validation message
- If wrong URL, you'll see a warning

### Step 4: Clear Browser Cache

- Clear localStorage: `localStorage.clear()` in console
- Or use Incognito mode
- Refresh page

## Get Correct Supabase Credentials

1. Go to: https://app.supabase.com
2. Select your project
3. Go to: **Settings** → **API**
4. Copy:
   - **Project URL**: `https://ocmtxnxdglntvznuwuhw.supabase.co`
   - **anon public key**: (long string starting with `eyJ...`)

## Verify

After fixing, the OAuth URL should be:
```
https://ocmtxnxdglntvznuwuhw.supabase.co/auth/v1/authorize?provider=google&...
```

NOT:
```
https://xoaesmifrvtjeunkmkax.supabase.co/auth/v1/authorize?provider=google&...
```


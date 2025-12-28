# 401 Error Fix - Supabase Authentication

## Error Explained

```
Failed to load resource: the server responded with a status of 401
ocmtxnxdglntvznuwuhw.supabase.co/auth/v1/token?grant_type=password
```

**401 = Unauthorized** - This means:
- ❌ The API key is **wrong** or **invalid**
- ❌ The key doesn't match the project URL
- ❌ The key has been revoked or expired

## Root Cause

Your `.env` file has:
- ✅ URL: `ocmtxnxdglntvznuwuhw` (correct project)
- ❌ KEY: From `xoaesmifrvtjeunkmkax` (wrong project!)

**The key MUST match the project URL!**

## Fix Steps

### Step 1: Get Correct Key

1. **Go to**: https://app.supabase.com
2. **Select project**: `ocmtxnxdglntvznuwuhw`
3. **Navigate to**: Settings → API
4. **Copy**: "anon public" key (starts with `eyJ...`)

### Step 2: Update .env

**Current (WRONG):**
```env
VITE_SUPABASE_PUBLISHABLE_KEY=eyJ...xoaesmifrvtjeunkmkax...
```

**Should be (CORRECT):**
```env
VITE_SUPABASE_PUBLISHABLE_KEY=eyJ...ocmtxnxdglntvznuwuhw...
```

The key should contain `ocmtxnxdglntvznuwuhw` in it, NOT `xoaesmifrvtjeunkmkax`.

### Step 3: Verify Key Format

The correct key should:
- Start with: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.`
- Be very long (200+ characters)
- Contain your project reference in the payload

### Step 4: Restart Everything

```bash
# Stop all servers (Ctrl+C)
# Clear browser cache or use Incognito
# Restart:
npm run dev:all
```

### Step 5: Test

1. Open browser console (F12)
2. Should see: ✅ No 401 errors
3. Should see: ✅ No key mismatch warnings
4. Try Google sign-in - should work now

## How to Verify Key is Correct

### Method 1: Check Browser Console

After updating `.env` and restarting:
- Open console (F12)
- Look for validation messages
- Should NOT see key mismatch error

### Method 2: Decode JWT (Optional)

The key is a JWT token. You can decode it at https://jwt.io:
- Paste your key
- Check the `ref` field in payload
- Should say: `"ref": "ocmtxnxdglntvznuwuhw"`

### Method 3: Test API Directly

```bash
# Replace YOUR_KEY with actual key
curl -H "apikey: YOUR_KEY" \
  https://ocmtxnxdglntvznuwuhw.supabase.co/rest/v1/
```

Should return data, not 401.

## Common Mistakes

1. **Using key from different project** ❌
   - Fix: Get key from correct project

2. **Key has extra spaces/quotes** ❌
   ```env
   VITE_SUPABASE_PUBLISHABLE_KEY="eyJ..."  # Wrong - quotes
   VITE_SUPABASE_PUBLISHABLE_KEY= eyJ...   # Wrong - space
   ```
   Fix: No quotes, no spaces

3. **Not restarting server** ❌
   - Fix: Always restart after changing .env

4. **Using service_role key instead of anon** ❌
   - Fix: Use "anon public" key, NOT "service_role"

## After Fix

Once you update with correct key:
- ✅ 401 errors will stop
- ✅ Google sign-in will work
- ✅ Email/password sign-in will work
- ✅ Resume saving will work
- ✅ All Supabase features will work

## Quick Checklist

- [ ] Got key from correct project (ocmtxnxdglntvznuwuhw)
- [ ] Updated .env file
- [ ] No quotes around key
- [ ] No trailing slashes
- [ ] Restarted dev server
- [ ] Cleared browser cache
- [ ] Tested sign-in - works!


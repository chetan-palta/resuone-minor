# OAuth Redirect Fix

## Problem
After Google sign-in, user is redirected to `/dashboard` but immediately redirected back to `/auth`.

## Root Cause
Race condition: The redirect check runs before OAuth session is established.

## Solution Applied

### 1. Check Hash in Redirect Logic
- Added direct hash check in redirect condition
- Prevents redirect while OAuth tokens are in URL

### 2. Don't Clean URL Immediately
- Keep hash in URL until session is established
- Supabase needs hash to process OAuth callback
- Clean URL only after session is confirmed

### 3. Extended Wait Time
- Increased max attempts to 20 (6 seconds)
- Initial delay increased to 500ms
- Gives Supabase time to process hash

## How It Works Now

1. OAuth redirects to `/dashboard#access_token=...`
2. Dashboard detects hash token
3. Sets `processingOAuth = true`
4. **Keeps hash in URL** (important!)
5. Waits for Supabase to process session
6. Once session established, cleans URL
7. Redirect check sees hash token → doesn't redirect
8. User stays on dashboard

## Testing

1. Clear browser cache
2. Sign in with Google
3. Should stay on `/dashboard` after redirect
4. Check console for "✅ OAuth session established"

## Note on 404 Error

The `Could not GET /` error on port 3001 is just Chrome DevTools trying to connect. It's not a real issue and doesn't affect functionality.


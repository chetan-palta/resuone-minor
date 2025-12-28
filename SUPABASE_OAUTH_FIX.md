# Supabase Google OAuth Fix Guide

## The Error
```
{
  "code": 400,
  "error_code": "validation_failed",
  "msg": "Unsupported provider: provider is not enabled"
}
```

## Quick Fix Steps

### 1. Supabase Dashboard - Re-enable Google Provider

1. **Go to**: https://app.supabase.com → Your Project
2. **Navigate to**: Authentication → Providers
3. **Find Google** in the list
4. **Click on the Google card** (opens settings)
5. **Disable** the toggle (turn it OFF)
6. **Wait 5 seconds**
7. **Enable** the toggle (turn it ON)
8. **Verify fields are filled**:
   - Client ID (from Google Cloud Console)
   - Client Secret (from Google Cloud Console)
9. **Click "Save"** at the bottom
10. **Wait 30-60 seconds** for changes to propagate

### 2. Verify Google Cloud Console

1. Go to: https://console.cloud.google.com
2. Select your project
3. Go to: **APIs & Services** → **Credentials**
4. Click on your OAuth 2.0 Client ID
5. **Verify "Authorized redirect URIs"** contains:
   ```
   https://ocmtxnxdglntvznuwuhw.supabase.co/auth/v1/callback
   ```
6. **Verify "Authorized JavaScript origins"** contains:
   ```
   http://localhost:3001
   http://localhost:8080
   ```
7. Click **Save**

### 3. Check Supabase URL Configuration

1. In Supabase Dashboard → **Authentication** → **URL Configuration**
2. Under **Redirect URLs**, ensure these are added:
   ```
   http://localhost:8080/**
   http://localhost:5173/**
   ```
3. Click **Save**

### 4. Verify Environment Variables

Check your `.env` file:
```env
VITE_SUPABASE_URL=https://ocmtxnxdglntvznuwuhw.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key_here
```

**Important**: 
- No trailing slashes
- No quotes around values
- Restart dev server after changing `.env`

### 5. Test Again

1. **Clear browser cache** or use Incognito mode
2. **Restart your dev server**: `npm run dev`
3. Go to `/auth` page
4. Click "Sign in with Google"
5. Check browser console (F12) for any errors

## Debugging

### Check Browser Console

Open browser console (F12) and look for:
- Any error messages
- Network requests to Supabase
- OAuth redirect URLs

### Check Supabase Logs

1. Go to Supabase Dashboard → **Logs** → **Auth Logs**
2. Look for recent authentication attempts
3. Check for error messages

### Test Provider Availability

Add this temporarily to test:

```typescript
// In browser console
const { supabase } = await import('./src/integrations/supabase/client.ts');
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: window.location.origin + '/dashboard'
  }
});
console.log('Test result:', { data, error });
```

## Common Mistakes

1. **Provider name**: Must be exactly `'google'` (lowercase)
2. **Client ID/Secret**: No extra spaces, copy-paste directly
3. **Redirect URL**: Must match EXACTLY in both places
4. **Not waiting**: Changes take 30-60 seconds to propagate
5. **Cache**: Browser cache can cause issues

## Still Not Working?

### Option 1: Restart Supabase Project
1. Supabase Dashboard → **Settings** → **General**
2. Scroll down → **Restart Project**
3. Wait 2-3 minutes
4. Try again

### Option 2: Re-create OAuth Credentials
1. Google Cloud Console → Delete old OAuth client
2. Create new OAuth 2.0 Client ID
3. Add redirect URI: `https://ocmtxnxdglntvznuwuhw.supabase.co/auth/v1/callback`
4. Copy new Client ID and Secret
5. Update in Supabase Dashboard
6. Save and wait 1 minute

### Option 3: Check Supabase Status
- Visit: https://status.supabase.com
- Check if there are any ongoing issues

## Connection String (Not Needed for OAuth)

The PostgreSQL connection string you provided is for database access, not OAuth:
```
postgresql://postgres:[YOUR_PASSWORD]@db.ocmtxnxdglntvznuwuhw.supabase.co:5432/postgres
```

This is **not needed** for Google OAuth to work. OAuth only needs:
- Supabase Project URL
- Supabase Anon Key
- Google OAuth Client ID
- Google OAuth Client Secret

## Final Checklist

Before testing again, verify:

- [ ] Google provider enabled in Supabase (toggle ON, saved)
- [ ] Client ID and Secret entered (no spaces, correct)
- [ ] Redirect URI in Google Console matches exactly
- [ ] Redirect URLs added in Supabase URL Configuration
- [ ] Environment variables correct
- [ ] Waited 1-2 minutes after saving
- [ ] Cleared browser cache
- [ ] Restarted dev server

Try these steps and let me know if it works!


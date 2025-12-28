# Google OAuth Troubleshooting

## Error: "Unsupported provider: provider is not enabled"

This error means Supabase can't find the Google provider enabled. Let's fix it step by step.

## Step-by-Step Fix

### 1. Verify Supabase Dashboard Configuration

1. Go to **Supabase Dashboard** → Your Project
2. Navigate to **Authentication** → **Providers**
3. Find **Google** in the list
4. **Important**: Click on the Google provider card (not just toggle)
5. Verify:
   - ✅ **Enabled** toggle is ON (green)
   - ✅ **Client ID** is filled (from Google Cloud Console)
   - ✅ **Client Secret** is filled (from Google Cloud Console)
6. Click **Save** button at the bottom

### 2. Check Google Cloud Console

1. Go to **Google Cloud Console** → **APIs & Services** → **Credentials**
2. Find your OAuth 2.0 Client ID
3. Verify **Authorized redirect URIs** includes:
   ```
   https://ocmtxnxdglntvznuwuhw.supabase.co/auth/v1/callback
   ```
4. Verify **Authorized JavaScript origins** includes:
   ```
   http://localhost:3001
   http://localhost:8080
   ```

### 3. Verify Supabase Redirect URLs

1. In Supabase Dashboard → **Authentication** → **URL Configuration**
2. Under **Redirect URLs**, add:
   ```
   http://localhost:8080/**
   http://localhost:5173/**
   http://localhost:3001/**
   ```
3. Click **Save**

### 4. Clear Browser Cache

Sometimes cached auth state causes issues:
- Clear browser cache
- Or use Incognito/Private window
- Or clear localStorage: `localStorage.clear()` in browser console

### 5. Check Supabase Project Settings

1. Go to **Settings** → **API**
2. Verify **Project URL** is: `https://ocmtxnxdglntvznuwuhw.supabase.co`
3. Copy the **anon public** key
4. Verify it matches your `.env` file

### 6. Test Provider Status

Run this in browser console on your app:
```javascript
// Check if provider is available
import { supabase } from '@/integrations/supabase/client';
const { data, error } = await supabase.auth.getSession();
console.log('Session:', data, error);
```

## Common Issues

### Issue 1: Provider Not Actually Enabled
**Solution**: 
- Disable Google provider
- Wait 5 seconds
- Re-enable it
- Click Save
- Wait 30 seconds for changes to propagate

### Issue 2: Wrong Client ID/Secret
**Solution**:
- Double-check Client ID and Secret from Google Cloud Console
- Make sure no extra spaces
- Copy-paste directly (don't type manually)

### Issue 3: Redirect URL Mismatch
**Solution**:
- Must match EXACTLY: `https://ocmtxnxdglntvznuwuhw.supabase.co/auth/v1/callback`
- No trailing slashes
- No typos

### Issue 4: Supabase Cache
**Solution**:
- Wait 1-2 minutes after saving
- Try again
- Or restart Supabase project (Settings → Restart)

## Alternative: Test with Supabase CLI

If dashboard isn't working, you can check via API:

```bash
# Check providers (requires Supabase access token)
curl -X GET \
  'https://ocmtxnxdglntvznuwuhw.supabase.co/rest/v1/auth/providers' \
  -H 'apikey: YOUR_ANON_KEY'
```

## Debug Code

Add this to test provider availability:

```typescript
// In browser console or component
const testGoogleAuth = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      }
    });
    console.log('OAuth response:', { data, error });
  } catch (err) {
    console.error('OAuth error:', err);
  }
};
```

## Final Checklist

- [ ] Google provider enabled in Supabase Dashboard
- [ ] Client ID and Secret entered correctly
- [ ] Redirect URL matches exactly
- [ ] Redirect URLs added in Supabase URL Configuration
- [ ] Google Cloud Console redirect URI matches
- [ ] Waited 1-2 minutes after saving
- [ ] Cleared browser cache
- [ ] Environment variables correct in `.env`

## Still Not Working?

If still getting the error:

1. **Double-check provider name**: Make sure it's exactly `'google'` (lowercase)
2. **Check Supabase logs**: Dashboard → Logs → Auth Logs
3. **Try different browser**: Sometimes browser extensions interfere
4. **Check network tab**: See what request is being made
5. **Contact Supabase support**: If provider is definitely enabled but still errors


# Verification Checklist

## ✅ Configuration Verified

### Supabase
- [x] Project URL: `https://ocmtxnxdglntvznuwuhw.supabase.co`
- [x] Redirect URL configured: `https://ocmtxnxdglntvznuwuhw.supabase.co/auth/v1/callback`
- [x] Google OAuth enabled in Supabase Dashboard

### Google Cloud Console
- [x] Authorized JavaScript Origins:
  - `http://localhost:3001`
  - `http://localhost:8080`
- [x] Authorized Redirect URI:
  - `https://ocmtxnxdglntvznuwuhw.supabase.co/auth/v1/callback`

### Environment Variables
Check `.env` file has:
```env
VITE_SUPABASE_URL=https://ocmtxnxdglntvznuwuhw.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key_here
VITE_API_URL=http://localhost:3001
```

## 🧪 Testing Steps

### 1. Start Servers

**Terminal 1:**
```bash
npm run dev:server
```
Expected output: `Server running on port 3001`

**Terminal 2:**
```bash
npm run dev
```
Expected: App opens on `http://localhost:8080` or `http://localhost:5173`

### 2. Test Dark Mode

1. Open `http://localhost:8080` (or 5173)
2. Look for theme toggle (moon/sun icon) in top right
3. Click it - page should switch themes
4. Refresh page - theme should persist
5. Go to `/dashboard` - toggle should be there
6. Go to `/edit` - toggle should be there

### 3. Test Google Sign-In

1. Go to `/auth`
2. Click "Sign in with Google" button
3. Should redirect to Google login
4. After login, should redirect back to `/dashboard`
5. Your email should appear in dashboard header

**If Sign-In Fails:**
- Check Supabase Dashboard > Authentication > Providers > Google is enabled
- Verify Client ID and Secret are correct
- Check browser console for errors
- Verify redirect URL matches exactly

### 4. Test Resume Import

1. Go to `/edit`
2. Click upload icon (top right, next to theme toggle)
3. Upload a DOCX or PDF file
4. Should show "Parsing resume..."
5. After parsing, resume should load in editor
6. Suggestions panel should appear on right side

**If Import Fails:**
- Check backend server is running: `npm run dev:server`
- Check browser console for errors
- Verify file is valid DOCX/PDF (< 10MB)
- Check server terminal for errors

### 5. Test Resume Saving

1. Sign in with Google
2. Go to `/edit`
3. Fill in some resume data
4. Click "Save to Dashboard" button
5. Should show success message
6. Go to `/dashboard` - resume should appear in list

**Test 5-Resume Limit:**
1. Create 5 resumes
2. Try to create 6th
3. Should show error: "Resume limit reached"

### 6. Test Suggestions

1. After importing resume, check suggestions panel
2. ATS score should display (0-100)
3. Suggestions should be categorized
4. Click "Apply" on auto-applyable suggestions
5. Click "Ignore" to dismiss
6. Click download icon to export suggestions

## 🔍 Common Issues & Fixes

### Issue: Backend server won't start
**Fix:**
- Check Node.js version: `node --version` (should be 18+)
- Check port 3001 is not in use
- Check `server/index.js` exists
- Check dependencies: `npm install`

### Issue: Google Sign-In redirects to wrong page
**Fix:**
- Verify redirect URL in Supabase matches exactly: `https://ocmtxnxdglntvznuwuhw.supabase.co/auth/v1/callback`
- Check Supabase Dashboard > Authentication > URL Configuration
- Add your localhost URL to redirect URLs

### Issue: Import fails with "failed to fetch"
**Fix:**
- Ensure backend server is running: `npm run dev:server`
- Check CORS settings in `server/index.js`
- Verify `VITE_API_URL=http://localhost:3001` in `.env`

### Issue: Theme toggle not working
**Fix:**
- Check browser localStorage is enabled
- Clear browser cache
- Check `ThemeProvider` is in `App.tsx`
- Verify `next-themes` is installed

### Issue: Can't save resume
**Fix:**
- Verify signed in (check dashboard shows email)
- Check Supabase connection (browser console)
- Verify database tables exist
- Check RLS policies are correct

## ✅ Final Verification

Before marking complete, verify:

- [ ] All servers start without errors
- [ ] Dark mode works on all pages
- [ ] Google Sign-In works end-to-end
- [ ] Resume import works (DOCX and PDF)
- [ ] Resume saving works
- [ ] 5-resume limit enforced
- [ ] Suggestions display correctly
- [ ] No console errors
- [ ] No server errors

## 📝 Notes

- Backend server must be running for resume import to work
- Google OAuth requires internet connection
- Theme preference stored in localStorage
- Resume data stored in Supabase database


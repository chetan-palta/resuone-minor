# Testing Guide

## Prerequisites

1. ✅ Backend server dependencies installed
2. ✅ Frontend dependencies installed
3. ✅ Supabase project created
4. ✅ Environment variables configured

## Step-by-Step Testing

### 1. Start Servers

**Terminal 1 - Backend:**
```bash
npm run dev:server
```
Expected: `Server running on port 3001`

**Terminal 2 - Frontend:**
```bash
npm run dev
```
Expected: App runs on `http://localhost:5173`

### 2. Test Dark Mode Toggle

**Landing Page:**
- [ ] Go to `/`
- [ ] Click theme toggle (top right, moon/sun icon)
- [ ] Page should switch between light/dark
- [ ] Refresh page - theme should persist

**Dashboard:**
- [ ] Sign in and go to `/dashboard`
- [ ] Click theme toggle (top right)
- [ ] Theme should toggle
- [ ] Refresh - theme persists

**Editor:**
- [ ] Go to `/edit`
- [ ] Click theme toggle in header
- [ ] Theme should toggle
- [ ] Preview should adapt to theme

### 3. Test Resume Import

**Test Case 1: Valid DOCX File**
- [ ] Go to `/edit`
- [ ] Click upload icon (top right)
- [ ] Drag & drop a DOCX file OR click "Choose File"
- [ ] File should upload
- [ ] Resume should parse and load in editor
- [ ] Suggestions panel should appear (if suggestions exist)
- [ ] ATS score should display

**Test Case 2: Valid PDF File**
- [ ] Repeat with PDF file
- [ ] Should parse correctly

**Test Case 3: Invalid File Type**
- [ ] Try uploading `.txt` or `.jpg`
- [ ] Should show error: "Invalid file type"

**Test Case 4: File Too Large**
- [ ] Try uploading file > 10MB
- [ ] Should show error: "File too large"

**Test Case 5: Server Not Running**
- [ ] Stop backend server
- [ ] Try uploading file
- [ ] Should show: "Cannot connect to server"

### 4. Test Resume Analysis & Suggestions

**After Import:**
- [ ] Check ATS score displays (0-100)
- [ ] Review suggestions list
- [ ] Click "Apply" on auto-applyable suggestions
- [ ] Click "Ignore" on suggestions
- [ ] Click download icon to export suggestions report (JSON)

**Suggestions to Verify:**
- [ ] Missing contact info (if email/phone missing)
- [ ] Missing skills (if < 5 skills)
- [ ] Missing metrics (if no numbers in experience)
- [ ] Passive verbs (if "was responsible" found)
- [ ] Missing education (if no education entries)

### 5. Test Google Sign-In

**Setup (One-time):**
- [ ] Follow `SUPABASE_SETUP.md` to configure Google OAuth
- [ ] Enable Google provider in Supabase Dashboard

**Test Sign-In:**
- [ ] Go to `/auth`
- [ ] Click "Sign in with Google"
- [ ] Should redirect to Google login
- [ ] After login, should redirect to `/dashboard`
- [ ] User email should display in dashboard header

**Test Sign-Out:**
- [ ] Click "Sign Out" in dashboard
- [ ] Should redirect to landing page
- [ ] Should be signed out

### 6. Test Resume Saving

**Test Case 1: Save New Resume (Signed In)**
- [ ] Sign in
- [ ] Go to `/edit`
- [ ] Fill in some resume data
- [ ] Click "Save to Dashboard"
- [ ] Should save successfully
- [ ] Resume ID should appear in URL
- [ ] Go to `/dashboard` - resume should appear in list

**Test Case 2: Update Existing Resume**
- [ ] Open saved resume from dashboard
- [ ] Make changes
- [ ] Click "Save"
- [ ] Should update successfully
- [ ] Changes should persist after refresh

**Test Case 3: 5-Resume Limit**
- [ ] Create 5 resumes (save 5 times)
- [ ] Try to create 6th resume
- [ ] Should show error: "Resume limit reached"
- [ ] Delete one resume
- [ ] Should be able to create new one

**Test Case 4: Save Without Sign-In**
- [ ] Sign out
- [ ] Go to `/edit`
- [ ] Try to save
- [ ] Should show: "Sign in required"

### 7. Test Imported Resume Saving

**Flow:**
- [ ] Import resume (DOCX/PDF)
- [ ] Review parsed data in editor
- [ ] Sign in (if not already)
- [ ] Click "Save to Dashboard"
- [ ] Should save successfully
- [ ] Go to dashboard - imported resume should appear

### 8. Test Dark Mode with Templates

**For Each Template:**
- [ ] Switch to template (Settings > Template)
- [ ] Toggle dark mode
- [ ] Preview should adapt
- [ ] Export should work in both themes

### 9. Test Error Handling

**Network Errors:**
- [ ] Stop backend server
- [ ] Try import - should show helpful error

**Auth Errors:**
- [ ] Try accessing `/dashboard` without sign-in
- [ ] Should redirect to `/auth`

**File Errors:**
- [ ] Try invalid file types
- [ ] Try oversized files
- [ ] Should show appropriate errors

## Expected Results Summary

✅ **All Features Working:**
- Dark mode toggle on all pages
- Resume import (DOCX/PDF)
- Resume analysis & suggestions
- Google Sign-In
- Resume saving with 5-resume limit
- Error handling

## Common Issues & Fixes

### Issue: Import fails with "failed to fetch"
**Fix:** Ensure backend server is running on port 3001

### Issue: Google Sign-In redirects to wrong URL
**Fix:** Check redirect URIs in Google Cloud Console match Supabase callback URL

### Issue: Theme doesn't persist
**Fix:** Check browser localStorage is enabled

### Issue: Can't save resume
**Fix:** 
- Verify signed in
- Check Supabase connection
- Verify database tables exist

### Issue: Suggestions not showing
**Fix:** 
- Check backend server is running
- Verify resume has parseable content
- Check browser console for errors

## Final Checklist

Before marking as complete:

- [ ] All test cases pass
- [ ] No console errors
- [ ] No linting errors
- [ ] Dark mode works on all pages
- [ ] Import works for DOCX and PDF
- [ ] Google Sign-In works
- [ ] Resume saving works
- [ ] 5-resume limit enforced
- [ ] Error messages are helpful
- [ ] UI is responsive


// Note: This endpoint is kept for compatibility but actual saving
// should be done directly from the frontend using Supabase client
// This endpoint can be used for additional server-side validation if needed

export async function saveImportedResume(req, res) {
  try {
    const { resumeJson, userId } = req.body;

    if (!resumeJson) {
      return res.status(400).json({ error: 'resumeJson is required' });
    }

    if (!userId) {
      return res.status(401).json({ error: 'User ID is required' });
    }

    // Note: Actual saving should be done from frontend using Supabase
    // This endpoint can be used for server-side validation or processing
    // The 5-resume limit should be enforced in Supabase RLS policies or frontend checks

    return res.json({
      success: true,
      message: 'Resume validated successfully. Save from frontend using Supabase client.',
      userId
    });
  } catch (err) {
    console.error('Save error:', err);
    return res.status(500).json({ 
      error: 'save_failed', 
      detail: err.message 
    });
  }
}


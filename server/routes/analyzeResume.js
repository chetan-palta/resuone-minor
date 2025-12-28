import { analyzeResumeLogic } from '../utils/analyzer.js';

export async function analyzeResume(req, res) {
  try {
    const { resumeJson } = req.body;
    
    if (!resumeJson) {
      return res.status(400).json({ error: 'resumeJson is required' });
    }

    const analysis = await analyzeResumeLogic(resumeJson);
    
    return res.json({
      suggestions: analysis.suggestions,
      atsScore: analysis.atsScore
    });
  } catch (err) {
    console.error('Analysis error:', err);
    return res.status(500).json({ 
      error: 'analysis_failed', 
      detail: err.message 
    });
  }
}


import mammoth from 'mammoth';
import sanitizeHtml from 'sanitize-html';
import fs from 'fs';
import { createRequire } from 'module';
import { parseTextToResumeJson } from '../utils/parser.js';

const require = createRequire(import.meta.url);
// pdf-parse exports an object with PDFParse function
const pdfParseModule = require('pdf-parse');
const pdfParse = pdfParseModule.PDFParse || pdfParseModule.default || pdfParseModule;

export async function parseResume(req, res) {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const mime = file.mimetype;
    let text = '';

    try {
      if (mime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
          file.originalname.endsWith('.docx')) {
        const result = await mammoth.convertToHtml({ path: file.path });
        const html = sanitizeHtml(result.value, {
          allowedTags: ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
          allowedAttributes: {}
        });
        text = html.replace(/<[^>]+>/g, '\n').replace(/\n{2,}/g, '\n').trim();
      } else if (mime === 'application/pdf' || file.originalname.endsWith('.pdf')) {
        const data = fs.readFileSync(file.path);
        const pdfData = await pdfParse(data);
        text = pdfData.text;
      } else {
        // Cleanup and return error
        fs.unlinkSync(file.path);
        return res.status(415).json({ error: 'Unsupported file type' });
      }

      // Parse text into resume JSON
      const resumeJson = parseTextToResumeJson(text);

      // Analyze resume
      const { analyzeResumeLogic } = await import('../utils/analyzer.js');
      const analysis = await analyzeResumeLogic(resumeJson);

      // Cleanup temp file
      fs.unlinkSync(file.path);

      return res.json({
        parsedResume: resumeJson,
        suggestions: analysis.suggestions,
        atsScore: analysis.atsScore
      });
    } catch (parseError) {
      // Cleanup on error
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      throw parseError;
    }
  } catch (err) {
    console.error('Parse error:', err);
    return res.status(500).json({ 
      error: 'parse_failed', 
      detail: err.message 
    });
  }
}


import { v4 as uuidv4 } from 'uuid';

export function parseTextToResumeJson(text) {
  // Clean up text: remove page markers and extra whitespace
  text = text.replace(/--\s*\d+\s+of\s+\d+\s*--/gi, '');
  text = text.replace(/page\s+\d+\s+of\s+\d+/gi, '');
  text = text.replace(/\n{3,}/g, '\n\n'); // Normalize multiple newlines
  
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(line => {
    // Filter out empty lines and page markers
    if (!line) return false;
    if (/^--\s*\d+\s+of\s+\d+\s*--$/i.test(line)) return false;
    if (/^page\s+\d+\s+of\s+\d+$/i.test(line)) return false;
    return true;
  });
  
  const resume = {
    personal: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      github: '',
      website: '',
      summary: ''
    },
    education: [],
    experience: [],
    projects: [],
    skills: [],
    certifications: [],
    sections: [
      { id: 'personal', type: 'personal', visible: true, order: 0 },
      { id: 'experience', type: 'experience', visible: true, order: 1 },
      { id: 'education', type: 'education', visible: true, order: 2 },
      { id: 'skills', type: 'skills', visible: true, order: 3 },
      { id: 'projects', type: 'projects', visible: true, order: 4 },
      { id: 'certifications', type: 'certifications', visible: true, order: 5 },
    ],
    title: 'Imported Resume',
    templateId: 'professional',
    accentColor: '#2563eb',
    fontFamily: 'inter'
  };

  // Simple section-based extraction - collect all text in each section
  let currentSection = null;
  const sectionTexts = {
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    summary: []
  };
  
  // Extract contact info first
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lower = line.toLowerCase();

    // Email
    const emailMatch = line.match(/[\w\.-]+@[\w\.-]+\.\w+/);
    if (emailMatch && !resume.personal.email) {
      resume.personal.email = emailMatch[0];
      continue;
    }

    // Phone
    const phoneMatch = line.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
    if (phoneMatch && !resume.personal.phone) {
      resume.personal.phone = phoneMatch[0];
      continue;
    }

    // LinkedIn
    if (lower.includes('linkedin.com') || (lower.includes('linkedin') && !lower.includes('linkedin:'))) {
      const linkedinMatch = line.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([\w-]+)/i) || 
                           line.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/profile\/view\?id=([\w-]+)/i);
      if (linkedinMatch) {
        resume.personal.linkedin = linkedinMatch[0].startsWith('http') ? linkedinMatch[0] : 'https://' + linkedinMatch[0];
      }
      continue;
    }

    // GitHub
    if (lower.includes('github.com') || (lower.includes('github') && !lower.includes('github:'))) {
      const githubMatch = line.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([\w-]+(?:\/[\w-]+)?)/i);
      if (githubMatch) {
        resume.personal.github = githubMatch[0].startsWith('http') ? githubMatch[0] : 'https://' + githubMatch[0];
      }
      continue;
    }

    // Website/Portfolio
    if ((lower.startsWith('http://') || lower.startsWith('https://') || lower.startsWith('www.')) 
        && !lower.includes('linkedin') && !lower.includes('github')) {
      let url = line.trim();
      url = url.replace(/[.,;:!?]+$/, '');
      if (!resume.personal.website) {
        resume.personal.website = url.startsWith('http') ? url : (url.startsWith('www.') ? 'https://' + url : url);
      }
      continue;
    }

    // Location
    if (!resume.personal.location && (lower.includes('location') || lower.includes('address'))) {
      const locationMatch = line.match(/location[:\s]+(.+)/i) || line.match(/address[:\s]+(.+)/i);
      if (locationMatch) {
        resume.personal.location = locationMatch[1].trim();
      }
    }
  }

  // Extract name from first non-empty line
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i];
    if (line && line.length > 2 && line.length < 50 && 
        !line.includes('@') && 
        !/^[\d\s\-\(\)]+$/.test(line) &&
        !line.toLowerCase().includes('resume') &&
        !line.toLowerCase().includes('cv')) {
      resume.personal.fullName = line;
      break;
    }
  }

  // Now parse sections - simple approach: detect section headers and collect all text
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lower = line.toLowerCase().trim();

    // Detect section headers
    if (/^(experience|work experience|professional experience|employment|work history|employment history|professional background)/i.test(lower)) {
      currentSection = 'experience';
      continue;
    }
    if (/^(education|academic|academic background|academic qualifications|qualifications|educational background)/i.test(lower)) {
      currentSection = 'education';
      continue;
    }
    if (/^(projects?|project experience|personal projects|side projects|portfolio projects)/i.test(lower)) {
      currentSection = 'projects';
      continue;
    }
    if (/^(skills?|technical skills|core competencies|competencies|technical competencies|key skills)/i.test(lower)) {
      currentSection = 'skills';
      continue;
    }
    if (/^(certifications?|certificates?|certification|certifications and licenses)/i.test(lower)) {
      currentSection = 'certifications';
      continue;
    }
    if (/^(summary|objective|profile|about|professional summary|career objective|executive summary)/i.test(lower)) {
      currentSection = 'summary';
      continue;
    }

    // Skip contact info lines we already extracted
    const isEmail = /^[\w\.-]+@[\w\.-]+\.\w+$/.test(line);
    const isPhone = /^(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/.test(line);
    const isOnlyLink = /^(linkedin|github|website):\s*https?:\/\//i.test(lower);
    if ((isEmail || isPhone || isOnlyLink) && line.length < 100) {
      continue;
    }

    // Collect text for current section
    if (currentSection && sectionTexts[currentSection]) {
      if (line.length > 0) {
        sectionTexts[currentSection].push(line);
      }
    }
  }

  // Process collected section texts
  // Experience
  if (sectionTexts.experience.length > 0) {
    const expText = sectionTexts.experience.join('\n');
    // Split by lines that look like job titles/companies
    const entries = expText.split(/\n(?=[A-Z][^a-z]*[A-Z]|\d{4})/).filter(e => e.trim().length > 10);
    entries.forEach((entry, idx) => {
      const lines = entry.split('\n').filter(l => l.trim());
      if (lines.length > 0) {
        const firstLine = lines[0];
        const dateMatch = firstLine.match(/(\d{4}|\w+\s+\d{4})\s*[-–—]\s*(\d{4}|\w+\s+\d{4}|present|current)/i);
        const positionMatch = firstLine.match(/(.+?)\s+(?:at|@)\s+(.+)/i);
        
        const exp = {
          id: uuidv4(),
          position: positionMatch ? positionMatch[1].trim() : firstLine,
          company: positionMatch ? positionMatch[2].split(/[-–—]/)[0].trim() : '',
          location: '',
          startDate: dateMatch ? dateMatch[1] : '',
          endDate: dateMatch ? (dateMatch[2].toLowerCase() === 'present' || dateMatch[2].toLowerCase() === 'current' ? new Date().toISOString().split('T')[0] : dateMatch[2]) : '',
          current: dateMatch ? (dateMatch[2].toLowerCase() === 'present' || dateMatch[2].toLowerCase() === 'current') : false,
          description: lines.slice(1).join(' '),
          achievements: lines.slice(1).filter(l => l.length > 20)
        };
        resume.experience.push(exp);
      }
    });
  }

  // Education
  if (sectionTexts.education.length > 0) {
    const eduText = sectionTexts.education.join('\n');
    const entries = eduText.split(/\n(?=[A-Z]|\d{4})/).filter(e => e.trim().length > 5);
    entries.forEach(entry => {
      const lines = entry.split('\n').filter(l => l.trim());
      if (lines.length > 0) {
        const edu = {
          id: uuidv4(),
          institution: lines[0],
          degree: '',
          field: '',
          startDate: '',
          endDate: '',
          description: lines.slice(1).join(' ')
        };
        const dateMatch = entry.match(/(\d{4}|\w+\s+\d{4})\s*[-–—]?\s*(\d{4}|\w+\s+\d{4})?/);
        if (dateMatch) {
          edu.startDate = dateMatch[1];
          if (dateMatch[2]) edu.endDate = dateMatch[2];
        }
        resume.education.push(edu);
      }
    });
  }

  // Skills - just join all text
  if (sectionTexts.skills.length > 0) {
    const skillsText = sectionTexts.skills.join(' ');
    const skills = skillsText.split(/[,;•\-\*|]/).map(s => s.trim()).filter(s => s.length > 1 && s.length < 50);
    if (skills.length > 0) {
      resume.skills.push({
        id: uuidv4(),
        category: 'Skills',
        skills: skills
      });
    }
  }

  // Projects
  if (sectionTexts.projects.length > 0) {
    const projText = sectionTexts.projects.join('\n');
    const entries = projText.split(/\n(?=[A-Z])/).filter(e => e.trim().length > 10);
    entries.forEach((entry, idx) => {
      const lines = entry.split('\n').filter(l => l.trim());
      if (lines.length > 0) {
        resume.projects.push({
          id: uuidv4(),
          name: lines[0],
          description: lines.slice(1).join(' '),
          technologies: [],
          link: '',
          github: ''
        });
      }
    });
  }

  // Certifications
  if (sectionTexts.certifications.length > 0) {
    const certText = sectionTexts.certifications.join('\n');
    const entries = certText.split(/\n/).filter(e => e.trim().length > 5);
    entries.forEach(entry => {
      if (entry.trim().length > 0) {
        resume.certifications.push({
          id: uuidv4(),
          name: entry,
          issuer: '',
          date: '',
          link: ''
        });
      }
    });
  }

  // Summary
  if (sectionTexts.summary.length > 0) {
    resume.personal.summary = sectionTexts.summary.join(' ');
  }

  return resume;
}

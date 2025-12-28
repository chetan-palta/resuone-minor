import { v4 as uuidv4 } from 'uuid';

export function parseTextToResumeJson(text) {
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  
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

  let currentSection = null;
  let currentEntry = null;
  let summaryLines = [];
  let inSummary = true;

  // Extract contact info first
  let hasEmail = false;
  let hasPhone = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lower = line.toLowerCase();

    // Email
    const emailMatch = line.match(/[\w\.-]+@[\w\.-]+\.\w+/);
    if (emailMatch && !resume.personal.email) {
      resume.personal.email = emailMatch[0];
      hasEmail = true;
      continue;
    }

    // Phone
    const phoneMatch = line.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
    if (phoneMatch && !resume.personal.phone) {
      resume.personal.phone = phoneMatch[0];
      hasPhone = true;
      continue;
    }

    // LinkedIn
    if (lower.includes('linkedin.com') || lower.includes('linkedin')) {
      const linkedinMatch = line.match(/linkedin\.com\/in\/[\w-]+/i);
      if (linkedinMatch) {
        resume.personal.linkedin = 'https://' + linkedinMatch[0];
      }
      continue;
    }

    // GitHub
    if (lower.includes('github.com') || lower.includes('github')) {
      const githubMatch = line.match(/github\.com\/[\w-]+/i);
      if (githubMatch) {
        resume.personal.github = 'https://' + githubMatch[0];
      }
      continue;
    }

    // Website
    if ((lower.startsWith('http://') || lower.startsWith('https://') || lower.startsWith('www.')) 
        && !lower.includes('linkedin') && !lower.includes('github')) {
      resume.personal.website = line;
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

  // Parse sections
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lower = line.toLowerCase().trim();

    // Detect section headers
    if (/^(experience|work experience|professional experience|employment|work history)$/.test(lower)) {
      currentSection = 'experience';
      inSummary = false;
      continue;
    }
    if (/^(education|academic|academic background)$/.test(lower)) {
      currentSection = 'education';
      inSummary = false;
      continue;
    }
    if (/^(projects?|project experience)$/.test(lower)) {
      currentSection = 'projects';
      inSummary = false;
      continue;
    }
    if (/^(skills?|technical skills|core competencies)$/.test(lower)) {
      currentSection = 'skills';
      inSummary = false;
      continue;
    }
    if (/^(certifications?|certificates?|certification)$/.test(lower)) {
      currentSection = 'certifications';
      inSummary = false;
      continue;
    }
    if (/^(summary|objective|profile|about)$/.test(lower)) {
      currentSection = null;
      inSummary = true;
      continue;
    }

    // Skip if it's contact info we already extracted
    const isEmail = /[\w\.-]+@[\w\.-]+\.\w+/.test(line);
    const isPhone = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(line);
    if (isEmail || isPhone || lower.includes('linkedin') || lower.includes('github')) {
      continue;
    }

    // Process based on current section
    if (inSummary && !currentSection) {
      if (line.length > 20) {
        summaryLines.push(line);
      }
    } else if (currentSection === 'experience') {
      // Try to detect new experience entry (company name, dates, etc.)
      const datePattern = /(\d{4}|\w+\s+\d{4}|\d{1,2}\/\d{4})/;
      const hasDate = datePattern.test(line);
      const hasCompany = line.includes(' at ') || line.includes('@') || line.includes(' - ');

      if (hasDate || hasCompany || (line.length < 100 && !line.startsWith('•') && !line.startsWith('-'))) {
        // New experience entry
        currentEntry = {
          id: uuidv4(),
          company: '',
          position: '',
          location: '',
          startDate: '',
          endDate: '',
          current: false,
          description: '',
          achievements: []
        };

        // Extract position and company
        if (line.includes(' at ')) {
          const parts = line.split(' at ');
          currentEntry.position = parts[0].trim();
          currentEntry.company = parts[1].split(/[–—\-]/)[0].trim();
        } else if (line.includes('@')) {
          const parts = line.split('@');
          currentEntry.position = parts[0].trim();
          currentEntry.company = parts[1].split(/[–—\-]/)[0].trim();
        } else {
          currentEntry.position = line;
        }

        // Extract dates
        const dates = line.match(/(\w+\s+\d{4}|\d{1,2}\/\d{4}|\d{4})\s*[-–—]\s*(\w+\s+\d{4}|\d{1,2}\/\d{4}|\d{4}|present|current)/i);
        if (dates) {
          currentEntry.startDate = dates[1];
          if (dates[2].toLowerCase() === 'present' || dates[2].toLowerCase() === 'current') {
            currentEntry.current = true;
            currentEntry.endDate = new Date().toISOString().split('T')[0];
          } else {
            currentEntry.endDate = dates[2];
          }
        }

        resume.experience.push(currentEntry);
      } else if (currentEntry) {
        // Bullet point or description
        const cleanLine = line.replace(/^[•\-\*]\s*/, '').trim();
        if (cleanLine.length > 0) {
          if (currentEntry.achievements.length === 0 && cleanLine.length > 50) {
            currentEntry.description = cleanLine;
          } else {
            currentEntry.achievements.push(cleanLine);
          }
        }
      }
    } else if (currentSection === 'education') {
      const datePattern = /(\d{4}|\w+\s+\d{4})/;
      if (datePattern.test(line) || line.length < 80) {
        const edu = {
          id: uuidv4(),
          institution: '',
          degree: '',
          field: '',
          startDate: '',
          endDate: '',
          description: ''
        };

        // Try to extract degree and institution
        if (line.includes(',')) {
          const parts = line.split(',');
          edu.degree = parts[0].trim();
          edu.institution = parts.slice(1).join(',').trim();
        } else {
          edu.institution = line;
        }

        // Extract dates
        const dates = line.match(/(\d{4}|\w+\s+\d{4})\s*[-–—]?\s*(\d{4}|\w+\s+\d{4})?/);
        if (dates) {
          edu.startDate = dates[1];
          if (dates[2]) edu.endDate = dates[2];
        }

        resume.education.push(edu);
      }
    } else if (currentSection === 'skills') {
      // Split by comma, semicolon, or newline
      const skills = line.split(/[,;•\-\*]/).map(s => s.trim()).filter(Boolean);
      if (skills.length > 0) {
        // Group into categories if we have a category structure
        if (resume.skills.length === 0 || resume.skills[resume.skills.length - 1].skills.length > 10) {
          resume.skills.push({
            id: uuidv4(),
            category: 'Technical Skills',
            skills: []
          });
        }
        resume.skills[resume.skills.length - 1].skills.push(...skills);
      }
    } else if (currentSection === 'projects') {
      if (line.length < 100 && !line.startsWith('•') && !line.startsWith('-')) {
        resume.projects.push({
          id: uuidv4(),
          name: line,
          description: '',
          technologies: [],
          link: '',
          github: ''
        });
      } else if (resume.projects.length > 0) {
        const cleanLine = line.replace(/^[•\-\*]\s*/, '').trim();
        const lastProject = resume.projects[resume.projects.length - 1];
        if (!lastProject.description) {
          lastProject.description = cleanLine;
        }
      }
    } else if (currentSection === 'certifications') {
      const cert = {
        id: uuidv4(),
        name: '',
        issuer: '',
        date: '',
        link: ''
      };

      if (line.includes(' - ')) {
        const parts = line.split(' - ');
        cert.name = parts[0].trim();
        cert.issuer = parts[1].trim();
      } else {
        cert.name = line;
      }

      // Extract date
      const dateMatch = line.match(/(\w+\s+\d{4}|\d{4})/);
      if (dateMatch) {
        cert.date = dateMatch[1];
      }

      resume.certifications.push(cert);
    }
  }

  // Set summary
  if (summaryLines.length > 0) {
    resume.personal.summary = summaryLines.join(' ');
  }

  // Set name from first line if not found
  if (!resume.personal.fullName && lines.length > 0) {
    const firstLine = lines[0];
    const isFirstLineEmail = /[\w\.-]+@[\w\.-]+\.\w+/.test(firstLine);
    const isFirstLinePhone = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(firstLine);
    if (!isFirstLineEmail && !isFirstLinePhone && firstLine.length < 50) {
      resume.personal.fullName = firstLine;
    }
  }

  return resume;
}


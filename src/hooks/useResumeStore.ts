import { useState, useEffect, useCallback } from 'react';
import { ResumeData, DEFAULT_RESUME, ResumeSection } from '@/types/resume';

const STORAGE_KEY = 'resuone:draft';

export function useResumeStore() {
  const [resume, setResume] = useState<ResumeData>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return DEFAULT_RESUME;
        }
      }
    }
    return DEFAULT_RESUME;
  });

  const [isDirty, setIsDirty] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Autosave to localStorage
  useEffect(() => {
    if (!isDirty) return;

    const timeout = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(resume));
      setLastSaved(new Date());
      setIsDirty(false);
    }, 500);

    return () => clearTimeout(timeout);
  }, [resume, isDirty]);

  const updateResume = useCallback((updates: Partial<ResumeData>) => {
    setResume(prev => ({ ...prev, ...updates, updatedAt: new Date().toISOString() }));
    setIsDirty(true);
  }, []);

  const updatePersonal = useCallback((updates: Partial<ResumeData['personal']>) => {
    setResume(prev => ({
      ...prev,
      personal: { ...prev.personal, ...updates },
      updatedAt: new Date().toISOString(),
    }));
    setIsDirty(true);
  }, []);

  const addEducation = useCallback((education: ResumeData['education'][0]) => {
    setResume(prev => ({
      ...prev,
      education: [...prev.education, education],
      updatedAt: new Date().toISOString(),
    }));
    setIsDirty(true);
  }, []);

  const updateEducation = useCallback((id: string, updates: Partial<ResumeData['education'][0]>) => {
    setResume(prev => ({
      ...prev,
      education: prev.education.map(e => e.id === id ? { ...e, ...updates } : e),
      updatedAt: new Date().toISOString(),
    }));
    setIsDirty(true);
  }, []);

  const removeEducation = useCallback((id: string) => {
    setResume(prev => ({
      ...prev,
      education: prev.education.filter(e => e.id !== id),
      updatedAt: new Date().toISOString(),
    }));
    setIsDirty(true);
  }, []);

  const addExperience = useCallback((experience: ResumeData['experience'][0]) => {
    setResume(prev => ({
      ...prev,
      experience: [...prev.experience, experience],
      updatedAt: new Date().toISOString(),
    }));
    setIsDirty(true);
  }, []);

  const updateExperience = useCallback((id: string, updates: Partial<ResumeData['experience'][0]>) => {
    setResume(prev => ({
      ...prev,
      experience: prev.experience.map(e => e.id === id ? { ...e, ...updates } : e),
      updatedAt: new Date().toISOString(),
    }));
    setIsDirty(true);
  }, []);

  const removeExperience = useCallback((id: string) => {
    setResume(prev => ({
      ...prev,
      experience: prev.experience.filter(e => e.id !== id),
      updatedAt: new Date().toISOString(),
    }));
    setIsDirty(true);
  }, []);

  const addSkill = useCallback((skill: ResumeData['skills'][0]) => {
    setResume(prev => ({
      ...prev,
      skills: [...prev.skills, skill],
      updatedAt: new Date().toISOString(),
    }));
    setIsDirty(true);
  }, []);

  const updateSkill = useCallback((id: string, updates: Partial<ResumeData['skills'][0]>) => {
    setResume(prev => ({
      ...prev,
      skills: prev.skills.map(s => s.id === id ? { ...s, ...updates } : s),
      updatedAt: new Date().toISOString(),
    }));
    setIsDirty(true);
  }, []);

  const removeSkill = useCallback((id: string) => {
    setResume(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s.id !== id),
      updatedAt: new Date().toISOString(),
    }));
    setIsDirty(true);
  }, []);

  const addProject = useCallback((project: ResumeData['projects'][0]) => {
    setResume(prev => ({
      ...prev,
      projects: [...prev.projects, project],
      updatedAt: new Date().toISOString(),
    }));
    setIsDirty(true);
  }, []);

  const updateProject = useCallback((id: string, updates: Partial<ResumeData['projects'][0]>) => {
    setResume(prev => ({
      ...prev,
      projects: prev.projects.map(p => p.id === id ? { ...p, ...updates } : p),
      updatedAt: new Date().toISOString(),
    }));
    setIsDirty(true);
  }, []);

  const removeProject = useCallback((id: string) => {
    setResume(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== id),
      updatedAt: new Date().toISOString(),
    }));
    setIsDirty(true);
  }, []);

  const addCertification = useCallback((cert: ResumeData['certifications'][0]) => {
    setResume(prev => ({
      ...prev,
      certifications: [...prev.certifications, cert],
      updatedAt: new Date().toISOString(),
    }));
    setIsDirty(true);
  }, []);

  const updateCertification = useCallback((id: string, updates: Partial<ResumeData['certifications'][0]>) => {
    setResume(prev => ({
      ...prev,
      certifications: prev.certifications.map(c => c.id === id ? { ...c, ...updates } : c),
      updatedAt: new Date().toISOString(),
    }));
    setIsDirty(true);
  }, []);

  const removeCertification = useCallback((id: string) => {
    setResume(prev => ({
      ...prev,
      certifications: prev.certifications.filter(c => c.id !== id),
      updatedAt: new Date().toISOString(),
    }));
    setIsDirty(true);
  }, []);

  const reorderSections = useCallback((sections: ResumeSection[]) => {
    setResume(prev => ({
      ...prev,
      sections,
      updatedAt: new Date().toISOString(),
    }));
    setIsDirty(true);
  }, []);

  const toggleSectionVisibility = useCallback((sectionId: string) => {
    setResume(prev => ({
      ...prev,
      sections: prev.sections.map(s => 
        s.id === sectionId ? { ...s, visible: !s.visible } : s
      ),
      updatedAt: new Date().toISOString(),
    }));
    setIsDirty(true);
  }, []);

  const resetResume = useCallback(() => {
    setResume(DEFAULT_RESUME);
    localStorage.removeItem(STORAGE_KEY);
    setLastSaved(null);
    setIsDirty(false);
  }, []);

  const loadResume = useCallback((data: ResumeData) => {
    setResume(data);
    setIsDirty(true);
  }, []);

  return {
    resume,
    isDirty,
    lastSaved,
    updateResume,
    updatePersonal,
    addEducation,
    updateEducation,
    removeEducation,
    addExperience,
    updateExperience,
    removeExperience,
    addSkill,
    updateSkill,
    removeSkill,
    addProject,
    updateProject,
    removeProject,
    addCertification,
    updateCertification,
    removeCertification,
    reorderSections,
    toggleSectionVisibility,
    resetResume,
    loadResume,
  };
}

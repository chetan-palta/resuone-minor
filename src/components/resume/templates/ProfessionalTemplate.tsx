import { ResumeData } from "@/types/resume";
import { Mail, Phone, MapPin, Linkedin, Github, Globe } from "lucide-react";

interface TemplateProps {
  resume: ResumeData;
}

export function ProfessionalTemplate({ resume }: TemplateProps) {
  const { personal, education, experience, skills, projects, certifications, sections } = resume;
  const accentColor = resume.accentColor;

  const visibleSections = sections
    .filter((s) => s.visible && s.type !== "personal")
    .sort((a, b) => a.order - b.order);

  const renderSection = (type: string) => {
    switch (type) {
      case "experience":
        return experience.length > 0 && (
          <section key="experience" className="mb-4">
            <h2 className="text-[12pt] font-bold uppercase tracking-wide mb-2 pb-1 border-b-2" style={{ color: accentColor, borderColor: accentColor, display: 'block', width: '100%', borderBottomWidth: '2px', borderBottomStyle: 'solid' }}>
              Professional Experience
            </h2>
            {experience.map((exp) => (
              <div key={exp.id} className="mb-3">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-bold text-[11pt]">{exp.position}</h3>
                    <div className="text-[10pt] font-medium" style={{ color: accentColor }}>{exp.company}</div>
                  </div>
                  <div className="text-right text-[9pt] text-gray-600">
                    <div>{exp.startDate} - {exp.endDate}</div>
                    {exp.location && <div>{exp.location}</div>}
                  </div>
                </div>
                {exp.description && <p className="text-[9pt] mt-1 text-gray-700">{exp.description}</p>}
                {exp.achievements.length > 0 && (
                  <ul className="mt-1 text-[9pt] text-gray-700 space-y-0.5 ml-4">
                    {exp.achievements.map((achievement, i) => (
                      <li key={i} className="list-disc">{achievement}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        );

      case "education":
        return education.length > 0 && (
          <section key="education" className="mb-4">
            <h2 className="text-[12pt] font-bold uppercase tracking-wide mb-2 pb-1 border-b-2" style={{ color: accentColor, borderColor: accentColor, display: 'block', width: '100%', borderBottomWidth: '2px', borderBottomStyle: 'solid' }}>
              Education
            </h2>
            {education.map((edu) => (
              <div key={edu.id} className="mb-2">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-bold text-[11pt]">{edu.degree}{edu.field && ` in ${edu.field}`}</h3>
                    <div className="text-[10pt]" style={{ color: accentColor }}>{edu.institution}</div>
                  </div>
                  <div className="text-right text-[9pt] text-gray-600">
                    <div>{edu.startDate} - {edu.endDate}</div>
                    {edu.gradeValue && <div>{edu.gradeType === 'percentage' ? '' : 'CGPA: '}{edu.gradeValue}</div>}
                  </div>
                </div>
                {edu.description && <p className="text-[9pt] mt-1 text-gray-700">{edu.description}</p>}
              </div>
            ))}
          </section>
        );

      case "skills":
        return skills.length > 0 && (
          <section key="skills" className="mb-4">
            <h2 className="text-[12pt] font-bold uppercase tracking-wide mb-2 pb-1 border-b-2" style={{ color: accentColor, borderColor: accentColor, display: 'block', width: '100%', borderBottomWidth: '2px', borderBottomStyle: 'solid' }}>
              Skills & Expertise
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {skills.map((category) => (
                <div key={category.id} className="text-[9pt]">
                  <span className="font-bold">{category.category}: </span>
                  <span className="text-gray-700">{category.skills.join(", ")}</span>
                </div>
              ))}
            </div>
          </section>
        );

      case "projects":
        return projects.length > 0 && (
          <section key="projects" className="mb-4">
            <h2 className="text-[12pt] font-bold uppercase tracking-wide mb-2 pb-1 border-b-2" style={{ color: accentColor, borderColor: accentColor, display: 'block', width: '100%', borderBottomWidth: '2px', borderBottomStyle: 'solid' }}>
              Projects
            </h2>
            {projects.map((project) => (
              <div key={project.id} className="mb-2">
                <div className="flex items-baseline gap-2">
                  <h3 className="font-bold text-[11pt]">{project.name}</h3>
                  {(project.link || project.github) && (
                    <span className="text-[9pt]">
                      {project.link && <a href={project.link.startsWith('http') ? project.link : `https://${project.link}`} className="hover:underline" style={{ color: accentColor }}>Demo</a>}
                      {project.link && project.github && " | "}
                      {project.github && <a href={project.github.startsWith('http') ? project.github : `https://${project.github}`} className="hover:underline" style={{ color: accentColor }}>Code</a>}
                    </span>
                  )}
                </div>
                {project.technologies.length > 0 && (
                  <div className="text-[9pt] text-gray-500 italic">{project.technologies.join(", ")}</div>
                )}
                {project.description && <p className="text-[9pt] mt-1 text-gray-700">{project.description}</p>}
              </div>
            ))}
          </section>
        );

      case "certifications":
        return certifications.length > 0 && (
          <section key="certifications" className="mb-4">
            <h2 className="text-[12pt] font-bold uppercase tracking-wide mb-2 pb-1 border-b-2" style={{ color: accentColor, borderColor: accentColor, display: 'block', width: '100%', borderBottomWidth: '2px', borderBottomStyle: 'solid' }}>
              Certifications
            </h2>
            {certifications.map((cert) => (
              <div key={cert.id} className="mb-1 flex justify-between text-[10pt]">
                <div>
                  {cert.link ? (
                    <a href={cert.link.startsWith('http') ? cert.link : `https://${cert.link}`} className="font-bold hover:underline" style={{ color: accentColor }}>{cert.name}</a>
                  ) : (
                    <span className="font-bold">{cert.name}</span>
                  )}
                  {cert.issuer && <span className="text-gray-600"> — {cert.issuer}</span>}
                </div>
                <span className="text-gray-500">{cert.date}</span>
              </div>
            ))}
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-full">
      {/* Header */}
      <header className="mb-4 pb-3 border-b-4" style={{ borderColor: accentColor }}>
        <h1 className="text-3xl font-bold text-gray-900">{personal.fullName || "Your Name"}</h1>
        <div className="flex flex-wrap gap-4 mt-2 text-[9pt] text-gray-600" style={{ display: 'flex', alignItems: 'center' }}>
          {personal.email && (
            <span className="flex items-center gap-1" style={{ display: 'inline-flex', alignItems: 'center', verticalAlign: 'middle' }}>
              <Mail className="w-3 h-3 flex-shrink-0" style={{ color: accentColor, display: 'inline-block', verticalAlign: 'middle' }} />
              <a href={`mailto:${personal.email}`} style={{ display: 'inline-block', verticalAlign: 'middle' }}>{personal.email}</a>
            </span>
          )}
          {personal.phone && (
            <span className="flex items-center gap-1" style={{ display: 'inline-flex', alignItems: 'center', verticalAlign: 'middle' }}>
              <Phone className="w-3 h-3 flex-shrink-0" style={{ color: accentColor, display: 'inline-block', verticalAlign: 'middle' }} />
              <span style={{ display: 'inline-block', verticalAlign: 'middle' }}>{personal.phone}</span>
            </span>
          )}
          {personal.location && (
            <span className="flex items-center gap-1" style={{ display: 'inline-flex', alignItems: 'center', verticalAlign: 'middle' }}>
              <MapPin className="w-3 h-3 flex-shrink-0" style={{ color: accentColor, display: 'inline-block', verticalAlign: 'middle' }} />
              <span style={{ display: 'inline-block', verticalAlign: 'middle' }}>{personal.location}</span>
            </span>
          )}
          {personal.linkedin && (
            <a href={personal.linkedin.startsWith('http') ? personal.linkedin : `https://${personal.linkedin}`} className="flex items-center gap-1 hover:underline" style={{ display: 'inline-flex', alignItems: 'center', verticalAlign: 'middle' }}>
              <Linkedin className="w-3 h-3 flex-shrink-0" style={{ color: accentColor, display: 'inline-block', verticalAlign: 'middle' }} />
              <span style={{ display: 'inline-block', verticalAlign: 'middle' }}>LinkedIn</span>
            </a>
          )}
          {personal.github && (
            <a href={personal.github.startsWith('http') ? personal.github : `https://${personal.github}`} className="flex items-center gap-1 hover:underline" style={{ display: 'inline-flex', alignItems: 'center', verticalAlign: 'middle' }}>
              <Github className="w-3 h-3 flex-shrink-0" style={{ color: accentColor, display: 'inline-block', verticalAlign: 'middle' }} />
              <span style={{ display: 'inline-block', verticalAlign: 'middle' }}>GitHub</span>
            </a>
          )}
          {personal.website && (
            <a href={personal.website.startsWith('http') ? personal.website : `https://${personal.website}`} className="flex items-center gap-1 hover:underline" style={{ display: 'inline-flex', alignItems: 'center', verticalAlign: 'middle' }}>
              <Globe className="w-3 h-3 flex-shrink-0" style={{ color: accentColor, display: 'inline-block', verticalAlign: 'middle' }} />
              <span style={{ display: 'inline-block', verticalAlign: 'middle' }}>Portfolio</span>
            </a>
          )}
        </div>
      </header>

      {/* Summary */}
      {personal.summary && (
        <section className="mb-4">
          <h2 className="text-[12pt] font-bold uppercase tracking-wide mb-2 pb-1 border-b-2" style={{ color: accentColor, borderColor: accentColor, display: 'block', width: '100%', borderBottomWidth: '2px', borderBottomStyle: 'solid' }}>
            Professional Summary
          </h2>
          <p className="text-[10pt] text-gray-700">{personal.summary}</p>
        </section>
      )}

      {/* Dynamic Sections */}
      {visibleSections.map((section) => renderSection(section.type))}
    </div>
  );
}

import { ResumeData } from "@/types/resume";
import { Mail, Phone, MapPin, Linkedin, Github, Globe } from "lucide-react";

interface TemplateProps {
  resume: ResumeData;
}

export function MinimalTemplate({ resume }: TemplateProps) {
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
            <h2 className="text-sm font-bold uppercase tracking-wider border-b pb-1 mb-3" style={{ color: accentColor, borderColor: accentColor }}>
              Experience
            </h2>
            {experience.map((exp) => (
              <div key={exp.id} className="mb-3">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-semibold text-[11pt]">{exp.position}</h3>
                  <span className="text-[9pt] text-gray-500">{exp.startDate} - {exp.endDate}</span>
                </div>
                <div className="text-[10pt] text-gray-600">{exp.company}{exp.location && `, ${exp.location}`}</div>
                {exp.description && <p className="text-[9pt] mt-1 text-gray-700">{exp.description}</p>}
                {exp.achievements.length > 0 && (
                  <ul className="mt-1 text-[9pt] text-gray-700 space-y-0.5">
                    {exp.achievements.map((achievement, i) => (
                      <li key={i}>• {achievement}</li>
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
            <h2 className="text-sm font-bold uppercase tracking-wider border-b pb-1 mb-3" style={{ color: accentColor, borderColor: accentColor }}>
              Education
            </h2>
            {education.map((edu) => {
              const gradeLabel = edu.gradeType === 'percentage' ? '' : edu.gradeType === 'cgpa10' ? 'CGPA' : edu.gradeType === 'cgpa9.5' ? 'CGPA' : '';
              return (
                <div key={edu.id} className="mb-2">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-semibold text-[11pt]">{edu.institution}</h3>
                    <span className="text-[9pt] text-gray-500">{edu.startDate} - {edu.endDate}</span>
                  </div>
                  <div className="text-[10pt] text-gray-600">
                    {edu.degree}{edu.field && ` in ${edu.field}`}{edu.gradeValue && ` • ${gradeLabel ? `${gradeLabel}: ` : ''}${edu.gradeValue}`}
                  </div>
                  {edu.description && <p className="text-[9pt] mt-1 text-gray-700">{edu.description}</p>}
                </div>
              );
            })}
          </section>
        );

      case "skills":
        return skills.length > 0 && (
          <section key="skills" className="mb-4">
            <h2 className="text-sm font-bold uppercase tracking-wider border-b pb-1 mb-3" style={{ color: accentColor, borderColor: accentColor }}>
              Skills
            </h2>
            {skills.map((category) => (
              <div key={category.id} className="mb-1 text-[10pt]">
                <span className="font-medium">{category.category}: </span>
                <span className="text-gray-700">{category.skills.join(", ")}</span>
              </div>
            ))}
          </section>
        );

      case "projects":
        return projects.length > 0 && (
          <section key="projects" className="mb-4">
            <h2 className="text-sm font-bold uppercase tracking-wider border-b pb-1 mb-3" style={{ color: accentColor, borderColor: accentColor }}>
              Projects
            </h2>
            {projects.map((project) => (
              <div key={project.id} className="mb-2">
                <div className="flex items-baseline gap-2">
                  <h3 className="font-semibold text-[11pt]">{project.name}</h3>
                  {(project.link || project.github) && (
                    <span className="text-[9pt]">
                      {project.link && <a href={project.link.startsWith('http') ? project.link : `https://${project.link}`} className="hover:underline" style={{ color: accentColor }}>Live</a>}
                      {project.link && project.github && " | "}
                      {project.github && <a href={project.github.startsWith('http') ? project.github : `https://${project.github}`} className="hover:underline" style={{ color: accentColor }}>GitHub</a>}
                    </span>
                  )}
                </div>
                {project.technologies.length > 0 && (
                  <div className="text-[9pt] text-gray-500">{project.technologies.join(" • ")}</div>
                )}
                {project.description && <p className="text-[9pt] mt-1 text-gray-700">{project.description}</p>}
              </div>
            ))}
          </section>
        );

      case "certifications":
        return certifications.length > 0 && (
          <section key="certifications" className="mb-4">
            <h2 className="text-sm font-bold uppercase tracking-wider border-b pb-1 mb-3" style={{ color: accentColor, borderColor: accentColor }}>
              Certifications
            </h2>
            {certifications.map((cert) => (
              <div key={cert.id} className="mb-2 text-[10pt]">
                <div className="font-semibold">
                  {cert.link ? (
                    <a href={cert.link.startsWith('http') ? cert.link : `https://${cert.link}`} className="hover:underline" style={{ color: accentColor }}>{cert.name}</a>
                  ) : (
                    cert.name
                  )}
                </div>
                <div className="text-gray-600">{cert.issuer} • {cert.date}</div>
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
      <header className="mb-4 text-center">
        <h1 className="text-2xl font-bold" style={{ color: accentColor }}>{personal.fullName || "Your Name"}</h1>
        <div className="flex flex-wrap justify-center gap-3 mt-2 text-[9pt] text-gray-600" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {personal.email && (
            <span className="flex items-center gap-1" style={{ display: 'inline-flex', alignItems: 'center', verticalAlign: 'middle' }}>
              <Mail className="w-3 h-3 flex-shrink-0" style={{ display: 'inline-block', verticalAlign: 'middle' }} />
              <a href={`mailto:${personal.email}`} style={{ display: 'inline-block', verticalAlign: 'middle' }}>{personal.email}</a>
            </span>
          )}
          {personal.phone && (
            <span className="flex items-center gap-1" style={{ display: 'inline-flex', alignItems: 'center', verticalAlign: 'middle' }}>
              <Phone className="w-3 h-3 flex-shrink-0" style={{ display: 'inline-block', verticalAlign: 'middle' }} />
              <span style={{ display: 'inline-block', verticalAlign: 'middle' }}>{personal.phone}</span>
            </span>
          )}
          {personal.location && (
            <span className="flex items-center gap-1" style={{ display: 'inline-flex', alignItems: 'center', verticalAlign: 'middle' }}>
              <MapPin className="w-3 h-3 flex-shrink-0" style={{ display: 'inline-block', verticalAlign: 'middle' }} />
              <span style={{ display: 'inline-block', verticalAlign: 'middle' }}>{personal.location}</span>
            </span>
          )}
          {personal.linkedin && (
            <a href={personal.linkedin.startsWith('http') ? personal.linkedin : `https://${personal.linkedin}`} className="flex items-center gap-1 hover:underline" style={{ color: accentColor, display: 'inline-flex', alignItems: 'center', verticalAlign: 'middle' }}>
              <Linkedin className="w-3 h-3 flex-shrink-0" style={{ display: 'inline-block', verticalAlign: 'middle' }} />
              <span style={{ display: 'inline-block', verticalAlign: 'middle' }}>LinkedIn</span>
            </a>
          )}
          {personal.github && (
            <a href={personal.github.startsWith('http') ? personal.github : `https://${personal.github}`} className="flex items-center gap-1 hover:underline" style={{ color: accentColor, display: 'inline-flex', alignItems: 'center', verticalAlign: 'middle' }}>
              <Github className="w-3 h-3 flex-shrink-0" style={{ display: 'inline-block', verticalAlign: 'middle' }} />
              <span style={{ display: 'inline-block', verticalAlign: 'middle' }}>GitHub</span>
            </a>
          )}
          {personal.website && (
            <a href={personal.website.startsWith('http') ? personal.website : `https://${personal.website}`} className="flex items-center gap-1 hover:underline" style={{ color: accentColor, display: 'inline-flex', alignItems: 'center', verticalAlign: 'middle' }}>
              <Globe className="w-3 h-3 flex-shrink-0" style={{ display: 'inline-block', verticalAlign: 'middle' }} />
              <span style={{ display: 'inline-block', verticalAlign: 'middle' }}>Website</span>
            </a>
          )}
        </div>
      </header>

      {/* Summary */}
      {personal.summary && (
        <section className="mb-4">
          <p className="text-[10pt] text-gray-700 text-center">{personal.summary}</p>
        </section>
      )}

      {/* Dynamic Sections */}
      {visibleSections.map((section) => renderSection(section.type))}
    </div>
  );
}

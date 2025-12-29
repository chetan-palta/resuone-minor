import { ResumeData } from "@/types/resume";

interface TemplateProps {
  resume: ResumeData;
}

export function ATSTemplate({ resume }: TemplateProps) {
  const { personal, education, experience, skills, projects, certifications, sections } = resume;

  const visibleSections = sections
    .filter((s) => s.visible && s.type !== "personal")
    .sort((a, b) => a.order - b.order);

  const renderSection = (type: string) => {
    switch (type) {
      case "experience":
        return experience.length > 0 && (
          <section key="experience" className="mb-4">
            <h2 className="text-[12pt] font-bold uppercase mb-2 border-b border-gray-400 pb-1" style={{ display: 'block', width: '100%', borderBottomWidth: '1px', borderBottomStyle: 'solid' }}>
              Work Experience
            </h2>
            {experience.map((exp) => (
              <div key={exp.id} className="mb-3">
                <h3 className="font-bold text-[11pt]">{exp.position}</h3>
                <div className="text-[10pt]">{exp.company}{exp.location && `, ${exp.location}`}</div>
                <div className="text-[10pt] text-gray-600">{exp.startDate} - {exp.endDate}</div>
                {exp.description && <p className="text-[10pt] mt-1">{exp.description}</p>}
                {exp.achievements.length > 0 && (
                  <ul className="mt-1 text-[10pt] list-disc ml-5">
                    {exp.achievements.map((achievement, i) => (
                      <li key={i}>{achievement}</li>
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
            <h2 className="text-[12pt] font-bold uppercase mb-2 border-b border-gray-400 pb-1" style={{ display: 'block', width: '100%', borderBottomWidth: '1px', borderBottomStyle: 'solid' }}>
              Education
            </h2>
            {education.map((edu) => (
              <div key={edu.id} className="mb-2">
                <h3 className="font-bold text-[11pt]">{edu.institution}</h3>
                <div className="text-[10pt]">{edu.degree}{edu.field && ` in ${edu.field}`}</div>
                <div className="text-[10pt] text-gray-600">
                  {edu.startDate} - {edu.endDate}{edu.gradeValue && ` | ${edu.gradeType === 'percentage' ? '' : 'CGPA: '}${edu.gradeValue}`}
                </div>
                {edu.description && <p className="text-[10pt] mt-1">{edu.description}</p>}
              </div>
            ))}
          </section>
        );

      case "skills":
        return skills.length > 0 && (
          <section key="skills" className="mb-4">
            <h2 className="text-[12pt] font-bold uppercase mb-2 border-b border-gray-400 pb-1" style={{ display: 'block', width: '100%', borderBottomWidth: '1px', borderBottomStyle: 'solid' }}>
              Skills
            </h2>
            {skills.map((category) => (
              <div key={category.id} className="mb-1 text-[10pt]">
                <span className="font-bold">{category.category}: </span>
                {category.skills.join(", ")}
              </div>
            ))}
          </section>
        );

      case "projects":
        return projects.length > 0 && (
          <section key="projects" className="mb-4">
            <h2 className="text-[12pt] font-bold uppercase mb-2 border-b border-gray-400 pb-1" style={{ display: 'block', width: '100%', borderBottomWidth: '1px', borderBottomStyle: 'solid' }}>
              Projects
            </h2>
            {projects.map((project) => (
              <div key={project.id} className="mb-2">
                <h3 className="font-bold text-[11pt]">{project.name}</h3>
                {project.technologies.length > 0 && (
                  <div className="text-[10pt] text-gray-600">Technologies: {project.technologies.join(", ")}</div>
                )}
                {project.description && <p className="text-[10pt] mt-1">{project.description}</p>}
                {(project.link || project.github) && (
                  <div className="text-[10pt] mt-1">
                    {project.link && (
                      <a 
                        href={project.link.startsWith('http') ? project.link : `https://${project.link}`}
                        className="text-blue-600 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Demo
                      </a>
                    )}
                    {project.link && project.github && <span className="mx-1">|</span>}
                    {project.github && (
                      <a 
                        href={project.github.startsWith('http') ? project.github : `https://${project.github}`}
                        className="text-blue-600 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        GitHub
                      </a>
                    )}
                  </div>
                )}
              </div>
            ))}
          </section>
        );

      case "certifications":
        return certifications.length > 0 && (
          <section key="certifications" className="mb-4">
            <h2 className="text-[12pt] font-bold uppercase mb-2 border-b border-gray-400 pb-1" style={{ display: 'block', width: '100%', borderBottomWidth: '1px', borderBottomStyle: 'solid' }}>
              Certifications
            </h2>
            {certifications.map((cert) => (
              <div key={cert.id} className="mb-1 text-[10pt]">
                {cert.link ? (
                  <a href={cert.link.startsWith('http') ? cert.link : `https://${cert.link}`} className="font-bold text-blue-600 hover:underline">{cert.name}</a>
                ) : (
                  <span className="font-bold">{cert.name}</span>
                )}
                {cert.issuer && <span> - {cert.issuer}</span>}
                {cert.date && <span> ({cert.date})</span>}
                {cert.credentialId && <span> | ID: {cert.credentialId}</span>}
              </div>
            ))}
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-full text-gray-900">
      {/* Header - Simple and ATS-friendly */}
      <header className="mb-4 text-center">
        <h1 className="text-2xl font-bold uppercase">{personal.fullName || "YOUR NAME"}</h1>
        <div className="text-[10pt] mt-1">
          {[personal.email, personal.phone, personal.location].filter(Boolean).join(" | ")}
        </div>
        {(personal.linkedin || personal.github || personal.website) && (
          <div className="text-[10pt]">
            {personal.linkedin && (
              <>
                <a 
                  href={personal.linkedin.startsWith('http') ? personal.linkedin : `https://${personal.linkedin}`}
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
                {(personal.github || personal.website) && ' | '}
              </>
            )}
            {personal.github && (
              <>
                <a 
                  href={personal.github.startsWith('http') ? personal.github : `https://${personal.github}`}
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
                {personal.website && ' | '}
              </>
            )}
            {personal.website && (
              <a 
                href={personal.website.startsWith('http') ? personal.website : `https://${personal.website}`}
                className="text-blue-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Website
              </a>
            )}
          </div>
        )}
      </header>

      {/* Summary */}
      {personal.summary && (
        <section className="mb-4">
          <h2 className="text-[12pt] font-bold uppercase mb-2 border-b border-gray-400 pb-1" style={{ display: 'block', width: '100%', borderBottomWidth: '1px', borderBottomStyle: 'solid' }}>
            Professional Summary
          </h2>
          <p className="text-[10pt]">{personal.summary}</p>
        </section>
      )}

      {/* Dynamic Sections */}
      {visibleSections.map((section) => renderSection(section.type))}
    </div>
  );
}

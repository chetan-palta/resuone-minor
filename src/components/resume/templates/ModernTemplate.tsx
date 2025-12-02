import { ResumeData } from "@/types/resume";
import { Mail, Phone, MapPin, Linkedin, Github, Globe } from "lucide-react";

interface TemplateProps {
  resume: ResumeData;
}

export function ModernTemplate({ resume }: TemplateProps) {
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
            <h2 className="text-[11pt] font-semibold mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
              Experience
            </h2>
            {experience.map((exp) => (
              <div key={exp.id} className="mb-3 pl-4 border-l-2" style={{ borderColor: `${accentColor}30` }}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-[11pt]">{exp.position}</h3>
                    <div className="text-[10pt]" style={{ color: accentColor }}>{exp.company}</div>
                  </div>
                  <div className="text-[9pt] text-gray-500 whitespace-nowrap">
                    {exp.startDate} — {exp.endDate}
                  </div>
                </div>
                {exp.location && <div className="text-[9pt] text-gray-500">{exp.location}</div>}
                {exp.description && <p className="text-[9pt] mt-1 text-gray-600">{exp.description}</p>}
                {exp.achievements.length > 0 && (
                  <ul className="mt-1 text-[9pt] text-gray-600 space-y-0.5">
                    {exp.achievements.map((achievement, i) => (
                      <li key={i} className="flex gap-2">
                        <span style={{ color: accentColor }}>›</span>
                        {achievement}
                      </li>
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
            <h2 className="text-[11pt] font-semibold mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
              Education
            </h2>
            {education.map((edu) => (
              <div key={edu.id} className="mb-2 pl-4 border-l-2" style={{ borderColor: `${accentColor}30` }}>
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-semibold text-[11pt]">{edu.institution}</h3>
                    <div className="text-[10pt] text-gray-600">{edu.degree}{edu.field && ` in ${edu.field}`}</div>
                  </div>
                  <div className="text-[9pt] text-gray-500 text-right">
                    <div>{edu.startDate} — {edu.endDate}</div>
                    {edu.gradeValue && <div>{edu.gradeType === 'percentage' ? '' : 'CGPA: '}{edu.gradeValue}</div>}
                  </div>
                </div>
              </div>
            ))}
          </section>
        );

      case "skills":
        return skills.length > 0 && (
          <section key="skills" className="mb-4">
            <h2 className="text-[11pt] font-semibold mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
              Skills
            </h2>
            <div className="flex flex-wrap gap-1">
              {skills.flatMap((category) => 
                category.skills.map((skill, i) => (
                  <span 
                    key={`${category.id}-${i}`}
                    className="px-2 py-0.5 text-[9pt] rounded-full"
                    style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
                  >
                    {skill}
                  </span>
                ))
              )}
            </div>
          </section>
        );

      case "projects":
        return projects.length > 0 && (
          <section key="projects" className="mb-4">
            <h2 className="text-[11pt] font-semibold mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
              Projects
            </h2>
            {projects.map((project) => (
              <div key={project.id} className="mb-2 pl-4 border-l-2" style={{ borderColor: `${accentColor}30` }}>
                <div className="flex items-baseline gap-2">
                  <h3 className="font-semibold text-[11pt]">{project.name}</h3>
                  {(project.link || project.github) && (
                    <span className="text-[9pt]">
                      {project.link && <a href={project.link.startsWith('http') ? project.link : `https://${project.link}`} className="hover:underline" style={{ color: accentColor }}>↗</a>}
                      {project.github && <a href={project.github.startsWith('http') ? project.github : `https://${project.github}`} className="ml-1 hover:underline" style={{ color: accentColor }}>⌘</a>}
                    </span>
                  )}
                </div>
                {project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {project.technologies.map((tech, i) => (
                      <span key={i} className="text-[8pt] px-1.5 py-0.5 bg-gray-100 rounded text-gray-600">{tech}</span>
                    ))}
                  </div>
                )}
                {project.description && <p className="text-[9pt] mt-1 text-gray-600">{project.description}</p>}
              </div>
            ))}
          </section>
        );

      case "certifications":
        return certifications.length > 0 && (
          <section key="certifications" className="mb-4">
            <h2 className="text-[11pt] font-semibold mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
              Certifications
            </h2>
            {certifications.map((cert) => (
              <div key={cert.id} className="mb-1 pl-4 text-[10pt] flex justify-between">
                <div>
                  {cert.link ? (
                    <a href={cert.link.startsWith('http') ? cert.link : `https://${cert.link}`} className="font-medium hover:underline" style={{ color: accentColor }}>{cert.name}</a>
                  ) : (
                    <span className="font-medium">{cert.name}</span>
                  )}
                  <span className="text-gray-500"> · {cert.issuer}</span>
                </div>
                <span className="text-gray-400">{cert.date}</span>
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
      <header className="mb-5">
        <h1 className="text-3xl font-light" style={{ color: accentColor }}>{personal.fullName || "Your Name"}</h1>
        <div className="flex flex-wrap gap-3 mt-2 text-[9pt] text-gray-500">
          {personal.email && (
            <a href={`mailto:${personal.email}`} className="flex items-center gap-1 hover:text-gray-700">
              <Mail className="w-3 h-3" />
              {personal.email}
            </a>
          )}
          {personal.phone && (
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3" />
              {personal.phone}
            </span>
          )}
          {personal.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {personal.location}
            </span>
          )}
          {personal.linkedin && (
            <a href={personal.linkedin.startsWith('http') ? personal.linkedin : `https://${personal.linkedin}`} className="flex items-center gap-1 hover:text-gray-700">
              <Linkedin className="w-3 h-3" />
            </a>
          )}
          {personal.github && (
            <a href={personal.github.startsWith('http') ? personal.github : `https://${personal.github}`} className="flex items-center gap-1 hover:text-gray-700">
              <Github className="w-3 h-3" />
            </a>
          )}
          {personal.website && (
            <a href={personal.website.startsWith('http') ? personal.website : `https://${personal.website}`} className="flex items-center gap-1 hover:text-gray-700">
              <Globe className="w-3 h-3" />
            </a>
          )}
        </div>
      </header>

      {/* Summary */}
      {personal.summary && (
        <section className="mb-4 p-3 rounded-lg" style={{ backgroundColor: `${accentColor}08` }}>
          <p className="text-[10pt] text-gray-600">{personal.summary}</p>
        </section>
      )}

      {/* Dynamic Sections */}
      {visibleSections.map((section) => renderSection(section.type))}
    </div>
  );
}

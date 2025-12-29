import { ResumeData } from "@/types/resume";
import { Mail, Phone, MapPin, Linkedin, Github, Globe } from "lucide-react";

interface TemplateProps {
  resume: ResumeData;
}

export function TwoColumnTemplate({ resume }: TemplateProps) {
  const { personal, education, experience, skills, projects, certifications, sections } = resume;
  const accentColor = resume.accentColor;

  const visibleSections = sections
    .filter((s) => s.visible && s.type !== "personal")
    .sort((a, b) => a.order - b.order);

  // Split sections: skills, education, certifications go to sidebar
  const sidebarSections = ["skills", "education", "certifications"];
  const mainSections = visibleSections.filter((s) => !sidebarSections.includes(s.type));
  const sidebar = visibleSections.filter((s) => sidebarSections.includes(s.type));

  const renderMainSection = (type: string) => {
    switch (type) {
      case "experience":
        return experience.length > 0 && (
          <section key="experience" className="mb-4">
            <h2 className="text-[11pt] font-bold uppercase tracking-wide mb-2 pb-1 border-b" style={{ color: accentColor, borderColor: `${accentColor}40` }}>
              Experience
            </h2>
            {experience.map((exp) => (
              <div key={exp.id} className="mb-3">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-[10pt]">{exp.position}</h3>
                  <span className="text-[8pt] text-gray-500">{exp.startDate} - {exp.endDate}</span>
                </div>
                <div className="text-[9pt]" style={{ color: accentColor }}>{exp.company}</div>
                {exp.location && <div className="text-[8pt] text-gray-500">{exp.location}</div>}
                {exp.description && <p className="text-[9pt] mt-1 text-gray-600">{exp.description}</p>}
                {exp.achievements.length > 0 && (
                  <ul className="mt-1 text-[9pt] text-gray-600 space-y-0.5">
                    {exp.achievements.map((achievement, i) => (
                      <li key={i}>• {achievement}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        );

      case "projects":
        return projects.length > 0 && (
          <section key="projects" className="mb-4">
            <h2 className="text-[11pt] font-bold uppercase tracking-wide mb-2 pb-1 border-b" style={{ color: accentColor, borderColor: `${accentColor}40` }}>
              Projects
            </h2>
            {projects.map((project) => (
              <div key={project.id} className="mb-2">
                <div className="flex items-baseline gap-2">
                  <h3 className="font-bold text-[10pt]">{project.name}</h3>
                  {(project.link || project.github) && (
                    <span className="text-[8pt]">
                      {project.link && <a href={project.link.startsWith('http') ? project.link : `https://${project.link}`} style={{ color: accentColor }}>↗</a>}
                      {project.github && <a href={project.github.startsWith('http') ? project.github : `https://${project.github}`} className="ml-1" style={{ color: accentColor }}>⌘</a>}
                    </span>
                  )}
                </div>
                {project.technologies.length > 0 && (
                  <div className="text-[8pt] text-gray-500">{project.technologies.join(" · ")}</div>
                )}
                {project.description && <p className="text-[9pt] mt-1 text-gray-600">{project.description}</p>}
              </div>
            ))}
          </section>
        );

      default:
        return null;
    }
  };

  const renderSidebarSection = (type: string) => {
    switch (type) {
      case "education":
        return education.length > 0 && (
          <section key="education" className="mb-4">
            <h2 className="text-[10pt] font-bold uppercase tracking-wide mb-2 text-white/90">
              Education
            </h2>
            {education.map((edu) => (
              <div key={edu.id} className="mb-2 text-white/80">
                <h3 className="font-semibold text-[9pt] text-white">{edu.institution}</h3>
                <div className="text-[8pt]">{edu.degree}{edu.field && ` in ${edu.field}`}</div>
                <div className="text-[8pt] text-white/60">{edu.startDate} - {edu.endDate}</div>
                {edu.gradeValue && <div className="text-[8pt] text-white/60">{edu.gradeType === 'percentage' ? '' : 'CGPA: '}{edu.gradeValue}</div>}
              </div>
            ))}
          </section>
        );

      case "skills":
        return skills.length > 0 && (
          <section key="skills" className="mb-4">
            <h2 className="text-[10pt] font-bold uppercase tracking-wide mb-2 text-white/90">
              Skills
            </h2>
            {skills.map((category) => (
              <div key={category.id} className="mb-2">
                <h3 className="text-[9pt] font-semibold text-white">{category.category}</h3>
                <div className="flex flex-wrap gap-1 mt-1">
                  {category.skills.map((skill, i) => (
                    <span key={i} className="text-[8pt] px-1.5 py-0.5 bg-white/10 rounded text-white/80">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </section>
        );

      case "certifications":
        return certifications.length > 0 && (
          <section key="certifications" className="mb-4">
            <h2 className="text-[10pt] font-bold uppercase tracking-wide mb-2 text-white/90">
              Certifications
            </h2>
            {certifications.map((cert) => (
              <div key={cert.id} className="mb-2 text-white/80">
                <div className="text-[9pt] font-semibold text-white">
                  {cert.link ? (
                    <a href={cert.link.startsWith('http') ? cert.link : `https://${cert.link}`} className="hover:underline text-blue-300">{cert.name}</a>
                  ) : (
                    cert.name
                  )}
                </div>
                <div className="text-[8pt]">{cert.issuer}</div>
                <div className="text-[8pt] text-white/60">{cert.date}</div>
              </div>
            ))}
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-full flex">
      {/* Sidebar */}
      <div className="w-[35%] p-4 text-white" style={{ backgroundColor: accentColor }}>
        {/* Personal Info */}
        <div className="mb-4">
          <h1 className="text-xl font-bold leading-tight">{personal.fullName || "Your Name"}</h1>
        </div>

        {/* Contact */}
        <section className="mb-4">
          <h2 className="text-[10pt] font-bold uppercase tracking-wide mb-2 text-white/90">Contact</h2>
          <div className="space-y-1 text-[9pt] text-white/80">
            {personal.email && (
              <div className="flex items-center gap-2" style={{ display: 'flex', alignItems: 'center' }}>
                <Mail className="w-3 h-3 flex-shrink-0" style={{ display: 'inline-block', verticalAlign: 'middle' }} />
                <a href={`mailto:${personal.email}`} className="truncate" style={{ display: 'inline-block', verticalAlign: 'middle' }}>{personal.email}</a>
              </div>
            )}
            {personal.phone && (
              <div className="flex items-center gap-2" style={{ display: 'flex', alignItems: 'center' }}>
                <Phone className="w-3 h-3 flex-shrink-0" style={{ display: 'inline-block', verticalAlign: 'middle' }} />
                <span style={{ display: 'inline-block', verticalAlign: 'middle' }}>{personal.phone}</span>
              </div>
            )}
            {personal.location && (
              <div className="flex items-center gap-2" style={{ display: 'flex', alignItems: 'center' }}>
                <MapPin className="w-3 h-3 flex-shrink-0" style={{ display: 'inline-block', verticalAlign: 'middle' }} />
                <span style={{ display: 'inline-block', verticalAlign: 'middle' }}>{personal.location}</span>
              </div>
            )}
            {personal.linkedin && (
              <div className="flex items-center gap-2" style={{ display: 'flex', alignItems: 'center' }}>
                <Linkedin className="w-3 h-3 flex-shrink-0" style={{ display: 'inline-block', verticalAlign: 'middle' }} />
                <a href={personal.linkedin.startsWith('http') ? personal.linkedin : `https://${personal.linkedin}`} className="truncate" style={{ display: 'inline-block', verticalAlign: 'middle' }}>LinkedIn</a>
              </div>
            )}
            {personal.github && (
              <div className="flex items-center gap-2" style={{ display: 'flex', alignItems: 'center' }}>
                <Github className="w-3 h-3 flex-shrink-0" style={{ display: 'inline-block', verticalAlign: 'middle' }} />
                <a href={personal.github.startsWith('http') ? personal.github : `https://${personal.github}`} className="truncate" style={{ display: 'inline-block', verticalAlign: 'middle' }}>GitHub</a>
              </div>
            )}
            {personal.website && (
              <div className="flex items-center gap-2" style={{ display: 'flex', alignItems: 'center' }}>
                <Globe className="w-3 h-3 flex-shrink-0" style={{ display: 'inline-block', verticalAlign: 'middle' }} />
                <a href={personal.website.startsWith('http') ? personal.website : `https://${personal.website}`} className="truncate" style={{ display: 'inline-block', verticalAlign: 'middle' }}>Website</a>
              </div>
            )}
          </div>
        </section>

        {/* Sidebar Sections */}
        {sidebar.map((section) => renderSidebarSection(section.type))}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4">
        {/* Summary */}
        {personal.summary && (
          <section className="mb-4">
            <h2 className="text-[11pt] font-bold uppercase tracking-wide mb-2 pb-1 border-b" style={{ color: accentColor, borderColor: `${accentColor}40` }}>
              About
            </h2>
            <p className="text-[9pt] text-gray-600">{personal.summary}</p>
          </section>
        )}

        {/* Main Sections */}
        {mainSections.map((section) => renderMainSection(section.type))}
      </div>
    </div>
  );
}

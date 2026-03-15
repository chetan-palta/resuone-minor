import React from "react";
import { ResumeData } from "@/types/resume";
import "./resume-template.css";

/* ================================================
   COMPONENT
   ================================================ */

interface TNPFaangTemplateProps {
    resume: ResumeData;
}

export function TNPFaangTemplate({ resume }: TNPFaangTemplateProps) {
    // Helper inside the component
    const truncateWords = (text: string, limit: number): string => {
        if (!text) return "";
        const words = text.trim().split(/\s+/);
        if (words.length <= limit) return text;
        return words.slice(0, limit).join(" ") + "…";
    };

    const { personal, education, experience, skills, projects, activities } = resume;

    /* ------------------------------------------------------------------
       Map project ResumeData → template's internal shape
    ------------------------------------------------------------------ */

    // Contact line: build a plain-text / HTML string from available personal fields
    const contactParts: string[] = [];
    if (personal.email) contactParts.push(personal.email);
    if (personal.phone) contactParts.push(personal.phone);
    if (personal.location) contactParts.push(personal.location);
    if (personal.linkedin) {
        const href = personal.linkedin.startsWith("http")
            ? personal.linkedin
            : `https://${personal.linkedin}`;
        contactParts.push(`<a href="${href}" target="_blank" rel="noopener noreferrer">LinkedIn</a>`);
    }
    if (personal.github) {
        const href = personal.github.startsWith("http")
            ? personal.github
            : `https://${personal.github}`;
        contactParts.push(`<a href="${href}" target="_blank" rel="noopener noreferrer">GitHub</a>`);
    }
    if (personal.website) {
        const href = personal.website.startsWith("http")
            ? personal.website
            : `https://${personal.website}`;
        contactParts.push(`<a href="${href}" target="_blank" rel="noopener noreferrer">Portfolio</a>`);
    }
    const contactLine = contactParts.join(" | ");

    // Education
    const mappedEducation = education.map((edu) => ({
        degree: `${edu.degree}${edu.field ? ` in ${edu.field}` : ""} — ${edu.institution}`,
        timeline: edu.endDate ? `${edu.startDate} – ${edu.endDate}` : edu.startDate,
        details: [
            edu.gradeValue
                ? edu.gradeType === "percentage"
                    ? `${edu.gradeValue}%`
                    : `CGPA: ${edu.gradeValue}`
                : null,
            edu.description || null,
        ]
            .filter(Boolean)
            .join(" | "),
    }));

    // Skills
    const mappedSkills = skills.map((s) => ({
        category: s.category,
        items: s.skills.join(", "),
    }));

    // Projects
    const mappedProjects = projects.map((p) => {
        const links: { label: string; url: string }[] = [];
        if (p.link) {
            links.push({
                label: "Demo",
                url: p.link.startsWith("http") ? p.link : `https://${p.link}`,
            });
        }
        if (p.github) {
            links.push({
                label: "GitHub",
                url: p.github.startsWith("http") ? p.github : `https://${p.github}`,
            });
        }
        return {
            title: p.name,
            stack: p.technologies.join(", "),
            links,
            timeline: [p.startDate, p.endDate].filter(Boolean).join(" – "),
            description: p.description,
            tech: p.technologies.join(", "),
        };
    });

    // Experience
    const mappedExperience = experience.map((exp) => ({
        company: exp.company,
        timeline: exp.current
            ? `${exp.startDate} – Present`
            : `${exp.startDate} – ${exp.endDate}`,
        role: exp.position,
        workMode: exp.location || "",
        bullets: exp.achievements.length > 0 ? exp.achievements : [exp.description].filter(Boolean),
    }));

    // Extra-curriculars
    const mappedExtras = (activities ?? []).map((act) => ({
        text: act.content,
        timeline: "",
    }));

    return (
        <div className="resume-container">
            {/* HEADER */}
            <header className="header">
                <h1 className="name">{personal.fullName || "FIRST NAME LAST NAME"}</h1>
                <p
                    className="contact-links"
                    dangerouslySetInnerHTML={{ __html: contactLine }}
                />
            </header>

            {/* CAREER SUMMARY */}
            {personal.summary && (
                <section className="section">
                    <h2 className="section-heading">CAREER SUMMARY</h2>
                    <div className="spacer-xs" />
                    <div className="divider" />
                    <div className="spacer-sm" />
                    <div className="summary-container">
                        <p className="summary-text">{truncateWords(personal.summary, 70)}</p>
                    </div>
                </section>
            )}

            {/* EDUCATION */}
            {mappedEducation.length > 0 && (
                <section className="section">
                    <h2 className="section-heading">EDUCATION</h2>
                    <div className="spacer-xs" />
                    <div className="divider" />
                    <div className="spacer-sm" />
                    {mappedEducation.map((edu, idx) => (
                        <React.Fragment key={`edu-${idx}`}>
                            <div className="education-entry">
                                <div className="flex-row">
                                    <p className="education-title">
                                        <strong>{edu.degree}</strong>
                                    </p>
                                    <p className="timeline">{edu.timeline}</p>
                                </div>
                                {edu.details && (
                                    <p className="education-details">{edu.details}</p>
                                )}
                            </div>
                            {idx < mappedEducation.length - 1 && <div className="spacer-xs" />}
                        </React.Fragment>
                    ))}
                </section>
            )}

            {/* SKILLS */}
            {mappedSkills.length > 0 && (
                <section className="section">
                    <h2 className="section-heading">SKILLS</h2>
                    <div className="spacer-xs" />
                    <div className="divider" />
                    <div className="spacer-sm" />
                    <div className="skills-content">
                        {mappedSkills.map((skill, idx) => (
                            <p className="skill-row" key={`skill-${idx}`}>
                                <span className="small-bullet">•</span>{" "}
                                <strong>{skill.category}:</strong> {skill.items}
                            </p>
                        ))}
                    </div>
                </section>
            )}

            {/* PROJECTS */}
            {mappedProjects.length > 0 && (
                <section className="section">
                    <h2 className="section-heading">PROJECTS</h2>
                    <div className="spacer-xs" />
                    <div className="divider" />
                    <div className="spacer-sm" />

                    {mappedProjects.slice(0, 4).map((project, idx) => (
                        <React.Fragment key={`proj-${idx}`}>
                            <div className="project-entry">
                                <div className="flex-row">
                                    <p className="project-header">
                                        <strong>{project.title}</strong>{project.stack ? ` (${project.stack})` : ""}
                                        <span className="project-links-inline">
                                            {project.links?.map((link, linkIdx) => (
                                                <React.Fragment key={`link-${idx}-${linkIdx}`}>
                                                    {linkIdx > 0 && " | "}
                                                    <a
                                                        href={link.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        {link.label}
                                                    </a>
                                                </React.Fragment>
                                            ))}
                                        </span>
                                    </p>
                                    <p className="timeline">{project.timeline}</p>
                                </div>
                                <p className="project-description">
                                    {truncateWords(project.description, 30)}{" "}
                                    {project.tech && (
                                        <span className="tech-line-inline">
                                            <strong>Tech:</strong> {project.tech}
                                        </span>
                                    )}
                                </p>
                            </div>
                            {idx < Math.min(mappedProjects.length, 4) - 1 && (
                                <div className="spacer-xs" />
                            )}
                        </React.Fragment>
                    ))}
                </section>
            )}

            {/* EXPERIENCE / INTERNSHIPS */}
            {mappedExperience.length > 0 && (
                <section className="section">
                    <h2 className="section-heading">EXPERIENCE / INTERNSHIPS</h2>
                    <div className="spacer-xs" />
                    <div className="divider" />
                    <div className="spacer-sm" />

                    {mappedExperience.map((exp, idx) => (
                        <React.Fragment key={`exp-${idx}`}>
                            <div className="experience-entry">
                                <div className="flex-row">
                                    <p className="company-name">
                                        <strong>{exp.company}</strong>
                                    </p>
                                    <p className="timeline">{exp.timeline}</p>
                                </div>
                                <p className="role-title">
                                    <em>{exp.role}</em>
                                </p>
                                {exp.workMode && <p className="work-mode">{exp.workMode}</p>}
                                {exp.bullets.length > 0 && (
                                    <ul className="experience-bullets">
                                        {exp.bullets.slice(0, 3).map((bullet, bIdx) => (
                                            <li key={`bullet-${idx}-${bIdx}`}>{bullet}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            {idx < mappedExperience.length - 1 && <div className="spacer-sm" />}
                        </React.Fragment>
                    ))}
                </section>
            )}

            {/* EXTRA-CURRICULAR ACTIVITIES */}
            {mappedExtras.length > 0 && (
                <section className="section">
                    <h2 className="section-heading">EXTRA-CURRICULAR ACTIVITIES</h2>
                    <div className="spacer-xs" />
                    <div className="divider" />
                    <div className="spacer-sm" />
                    <ul className="activities-list">
                        {mappedExtras.map((extra, idx) => (
                            <li key={`extra-${idx}`}>
                                <div className="flex-row">
                                    <p>{extra.text}</p>
                                    {extra.timeline && <p className="timeline">{extra.timeline}</p>}
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>
            )}
        </div>
    );
}

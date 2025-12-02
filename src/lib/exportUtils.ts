import html2pdf from "html2pdf.js";
import { Document, Packer, Paragraph, TextRun, HeadingLevel, ExternalHyperlink } from "docx";
import { saveAs } from "file-saver";
import { ResumeData } from "@/types/resume";

export async function exportToPDF(resume: ResumeData): Promise<void> {
  const element = document.getElementById("resume-preview");
  if (!element) {
    throw new Error("Resume preview element not found");
  }

  const filename = `${resume.personal.fullName || "Resume"}_${resume.templateId}.pdf`;

  const options = {
    margin: 0,
    filename,
    image: { type: "jpeg" as const, quality: 0.98 },
    html2canvas: { 
      scale: 2, 
      useCORS: true,
      letterRendering: true,
    },
    jsPDF: { 
      unit: "in" as const, 
      format: "letter" as const, 
      orientation: "portrait" as const
    },
  };

  await html2pdf().set(options).from(element).save();
}

export async function exportToDOCX(resume: ResumeData): Promise<void> {
  const children: (Paragraph)[] = [];

  // Personal Info Section
  if (resume.personal.fullName) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: resume.personal.fullName, bold: true, size: 32 }),
        ],
        heading: HeadingLevel.TITLE,
        spacing: { after: 100 },
      })
    );
  }

  // Contact Info
  const contactParts: string[] = [];
  if (resume.personal.email) contactParts.push(resume.personal.email);
  if (resume.personal.phone) contactParts.push(resume.personal.phone);
  if (resume.personal.location) contactParts.push(resume.personal.location);

  if (contactParts.length > 0) {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: contactParts.join(" | "), size: 20 })],
        spacing: { after: 100 },
      })
    );
  }

  // Links
  const links: (TextRun | ExternalHyperlink)[] = [];
  if (resume.personal.linkedin) {
    links.push(
      new ExternalHyperlink({
        children: [new TextRun({ text: "LinkedIn", style: "Hyperlink", size: 20 })],
        link: resume.personal.linkedin.startsWith("http") ? resume.personal.linkedin : `https://${resume.personal.linkedin}`,
      })
    );
  }
  if (resume.personal.github) {
    if (links.length > 0) links.push(new TextRun({ text: " | ", size: 20 }));
    links.push(
      new ExternalHyperlink({
        children: [new TextRun({ text: "GitHub", style: "Hyperlink", size: 20 })],
        link: resume.personal.github.startsWith("http") ? resume.personal.github : `https://${resume.personal.github}`,
      })
    );
  }
  if (resume.personal.website) {
    if (links.length > 0) links.push(new TextRun({ text: " | ", size: 20 }));
    links.push(
      new ExternalHyperlink({
        children: [new TextRun({ text: "Website", style: "Hyperlink", size: 20 })],
        link: resume.personal.website.startsWith("http") ? resume.personal.website : `https://${resume.personal.website}`,
      })
    );
  }

  if (links.length > 0) {
    children.push(new Paragraph({ children: links, spacing: { after: 200 } }));
  }

  // Summary
  if (resume.personal.summary) {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: "Professional Summary", bold: true, size: 24 })],
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 200, after: 100 },
      }),
      new Paragraph({
        children: [new TextRun({ text: resume.personal.summary, size: 22 })],
        spacing: { after: 200 },
      })
    );
  }

  // Get visible sections in order
  const visibleSections = resume.sections
    .filter((s) => s.visible && s.type !== "personal")
    .sort((a, b) => a.order - b.order);

  for (const section of visibleSections) {
    switch (section.type) {
      case "experience":
        if (resume.experience.length > 0) {
          children.push(
            new Paragraph({
              children: [new TextRun({ text: "Work Experience", bold: true, size: 24 })],
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 200, after: 100 },
            })
          );

          for (const exp of resume.experience) {
            children.push(
              new Paragraph({
                children: [
                  new TextRun({ text: exp.position, bold: true, size: 22 }),
                  new TextRun({ text: ` at ${exp.company}`, size: 22 }),
                ],
                spacing: { before: 100 },
              }),
              new Paragraph({
                children: [
                  new TextRun({ 
                    text: `${exp.location ? exp.location + " | " : ""}${exp.startDate} - ${exp.endDate}`, 
                    italics: true, 
                    size: 20 
                  }),
                ],
                spacing: { after: 50 },
              })
            );

            if (exp.description) {
              children.push(
                new Paragraph({
                  children: [new TextRun({ text: exp.description, size: 22 })],
                  spacing: { after: 50 },
                })
              );
            }

            for (const achievement of exp.achievements) {
              children.push(
                new Paragraph({
                  children: [new TextRun({ text: `• ${achievement}`, size: 22 })],
                  indent: { left: 360 },
                })
              );
            }
          }
        }
        break;

      case "education":
        if (resume.education.length > 0) {
          children.push(
            new Paragraph({
              children: [new TextRun({ text: "Education", bold: true, size: 24 })],
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 200, after: 100 },
            })
          );

          for (const edu of resume.education) {
            children.push(
              new Paragraph({
                children: [
                  new TextRun({ text: edu.institution, bold: true, size: 22 }),
                ],
                spacing: { before: 100 },
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: `${edu.degree}${edu.field ? ` in ${edu.field}` : ""}`, size: 22 }),
                  new TextRun({ text: edu.gradeValue ? ` | ${edu.gradeType === 'percentage' ? '' : 'CGPA: '}${edu.gradeValue}` : "", size: 22 }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: `${edu.startDate} - ${edu.endDate}`, italics: true, size: 20 }),
                ],
                spacing: { after: 50 },
              })
            );

            if (edu.description) {
              children.push(
                new Paragraph({
                  children: [new TextRun({ text: edu.description, size: 22 })],
                })
              );
            }
          }
        }
        break;

      case "skills":
        if (resume.skills.length > 0) {
          children.push(
            new Paragraph({
              children: [new TextRun({ text: "Skills", bold: true, size: 24 })],
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 200, after: 100 },
            })
          );

          for (const skillCategory of resume.skills) {
            children.push(
              new Paragraph({
                children: [
                  new TextRun({ text: `${skillCategory.category}: `, bold: true, size: 22 }),
                  new TextRun({ text: skillCategory.skills.join(", "), size: 22 }),
                ],
                spacing: { after: 50 },
              })
            );
          }
        }
        break;

      case "projects":
        if (resume.projects.length > 0) {
          children.push(
            new Paragraph({
              children: [new TextRun({ text: "Projects", bold: true, size: 24 })],
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 200, after: 100 },
            })
          );

          for (const project of resume.projects) {
            const projectTitle: (TextRun | ExternalHyperlink)[] = [
              new TextRun({ text: project.name, bold: true, size: 22 }),
            ];

            if (project.link) {
              projectTitle.push(new TextRun({ text: " — ", size: 22 }));
              projectTitle.push(
                new ExternalHyperlink({
                  children: [new TextRun({ text: "Live", style: "Hyperlink", size: 20 })],
                  link: project.link.startsWith("http") ? project.link : `https://${project.link}`,
                })
              );
            }

            if (project.github) {
              projectTitle.push(new TextRun({ text: " | ", size: 22 }));
              projectTitle.push(
                new ExternalHyperlink({
                  children: [new TextRun({ text: "GitHub", style: "Hyperlink", size: 20 })],
                  link: project.github.startsWith("http") ? project.github : `https://${project.github}`,
                })
              );
            }

            children.push(
              new Paragraph({ children: projectTitle, spacing: { before: 100 } })
            );

            if (project.technologies.length > 0) {
              children.push(
                new Paragraph({
                  children: [
                    new TextRun({ text: "Technologies: ", italics: true, size: 20 }),
                    new TextRun({ text: project.technologies.join(", "), size: 20 }),
                  ],
                })
              );
            }

            if (project.description) {
              children.push(
                new Paragraph({
                  children: [new TextRun({ text: project.description, size: 22 })],
                  spacing: { after: 50 },
                })
              );
            }
          }
        }
        break;

      case "certifications":
        if (resume.certifications.length > 0) {
          children.push(
            new Paragraph({
              children: [new TextRun({ text: "Certifications", bold: true, size: 24 })],
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 200, after: 100 },
            })
          );

          for (const cert of resume.certifications) {
            const certTitle: (TextRun | ExternalHyperlink)[] = [
              new TextRun({ text: cert.name, bold: true, size: 22 }),
            ];

            if (cert.link) {
              certTitle.push(new TextRun({ text: " — ", size: 22 }));
              certTitle.push(
                new ExternalHyperlink({
                  children: [new TextRun({ text: "Verify", style: "Hyperlink", size: 20 })],
                  link: cert.link.startsWith("http") ? cert.link : `https://${cert.link}`,
                })
              );
            }

            children.push(
              new Paragraph({ children: certTitle, spacing: { before: 100 } }),
              new Paragraph({
                children: [
                  new TextRun({ text: cert.issuer, size: 22 }),
                  new TextRun({ text: ` | ${cert.date}`, italics: true, size: 20 }),
                  cert.expiryDate ? new TextRun({ text: ` - ${cert.expiryDate}`, italics: true, size: 20 }) : new TextRun({ text: "" }),
                ],
                spacing: { after: 50 },
              })
            );

            if (cert.credentialId) {
              children.push(
                new Paragraph({
                  children: [
                    new TextRun({ text: `Credential ID: ${cert.credentialId}`, size: 20 }),
                  ],
                })
              );
            }
          }
        }
        break;
    }
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const filename = `${resume.personal.fullName || "Resume"}_${resume.templateId}.docx`;
  saveAs(blob, filename);
}

export function exportToJSON(resume: ResumeData): void {
  const dataStr = JSON.stringify(resume, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const filename = `${resume.personal.fullName || "Resume"}_backup.json`;
  saveAs(blob, filename);
}

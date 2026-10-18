import { notFound } from "next/navigation";
import { projects } from "../../../../data";
import ProjectGalleryClient from "@/app/components/ProjectGalleryClient";
import { ExternalLink } from "lucide-react"; // Optional icon

export async function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

// Next.js 15: route params arrive as a Promise and must be awaited
export default async function ProjectDetail({ params }) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return notFound();

  return (
    <main className="max-w-5xl mx-auto px-4 py-12 [color:var(--text-light)]">
      <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
      <p className="mb-4" style={{ color: "var(--text-muted)" }}>
        {project.description}
      </p>

      {/* Project Link (if available) */}
      {project.link && (
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm hover:underline mb-8"
          style={{ color: "var(--accent)" }}
        >
          <ExternalLink size={16} /> View Live Project
        </a>
      )}

      {/* Image gallery */}
      <div className="w-full mb-8">
        <ProjectGalleryClient images={project.images} />
      </div>

      {/* Contributions */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">My Contributions</h2>
        <ul
          className="list-disc pl-6 space-y-2"
          style={{ color: "var(--text-muted)" }}
        >
          {project.contributions.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ul>
      </div>

      {/* Grouped detail (e.g. agents, integrations, channels) */}
      {project.sections?.length > 0 && (
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {project.sections.map((section) => (
            <div
              key={section.title}
              className={`glass p-6 ${section.items?.length > 5 ? "md:col-span-2" : ""}`}
            >
              <h3 className="h3">{section.title}</h3>
              {section.text && (
                <p className="mt-2" style={{ color: "var(--text-muted)" }}>
                  {section.text}
                </p>
              )}
              {section.items?.length > 0 && (
                <ul className="mt-4 flex flex-wrap gap-2">
                  {section.items.map((item) => (
                    <li key={item} className="chip">
                      {item}
                    </li>
                  ))}
                </ul>
              )}
              {section.link && (
                <a
                  href={section.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-sm hover:underline"
                  style={{ color: "var(--accent)" }}
                >
                  <ExternalLink size={14} /> Learn more
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Tags */}
      <div className="mt-6 flex flex-wrap gap-2">
        {project.tags.map((tag, i) => (
          <span key={i} className="tag">
            {tag}
          </span>
        ))}
      </div>
    </main>
  );
}

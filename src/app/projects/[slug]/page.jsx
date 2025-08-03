import { notFound } from "next/navigation";
import { projects } from "../../../../data";
import ProjectGalleryClient from "@/app/components/ProjectGalleryClient";
import { ExternalLink } from "lucide-react"; // Optional icon

export async function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default function ProjectDetail({ params }) {
  const project = projects.find((p) => p.slug === params.slug);
  if (!project) return notFound();

  return (
    <main className="max-w-5xl mx-auto px-4 py-12 text-white">
      <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
      <p className="mb-4 text-slate-300">{project.description}</p>

      {/* 🔗 Project Link (if available) */}
      {project.link && (
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:underline mb-8"
        >
          <ExternalLink size={16} /> View Live Project
        </a>
      )}

      {/* 🖼️ Image gallery */}
      <div className="w-full mb-8">
        <ProjectGalleryClient images={project.images} />
      </div>

      {/* 📌 Contributions */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-pink-400">
          My Contributions
        </h2>
        <ul className="list-disc pl-6 space-y-2 text-slate-300">
          {project.contributions.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ul>
      </div>

      {/* 🏷️ Tags */}
      <div className="mt-6 flex flex-wrap gap-2">
        {project.tags.map((tag, i) => (
          <span
            key={i}
            className="px-3 py-1 rounded-full bg-slate-700 text-sm text-white"
          >
            {tag}
          </span>
        ))}
      </div>
    </main>
  );
}

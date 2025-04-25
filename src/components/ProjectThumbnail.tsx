import Image from 'next/image';
import { useState } from 'react';
import ProjectDetailModal from './ProjectDetailModal';

interface ProjectData {
  title: string;
  image: string;
  description: string;
  fullDescription: string;
}

interface ProjectThumbnailProps {
  project: ProjectData;
}

const ProjectThumbnail = ({ project }: ProjectThumbnailProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div 
        onClick={() => setIsModalOpen(true)}
        className="group cursor-pointer overflow-hidden rounded-lg bg-white shadow-lg transition-all hover:shadow-xl"
      >
        <div className="relative h-48 w-full">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>
        <div className="p-4">
          <h3 className="mb-2 text-xl font-semibold text-gray-800">{project.title}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>
        </div>
      </div>

      <ProjectDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        project={project}
      />
    </>
  );
};

export default ProjectThumbnail; 
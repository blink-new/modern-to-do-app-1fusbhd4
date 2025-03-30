
import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { ProjectItem } from './ProjectItem';
import { ProjectModal } from './ProjectModal';
import { useProjectStore } from '../stores/projectStore';
import type { Project } from '../lib/types';

interface ProjectListProps {
  activeProjectId?: string;
  onProjectSelect: (projectId: string) => void;
}

export function ProjectList({ activeProjectId, onProjectSelect }: ProjectListProps) {
  const [editingProject, setEditingProject] = useState<Project | undefined>();
  const { projects, reorderProjects } = useProjectStore();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = projects.findIndex((p) => p.id === active.id);
      const newIndex = projects.findIndex((p) => p.id === over.id);

      const newProjects = arrayMove(projects, oldIndex, newIndex).map(
        (project, index) => ({
          ...project,
          order: index,
        })
      );

      reorderProjects(newProjects);
    }
  };

  return (
    <>
      <div className="space-y-1 px-2">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={projects.map((p) => p.id)}
            strategy={verticalListSortingStrategy}
          >
            {projects
              .sort((a, b) => a.order - b.order)
              .map((project) => (
                <ProjectItem
                  key={project.id}
                  project={project}
                  isActive={project.id === activeProjectId}
                  onSelect={() => onProjectSelect(project.id)}
                  onEdit={() => setEditingProject(project)}
                />
              ))}
          </SortableContext>
        </DndContext>
      </div>

      <ProjectModal
        isOpen={!!editingProject}
        onClose={() => setEditingProject(undefined)}
        editingProject={editingProject}
      />
    </>
  );
}
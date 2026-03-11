import { type AgendaTemplate } from '@/types/template';
import { TemplateCard } from './template-card';

interface TemplateGridProps {
  templates: AgendaTemplate[];
}

export function TemplateGrid({ templates }: TemplateGridProps) {
  if (templates.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500">
        <p>Nenhum template encontrado.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {templates.map((template) => (
        <TemplateCard key={template.id} template={template} />
      ))}
    </div>
  );
}

'use client';

import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { TemplateGrid } from '@/components/templates/template-grid';
import { Badge } from '@/components/ui/badge';
import { TEMPLATE_CATEGORIES, type AgendaTemplate } from '@/types/template';

export default function TemplatesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const { data: templates, isLoading } = trpc.template.list.useQuery(
    selectedCategory ? { category: selectedCategory } : undefined
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Templates de Agenda</h1>
        <p className="text-gray-600">Escolha o template perfeito para você</p>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        <Badge
          variant={!selectedCategory ? 'default' : 'outline'}
          className="cursor-pointer"
          onClick={() => setSelectedCategory('')}
        >
          Todos
        </Badge>
        {TEMPLATE_CATEGORIES.map((cat) => (
          <Badge
            key={cat.value}
            variant={selectedCategory === cat.value ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => setSelectedCategory(cat.value)}
          >
            {cat.label}
          </Badge>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <TemplateGrid templates={(templates ?? []) as unknown as AgendaTemplate[]} />
      )}
    </div>
  );
}

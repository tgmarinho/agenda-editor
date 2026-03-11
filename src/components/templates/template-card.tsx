import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { type AgendaTemplate } from '@/types/template';

interface TemplateCardProps {
  template: AgendaTemplate;
}

export function TemplateCard({ template }: TemplateCardProps) {
  const priceFormatted = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(template.price / 100);

  return (
    <div className="group rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="relative aspect-[2/3] overflow-hidden">
        <Image
          src={template.thumbnailUrl}
          alt={template.name}
          fill
          unoptimized
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 left-2">
          <Badge variant="secondary" className="text-xs capitalize">
            {template.category}
          </Badge>
        </div>
      </div>
      <div className="p-3">
        <h3 className="font-medium text-sm mb-1 truncate">{template.name}</h3>
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-rose-500">{priceFormatted}</span>
          <Link href={`/editor/${template.slug}`}>
            <Button size="sm" variant="outline" className="text-xs">
              Personalizar
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

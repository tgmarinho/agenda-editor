import { prisma } from '@/lib/prisma';
import { Editor } from '@/features/editor/components/editor';
import { notFound } from 'next/navigation';
import { type AgendaTemplate } from '@/types/template';

interface EditorPageProps {
  params: Promise<{ templateSlug: string }>;
}

export default async function EditorPage({ params }: EditorPageProps) {
  const { templateSlug } = await params;
  const template = await prisma.template.findUnique({
    where: { slug: templateSlug },
  });

  if (!template) notFound();

  return (
    <Editor
      template={template as unknown as AgendaTemplate}
    />
  );
}

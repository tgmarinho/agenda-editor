import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed MioloTypes
  await prisma.mioloType.upsert({
    where: { id: 'miolo-comercial' },
    update: {},
    create: {
      id: 'miolo-comercial',
      name: 'Comercial',
      availableColors: ['cinza'],
      description: 'Ideal para uso profissional e empresarial',
    },
  });

  await prisma.mioloType.upsert({
    where: { id: 'miolo-classica' },
    update: {},
    create: {
      id: 'miolo-classica',
      name: 'Clássica',
      availableColors: ['azul', 'amarelo', 'cinza', 'verde'],
      description: 'A agenda clássica com visual elegante',
    },
  });

  await prisma.mioloType.upsert({
    where: { id: 'miolo-juridica' },
    update: {},
    create: {
      id: 'miolo-juridica',
      name: 'Jurídica',
      availableColors: ['azul', 'cinza', 'verde'],
      description: 'Com campos especiais para audiências e processos',
    },
  });

  // Seed SpiralColors
  const spiralColors = [
    { id: 'spiral-prata', name: 'Prata', hexColor: '#C0C0C0' },
    { id: 'spiral-dourado', name: 'Dourado', hexColor: '#FFD700' },
    { id: 'spiral-preto', name: 'Preto', hexColor: '#000000' },
    { id: 'spiral-branco', name: 'Branco', hexColor: '#FFFFFF' },
    { id: 'spiral-rosa', name: 'Rosa', hexColor: '#FF69B4' },
    { id: 'spiral-azul', name: 'Azul', hexColor: '#4169E1' },
    { id: 'spiral-verde', name: 'Verde', hexColor: '#228B22' },
    { id: 'spiral-vermelho', name: 'Vermelho', hexColor: '#DC143C' },
  ];

  for (const color of spiralColors) {
    await prisma.spiralColor.upsert({
      where: { id: color.id },
      update: {},
      create: color,
    });
  }

  // Seed sample Templates
  const templates = [
    {
      id: 'template-flor-marsalla',
      name: 'Agenda Flor Marsalla',
      slug: 'flor-marsalla',
      category: 'feminina',
      thumbnailUrl: 'https://via.placeholder.com/400x566/E91E63/ffffff?text=Flor+Marsalla',
      fullImageUrl: 'https://via.placeholder.com/2480x3508/E91E63/ffffff?text=Flor+Marsalla+Full',
      suggestedLayout: {
        namePosition: { x: 150, y: 400, fontSize: 52, fontFamily: 'Great Vibes', color: '#c8a960' },
        logoPosition: { x: 220, y: 200, width: 150 },
      },
      price: 9900,
      sortOrder: 1,
    },
    {
      id: 'template-minimalista',
      name: 'Agenda Minimalista',
      slug: 'minimalista',
      category: 'masculina',
      thumbnailUrl: 'https://via.placeholder.com/400x566/37474F/ffffff?text=Minimalista',
      fullImageUrl: 'https://via.placeholder.com/2480x3508/37474F/ffffff?text=Minimalista+Full',
      suggestedLayout: {
        namePosition: { x: 100, y: 450, fontSize: 40, fontFamily: 'Playfair Display', color: '#ffffff' },
        logoPosition: { x: 200, y: 150, width: 200 },
      },
      price: 8900,
      sortOrder: 2,
    },
    {
      id: 'template-juridica-azul',
      name: 'Agenda Jurídica Azul',
      slug: 'juridica-azul',
      category: 'profissional',
      thumbnailUrl: 'https://via.placeholder.com/400x566/1A237E/ffffff?text=Juridica+Azul',
      fullImageUrl: 'https://via.placeholder.com/2480x3508/1A237E/ffffff?text=Juridica+Azul+Full',
      suggestedLayout: {
        namePosition: { x: 100, y: 500, fontSize: 36, fontFamily: 'Cinzel Decorative', color: '#c8a960' },
        logoPosition: { x: 180, y: 200, width: 230 },
      },
      price: 11900,
      sortOrder: 3,
    },
    {
      id: 'template-elegante-dourado',
      name: 'Agenda Elegante Dourado',
      slug: 'elegante-dourado',
      category: 'elegante',
      thumbnailUrl: 'https://via.placeholder.com/400x566/212121/c8a960?text=Elegante+Dourado',
      fullImageUrl: 'https://via.placeholder.com/2480x3508/212121/c8a960?text=Elegante+Dourado+Full',
      suggestedLayout: {
        namePosition: { x: 100, y: 450, fontSize: 56, fontFamily: 'Cormorant Garamond', color: '#c8a960' },
        logoPosition: { x: 200, y: 180, width: 180 },
      },
      price: 12900,
      sortOrder: 4,
    },
  ];

  for (const template of templates) {
    await prisma.template.upsert({
      where: { id: template.id },
      update: {},
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      create: template as any,
    });
  }

  console.log('Seeds completed successfully!');
  console.log('  - 3 MioloTypes');
  console.log(`  - ${spiralColors.length} SpiralColors`);
  console.log(`  - ${templates.length} Templates`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

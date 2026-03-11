import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Seed MioloTypes
  await prisma.mioloType.upsert({
    where: { id: "miolo-comercial" },
    update: {},
    create: {
      id: "miolo-comercial",
      name: "Comercial",
      availableColors: ["cinza"],
      description: "Ideal para uso profissional e empresarial",
    },
  });

  await prisma.mioloType.upsert({
    where: { id: "miolo-classica" },
    update: {},
    create: {
      id: "miolo-classica",
      name: "Clássica",
      availableColors: ["azul", "amarelo", "cinza", "verde"],
      description: "A agenda clássica com visual elegante",
    },
  });

  await prisma.mioloType.upsert({
    where: { id: "miolo-juridica" },
    update: {},
    create: {
      id: "miolo-juridica",
      name: "Jurídica",
      availableColors: ["azul", "cinza", "verde"],
      description: "Com campos especiais para audiências e processos",
    },
  });

  // Seed SpiralColors
  const spiralColors = [
    { id: "spiral-prata", name: "Prata", hexColor: "#C0C0C0" },
    { id: "spiral-dourado", name: "Dourado", hexColor: "#FFD700" },
    { id: "spiral-preto", name: "Preto", hexColor: "#000000" },
    { id: "spiral-branco", name: "Branco", hexColor: "#FFFFFF" },
    { id: "spiral-rosa", name: "Rosa", hexColor: "#FF69B4" },
    { id: "spiral-azul", name: "Azul", hexColor: "#4169E1" },
    { id: "spiral-verde", name: "Verde", hexColor: "#228B22" },
    { id: "spiral-vermelho", name: "Vermelho", hexColor: "#DC143C" },
  ];

  for (const color of spiralColors) {
    await prisma.spiralColor.upsert({
      where: { id: color.id },
      update: {},
      create: color,
    });
  }

  // Formato que o CDN Unsplash aceita: photo-{timestamp}-{hash}. IDs verificados (fotos gratuitas).
  const unsplashPhoto = (photoId: string, w: number, h: number) =>
    `https://images.unsplash.com/photo-${photoId}?w=${w}&h=${h}&fit=crop&auto=format`;

  // Uma imagem por template, semântica ao nome. IDs do Unsplash (fotos gratuitas, sem repetição).
  const PHOTOS = {
    floralRosa: "1623776025811-fd139155a39b", // pink roses in bloom
    folhaVerde: "1448375240586-882707db888b", // forest green
    florRosaClose: "1589458456444-f7158a7e8a4f", // pink roses close up
    floresVaso: "1579783901586-d88db74b4fe4", // flowers in vase
    rosasPink: "1527683761419-a124d1a58361", // pink roses
    folhaMarrom: "1583418007992-HYZLZYJfkIk", // brown wooden surface
    ondasAmarelo: "1620641788421-7a1c342ea42e", // color gradient
    folhaVermelha: "1605162785589-498678569628", // red maple leaf
    marmoreBranco: "1566305977571-5666677c6e98", // white marble / light
    marmorePapel: "1524673278499-ded2db8a4084", // elegant gold / marble
    abstractoAzul: "1579546929518-9e396f3cc809", // abstract blue
    marmorePreto: "1550684848-fac1c5b4e853", // dark geometric
    concretoCinza: "1496268280706-ec91c5e133c7", // gray concrete surface
    tijolo: "1547056961-3c25e9140b05", // brown brick wall
    pedras: "1506905925346-21bda4d32df4", // stones/mountains
    texturaParede: "1585750629386-33bdc1431574", // brick wall texture
    ceuAzul: "1617150119111-09bbb85178b0", // white clouds blue sky
    neve: "1491002052546-bf38f186af56", // snow winter
    verdeAereo: "1517758478390-c89333af4642", // green land / nature
    cachoeira: "1482685945432-29a7abf2f466", // waterfall
    costaRochas: "1527022206739-2c7edca55829", // rocks water
    montanhas: "1464822759023-fed622ff2c3b", // mountains
    amadeirado: "1576092762791-dd9e2220abd1", // wood parquet
    juridica: "1589829545856-d10d557cf95f", // Lady Justice
    florLilas: "1490750967868-88df5691cc41", // lilac floral
    minimalista: "1507003211169-0a1dd7228f2d", // minimalist portrait
  } as const;

  // Seed sample Templates: imagens Unsplash (apenas IDs que funcionam) + cores sólidas
  const templates = [
    // ── FEMININAS (flores, pastel) ─────────────────────────────────
    {
      id: "template-flor-rosa",
      name: "Floral Rosa",
      slug: "floral-rosa",
      category: "feminina",
      thumbnailUrl: unsplashPhoto(PHOTOS.floralRosa, 400, 566),
      fullImageUrl: unsplashPhoto(PHOTOS.floralRosa, 600, 849),
      suggestedLayout: {
        namePosition: {
          x: 60,
          y: 480,
          fontSize: 52,
          fontFamily: "Great Vibes",
          color: "#ffffff",
        },
        logoPosition: { x: 200, y: 180, width: 150 },
      },
      price: 9900,
      sortOrder: 1,
    },
    {
      id: "template-folha-verde",
      name: "Folha Verde",
      slug: "folha-verde",
      category: "feminina",
      thumbnailUrl: unsplashPhoto(PHOTOS.folhaVerde, 400, 566),
      fullImageUrl: unsplashPhoto(PHOTOS.folhaVerde, 600, 849),
      suggestedLayout: {
        namePosition: {
          x: 60,
          y: 500,
          fontSize: 48,
          fontFamily: "Dancing Script",
          color: "#166534",
        },
        logoPosition: { x: 200, y: 160, width: 150 },
      },
      price: 9900,
      sortOrder: 2,
    },
    {
      id: "template-flor-close-rosa",
      name: "Flor Rosa Close",
      slug: "flor-close-rosa",
      category: "feminina",
      thumbnailUrl: unsplashPhoto(PHOTOS.florRosaClose, 400, 566),
      fullImageUrl: unsplashPhoto(PHOTOS.florRosaClose, 600, 849),
      suggestedLayout: {
        namePosition: {
          x: 60,
          y: 520,
          fontSize: 50,
          fontFamily: "Pacifico",
          color: "#be185d",
        },
        logoPosition: { x: 200, y: 160, width: 150 },
      },
      price: 9900,
      sortOrder: 3,
    },
    {
      id: "template-flores-vaso",
      name: "Flores no Vaso",
      slug: "flores-vaso",
      category: "feminina",
      thumbnailUrl: unsplashPhoto(PHOTOS.floresVaso, 400, 566),
      fullImageUrl: unsplashPhoto(PHOTOS.floresVaso, 600, 849),
      suggestedLayout: {
        namePosition: {
          x: 60,
          y: 500,
          fontSize: 48,
          fontFamily: "Satisfy",
          color: "#ffffff",
        },
        logoPosition: { x: 200, y: 160, width: 150 },
      },
      price: 9900,
      sortOrder: 4,
    },
    {
      id: "template-rosas-pink",
      name: "Rosas Pink",
      slug: "rosas-pink",
      category: "feminina",
      thumbnailUrl: unsplashPhoto(PHOTOS.rosasPink, 400, 566),
      fullImageUrl: unsplashPhoto(PHOTOS.rosasPink, 600, 849),
      suggestedLayout: {
        namePosition: {
          x: 60,
          y: 500,
          fontSize: 48,
          fontFamily: "Great Vibes",
          color: "#831843",
        },
        logoPosition: { x: 200, y: 160, width: 150 },
      },
      price: 9900,
      sortOrder: 5,
    },
    {
      id: "template-folha-marrom",
      name: "Folha Marrom",
      slug: "folha-marrom",
      category: "feminina",
      thumbnailUrl: unsplashPhoto(PHOTOS.folhaMarrom, 400, 566),
      fullImageUrl: unsplashPhoto(PHOTOS.folhaMarrom, 600, 849),
      suggestedLayout: {
        namePosition: {
          x: 60,
          y: 500,
          fontSize: 46,
          fontFamily: "Lora",
          color: "#fef3c7",
        },
        logoPosition: { x: 200, y: 160, width: 150 },
      },
      price: 9900,
      sortOrder: 6,
    },
    {
      id: "template-fundo-amarelo",
      name: "Ondas Amarelo",
      slug: "ondas-amarelo",
      category: "feminina",
      thumbnailUrl: unsplashPhoto(PHOTOS.ondasAmarelo, 400, 566),
      fullImageUrl: unsplashPhoto(PHOTOS.ondasAmarelo, 600, 849),
      suggestedLayout: {
        namePosition: {
          x: 60,
          y: 500,
          fontSize: 48,
          fontFamily: "Dancing Script",
          color: "#1c1917",
        },
        logoPosition: { x: 200, y: 160, width: 150 },
      },
      price: 9900,
      sortOrder: 7,
    },
    {
      id: "template-folha-vermelha",
      name: "Folha Vermelha",
      slug: "folha-vermelha",
      category: "feminina",
      thumbnailUrl: unsplashPhoto(PHOTOS.folhaVermelha, 400, 566),
      fullImageUrl: unsplashPhoto(PHOTOS.folhaVermelha, 600, 849),
      suggestedLayout: {
        namePosition: {
          x: 60,
          y: 500,
          fontSize: 48,
          fontFamily: "Pacifico",
          color: "#fef2f2",
        },
        logoPosition: { x: 200, y: 160, width: 150 },
      },
      price: 9900,
      sortOrder: 8,
    },
    // ── MASCULINAS / ELEGANTES (mármore, concreto, texturas) ───────
    {
      id: "template-marmore-branco",
      name: "Mármore Branco",
      slug: "marmore-branco",
      category: "elegante",
      thumbnailUrl: unsplashPhoto(PHOTOS.marmoreBranco, 400, 566),
      fullImageUrl: unsplashPhoto(PHOTOS.marmoreBranco, 600, 849),
      suggestedLayout: {
        namePosition: {
          x: 40,
          y: 480,
          fontSize: 44,
          fontFamily: "Playfair Display",
          color: "#1c1917",
        },
        logoPosition: { x: 180, y: 140, width: 200 },
      },
      price: 11900,
      sortOrder: 9,
    },
    {
      id: "template-marmore-mesas",
      name: "Mármore & Papel",
      slug: "marmore-mesas",
      category: "elegante",
      thumbnailUrl: unsplashPhoto(PHOTOS.marmorePapel, 400, 566),
      fullImageUrl: unsplashPhoto(PHOTOS.marmorePapel, 600, 849),
      suggestedLayout: {
        namePosition: {
          x: 40,
          y: 460,
          fontSize: 42,
          fontFamily: "Raleway",
          color: "#292524",
        },
        logoPosition: { x: 180, y: 140, width: 200 },
      },
      price: 11900,
      sortOrder: 10,
    },
    {
      id: "template-abstracto-azul",
      name: "Abstrato Azul",
      slug: "abstracto-azul",
      category: "elegante",
      thumbnailUrl: unsplashPhoto(PHOTOS.abstractoAzul, 400, 566),
      fullImageUrl: unsplashPhoto(PHOTOS.abstractoAzul, 600, 849),
      suggestedLayout: {
        namePosition: {
          x: 60,
          y: 500,
          fontSize: 48,
          fontFamily: "Cormorant Garamond",
          color: "#ffffff",
        },
        logoPosition: { x: 200, y: 160, width: 160 },
      },
      price: 11900,
      sortOrder: 11,
    },
    {
      id: "template-marmore-preto",
      name: "Mármore Preto",
      slug: "marmore-preto",
      category: "masculina",
      thumbnailUrl: unsplashPhoto(PHOTOS.marmorePreto, 400, 566),
      fullImageUrl: unsplashPhoto(PHOTOS.marmorePreto, 600, 849),
      suggestedLayout: {
        namePosition: {
          x: 40,
          y: 460,
          fontSize: 42,
          fontFamily: "Raleway",
          color: "#e2e8f0",
        },
        logoPosition: { x: 180, y: 140, width: 200 },
      },
      price: 11900,
      sortOrder: 12,
    },
    {
      id: "template-concreto-cinza",
      name: "Concreto Cinza",
      slug: "concreto-cinza",
      category: "masculina",
      thumbnailUrl: unsplashPhoto(PHOTOS.concretoCinza, 400, 566),
      fullImageUrl: unsplashPhoto(PHOTOS.concretoCinza, 600, 849),
      suggestedLayout: {
        namePosition: {
          x: 40,
          y: 500,
          fontSize: 44,
          fontFamily: "Montserrat",
          color: "#fafafa",
        },
        logoPosition: { x: 180, y: 140, width: 200 },
      },
      price: 9900,
      sortOrder: 13,
    },
    {
      id: "template-tijolo",
      name: "Tijolo",
      slug: "tijolo",
      category: "masculina",
      thumbnailUrl: unsplashPhoto(PHOTOS.tijolo, 400, 566),
      fullImageUrl: unsplashPhoto(PHOTOS.tijolo, 600, 849),
      suggestedLayout: {
        namePosition: {
          x: 40,
          y: 490,
          fontSize: 44,
          fontFamily: "Playfair Display",
          color: "#fef3c7",
        },
        logoPosition: { x: 180, y: 140, width: 200 },
      },
      price: 9900,
      sortOrder: 14,
    },
    {
      id: "template-pedras",
      name: "Pedras",
      slug: "pedras",
      category: "natureza",
      thumbnailUrl: unsplashPhoto(PHOTOS.pedras, 400, 566),
      fullImageUrl: unsplashPhoto(PHOTOS.pedras, 600, 849),
      suggestedLayout: {
        namePosition: {
          x: 40,
          y: 500,
          fontSize: 44,
          fontFamily: "Montserrat",
          color: "#fafafa",
        },
        logoPosition: { x: 180, y: 140, width: 200 },
      },
      price: 9900,
      sortOrder: 15,
    },
    {
      id: "template-textura-parede",
      name: "Textura Parede",
      slug: "textura-parede",
      category: "masculina",
      thumbnailUrl: unsplashPhoto(PHOTOS.texturaParede, 400, 566),
      fullImageUrl: unsplashPhoto(PHOTOS.texturaParede, 600, 849),
      suggestedLayout: {
        namePosition: {
          x: 40,
          y: 480,
          fontSize: 42,
          fontFamily: "Raleway",
          color: "#e2e8f0",
        },
        logoPosition: { x: 180, y: 140, width: 200 },
      },
      price: 9900,
      sortOrder: 16,
    },
    // ── NATUREZA / PAISAGENS ───────────────────────────────────────
    {
      id: "template-aviao-ceu",
      name: "Céu Azul",
      slug: "ceu-azul",
      category: "natureza",
      thumbnailUrl: unsplashPhoto(PHOTOS.ceuAzul, 400, 566),
      fullImageUrl: unsplashPhoto(PHOTOS.ceuAzul, 600, 849),
      suggestedLayout: {
        namePosition: {
          x: 60,
          y: 500,
          fontSize: 48,
          fontFamily: "Lora",
          color: "#ffffff",
        },
        logoPosition: { x: 200, y: 160, width: 160 },
      },
      price: 9900,
      sortOrder: 17,
    },
    {
      id: "template-rio-gelo",
      name: "Rio & Gelo",
      slug: "rio-gelo",
      category: "natureza",
      thumbnailUrl: unsplashPhoto(PHOTOS.neve, 400, 566),
      fullImageUrl: unsplashPhoto(PHOTOS.neve, 600, 849),
      suggestedLayout: {
        namePosition: {
          x: 60,
          y: 500,
          fontSize: 48,
          fontFamily: "Lora",
          color: "#f0f9ff",
        },
        logoPosition: { x: 200, y: 160, width: 160 },
      },
      price: 9900,
      sortOrder: 18,
    },
    {
      id: "template-aerial-verde",
      name: "Verde Aéreo",
      slug: "verde-aereo",
      category: "natureza",
      thumbnailUrl: unsplashPhoto(PHOTOS.verdeAereo, 400, 566),
      fullImageUrl: unsplashPhoto(PHOTOS.verdeAereo, 600, 849),
      suggestedLayout: {
        namePosition: {
          x: 60,
          y: 500,
          fontSize: 48,
          fontFamily: "Lora",
          color: "#ffffff",
        },
        logoPosition: { x: 200, y: 160, width: 160 },
      },
      price: 9900,
      sortOrder: 19,
    },
    {
      id: "template-cachoeira",
      name: "Cachoeira",
      slug: "cachoeira",
      category: "natureza",
      thumbnailUrl: unsplashPhoto(PHOTOS.cachoeira, 400, 566),
      fullImageUrl: unsplashPhoto(PHOTOS.cachoeira, 600, 849),
      suggestedLayout: {
        namePosition: {
          x: 60,
          y: 500,
          fontSize: 48,
          fontFamily: "Lora",
          color: "#ffffff",
        },
        logoPosition: { x: 200, y: 160, width: 160 },
      },
      price: 9900,
      sortOrder: 20,
    },
    {
      id: "template-costa-rochas",
      name: "Costa & Rochas",
      slug: "costa-rochas",
      category: "natureza",
      thumbnailUrl: unsplashPhoto(PHOTOS.costaRochas, 400, 566),
      fullImageUrl: unsplashPhoto(PHOTOS.costaRochas, 600, 849),
      suggestedLayout: {
        namePosition: {
          x: 60,
          y: 500,
          fontSize: 48,
          fontFamily: "Lora",
          color: "#f0f9ff",
        },
        logoPosition: { x: 200, y: 160, width: 160 },
      },
      price: 9900,
      sortOrder: 21,
    },
    // ── PROFISSIONAL ───────────────────────────────────────────────
    {
      id: "template-celular-mesa",
      name: "Minimal Tech",
      slug: "minimal-tech",
      category: "profissional",
      thumbnailUrl: unsplashPhoto(PHOTOS.minimalista, 400, 566),
      fullImageUrl: unsplashPhoto(PHOTOS.minimalista, 600, 849),
      suggestedLayout: {
        namePosition: {
          x: 60,
          y: 500,
          fontSize: 40,
          fontFamily: "Montserrat",
          color: "#1e293b",
        },
        logoPosition: { x: 180, y: 160, width: 200 },
      },
      price: 8900,
      sortOrder: 22,
    },
    // ── CORES SÓLIDAS (preto, dourado, branco, chumbo, rosa, lilás) ─
    {
      id: "template-solido-preto",
      name: "Sólido Preto",
      slug: "solido-preto",
      category: "elegante",
      thumbnailUrl: "https://placehold.co/400x566/000000/ffffff?text=Preto",
      fullImageUrl: "https://placehold.co/600x849/000000/ffffff?text=Preto",
      suggestedLayout: {
        namePosition: {
          x: 60,
          y: 500,
          fontSize: 48,
          fontFamily: "Cormorant Garamond",
          color: "#ffffff",
        },
        logoPosition: { x: 200, y: 160, width: 180 },
      },
      price: 8900,
      sortOrder: 23,
    },
    {
      id: "template-solido-dourado",
      name: "Sólido Dourado",
      slug: "solido-dourado",
      category: "elegante",
      thumbnailUrl: "https://placehold.co/400x566/FFD700/1c1917?text=Dourado",
      fullImageUrl: "https://placehold.co/600x849/FFD700/1c1917?text=Dourado",
      suggestedLayout: {
        namePosition: {
          x: 60,
          y: 490,
          fontSize: 52,
          fontFamily: "Cormorant Garamond",
          color: "#1c1917",
        },
        logoPosition: { x: 200, y: 160, width: 180 },
      },
      price: 9900,
      sortOrder: 24,
    },
    {
      id: "template-solido-branco",
      name: "Sólido Branco",
      slug: "solido-branco",
      category: "elegante",
      thumbnailUrl: "https://placehold.co/400x566/ffffff/374151?text=Branco",
      fullImageUrl: "https://placehold.co/600x849/ffffff/374151?text=Branco",
      suggestedLayout: {
        namePosition: {
          x: 60,
          y: 500,
          fontSize: 48,
          fontFamily: "Playfair Display",
          color: "#1f2937",
        },
        logoPosition: { x: 200, y: 160, width: 180 },
      },
      price: 8900,
      sortOrder: 25,
    },
    {
      id: "template-solido-chumbo",
      name: "Sólido Chumbo",
      slug: "solido-chumbo",
      category: "profissional",
      thumbnailUrl: "https://placehold.co/400x566/5C5C5C/ffffff?text=Chumbo",
      fullImageUrl: "https://placehold.co/600x849/5C5C5C/ffffff?text=Chumbo",
      suggestedLayout: {
        namePosition: {
          x: 60,
          y: 500,
          fontSize: 48,
          fontFamily: "Raleway",
          color: "#ffffff",
        },
        logoPosition: { x: 200, y: 160, width: 180 },
      },
      price: 8900,
      sortOrder: 26,
    },
    {
      id: "template-solido-rosa",
      name: "Sólido Rosa",
      slug: "solido-rosa",
      category: "feminina",
      thumbnailUrl: "https://placehold.co/400x566/F472B6/ffffff?text=Rosa",
      fullImageUrl: "https://placehold.co/600x849/F472B6/ffffff?text=Rosa",
      suggestedLayout: {
        namePosition: {
          x: 60,
          y: 500,
          fontSize: 48,
          fontFamily: "Dancing Script",
          color: "#ffffff",
        },
        logoPosition: { x: 200, y: 160, width: 150 },
      },
      price: 8900,
      sortOrder: 27,
    },
    {
      id: "template-solido-lilas",
      name: "Sólido Lilás",
      slug: "solido-lilas",
      category: "feminina",
      thumbnailUrl: "https://placehold.co/400x566/A78BFA/ffffff?text=Lilás",
      fullImageUrl: "https://placehold.co/600x849/A78BFA/ffffff?text=Lilás",
      suggestedLayout: {
        namePosition: {
          x: 60,
          y: 500,
          fontSize: 48,
          fontFamily: "Dancing Script",
          color: "#ffffff",
        },
        logoPosition: { x: 200, y: 160, width: 150 },
      },
      price: 8900,
      sortOrder: 28,
    },
  ];

  // Remove templates antigos que não existem mais na lista
  await prisma.template.deleteMany({
    where: { id: { in: ["template-flor-marsalla"] } },
  });

  for (const template of templates) {
    await prisma.template.upsert({
      where: { id: template.id },
      update: {
        thumbnailUrl: template.thumbnailUrl,
        fullImageUrl: template.fullImageUrl,
        name: template.name,
        slug: template.slug,
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      create: template as any,
    });
  }

  console.log("Seeds completed successfully!");
  console.log("  - 3 MioloTypes");
  console.log(`  - ${spiralColors.length} SpiralColors`);
  console.log(
    `  - ${templates.length} Templates (Unsplash + cores sólidas: preto, dourado, branco, chumbo, rosa, lilás)`,
  );
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

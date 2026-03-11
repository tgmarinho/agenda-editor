import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Palette, Star, Truck } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50 py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-4" variant="secondary">
            Agendas Personalizadas 2026
          </Badge>
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Crie sua agenda{' '}
            <span className="text-rose-500">única e especial</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Escolha um template, personalize com seu nome e logo, configure o miolo ideal
            e receba sua agenda impressa em casa.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/templates">
              <Button size="lg" className="bg-rose-500 hover:bg-rose-600 text-white px-8">
                Ver Templates
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              Como Funciona
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Como funciona</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { icon: Palette, title: '1. Escolha o template', desc: 'Floral, minimalista, jurídica, elegante e mais.' },
            { icon: Star, title: '2. Personalize', desc: 'Adicione seu nome, logo, escolha fontes e cores.' },
            { icon: BookOpen, title: '3. Configure o miolo', desc: 'Tipo, dias por página, cor das folhas e espiral.' },
            { icon: Truck, title: '4. Receba em casa', desc: 'Pague via Pix e receba sua agenda impressa.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="text-center">
              <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon className="w-6 h-6 text-rose-500" />
              </div>
              <h3 className="font-semibold mb-2">{title}</h3>
              <p className="text-sm text-gray-600">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

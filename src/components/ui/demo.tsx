import { ArticleCard } from '@/components/ui/article-cards';

const articles = [
  {
    category: 'CÂINI & PISICI',
    title: 'Ghid complet pentru o alimentație echilibrată',
    price: 0.99,
    imageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80',
    gradient: 'from-emerald-400/70 to-teal-600/70',
  },
  {
    category: 'BOVINE',
    title: 'Protocoale moderne de nutriție și productivitate',
    price: 0.19,
    imageUrl: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=800&q=80',
    gradient: 'from-slate-800/70 to-slate-900/70',
  },
  {
    category: 'OVINE',
    title: 'Managementul sănătății sezoniere a efectivelor',
    price: 2.29,
    imageUrl: 'https://images.unsplash.com/photo-1484557052118-f32bd25b45b5?auto=format&fit=crop&w=800&q=80',
    gradient: 'from-amber-400/70 to-orange-600/70',
  },
  {
    category: 'PĂSĂRI',
    title: 'Prevenție și biosecuritate în avicultură',
    price: 0.09,
    imageUrl: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=800&q=80',
    gradient: 'from-sky-300/70 to-cyan-400/70',
  },
  {
    category: 'PORCINE',
    title: 'Etape esențiale în creșterea purceilor',
    price: 0.99,
    imageUrl: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=800&q=80',
    gradient: 'from-rose-400/70 to-red-500/70',
  },
  {
    category: 'ROZĂTOARE',
    title: 'Nutriție adecvată și îngrijire pentru micii companioni',
    price: 0.29,
    imageUrl: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=800&q=80',
    gradient: 'from-blue-400/70 to-indigo-500/70',
  },
];

export default function ArticleCardGridDemo() {
  return (
    <div className="p-4 md:p-8 bg-background">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground">Articole & Ghiduri.</h1>
        <p className="text-muted-foreground">Cele mai recente ghiduri veterinare și articole de nutriție selectate de specialiștii noștri.</p>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        {articles.map((article, index) => (
          <ArticleCard
            key={index}
            category={article.category}
            title={article.title}
            price={article.price}
            imageUrl={article.imageUrl}
            gradient={article.gradient}
          />
        ))}
      </div>
    </div>
  );
}

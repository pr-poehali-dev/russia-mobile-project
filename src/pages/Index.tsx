import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center relative">
      <div className="absolute top-8 left-8">
        <h1 className="text-4xl font-black text-primary tracking-tight">
          RUSSIA MOBILE
        </h1>
      </div>

      <div className="absolute top-8 right-8">
        <Button 
          size="lg" 
          className="text-xl px-12 py-6 font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
          onClick={() => navigate('/game')}
        >
          ИГРАТЬ
        </Button>
      </div>

      <div className="text-center animate-fade-in">
        <div className="mb-8">
          <div className="text-8xl mb-4">🏁</div>
          <h2 className="text-5xl font-black mb-4">Гоночные приключения</h2>
          <p className="text-xl text-muted-foreground">по дорогам России</p>
        </div>
      </div>
    </div>
  );
};

export default Index;

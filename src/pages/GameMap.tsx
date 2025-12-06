import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useMissions } from '@/contexts/MissionContext';

interface MapLocation {
  id: number;
  name: string;
  type: 'race' | 'shop' | 'garage' | 'mission';
  x: number;
  y: number;
  icon: string;
  unlocked: boolean;
  reward?: number;
}

const GameMap = () => {
  const navigate = useNavigate();
  const { balance, addBalance } = useCurrency();
  const { activeMission } = useMissions();
  const [playerPos, setPlayerPos] = useState({ x: 50, y: 50 });
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [zoom, setZoom] = useState(1);

  const locations: MapLocation[] = [
    { id: 1, name: 'Красная площадь', type: 'race', x: 75, y: 30, icon: '🏛️', unlocked: true, reward: 500 },
    { id: 2, name: 'Невский проспект', type: 'race', x: 80, y: 20, icon: '🌉', unlocked: true, reward: 350 },
    { id: 3, name: 'Автосалон', type: 'shop', x: 50, y: 45, icon: '🏪', unlocked: true },
    { id: 4, name: 'Гараж', type: 'garage', x: 45, y: 55, icon: '🏠', unlocked: true },
    { id: 5, name: 'Сибирская тайга', type: 'race', x: 85, y: 55, icon: '🌲', unlocked: true, reward: 800 },
    { id: 6, name: 'Кольская трасса', type: 'mission', x: 70, y: 15, icon: '❄️', unlocked: false, reward: 1200 },
    { id: 7, name: 'Казанский кремль', type: 'race', x: 65, y: 40, icon: '🕌', unlocked: true, reward: 600 },
    { id: 8, name: 'Владивосток', type: 'race', x: 95, y: 60, icon: '⚓', unlocked: true, reward: 900 },
    { id: 9, name: 'Автозаправка', type: 'shop', x: 55, y: 35, icon: '⛽', unlocked: true },
    { id: 10, name: 'Мастерская', type: 'garage', x: 40, y: 70, icon: '🔧', unlocked: true }
  ];

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const speed = 2;
      setPlayerPos(prev => {
        let newX = prev.x;
        let newY = prev.y;
        
        if (e.key === 'ArrowUp' || e.key === 'w') newY = Math.max(5, prev.y - speed);
        if (e.key === 'ArrowDown' || e.key === 's') newY = Math.min(95, prev.y + speed);
        if (e.key === 'ArrowLeft' || e.key === 'a') newX = Math.max(5, prev.x - speed);
        if (e.key === 'ArrowRight' || e.key === 'd') newX = Math.min(95, prev.x + speed);
        
        return { x: newX, y: newY };
      });
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const getDistance = (x1: number, y1: number, x2: number, y2: number) => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  };

  const checkNearbyLocations = () => {
    return locations.find(loc => {
      const distance = getDistance(playerPos.x, playerPos.y, loc.x, loc.y);
      return distance < 5 && loc.unlocked;
    });
  };

  const nearbyLocation = checkNearbyLocations();

  const handleLocationAction = (location: MapLocation) => {
    if (location.type === 'race' && location.reward) {
      addBalance(location.reward);
      setSelectedLocation(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 relative overflow-hidden">
      <div 
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_hsl(var(--muted))_0%,_hsl(var(--background))_100%)]"
        style={{
          backgroundSize: `${100 * zoom}% ${100 * zoom}%`,
          backgroundPosition: `${50 - playerPos.x * zoom}% ${50 - playerPos.y * zoom}%`
        }}
      >
        <div className="absolute inset-0">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={`road-h-${i}`}
              className="absolute h-px bg-muted/20"
              style={{ top: `${i * 5}%`, width: '100%' }}
            />
          ))}
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={`road-v-${i}`}
              className="absolute w-px bg-muted/20"
              style={{ left: `${i * 5}%`, height: '100%' }}
            />
          ))}
        </div>
      </div>

      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/game')}
          className="bg-card/80 backdrop-blur"
        >
          <Icon name="ArrowLeft" className="mr-2" />
          Назад
        </Button>

        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/missions')}
            className="bg-card/80 backdrop-blur"
          >
            <Icon name="ScrollText" className="mr-2" />
            Миссии
          </Button>
          
          <div className="flex items-center gap-2 bg-card/80 backdrop-blur px-4 py-2 rounded-lg">
            <Icon name="Coins" className="text-secondary" />
            <span className="text-xl font-bold text-secondary">{balance.toLocaleString()}</span>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setZoom(Math.min(2, zoom + 0.2))}
              className="bg-card/80 backdrop-blur"
            >
              <Icon name="ZoomIn" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setZoom(Math.max(0.5, zoom - 0.2))}
              className="bg-card/80 backdrop-blur"
            >
              <Icon name="ZoomOut" />
            </Button>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {locations.map((location) => (
          <div
            key={location.id}
            className="absolute pointer-events-auto"
            style={{
              left: `${location.x}%`,
              top: `${location.y}%`,
              transform: 'translate(-50%, -50%)',
              opacity: location.unlocked ? 1 : 0.3
            }}
          >
            <div 
              className={`
                text-4xl cursor-pointer transition-all hover:scale-125
                ${nearbyLocation?.id === location.id ? 'animate-bounce' : ''}
              `}
              onClick={() => location.unlocked && setSelectedLocation(location)}
            >
              {location.icon}
            </div>
            <div className="text-xs text-center mt-1 bg-card/80 backdrop-blur px-2 py-1 rounded whitespace-nowrap">
              {location.name}
            </div>
          </div>
        ))}

        <div
          className="absolute text-5xl animate-pulse"
          style={{
            left: `${playerPos.x}%`,
            top: `${playerPos.y}%`,
            transform: 'translate(-50%, -50%)',
            filter: 'drop-shadow(0 0 10px hsl(var(--primary)))'
          }}
        >
          🏎️
        </div>
      </div>

      {activeMission && (
        <Card className="absolute top-20 left-4 p-4 bg-card/90 backdrop-blur max-w-sm">
          <div className="flex items-start gap-3">
            <div className="text-3xl">{activeMission.icon}</div>
            <div className="flex-1">
              <h3 className="font-bold text-sm mb-1">{activeMission.title}</h3>
              <p className="text-xs text-muted-foreground mb-2">{activeMission.description}</p>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">Прогресс</span>
                <span className="font-bold">{activeMission.progress} / {activeMission.maxProgress}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5">
                <div 
                  className="bg-primary h-1.5 rounded-full transition-all"
                  style={{ width: `${(activeMission.progress / activeMission.maxProgress) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </Card>
      )}

      <Card className="absolute bottom-4 right-4 w-64 h-64 p-4 bg-card/80 backdrop-blur">
        <h3 className="text-sm font-bold mb-2 flex items-center gap-2">
          <Icon name="Map" size={16} />
          Миникарта
        </h3>
        <div className="relative w-full h-full bg-muted/20 rounded border border-border">
          {locations.map((loc) => (
            <div
              key={loc.id}
              className="absolute w-2 h-2 rounded-full bg-primary/50"
              style={{
                left: `${loc.x}%`,
                top: `${loc.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
            />
          ))}
          <div
            className="absolute w-3 h-3 bg-primary rounded-full animate-ping"
            style={{
              left: `${playerPos.x}%`,
              top: `${playerPos.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
          />
        </div>
      </Card>

      {nearbyLocation && (
        <Card className="absolute bottom-4 left-1/2 transform -translate-x-1/2 p-4 bg-card/90 backdrop-blur animate-slide-up">
          <div className="flex items-center gap-4">
            <div className="text-4xl">{nearbyLocation.icon}</div>
            <div>
              <h3 className="font-bold text-lg">{nearbyLocation.name}</h3>
              <p className="text-sm text-muted-foreground">Нажмите E для взаимодействия</p>
              {nearbyLocation.reward && (
                <p className="text-sm text-secondary font-bold">Награда: {nearbyLocation.reward} ₽</p>
              )}
            </div>
            <Button 
              onClick={() => handleLocationAction(nearbyLocation)}
              className="ml-auto"
            >
              Открыть
            </Button>
          </div>
        </Card>
      )}

      {selectedLocation && !nearbyLocation && (
        <div 
          className="absolute inset-0 bg-background/80 backdrop-blur flex items-center justify-center z-20"
          onClick={() => setSelectedLocation(null)}
        >
          <Card className="p-8 max-w-md animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="text-center">
              <div className="text-6xl mb-4">{selectedLocation.icon}</div>
              <h2 className="text-3xl font-black mb-2">{selectedLocation.name}</h2>
              <p className="text-muted-foreground mb-6">
                {selectedLocation.type === 'race' && 'Гоночная трасса'}
                {selectedLocation.type === 'shop' && 'Магазин'}
                {selectedLocation.type === 'garage' && 'Гараж'}
                {selectedLocation.type === 'mission' && 'Миссия'}
              </p>
              {selectedLocation.reward && (
                <div className="text-2xl text-secondary font-bold mb-4">
                  Награда: {selectedLocation.reward} ₽
                </div>
              )}
              <div className="flex gap-4">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setSelectedLocation(null)}
                >
                  Закрыть
                </Button>
                <Button 
                  className="flex-1"
                  onClick={() => {
                    setPlayerPos({ x: selectedLocation.x, y: selectedLocation.y });
                    setSelectedLocation(null);
                  }}
                >
                  <Icon name="Navigation" className="mr-2" />
                  Поехать
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      <div className="absolute bottom-4 left-4 bg-card/80 backdrop-blur px-4 py-3 rounded-lg">
        <p className="text-xs text-muted-foreground mb-2">Управление</p>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-1">
            <kbd className="px-2 py-1 bg-muted rounded text-xs">WASD</kbd>
            <span className="text-muted-foreground">или</span>
            <kbd className="px-2 py-1 bg-muted rounded text-xs">↑←↓→</kbd>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameMap;
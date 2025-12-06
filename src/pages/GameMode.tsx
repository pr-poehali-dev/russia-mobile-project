import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const GameMode = () => {
  const navigate = useNavigate();
  const [selectedMode, setSelectedMode] = useState<'solo' | 'multiplayer' | null>(null);

  const tracks = [
    {
      id: 1,
      name: 'Красная площадь',
      location: 'Москва',
      difficulty: 'Средняя',
      laps: 3,
      emoji: '🏛️'
    },
    {
      id: 2,
      name: 'Невский проспект',
      location: 'Санкт-Петербург',
      difficulty: 'Легкая',
      laps: 2,
      emoji: '🌉'
    },
    {
      id: 3,
      name: 'Сибирская тайга',
      location: 'Сибирь',
      difficulty: 'Сложная',
      laps: 5,
      emoji: '🌲'
    },
    {
      id: 4,
      name: 'Кольская трасса',
      location: 'Мурманск',
      difficulty: 'Экстремальная',
      laps: 4,
      emoji: '❄️'
    },
    {
      id: 5,
      name: 'Казанский кремль',
      location: 'Казань',
      difficulty: 'Средняя',
      laps: 3,
      emoji: '🕌'
    },
    {
      id: 6,
      name: 'Владивосток-порт',
      location: 'Владивосток',
      difficulty: 'Сложная',
      laps: 4,
      emoji: '⚓'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <Button 
            variant="ghost" 
            size="lg"
            onClick={() => navigate('/')}
            className="text-lg"
          >
            <Icon name="ArrowLeft" className="mr-2" />
            Назад
          </Button>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-lg">
              <Icon name="Coins" className="text-secondary" />
              <span className="text-xl font-bold text-secondary">12,450</span>
            </div>
          </div>
        </div>

        <h1 className="text-5xl font-black text-center mb-4 animate-fade-in">
          Выбор режима игры
        </h1>
        <p className="text-center text-muted-foreground mb-12 text-xl">
          Выбери режим и трассу для гонки
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-12 animate-scale-in">
          <Card 
            className={`p-8 cursor-pointer transition-all hover:scale-105 ${
              selectedMode === 'solo' ? 'ring-4 ring-primary' : ''
            }`}
            onClick={() => setSelectedMode('solo')}
          >
            <div className="text-center">
              <div className="text-6xl mb-4">🏎️</div>
              <h2 className="text-3xl font-black mb-2">Одиночная игра</h2>
              <p className="text-muted-foreground">Гонки против ИИ соперников</p>
            </div>
          </Card>

          <Card 
            className={`p-8 cursor-pointer transition-all hover:scale-105 ${
              selectedMode === 'multiplayer' ? 'ring-4 ring-primary' : ''
            }`}
            onClick={() => setSelectedMode('multiplayer')}
          >
            <div className="text-center">
              <div className="text-6xl mb-4">🌐</div>
              <h2 className="text-3xl font-black mb-2">Мультиплеер</h2>
              <p className="text-muted-foreground">Онлайн гонки с игроками</p>
            </div>
          </Card>
        </div>

        {selectedMode && (
          <div className="animate-slide-up">
            <h2 className="text-4xl font-black mb-6 text-center">Выбери трассу</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {tracks.map((track, index) => (
                <Card 
                  key={track.id}
                  className="p-6 cursor-pointer transition-all hover:scale-105 hover:shadow-xl animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="text-center mb-4">
                    <div className="text-5xl mb-2">{track.emoji}</div>
                    <h3 className="text-2xl font-black mb-1">{track.name}</h3>
                    <p className="text-muted-foreground mb-4">{track.location}</p>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Сложность:</span>
                      <span className="font-bold">{track.difficulty}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Круги:</span>
                      <span className="font-bold">{track.laps}</span>
                    </div>
                  </div>

                  <Button className="w-full" size="lg">
                    <Icon name="Play" className="mr-2" />
                    Начать гонку
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameMode;

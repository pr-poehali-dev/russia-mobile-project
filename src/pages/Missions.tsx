import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useMissions } from '@/contexts/MissionContext';
import { useCurrency } from '@/contexts/CurrencyContext';

const Missions = () => {
  const navigate = useNavigate();
  const { missions, startMission, completeMission, playerLevel, playerXP } = useMissions();
  const { balance, addBalance } = useCurrency();

  const handleStartMission = (missionId: number) => {
    startMission(missionId);
    navigate('/map');
  };

  const handleCompleteMission = (missionId: number) => {
    const mission = missions.find(m => m.id === missionId);
    if (mission) {
      completeMission(missionId);
      addBalance(mission.reward);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'hard': return 'text-orange-500';
      case 'extreme': return 'text-red-500';
      default: return 'text-muted-foreground';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Легкая';
      case 'medium': return 'Средняя';
      case 'hard': return 'Сложная';
      case 'extreme': return 'Экстремальная';
      default: return difficulty;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'race': return 'Гонка';
      case 'delivery': return 'Доставка';
      case 'chase': return 'Погоня';
      case 'explore': return 'Исследование';
      default: return type;
    }
  };

  const availableMissions = missions.filter(m => m.status === 'available');
  const inProgressMissions = missions.filter(m => m.status === 'in_progress');
  const completedMissions = missions.filter(m => m.status === 'completed');

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="ghost" 
            size="lg"
            onClick={() => navigate('/game')}
          >
            <Icon name="ArrowLeft" className="mr-2" />
            Назад
          </Button>

          <div className="flex items-center gap-4">
            <Card className="px-4 py-2 bg-card/80 backdrop-blur">
              <div className="flex items-center gap-2">
                <Icon name="Star" className="text-yellow-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Уровень</p>
                  <p className="text-xl font-bold">{playerLevel}</p>
                </div>
              </div>
            </Card>

            <Card className="px-4 py-2 bg-card/80 backdrop-blur">
              <div className="flex items-center gap-2">
                <Icon name="Zap" className="text-blue-500" />
                <div>
                  <p className="text-xs text-muted-foreground">XP</p>
                  <p className="text-xl font-bold">{playerXP}</p>
                </div>
              </div>
            </Card>

            <Card className="px-4 py-2 bg-card/80 backdrop-blur">
              <div className="flex items-center gap-2">
                <Icon name="Coins" className="text-secondary" />
                <p className="text-xl font-bold text-secondary">{balance.toLocaleString()}</p>
              </div>
            </Card>
          </div>
        </div>

        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-black mb-4">Миссии</h1>
          <p className="text-xl text-muted-foreground">
            Выполняй задания и становись легендой российских дорог
          </p>
        </div>

        {inProgressMissions.length > 0 && (
          <div className="mb-12 animate-scale-in">
            <h2 className="text-3xl font-black mb-6 flex items-center gap-2">
              <Icon name="PlayCircle" className="text-primary" />
              Текущие миссии
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {inProgressMissions.map((mission) => (
                <Card 
                  key={mission.id}
                  className="p-6 border-2 border-primary/50 animate-pulse"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-5xl">{mission.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-black mb-2">{mission.title}</h3>
                      <p className="text-muted-foreground mb-3">{mission.description}</p>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                        <div>
                          <span className="text-muted-foreground">Тип:</span>
                          <span className="ml-2 font-bold">{getTypeLabel(mission.type)}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Сложность:</span>
                          <span className={`ml-2 font-bold ${getDifficultyColor(mission.difficulty)}`}>
                            {getDifficultyLabel(mission.difficulty)}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Награда:</span>
                          <span className="ml-2 font-bold text-secondary">{mission.reward} ₽</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">XP:</span>
                          <span className="ml-2 font-bold text-blue-500">+{mission.xpReward}</span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Прогресс</span>
                          <span className="font-bold">{mission.progress} / {mission.maxProgress}</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `${(mission.progress / mission.maxProgress) * 100}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          className="flex-1"
                          onClick={() => navigate('/map')}
                        >
                          <Icon name="Map" className="mr-2" />
                          На карту
                        </Button>
                        <Button 
                          variant="secondary"
                          onClick={() => handleCompleteMission(mission.id)}
                        >
                          Завершить
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {availableMissions.length > 0 && (
          <div className="mb-12 animate-slide-up">
            <h2 className="text-3xl font-black mb-6 flex items-center gap-2">
              <Icon name="CircleDot" className="text-green-500" />
              Доступные миссии
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {availableMissions.map((mission, index) => (
                <Card 
                  key={mission.id}
                  className="p-6 hover:scale-105 transition-all cursor-pointer animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="text-center mb-4">
                    <div className="text-5xl mb-2">{mission.icon}</div>
                    <h3 className="text-xl font-black mb-2">{mission.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{mission.description}</p>
                  </div>

                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Тип:</span>
                      <span className="font-bold">{getTypeLabel(mission.type)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Сложность:</span>
                      <span className={`font-bold ${getDifficultyColor(mission.difficulty)}`}>
                        {getDifficultyLabel(mission.difficulty)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Награда:</span>
                      <span className="font-bold text-secondary">{mission.reward} ₽</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">XP:</span>
                      <span className="font-bold text-blue-500">+{mission.xpReward}</span>
                    </div>
                  </div>

                  <Button 
                    className="w-full"
                    onClick={() => handleStartMission(mission.id)}
                  >
                    <Icon name="Play" className="mr-2" />
                    Начать
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        )}

        {completedMissions.length > 0 && (
          <div className="animate-slide-up">
            <h2 className="text-3xl font-black mb-6 flex items-center gap-2">
              <Icon name="CheckCircle" className="text-green-500" />
              Завершенные миссии ({completedMissions.length})
            </h2>
            <div className="grid md:grid-cols-4 gap-4">
              {completedMissions.map((mission) => (
                <Card 
                  key={mission.id}
                  className="p-4 opacity-70"
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2 relative">
                      {mission.icon}
                      <div className="absolute -top-1 -right-1 text-green-500 text-lg">✓</div>
                    </div>
                    <p className="text-sm font-bold">{mission.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">Завершено</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Missions;

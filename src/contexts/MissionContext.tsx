import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Mission {
  id: number;
  title: string;
  description: string;
  type: 'race' | 'delivery' | 'chase' | 'explore';
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme';
  location: string;
  reward: number;
  xpReward: number;
  status: 'locked' | 'available' | 'in_progress' | 'completed';
  progress: number;
  maxProgress: number;
  requirements?: number[];
  icon: string;
}

interface MissionContextType {
  missions: Mission[];
  activeMission: Mission | null;
  startMission: (missionId: number) => void;
  completeMission: (missionId: number) => void;
  updateProgress: (missionId: number, progress: number) => void;
  playerLevel: number;
  playerXP: number;
}

const MissionContext = createContext<MissionContextType | undefined>(undefined);

const initialMissions: Mission[] = [
  {
    id: 1,
    title: 'Первая гонка',
    description: 'Пройди тренировочную гонку на Красной площади',
    type: 'race',
    difficulty: 'easy',
    location: 'Москва, Красная площадь',
    reward: 500,
    xpReward: 100,
    status: 'available',
    progress: 0,
    maxProgress: 1,
    icon: '🏁'
  },
  {
    id: 2,
    title: 'Доставка груза',
    description: 'Доставь груз из Москвы в Санкт-Петербург',
    type: 'delivery',
    difficulty: 'easy',
    location: 'Москва → Санкт-Петербург',
    reward: 800,
    xpReward: 150,
    status: 'available',
    progress: 0,
    maxProgress: 1,
    icon: '📦'
  },
  {
    id: 3,
    title: 'Погоня по городу',
    description: 'Уйди от полицейской погони на Невском проспекте',
    type: 'chase',
    difficulty: 'medium',
    location: 'Санкт-Петербург',
    reward: 1200,
    xpReward: 250,
    status: 'locked',
    progress: 0,
    maxProgress: 1,
    requirements: [1, 2],
    icon: '🚓'
  },
  {
    id: 4,
    title: 'Исследователь Сибири',
    description: 'Найди 5 секретных точек в Сибирской тайге',
    type: 'explore',
    difficulty: 'medium',
    location: 'Сибирь',
    reward: 1500,
    xpReward: 300,
    status: 'locked',
    progress: 0,
    maxProgress: 5,
    requirements: [1],
    icon: '🔍'
  },
  {
    id: 5,
    title: 'Король дорог',
    description: 'Победи в гонке на Казанском кремле',
    type: 'race',
    difficulty: 'hard',
    location: 'Казань',
    reward: 2000,
    xpReward: 400,
    status: 'locked',
    progress: 0,
    maxProgress: 1,
    requirements: [1, 3],
    icon: '👑'
  },
  {
    id: 6,
    title: 'Экстремальная доставка',
    description: 'Доставь груз через Кольскую трассу за 5 минут',
    type: 'delivery',
    difficulty: 'hard',
    location: 'Мурманск',
    reward: 2500,
    xpReward: 500,
    status: 'locked',
    progress: 0,
    maxProgress: 1,
    requirements: [2, 4],
    icon: '❄️'
  },
  {
    id: 7,
    title: 'Дальневосточный экспресс',
    description: 'Пройди гонку во Владивостоке без повреждений',
    type: 'race',
    difficulty: 'extreme',
    location: 'Владивосток',
    reward: 3500,
    xpReward: 700,
    status: 'locked',
    progress: 0,
    maxProgress: 1,
    requirements: [5, 6],
    icon: '⚓'
  },
  {
    id: 8,
    title: 'Легенда России',
    description: 'Стань чемпионом всех российских гонок',
    type: 'race',
    difficulty: 'extreme',
    location: 'Вся Россия',
    reward: 10000,
    xpReward: 2000,
    status: 'locked',
    progress: 0,
    maxProgress: 10,
    requirements: [1, 3, 5, 7],
    icon: '🏆'
  }
];

export const MissionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [missions, setMissions] = useState<Mission[]>(() => {
    const saved = localStorage.getItem('russiaMobileMissions');
    return saved ? JSON.parse(saved) : initialMissions;
  });

  const [activeMission, setActiveMission] = useState<Mission | null>(null);
  const [playerXP, setPlayerXP] = useState(() => {
    const saved = localStorage.getItem('russiaMobileXP');
    return saved ? parseInt(saved, 10) : 0;
  });

  const playerLevel = Math.floor(playerXP / 1000) + 1;

  useEffect(() => {
    localStorage.setItem('russiaMobileMissions', JSON.stringify(missions));
  }, [missions]);

  useEffect(() => {
    localStorage.setItem('russiaMobileXP', playerXP.toString());
  }, [playerXP]);

  useEffect(() => {
    const updatedMissions = missions.map(mission => {
      if (mission.status === 'locked' && mission.requirements) {
        const allRequirementsMet = mission.requirements.every(reqId => {
          const reqMission = missions.find(m => m.id === reqId);
          return reqMission?.status === 'completed';
        });
        if (allRequirementsMet) {
          return { ...mission, status: 'available' as const };
        }
      }
      return mission;
    });
    setMissions(updatedMissions);
  }, [missions]);

  const startMission = (missionId: number) => {
    const mission = missions.find(m => m.id === missionId);
    if (mission && mission.status === 'available') {
      setMissions(prev =>
        prev.map(m =>
          m.id === missionId ? { ...m, status: 'in_progress' as const } : m
        )
      );
      setActiveMission(mission);
    }
  };

  const completeMission = (missionId: number) => {
    const mission = missions.find(m => m.id === missionId);
    if (mission) {
      setMissions(prev =>
        prev.map(m =>
          m.id === missionId
            ? { ...m, status: 'completed' as const, progress: m.maxProgress }
            : m
        )
      );
      setPlayerXP(prev => prev + mission.xpReward);
      if (activeMission?.id === missionId) {
        setActiveMission(null);
      }
    }
  };

  const updateProgress = (missionId: number, progress: number) => {
    setMissions(prev =>
      prev.map(m =>
        m.id === missionId
          ? { ...m, progress: Math.min(progress, m.maxProgress) }
          : m
      )
    );
  };

  return (
    <MissionContext.Provider
      value={{
        missions,
        activeMission,
        startMission,
        completeMission,
        updateProgress,
        playerLevel,
        playerXP
      }}
    >
      {children}
    </MissionContext.Provider>
  );
};

export const useMissions = () => {
  const context = useContext(MissionContext);
  if (context === undefined) {
    throw new Error('useMissions must be used within a MissionProvider');
  }
  return context;
};

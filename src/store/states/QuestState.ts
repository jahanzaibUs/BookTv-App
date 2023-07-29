export interface QuestState {
  loading: boolean;
  error: boolean;
  level: string;
  totalExp: number;
  nextLvExp: number;
  expSources: ExpSource[];
  rewards: LevelReward[];
  rewardLog: RewardLog[];
  giftReward: GiftLog[]; // sender
  giftLog: GiftLog[]; // receiver
  missions: Mission[];
  missionSum: MissionState[];
  currentStreak: StreakState;
  expGains: ExpGains[];
}

export interface ExpSource {
  id: number;
  type: string;
  content: string;
  exp: number;
}

export interface Mission {
  id: number;
  title: string;
  subtitle: string;
  type: string;
  icon: string;
  iconColor: string;
  exp: ExpSource[];
}

export interface MissionState {
  id: number;
  type: string;
  exp: number;
}

export interface LevelReward {
  id: number;
  name: string;
  exp: number;
  reward: Reward;
}

export interface Reward {
  id: number;
  level: number; // level id
  content: string;
  description: string;
  enabled: boolean;
}
export interface RewardLog {
  id: number;
  reward: Reward;
  collected: boolean;
  collected_at: string;
}

export interface Gift {
  id: number;
  content: string;
  duration: number;
  enabled: boolean;
}

export interface GiftLog {
  id: number;
  code: string;
  gift: Gift;
  created_at: string;
  activated_at: string;
  expired_at: string;
}

export interface StreakState {
  startDate: string;
  endDate: string;
  length: number;
}

export interface ExpLog {
  id: number;
  exp: number;
  source: ExpSource;
  created_at: string;
  lesson: null | number;
}

export interface ExpGains {
  date: string;
  total: number;
  logs: ExpLog[];
  levelup: null | { id: number; reward: Reward };
}

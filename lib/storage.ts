export interface UserPreferences {
  items: string[]; // 用户选择的物品
  timestamp: string;
}

export interface DailyRecord {
  date: string;
  interactionType: 'slider' | 'choice' | 'senses';
  data: any;
  timestamp: string;
}

export interface AIAdvice {
  physical: string;
  sensory: string;
  awareness: string;
  timestamp: string;
}

const STORAGE_KEYS = {
  USER_PREFERENCES: 'user_preferences',
  DAILY_RECORDS: 'daily_records',
  LAST_CHECK_IN: 'last_check_in',
};

export const storage = {
  // 用户偏好存储
  saveUserPreferences(preferences: UserPreferences): void {
    localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(preferences));
  },

  getUserPreferences(): UserPreferences | null {
    const data = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
    return data ? JSON.parse(data) : null;
  },

  // 日常记录存储
  saveDailyRecord(record: DailyRecord): void {
    const records = this.getDailyRecords();
    records.push(record);
    localStorage.setItem(STORAGE_KEYS.DAILY_RECORDS, JSON.stringify(records));
  },

  getDailyRecords(): DailyRecord[] {
    const data = localStorage.getItem(STORAGE_KEYS.DAILY_RECORDS);
    return data ? JSON.parse(data) : [];
  },

  getTodayRecord(): DailyRecord | null {
    const today = new Date().toISOString().split('T')[0];
    const records = this.getDailyRecords();
    return records.find(record => record.date === today) || null;
  },

  saveLastCheckIn(date: string): void {
    localStorage.setItem(STORAGE_KEYS.LAST_CHECK_IN, date);
  },

  getLastCheckIn(): string | null {
    return localStorage.getItem(STORAGE_KEYS.LAST_CHECK_IN);
  },

  isCheckedInToday(): boolean {
    const today = new Date().toISOString().split('T')[0];
    const lastCheckIn = this.getLastCheckIn();
    return lastCheckIn === today;
  },

  // 清除所有数据
  clearAll(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
};
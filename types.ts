
export type Language = 'en' | 'te';

export interface AppState {
  currentSpeed: number; // km/h
  speedLimit: number; // km/h
  isAlerting: boolean;
  isTestMode: boolean;
  history: SpeedRecord[];
  language: Language;
  permissionsGranted: boolean;
}

export interface SpeedRecord {
  id: string;
  timestamp: number;
  speed: number;
  limit: number;
  wasOverspeed: boolean;
}

export interface TranslationStrings {
  title: string;
  speedLabel: string;
  unit: string;
  limitLabel: string;
  historyLabel: string;
  settingsLabel: string;
  alertMessage: string;
  permissionTitle: string;
  permissionDesc: string;
  allowBtn: string;
  testModeLabel: string;
  testModeDesc: string;
  devBy: string;
  vibrateLabel: string;
}


import { Language, TranslationStrings } from './types';

export const translations: Record<Language, TranslationStrings> = {
  en: {
    title: "RideSafe",
    speedLabel: "Current Speed",
    unit: "km/h",
    limitLabel: "Speed Limit",
    historyLabel: "History",
    settingsLabel: "Settings",
    alertMessage: "SPEED LIMIT EXCEEDED!",
    permissionTitle: "Safety First",
    permissionDesc: "To track your riding speed and alert you in real-time, RideSafe needs Location and Notification permissions.",
    allowBtn: "Start Riding",
    testModeLabel: "Test Mode",
    testModeDesc: "Simulates speed for testing alerts",
    devBy: "Designed & Developed by @Sumanth Csy",
    vibrateLabel: "Vibration Alerts",
  },
  te: {
    title: "రైడ్ సేఫ్",
    speedLabel: "ప్రస్తుత వేగం",
    unit: "కి.మీ/గం",
    limitLabel: "వేగ పరిమితి",
    historyLabel: "చరిత్ర",
    settingsLabel: "సెట్టింగ్స్",
    alertMessage: "వేగ పరిమితి మించిపోయింది!",
    permissionTitle: "భద్రత ముఖ్యం",
    permissionDesc: "మీ రైడింగ్ వేగాన్ని ట్రాక్ చేయడానికి మరియు హెచ్చరించడానికి, రైడ్ సేఫ్ కు లోకేషన్ మరియు నోటిఫికేషన్ అనుమతులు అవసరం.",
    allowBtn: "రైడింగ్ ప్రారంభించండి",
    testModeLabel: "టెస్ట్ మోడ్",
    testModeDesc: "హెచ్చరికలను పరీక్షించడానికి వేగాన్ని అనుకరిస్తుంది",
    devBy: "@Sumanth Csy ద్వారా రూపొందించబడింది",
    vibrateLabel: "వైబ్రేషన్ అలర్ట్స్",
  }
};

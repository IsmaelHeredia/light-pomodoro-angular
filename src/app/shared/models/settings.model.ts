export interface Settings {
  pomodoro: number;
  shortBreak: number;
  longBreak: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  longBreakInterval: number;
}

export const DEFAULT_SETTINGS: Settings = {
  pomodoro: 20,
  shortBreak: 5,
  longBreak: 10,
  autoStartBreaks: false,
  autoStartPomodoros: false,
  longBreakInterval: 4,
};
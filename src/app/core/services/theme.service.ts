import { Injectable, effect, inject } from '@angular/core';
import { TimerService } from './timer.service';
import { TimerMode } from '../../shared/models/timer-mode.type';

interface ThemeColors {
  bg: string;
  bgSoft: string;
  surface: string;
  primary: string;
  primaryDark: string;
}

const THEMES: Record<TimerMode, ThemeColors> = {
  pomodoro: {
    bg: '#f0c199',
    bgSoft: '#e8b280',
    surface: '#dba065',
    primary: '#cc241d',
    primaryDark: '#9d0006',
  },
  shortBreak: {
    bg: '#dde3a3',
    bgSoft: '#cdd587',
    surface: '#b8c168',
    primary: '#98971a',
    primaryDark: '#79740e',
  },
  longBreak: {
    bg: '#a8d4d1',
    bgSoft: '#8ec4c0',
    surface: '#6fb0ac',
    primary: '#458588',
    primaryDark: '#076678',
  },
};

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private timer = inject(TimerService);

  constructor() {
    effect(() => {
      this.applyTheme(this.timer.mode());
    });
  }

  private applyTheme(mode: TimerMode): void {
    const colors = THEMES[mode];
    const root = document.documentElement.style;

    root.setProperty('--color-gv-bg', colors.bg);
    root.setProperty('--color-gv-bg-soft', colors.bgSoft);
    root.setProperty('--color-gv-surface', colors.surface);
    root.setProperty('--color-gv-primary', colors.primary);
    root.setProperty('--color-gv-primary-dark', colors.primaryDark);
  }
}
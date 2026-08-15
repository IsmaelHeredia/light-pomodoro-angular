import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { StorageService } from './storage.service';
import { SettingsService } from './settings.service';
import { NotificationService } from './notification.service';
import { TimerMode } from '../../shared/models/timer-mode.type';

interface PersistedTimerState {
  mode: TimerMode;
  isRunning: boolean;
  endTime: number | null;
  remainingMs: number;
  completedPomodoros: number;
}

const STORAGE_KEY = 'timer_state';

const DEFAULT_STATE: PersistedTimerState = {
  mode: 'pomodoro',
  isRunning: false,
  endTime: null,
  remainingMs: 0,
  completedPomodoros: 0,
};

@Injectable({ providedIn: 'root' })
export class TimerService {
  private storage = inject(StorageService);
  private settings = inject(SettingsService);
  private notifications = inject(NotificationService);

  private intervalId: ReturnType<typeof setInterval> | null = null;

  private readonly state = signal<PersistedTimerState>(this.buildInitialState());

  readonly mode = computed(() => this.state().mode);
  readonly isRunning = computed(() => this.state().isRunning);
  readonly completedPomodoros = computed(() => this.state().completedPomodoros);

  readonly remainingMs = signal<number>(0);

  readonly minutes = computed(() => Math.floor(this.remainingMs() / 60000));
  readonly seconds = computed(() => Math.floor((this.remainingMs() % 60000) / 1000));

  constructor() {
    this.recalculateRemaining();

    if (this.state().isRunning) {
      this.startInterval();
    }

    effect(() => {
      this.storage.set(STORAGE_KEY, this.state());
    });
  }

  private buildInitialState(): PersistedTimerState {
    const saved = this.storage.get<PersistedTimerState>(STORAGE_KEY, DEFAULT_STATE);

    if (saved.isRunning && saved.endTime && saved.endTime < Date.now()) {
      return {
        ...saved,
        isRunning: false,
        remainingMs: this.durationForMode(saved.mode),
        endTime: null,
      };
    }

    if (!saved.isRunning && saved.remainingMs <= 0) {
      return { ...saved, remainingMs: this.durationForMode(saved.mode) };
    }

    return saved;
  }

  private recalculateRemaining(): void {
    const s = this.state();
    if (s.isRunning && s.endTime) {
      const diff = s.endTime - Date.now();
      this.remainingMs.set(Math.max(diff, 0));
    } else {
      this.remainingMs.set(s.remainingMs);
    }
  }

  private durationForMode(mode: TimerMode): number {
    const cfg = this.settings.settings();
    const minutesMap: Record<TimerMode, number> = {
      pomodoro: cfg.pomodoro,
      shortBreak: cfg.shortBreak,
      longBreak: cfg.longBreak,
    };
    return minutesMap[mode] * 60 * 1000;
  }

  start(): void {
    this.notifications.requestPermission();

    const s = this.state();
    const duration = s.remainingMs > 0 ? s.remainingMs : this.durationForMode(s.mode);

    this.state.update(current => ({
      ...current,
      isRunning: true,
      endTime: Date.now() + duration,
      remainingMs: duration,
    }));

    this.startInterval();
  }

  pause(): void {
    this.clearInterval();
    this.state.update(current => ({
      ...current,
      isRunning: false,
      endTime: null,
      remainingMs: this.remainingMs(),
    }));
  }

  reset(): void {
    this.clearInterval();
    const duration = this.durationForMode(this.state().mode);
    this.state.update(current => ({
      ...current,
      isRunning: false,
      endTime: null,
      remainingMs: duration,
    }));
    this.remainingMs.set(duration);
  }

  switchMode(mode: TimerMode): void {
    this.clearInterval();
    const duration = this.durationForMode(mode);
    this.state.update(current => ({
      ...current,
      mode,
      isRunning: false,
      endTime: null,
      remainingMs: duration,
    }));
    this.remainingMs.set(duration);
  }

  private startInterval(): void {
    this.clearInterval();
    this.intervalId = setInterval(() => {
      this.recalculateRemaining();
      if (this.remainingMs() <= 0) {
        this.handleCompletion();
      }
    }, 250);
  }

  private clearInterval(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private handleCompletion(): void {
    this.clearInterval();

    const s = this.state();
    const cfg = this.settings.settings();

    const completedModeLabel: Record<TimerMode, string> = {
      pomodoro: 'Pomodoro completado',
      shortBreak: 'Descanso Corto completado',
      longBreak: 'Descanso Largo completado',
    };

    this.notifications.notifyCycleComplete(
      completedModeLabel[s.mode],
      s.mode === 'pomodoro' ? '¡Hora de un descanso!' : '¡Volvamos a enfocarnos!'
    );

    let nextMode: TimerMode;
    let nextCompleted = s.completedPomodoros;

    if (s.mode === 'pomodoro') {
      nextCompleted += 1;
      const isLongBreakTime = nextCompleted % cfg.longBreakInterval === 0;
      nextMode = isLongBreakTime ? 'longBreak' : 'shortBreak';
    } else {
      nextMode = 'pomodoro';
    }

    const duration = this.durationForMode(nextMode);
    const shouldAutoStart =
      nextMode === 'pomodoro' ? cfg.autoStartPomodoros : cfg.autoStartBreaks;

    this.state.update(current => ({
      ...current,
      mode: nextMode,
      completedPomodoros: nextCompleted,
      isRunning: shouldAutoStart,
      endTime: shouldAutoStart ? Date.now() + duration : null,
      remainingMs: duration,
    }));

    this.remainingMs.set(duration);

    if (shouldAutoStart) {
      this.startInterval();
    }
  }
}
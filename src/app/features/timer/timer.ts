import { Component, inject } from '@angular/core';
import { TimerService } from '../../core/services/timer.service';
import { SettingsService } from '../../core/services/settings.service';
import { TimerMode } from '../../shared/models/timer-mode.type';

@Component({
  selector: 'app-timer',
  imports: [],
  templateUrl: './timer.html',
})
export class TimerComponent {
  timer = inject(TimerService);
  settingsService = inject(SettingsService);

  readonly modes: { key: TimerMode; label: string }[] = [
    { key: 'pomodoro', label: 'Pomodoro' },
    { key: 'shortBreak', label: 'Descanso Corto' },
    { key: 'longBreak', label: 'Descanso Largo' },
  ];

  pad(value: number): string {
    return value.toString().padStart(2, '0');
  }

  onToggleStart(): void {
    this.timer.isRunning() ? this.timer.pause() : this.timer.start();
  }

  onSelectMode(mode: TimerMode): void {
    this.timer.switchMode(mode);
  }

  onOpenSettings(): void {
    this.settingsService.open();
  }
}
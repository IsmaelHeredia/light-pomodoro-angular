import { Component, inject, signal, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SettingsService } from '../../../core/services/settings.service';
import { Settings } from '../../../shared/models/settings.model';

@Component({
  selector: 'app-settings-modal',
  imports: [FormsModule],
  templateUrl: './settings-modal.html',
})
export class SettingsModalComponent {
  settingsService = inject(SettingsService);

  draft = signal<Settings>({ ...this.settingsService.settings() });

  constructor() {
    effect(() => {
      if (this.settingsService.isOpen()) {
        this.draft.set({ ...this.settingsService.settings() });
      }
    });
  }

  updateDraft<K extends keyof Settings>(key: K, value: Settings[K]): void {
    this.draft.update(current => ({ ...current, [key]: value }));
  }

  onNumberChange(key: keyof Settings, rawValue: string): void {
    const parsed = Math.floor(Number(rawValue));
    const safeValue = Number.isFinite(parsed) && parsed >= 1 ? parsed : 1;
    this.updateDraft(key, safeValue as Settings[typeof key]);
  }

  onSave(): void {
    this.settingsService.update(this.draft());
    this.settingsService.close();
  }

  onCancel(): void {
    this.settingsService.close();
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.onCancel();
    }
  }
}
import { Injectable, signal, effect, inject } from '@angular/core';
import { StorageService } from './storage.service';
import { Settings, DEFAULT_SETTINGS } from '../../shared/models/settings.model';

const STORAGE_KEY = 'settings';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private storage = inject(StorageService);

  readonly settings = signal<Settings>(
    this.storage.get<Settings>(STORAGE_KEY, DEFAULT_SETTINGS)
  );

  readonly isOpen = signal(false);

  constructor() {
    effect(() => {
      this.storage.set(STORAGE_KEY, this.settings());
    });
  }

  update(partial: Partial<Settings>): void {
    this.settings.update(current => ({ ...current, ...partial }));
  }

  reset(): void {
    this.settings.set(DEFAULT_SETTINGS);
  }

  open(): void {
    this.isOpen.set(true);
  }

  close(): void {
    this.isOpen.set(false);
  }
}
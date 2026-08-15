import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private audio: HTMLAudioElement | null = null;
  private permissionRequested = false;

  constructor() {
    this.audio = new Audio('/sounds/notification.mp3');
    this.audio.volume = 1.0;
    this.audio.load();
  }

  requestPermission(): void {
    if (this.permissionRequested) return;
    this.permissionRequested = true;

    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }

  notifyCycleComplete(title: string, body: string): void {
    this.playSound();
    this.showBrowserNotification(title, body);
  }

  private playSound(): void {
    if (!this.audio) return;
    try {
      this.audio.currentTime = 0;
      this.audio.volume = 1.0;
      void this.audio.play();
    } catch {
    }
  }

  private showBrowserNotification(title: string, body: string): void {
    if (document.visibilityState === 'visible') return;

    if (!('Notification' in window)) return;
    if (Notification.permission !== 'granted') return;

    try {
      new Notification(title, {
        body,
        icon: '/sounds/pomodoro-icon.png',
      });
    } catch {
    }
  }
}
import { Component, inject } from '@angular/core';
import { TimerComponent } from './features/timer/timer';
import { TaskListComponent } from './features/tasks/task-list/task-list';
import { SettingsModalComponent } from './features/settings/settings-modal/settings-modal';
import { AboutModalComponent } from './features/about/about-modal/about-modal';
import { ThemeService } from './core/services/theme.service';
import { AboutService } from './core/services/about.service';

@Component({
  selector: 'app-root',
  imports: [TimerComponent, TaskListComponent, SettingsModalComponent, AboutModalComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private theme = inject(ThemeService);
  aboutService = inject(AboutService);

  onOpenAbout(): void {
    this.aboutService.open();
  }
}
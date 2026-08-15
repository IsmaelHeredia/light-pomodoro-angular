import { Component, inject } from '@angular/core';
import { AboutService } from '../../../core/services/about.service';

@Component({
  selector: 'app-about-modal',
  imports: [],
  templateUrl: './about-modal.html',
})
export class AboutModalComponent {
  aboutService = inject(AboutService);

  readonly appName = 'Light Pomodoro';
  readonly version = '1.0.0';
  readonly description =
    'Un temporizador Pomodoro minimalista con gestión de tareas, inspirado en la paleta Gruvbox Light. Sin cuentas, sin backend: todo tu progreso vive en tu navegador.';
  readonly author = 'Ismael Heredia';

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.aboutService.close();
    }
  }
}
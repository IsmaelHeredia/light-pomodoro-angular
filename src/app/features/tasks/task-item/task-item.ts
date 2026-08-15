import { Component, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { TasksService } from '../../../core/services/tasks.service';
import { Task } from '../../../shared/models/task.model';

@Component({
  selector: 'app-task-item',
  imports: [FormsModule, CdkDrag, CdkDragHandle],
  templateUrl: './task-item.html',
})
export class TaskItemComponent {
  private tasksService = inject(TasksService);

  task = input.required<Task>();

  isEditing = signal(false);
  editValue = signal('');

  startEdit(): void {
    this.editValue.set(this.task().name);
    this.isEditing.set(true);
  }

  confirmEdit(): void {
    this.tasksService.edit(this.task().id, this.editValue());
    this.isEditing.set(false);
  }

  cancelEdit(): void {
    this.isEditing.set(false);
  }

  toggle(): void {
    this.tasksService.toggleCompleted(this.task().id);
  }

  remove(): void {
    this.tasksService.delete(this.task().id);
  }
}
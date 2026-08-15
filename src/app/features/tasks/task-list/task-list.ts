import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CdkDropList, CdkDropListGroup, CdkDrag, moveItemInArray, CdkDragDrop } from '@angular/cdk/drag-drop';
import { TasksService } from '../../../core/services/tasks.service';
import { TaskItemComponent } from '../task-item/task-item';

@Component({
  selector: 'app-task-list',
  imports: [FormsModule, CdkDropList, TaskItemComponent],
  templateUrl: './task-list.html',
})
export class TaskListComponent {
  tasksService = inject(TasksService);

  newTaskName = signal('');
  isAdding = signal(false);

  onAdd(): void {
    if (!this.newTaskName().trim()) {
      this.isAdding.set(false);
      return;
    }
    this.tasksService.add(this.newTaskName());
    this.newTaskName.set('');
    this.isAdding.set(false);
  }

  onDrop(event: CdkDragDrop<unknown>): void {
    this.tasksService.reorder(event.previousIndex, event.currentIndex);
  }
}
import { Injectable, signal, effect, inject } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { StorageService } from './storage.service';
import { Task } from '../../shared/models/task.model';

const STORAGE_KEY = 'tasks';

@Injectable({ providedIn: 'root' })
export class TasksService {
  private storage = inject(StorageService);

  private readonly _tasks = signal<Task[]>(
    this.storage.get<Task[]>(STORAGE_KEY, [])
  );

  readonly tasks = signal<Task[]>([]);

  constructor() {
    effect(() => {
      const sorted = [...this._tasks()].sort((a, b) => a.order - b.order);
      this.tasks.set(sorted);
    });

    effect(() => {
      this.storage.set(STORAGE_KEY, this._tasks());
    });
  }

  add(name: string): void {
    const trimmed = name.trim();
    if (!trimmed) return;

    const maxOrder = this._tasks().reduce((max, t) => Math.max(max, t.order), -1);

    const newTask: Task = {
      id: uuidv4(),
      name: trimmed,
      completed: false,
      order: maxOrder + 1,
    };

    this._tasks.update(tasks => [...tasks, newTask]);
  }

  edit(id: string, newName: string): void {
    const trimmed = newName.trim();
    if (!trimmed) return;

    this._tasks.update(tasks =>
      tasks.map(t => (t.id === id ? { ...t, name: trimmed } : t))
    );
  }

  toggleCompleted(id: string): void {
    this._tasks.update(tasks =>
      tasks.map(t => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }

  delete(id: string): void {
    this._tasks.update(tasks => tasks.filter(t => t.id !== id));
  }

  reorder(previousIndex: number, currentIndex: number): void {
    const current = [...this.tasks()];
    const [moved] = current.splice(previousIndex, 1);
    current.splice(currentIndex, 0, moved);

    const reordered = current.map((task, index) => ({ ...task, order: index }));
    this._tasks.set(reordered);
  }

  clearCompleted(): void {
    this._tasks.update(tasks => tasks.filter(t => !t.completed));
  }
}
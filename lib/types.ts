export interface TaskItem {
  id: number;
  name: string;
}

export interface CategoryWithTasks {
  id: number;
  name: string;
  tasks: TaskItem[];
}

export interface TimeLogEntry {
  id: number;
  hours: number;
  date: string;
  category: { name: string };
  task: { name: string };
  categoryId: number;
  taskId: number;
}

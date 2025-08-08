export type TaskStatus = 'todo' | 'progress' | 'review' | 'completed';
export type Priority = 'low' | 'medium' | 'high';
export type ItemType = 'task' | 'event';

export interface TaskItem {
  id: string;
  title: string;
  description?: string;
  type: ItemType;
  status: TaskStatus;
  priority: Priority;
  startDate: Date;
  endDate: Date;
  assignees: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CalendarFilters {
  categories: string[];
  duration: 'week1' | 'week2' | 'week3' | 'all';
  status: TaskStatus[];
}

export interface DragData {
  itemId: string;
  originalDate: Date;
  isResizing?: 'start' | 'end';
}
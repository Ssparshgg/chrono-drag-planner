import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { TaskItem, CalendarFilters, TaskStatus, Priority } from '../types/planner';

interface PlannerState {
  tasks: TaskItem[];
  filters: CalendarFilters;
  selectedTask: TaskItem | null;
  isCreateModalOpen: boolean;
  isDetailDrawerOpen: boolean;
  isFilterSidebarOpen: boolean;
  currentDate: Date;
  selectedDateRange: { start: Date; end: Date } | null;
}

type PlannerAction =
  | { type: 'SET_TASKS'; payload: TaskItem[] }
  | { type: 'ADD_TASK'; payload: TaskItem }
  | { type: 'UPDATE_TASK'; payload: { id: string; updates: Partial<TaskItem> } }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'SET_FILTERS'; payload: Partial<CalendarFilters> }
  | { type: 'SET_SELECTED_TASK'; payload: TaskItem | null }
  | { type: 'TOGGLE_CREATE_MODAL'; payload?: boolean }
  | { type: 'TOGGLE_DETAIL_DRAWER'; payload?: boolean }
  | { type: 'TOGGLE_FILTER_SIDEBAR'; payload?: boolean }
  | { type: 'SET_CURRENT_DATE'; payload: Date }
  | { type: 'SET_DATE_RANGE'; payload: { start: Date; end: Date } | null };

const initialState: PlannerState = {
  tasks: [],
  filters: {
    categories: [],
    duration: 'all',
    status: ['todo', 'progress', 'review', 'completed'],
  },
  selectedTask: null,
  isCreateModalOpen: false,
  isDetailDrawerOpen: false,
  isFilterSidebarOpen: false,
  currentDate: new Date(),
  selectedDateRange: null,
};

// Sample data for August 2025
const sampleTasks: TaskItem[] = [
  {
    id: 'task-1',
    title: 'new task',
    description: '',
    type: 'task',
    status: 'todo',
    priority: 'medium',
    startDate: new Date(2025, 7, 5), // Aug 5, 2025
    endDate: new Date(2025, 7, 8), // Aug 8, 2025
    assignees: [],
    createdBy: 'Random user',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'task-2',
    title: 'hjkhjkh',
    description: '',
    type: 'task',
    status: 'completed',
    priority: 'low',
    startDate: new Date(2025, 7, 9), // Aug 9, 2025
    endDate: new Date(2025, 7, 9), // Aug 9, 2025
    assignees: [],
    createdBy: 'Random user',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

function plannerReducer(state: PlannerState, action: PlannerAction): PlannerState {
  switch (action.type) {
    case 'SET_TASKS':
      return { ...state, tasks: action.payload };
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? { ...task, ...action.payload.updates } : task
        ),
      };
    case 'DELETE_TASK':
      return { ...state, tasks: state.tasks.filter(task => task.id !== action.payload) };
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case 'SET_SELECTED_TASK':
      return { ...state, selectedTask: action.payload };
    case 'TOGGLE_CREATE_MODAL':
      return { ...state, isCreateModalOpen: action.payload ?? !state.isCreateModalOpen };
    case 'TOGGLE_DETAIL_DRAWER':
      return { ...state, isDetailDrawerOpen: action.payload ?? !state.isDetailDrawerOpen };
    case 'TOGGLE_FILTER_SIDEBAR':
      return { ...state, isFilterSidebarOpen: action.payload ?? !state.isFilterSidebarOpen };
    case 'SET_CURRENT_DATE':
      return { ...state, currentDate: action.payload };
    case 'SET_DATE_RANGE':
      return { ...state, selectedDateRange: action.payload };
    default:
      return state;
  }
}

const PlannerContext = createContext<{
  state: PlannerState;
  dispatch: React.Dispatch<PlannerAction>;
} | null>(null);

export function PlannerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(plannerReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('planner-tasks');
    if (savedTasks) {
      try {
        const tasks = JSON.parse(savedTasks).map((task: any) => ({
          ...task,
          startDate: new Date(task.startDate),
          endDate: new Date(task.endDate),
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt),
        }));
        dispatch({ type: 'SET_TASKS', payload: tasks });
      } catch (error) {
        console.error('Failed to load tasks from localStorage:', error);
        dispatch({ type: 'SET_TASKS', payload: sampleTasks });
      }
    } else {
      dispatch({ type: 'SET_TASKS', payload: sampleTasks });
    }
  }, []);

  // Save to localStorage when tasks change
  useEffect(() => {
    if (state.tasks.length > 0) {
      localStorage.setItem('planner-tasks', JSON.stringify(state.tasks));
    }
  }, [state.tasks]);

  return (
    <PlannerContext.Provider value={{ state, dispatch }}>
      {children}
    </PlannerContext.Provider>
  );
}

export function usePlanner() {
  const context = useContext(PlannerContext);
  if (!context) {
    throw new Error('usePlanner must be used within a PlannerProvider');
  }
  return context;
}
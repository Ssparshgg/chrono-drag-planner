import React from 'react';
import { CalendarHeader } from './CalendarHeader';
import { CalendarGrid } from './CalendarGrid';
import { CreateItemModal } from './CreateItemModal';
import { TaskDetailDrawer } from './TaskDetailDrawer';
import { FilterSidebar } from './FilterSidebar';
import { PlannerProvider } from '../contexts/PlannerContext';

export function MonthViewPlanner() {
  return (
    <PlannerProvider>
      <div className="h-screen bg-[#0F0F0F] flex overflow-hidden">
        {/* Filter Sidebar */}
        <FilterSidebar />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          <CalendarHeader />
          <CalendarGrid />
        </div>
        
        {/* Task Detail Drawer */}
        <TaskDetailDrawer />
        
        {/* Create Item Modal */}
        <CreateItemModal />
      </div>
    </PlannerProvider>
  );
}
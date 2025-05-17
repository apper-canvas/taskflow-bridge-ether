import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { getIcon } from '../utils/iconUtils';

const KanbanTaskCard = ({ task, index, provided, snapshot, getPriorityColor, handleEditTask, setShowTaskDetails }) => {
  const CalendarIcon = getIcon('Calendar');
  const FolderIcon = getIcon('Folder');
  const PencilIcon = getIcon('Pencil');

  return (
    <motion.div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className={`neu-card p-4 rounded-lg border border-surface-200 dark:border-surface-700 cursor-pointer flex flex-col space-y-2 ${
        snapshot.isDragging ? 'shadow-xl' : 'shadow-sm'
      } transition-shadow duration-200 ease-in-out hover:shadow-md`}
      onClick={() => setShowTaskDetails(task)} // Open details on card click
    >
      <div className="flex items-start justify-between">
        <div className={`w-2 h-2 ${getPriorityColor(task.priority)} rounded-full mr-2 mt-2 flex-shrink-0`}></div>
        <div className="flex-grow min-w-0">
          <h4 className="text-md font-semibold text-surface-800 dark:text-surface-200 truncate mb-1">
            {task.title}
          </h4>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-surface-600 dark:text-surface-400">
            <span className="flex items-center">
              <CalendarIcon className="w-3 h-3 mr-1" />
              {format(new Date(task.dueDate), 'MMM d, yyyy')}
            </span>
            <span className="flex items-center">
              <FolderIcon className="w-3 h-3 mr-1" />
              {task.project || 'General'}
            </span>
          </div>
        </div>
        {/* Edit button removed from card for simplicity, use modal for editing */}
      </div>
      {/* Status badge is handled by column rendering */}
    </motion.div>
  );
};

export default KanbanTaskCard;

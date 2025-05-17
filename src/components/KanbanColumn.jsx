import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import KanbanTaskCard from './KanbanTaskCard';
import { motion } from 'framer-motion';

const KanbanColumn = ({ column, tasks, getPriorityColor, getStatusBadge, handleEditTask, setShowTaskDetails }) => {
  const columnVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      className="flex-1 min-w-[300px] max-w-[400px] w-full bg-surface-100 dark:bg-surface-800 rounded-lg p-4 shadow-md flex flex-col"
      variants={columnVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.3 }}
    >
      <h3 className="text-lg font-semibold text-surface-800 dark:text-surface-200 mb-4 border-b border-surface-200 dark:border-surface-700 pb-2">
        {column.title} <span className="ml-1 text-sm font-normal text-surface-500 dark:text-surface-400">({tasks.length})</span>
      </h3>
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`flex-1 min-h-[100px] p-2 rounded-md transition-colors duration-200 ${
              snapshot.isDraggingOver ? 'bg-surface-200 dark:bg-surface-700' : 'bg-surface-100 dark:bg-surface-800'
            }`}
          >
            {tasks.length > 0 ? (
              <div className="space-y-3">
                {tasks.map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided, snapshot) => (
                      <KanbanTaskCard
                        task={task}
                        index={index}
                        provided={provided}
                        snapshot={snapshot}
                        getPriorityColor={getPriorityColor}
                        getStatusBadge={getStatusBadge}
                        handleEditTask={handleEditTask}
                        setShowTaskDetails={setShowTaskDetails}
                      />
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            ) : (
              <div className="text-center text-surface-500 dark:text-surface-400 p-4">
                No tasks here.
              </div>
            )}
             {/* Render placeholder outside if tasks list is empty */}
            {tasks.length === 0 && provided.placeholder}
          </div>
        )}
      </Droppable>
    </motion.div>
  );
};

export default KanbanColumn;

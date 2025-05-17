import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';

const MainFeature = () => {
  // Initial data with 3 sample tasks
  const initialTasks = [
    {
      id: '1',
      title: 'Complete project proposal',
      description: 'Draft the initial proposal for the new client project',
      dueDate: new Date(Date.now() + 86400000 * 3), // 3 days from now
      status: 'in-progress',
      priority: 'high',
      project: 'Work'
    },
    {
      id: '2',
      title: 'Weekly grocery shopping',
      description: 'Buy fruits, vegetables, and other essentials',
      dueDate: new Date(Date.now() + 86400000), // 1 day from now
      status: 'not-started',
      priority: 'medium',
      project: 'Personal'
    },
    {
      id: '3',
      title: 'Call the internet provider',
      description: 'Discuss the recent connection issues and possible solutions',
      dueDate: new Date(Date.now() + 86400000 * 2), // 2 days from now
      status: 'not-started',
      priority: 'low',
      project: 'Home'
    }
  ];

  // State declarations
  const [tasks, setTasks] = useState(() => {
    // Get tasks from localStorage if available
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : initialTasks;
  });
  
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState('not-started');
  const [priority, setPriority] = useState('medium');
  const [project, setProject] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('dueDate');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [showTaskDetails, setShowTaskDetails] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const modalRef = useRef(null);

  // Save tasks to localStorage when they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Handle click outside the modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowTaskDetails(null);
        if (showAddTaskForm && !editingTaskId) {
          setShowAddTaskForm(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAddTaskForm, editingTaskId]);

  // Format date string for input
  const formatDateForInput = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Add new task handler
  const handleAddTask = () => {
    if (!title.trim()) {
      toast.error('Task title is required');
      return;
    }
    
    if (!dueDate) {
      toast.error('Due date is required');
      return;
    }

    const newTask = {
      id: editingTaskId || Date.now().toString(),
      title,
      description,
      dueDate: new Date(dueDate),
      status,
      priority,
      project: project || 'General'
    };

    if (editingTaskId) {
      setTasks(tasks.map(task => task.id === editingTaskId ? newTask : task));
      toast.success('Task updated successfully');
      setEditingTaskId(null);
    } else {
      setTasks([...tasks, newTask]);
      toast.success('Task added successfully');
    }

    // Reset form
    setTitle('');
    setDescription('');
    setDueDate('');
    setStatus('not-started');
    setPriority('medium');
    setProject('');
    setShowAddTaskForm(false);
  };

  // Delete task handler
  const handleDeleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
    setShowTaskDetails(null);
    toast.success('Task deleted successfully');
  };

  // Edit task handler
  const handleEditTask = (task) => {
    setTitle(task.title);
    setDescription(task.description);
    setDueDate(formatDateForInput(task.dueDate));
    setStatus(task.status);
    setPriority(task.priority);
    setProject(task.project);
    setEditingTaskId(task.id);
    setShowAddTaskForm(true);
    setShowTaskDetails(null);
  };

  // Update task status handler
  const handleStatusChange = (taskId, newStatus) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, status: newStatus } 
        : task
    ));
    toast.info(`Task status updated to ${newStatus.replace('-', ' ')}`);
  };

  // Cancel form handler
  const handleCancel = () => {
    setTitle('');
    setDescription('');
    setDueDate('');
    setStatus('not-started');
    setPriority('medium');
    setProject('');
    setEditingTaskId(null);
    setShowAddTaskForm(false);
  };

  // Get filtered and sorted tasks
  const getFilteredTasks = () => {
    // Filter tasks
    let filteredTasks = tasks;
    
    if (filter !== 'all') {
      filteredTasks = tasks.filter(task => task.status === filter);
    }

    // Apply search filter if there is a search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filteredTasks = filteredTasks.filter(task => 
        task.title.toLowerCase().includes(term) || 
        task.description.toLowerCase().includes(term) ||
        task.project.toLowerCase().includes(term)
      );
    }

    // Sort tasks
    return filteredTasks.sort((a, b) => {
      if (sort === 'dueDate') {
        return new Date(a.dueDate) - new Date(b.dueDate);
      } else if (sort === 'priority') {
        const priorityOrder = { 'high': 0, 'medium': 1, 'low': 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      } else if (sort === 'title') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  };

  // Get unique project names
  const projectList = [...new Set(tasks.map(task => task.project))].sort();

  // Icons
  const PlusIcon = getIcon('Plus');
  const CheckCircleIcon = getIcon('CheckCircle');
  const ClockIcon = getIcon('Clock');
  const XCircleIcon = getIcon('XCircle');
  const FlagIcon = getIcon('Flag');
  const FolderIcon = getIcon('Folder');
  const CalendarIcon = getIcon('Calendar');
  const TrashIcon = getIcon('Trash');
  const PencilIcon = getIcon('Pencil');
  const ChevronRightIcon = getIcon('ChevronRight');
  const ArrowUpIcon = getIcon('ArrowUp');
  const ArrowDownIcon = getIcon('ArrowDown');
  const FilterIcon = getIcon('Filter');
  const XIcon = getIcon('X');
  const SearchIcon = getIcon('Search');

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05 
      }
    }
  };

  const taskVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0,
      x: -10,
      transition: { duration: 0.2 }
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <CheckCircleIcon className="w-3 h-3 mr-1" />
            Completed
          </span>
        );
      case 'in-progress':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            <ClockIcon className="w-3 h-3 mr-1" />
            In Progress
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
            <XCircleIcon className="w-3 h-3 mr-1" />
            Not Started
          </span>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header with controls */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-surface-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-surface-300 dark:border-surface-700 rounded-lg focus:ring-primary focus:border-primary dark:bg-surface-800"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center">
            <label htmlFor="filter" className="mr-2 text-sm font-medium text-surface-700 dark:text-surface-300">
              <FilterIcon className="w-4 h-4 inline mr-1" />
              Status:
            </label>
            <select
              id="filter"
              className="block w-full sm:w-auto rounded-lg border border-surface-300 dark:border-surface-700 py-1.5 text-surface-700 dark:text-surface-300 bg-white dark:bg-surface-800"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="not-started">Not Started</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="flex items-center">
            <label htmlFor="sort" className="mr-2 text-sm font-medium text-surface-700 dark:text-surface-300">
              Sort by:
            </label>
            <select
              id="sort"
              className="block w-full sm:w-auto rounded-lg border border-surface-300 dark:border-surface-700 py-1.5 text-surface-700 dark:text-surface-300 bg-white dark:bg-surface-800"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
              <option value="title">Title</option>
            </select>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn btn-primary flex items-center justify-center"
          onClick={() => {
            setShowAddTaskForm(true);
            setEditingTaskId(null);
          }}
        >
          <PlusIcon className="w-5 h-5 mr-1" />
          <span>Add Task</span>
        </motion.button>
      </div>

      {/* Tasks list */}
      {getFilteredTasks().length > 0 ? (
        <motion.div 
          className="neu-card mb-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-xl font-bold mb-4 text-surface-800 dark:text-surface-100">
            {filter === 'all' ? 'All Tasks' : filter === 'completed' ? 'Completed Tasks' : filter === 'in-progress' ? 'In Progress Tasks' : 'Not Started Tasks'}
            <span className="ml-2 text-sm font-normal text-surface-500">({getFilteredTasks().length})</span>
          </h2>
          
          <div className="space-y-3">
            <AnimatePresence>
              {getFilteredTasks().map(task => (
                <motion.div
                  key={task.id}
                  variants={taskVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="task-item p-4 flex flex-col sm:flex-row sm:items-center gap-3 border-b border-surface-200 dark:border-surface-700 last:border-0"
                  onClick={() => setShowTaskDetails(task)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start">
                      <div className={`w-2 h-2 mt-2 ${getPriorityColor(task.priority)} rounded-full mr-2`}></div>
                      <div>
                        <h3 className="text-lg font-semibold text-surface-800 dark:text-surface-200 truncate">
                          {task.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-surface-600 dark:text-surface-400">
                          <span className="flex items-center">
                            <CalendarIcon className="w-3.5 h-3.5 mr-1" />
                            {format(new Date(task.dueDate), 'MMM d, yyyy')}
                          </span>
                          <span className="flex items-center">
                            <FolderIcon className="w-3.5 h-3.5 mr-1" />
                            {task.project}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between sm:justify-end gap-2">
                    <div>{getStatusBadge(task.status)}</div>
                    <button 
                      className="p-1 text-surface-400 hover:text-surface-600 dark:hover:text-surface-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditTask(task);
                      }}
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <ChevronRightIcon className="w-5 h-5 text-surface-400" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      ) : (
        <motion.div 
          className="neu-card p-10 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="p-3 bg-surface-200 dark:bg-surface-700 rounded-full">
              <ClockIcon className="w-8 h-8 text-surface-500 dark:text-surface-400" />
            </div>
            <h3 className="text-xl font-medium text-surface-800 dark:text-surface-200">No tasks found</h3>
            <p className="text-surface-600 dark:text-surface-400 max-w-md">
              {searchTerm 
                ? `No tasks match your search for "${searchTerm}"`
                : filter !== 'all' 
                  ? `You don't have any ${filter.replace('-', ' ')} tasks`
                  : "You don't have any tasks yet. Add your first task to get started!"}
            </p>
            {searchTerm && (
              <button 
                className="btn btn-outline mt-2"
                onClick={() => setSearchTerm('')}
              >
                Clear search
              </button>
            )}
          </div>
        </motion.div>
      )}

      {/* Add/Edit Task Modal */}
      <AnimatePresence>
        {showAddTaskForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              ref={modalRef}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-surface-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden"
            >
              <div className="p-5 border-b border-surface-200 dark:border-surface-700 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-surface-800 dark:text-surface-100">
                  {editingTaskId ? 'Edit Task' : 'Add New Task'}
                </h2>
                <button
                  className="text-surface-500 hover:text-surface-700 dark:hover:text-surface-300"
                  onClick={handleCancel}
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-5 space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    className="w-full"
                    placeholder="Task title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    rows="3"
                    className="w-full"
                    placeholder="Task description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="dueDate" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Due Date *
                    </label>
                    <input
                      type="date"
                      id="dueDate"
                      className="w-full"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Priority
                    </label>
                    <select
                      id="priority"
                      className="w-full"
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Status
                    </label>
                    <select
                      id="status"
                      className="w-full"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="not-started">Not Started</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="project" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Project
                    </label>
                    <input
                      type="text"
                      id="project"
                      className="w-full"
                      list="projectList"
                      placeholder="Project name"
                      value={project}
                      onChange={(e) => setProject(e.target.value)}
                    />
                    <datalist id="projectList">
                      {projectList.map((proj, index) => (
                        <option key={index} value={proj} />
                      ))}
                    </datalist>
                  </div>
                </div>
              </div>
              
              <div className="px-5 py-4 bg-surface-50 dark:bg-surface-900 flex justify-end space-x-3">
                <button
                  className="btn btn-outline"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleAddTask}
                >
                  {editingTaskId ? 'Update Task' : 'Add Task'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Task Details Modal */}
      <AnimatePresence>
        {showTaskDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              ref={modalRef}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-surface-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden"
            >
              <div className="p-5 border-b border-surface-200 dark:border-surface-700 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-surface-800 dark:text-surface-100 truncate pr-6">
                  {showTaskDetails.title}
                </h2>
                <button
                  className="text-surface-500 hover:text-surface-700 dark:hover:text-surface-300"
                  onClick={() => setShowTaskDetails(null)}
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-5">
                <div className="space-y-4">
                  {showTaskDetails.description && (
                    <div>
                      <h3 className="text-sm font-medium text-surface-500 dark:text-surface-400 mb-1">Description</h3>
                      <p className="text-surface-800 dark:text-surface-200">
                        {showTaskDetails.description}
                      </p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-surface-500 dark:text-surface-400 mb-1">Due Date</h3>
                      <p className="text-surface-800 dark:text-surface-200 flex items-center">
                        <CalendarIcon className="w-4 h-4 mr-1 text-primary" />
                        {format(new Date(showTaskDetails.dueDate), 'MMM d, yyyy')}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-surface-500 dark:text-surface-400 mb-1">Priority</h3>
                      <p className="text-surface-800 dark:text-surface-200 flex items-center">
                        <FlagIcon className="w-4 h-4 mr-1 text-primary" />
                        {showTaskDetails.priority.charAt(0).toUpperCase() + showTaskDetails.priority.slice(1)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-surface-500 dark:text-surface-400 mb-1">Project</h3>
                      <p className="text-surface-800 dark:text-surface-200 flex items-center">
                        <FolderIcon className="w-4 h-4 mr-1 text-primary" />
                        {showTaskDetails.project}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-surface-500 dark:text-surface-400 mb-1">Status</h3>
                      <div>{getStatusBadge(showTaskDetails.status)}</div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-surface-200 dark:border-surface-700">
                    <h3 className="text-sm font-medium text-surface-500 dark:text-surface-400 mb-2">Change Status</h3>
                    <div className="flex flex-wrap gap-2">
                      <button
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                          showTaskDetails.status === 'not-started'
                            ? 'bg-surface-200 dark:bg-surface-700 text-surface-800 dark:text-surface-200'
                            : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-700'
                        }`}
                        onClick={() => handleStatusChange(showTaskDetails.id, 'not-started')}
                        disabled={showTaskDetails.status === 'not-started'}
                      >
                        Not Started
                      </button>
                      <button
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                          showTaskDetails.status === 'in-progress'
                            ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                            : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-700'
                        }`}
                        onClick={() => handleStatusChange(showTaskDetails.id, 'in-progress')}
                        disabled={showTaskDetails.status === 'in-progress'}
                      >
                        In Progress
                      </button>
                      <button
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                          showTaskDetails.status === 'completed'
                            ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                            : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-700'
                        }`}
                        onClick={() => handleStatusChange(showTaskDetails.id, 'completed')}
                        disabled={showTaskDetails.status === 'completed'}
                      >
                        Completed
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="px-5 py-4 bg-surface-50 dark:bg-surface-900 flex justify-between">
                <button
                  className="btn btn-outline text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center"
                  onClick={() => handleDeleteTask(showTaskDetails.id)}
                >
                  <TrashIcon className="w-4 h-4 mr-1" />
                  Delete
                </button>
                <button
                  className="btn btn-primary flex items-center"
                  onClick={() => handleEditTask(showTaskDetails)}
                >
                  <PencilIcon className="w-4 h-4 mr-1" />
                  Edit
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MainFeature;
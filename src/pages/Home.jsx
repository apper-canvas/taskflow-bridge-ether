import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getIcon } from '../utils/iconUtils.jsx';
import MainFeature from '../components/MainFeature';

const Home = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  const ListIcon = getIcon('CheckSquare');
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="container mx-auto px-4 py-6 md:py-12">
      <header className="mb-8 md:mb-12">
        <motion.div 
          className="flex items-center justify-center md:justify-start space-x-3"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ListIcon className="h-8 w-8 text-primary" />
          <h1 className="text-3xl md:text-4xl font-bold text-surface-800 dark:text-surface-100">
            TaskFlow
          </h1>
        </motion.div>
        <motion.p 
          className="mt-2 text-center md:text-left text-surface-600 dark:text-surface-400 max-w-2xl mx-auto md:mx-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          Efficiently manage and organize your tasks with our intuitive task management app.
        </motion.p>
      </header>

      {isLoaded ? (
        <MainFeature />
      ) : (
        <motion.div 
          className="flex items-center justify-center p-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-12 h-12 rounded-full border-4 border-surface-300 dark:border-surface-600 border-t-primary animate-spin"></div>
        </motion.div>
      )}

      <motion.footer 
        className="mt-12 pt-6 border-t border-surface-200 dark:border-surface-800 text-center"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.p 
          variants={item}
          className="text-surface-500 dark:text-surface-400 text-sm"
        >
          TaskFlow &copy; {new Date().getFullYear()} - A simple task management application
        </motion.p>
        <motion.div 
          variants={item}
          className="flex justify-center mt-4 space-x-4"
        >
          <a href="#" className="text-surface-500 dark:text-surface-400 hover:text-primary dark:hover:text-primary-light transition-colors">
            About
          </a>
          <a href="#" className="text-surface-500 dark:text-surface-400 hover:text-primary dark:hover:text-primary-light transition-colors">
            Privacy
          </a>
          <a href="#" className="text-surface-500 dark:text-surface-400 hover:text-primary dark:hover:text-primary-light transition-colors">
            Terms
          </a>
        </motion.div>
      </motion.footer>
    </div>
  );
};

export default Home;
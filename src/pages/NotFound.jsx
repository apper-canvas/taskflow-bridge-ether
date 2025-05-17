import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getIcon } from '../utils/iconUtils.jsx';

const NotFound = () => {
  const navigate = useNavigate();
  const AlertOctagon = getIcon('AlertOctagon');
  const HomeIcon = getIcon('Home');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="mb-6 inline-block"
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0] 
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          <AlertOctagon className="w-20 h-20 mx-auto text-primary" />
        </motion.div>
        
        <h1 className="text-4xl md:text-6xl font-bold text-surface-800 dark:text-surface-100 mb-4">
          404
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-surface-700 dark:text-surface-300 mb-6">
          Page Not Found
        </h2>
        <p className="text-surface-600 dark:text-surface-400 max-w-md mx-auto mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <motion.button
          onClick={() => navigate('/')}
          className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-lg shadow-md hover:bg-primary-dark transition-colors duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <HomeIcon className="w-5 h-5 mr-2" />
          Return Home
        </motion.button>
      </motion.div>
    </div>
  );
};

export default NotFound;
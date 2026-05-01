import { useCountUp } from '../../hooks/useCountUp';
import { motion } from 'framer-motion';

const MetricCards = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-lg p-4 text-center"
      >
        <h3 className="text-lg font-semibold text-gray-300">Pre-Registered</h3>
        <div className="text-2xl font-bold mt-2">
          {useCountUp(metrics.total_pre_registered)}
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-lg p-4 text-center"
      >
        <h3 className="text-lg font-semibold text-gray-300">On-Spot</h3>
        <div className="text-2xl font-bold mt-2 text-blue-500">
          {useCountUp(metrics.total_onspot)}
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-lg p-4 text-center"
      >
        <h3 className="text-lg font-semibold text-gray-300">Approved</h3>
        <div className="text-2xl font-bold mt-2 text-green-500">
          {useCountUp(metrics.approved)}
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-lg p-4 text-center"
      >
        <h3 className="text-lg font-semibold text-gray-300">Attended</h3>
        <div className="text-2xl font-bold mt-2 text-emerald-500">
          {useCountUp(metrics.attended)}
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-lg p-4 text-center"
      >
        <h3 className="text-lg font-semibold text-gray-300">Pending</h3>
        <div className="text-2xl font-bold mt-2 text-yellow-500">
          {useCountUp(metrics.pending)}
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-lg p-4 text-center"
      >
        <h3 className="text-lg font-semibold text-gray-300">Rejected</h3>
        <div className="text-2xl font-bold mt-2 text-red-500">
          {useCountUp(metrics.rejected)}
        </div>
      </motion.div>
    </div>
  );
};

export default MetricCards;
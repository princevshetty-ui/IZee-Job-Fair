import { motion } from 'framer-motion'

const AnimatedPage = ({ children, className = '', ...props }) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export default AnimatedPage
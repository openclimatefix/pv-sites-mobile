import { AnimatePresence, motion } from 'framer-motion';
import { FC, PropsWithChildren, useEffect, useState } from 'react';

const Toast: FC<PropsWithChildren> = ({ children }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setTimeout(() => setVisible(false), 2500);
  }, []);

  const variants = {
    hidden: { opacity: 0, x: '100%' },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <AnimatePresence initial>
      {visible && (
        <div className="flex flex-row flex-nowrap items-center gap-1 overflow-hidden">
          <motion.p
            className="flex items-center justify-center gap-2"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={variants}
            transition={{
              duration: 0.5,
              delay: 0.1,
              ease: 'easeInOut',
            }}
          >
            {children}
          </motion.p>

          {/* Toast vertical bar */}
          <motion.div
            className="ml-2 h-[2em] w-[2px] rounded-sm bg-ocf-yellow"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={variants}
            transition={{
              duration: 0.75,
              ease: 'easeOut',
            }}
          />
        </div>
      )}
    </AnimatePresence>
  );
};

export default Toast;

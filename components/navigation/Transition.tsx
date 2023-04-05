import { FC, PropsWithChildren } from 'react';
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  Variants,
} from 'framer-motion';
import { useRouter } from 'next/router';
import useMediaQuery from '~/lib/hooks/useMediaQuery';

const Transition: FC<PropsWithChildren> = ({ children }) => {
  const { asPath } = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const mobile = useMediaQuery('(max-width: 768px)');

  const variants: Variants = {
    out: {
      y: '-50%',
      opacity: 0,
      transition: {
        duration: 0.4,
      },
    },
    in: {
      y: '100%',
      scale: 0.8,
      boxShadow: '10px 10px 0 rgba(0, 0, 0, 0.2)',
      transition: {
        duration: 0.4,
      },
    },
    center: {
      y: 0,
      scale: 1,
      transformOrigin: 'top',
      boxShadow: '',
      transition: {
        duration: 0.4,
        ease: 'easeOut',
      },
    },
  };

  return (
    <div className="effect-1">
      <AnimatePresence initial={false} mode="popLayout">
        <motion.div
          initial="in"
          animate={['center']}
          exit={['out']}
          variants={mobile && !shouldReduceMotion ? variants : {}}
          key={asPath}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Transition;

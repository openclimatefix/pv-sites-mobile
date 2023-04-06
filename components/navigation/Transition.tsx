import {
  AnimatePresence,
  Variants,
  motion,
  useReducedMotion,
} from 'framer-motion';
import { useRouter } from 'next/router';
import { FC, PropsWithChildren } from 'react';
import { useIsSitePage } from '~/lib/hooks/useIsSitePage';
import useMediaQuery from '~/lib/hooks/useMediaQuery';

const Transition: FC<PropsWithChildren> = ({ children }) => {
  const { asPath } = useRouter();
  const isSitePage = useIsSitePage();
  const shouldReduceMotion = useReducedMotion();
  const mobile = useMediaQuery('(max-width: 768px)');
  const animationKey = isSitePage ? asPath : undefined;

  const duration = 0.4;
  const variants: Variants = {
    popRight: {
      x: '100%',
      zIndex: 25,
      boxShadow: '-3px 0 6px 2px rgba(0, 0, 0, 0.4)',
      transition: {
        duration,
      },
    },
    popLeft: {
      x: '-75%',
      zIndex: 15,
      opacity: 0.8,
      transition: {
        duration,
      },
    },
    center: {
      x: 0,
      zIndex: 21,
      opacity: 1,
      transformOrigin: 'top',
      position: 'relative',
      boxShadow: '-3px 0 6px 2px rgba(0, 0, 0, 0.4)',
      transition: {
        duration,
      },
    },
  };

  return (
    <div className="page-transition">
      <AnimatePresence initial={false} mode="popLayout">
        <motion.div
          initial={animationKey ? 'popRight' : 'popLeft'}
          animate={animationKey ? 'center' : 'center'}
          exit={animationKey ? 'popRight' : 'popLeft'}
          variants={mobile && !shouldReduceMotion ? variants : {}}
          key={animationKey}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Transition;

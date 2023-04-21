import {
  AnimatePresence,
  Variants,
  motion,
  useReducedMotion,
} from 'framer-motion';
import { useRouter } from 'next/router';
import { FC, PropsWithChildren } from 'react';
import { useIsMobile, useIsSitePage, useMediaQuery } from '~/lib/utils';

interface Props {
  className?: string;
}

const Transition: FC<PropsWithChildren<Props>> = ({ children, className }) => {
  const { asPath } = useRouter();
  const isSitePage = useIsSitePage();
  const shouldReduceMotion = useReducedMotion();
  const mobile = useIsMobile();
  const animationKey = isSitePage ? asPath : undefined;

  const duration = 0.2;
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
      x: '-25%',
      zIndex: 15,
      opacity: 0.5,
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
    <div className={`page-transiton ${className}`}>
      <AnimatePresence initial={false} mode="popLayout">
        <motion.div
          suppressHydrationWarning
          initial={animationKey ? 'popRight' : 'popLeft'}
          animate={animationKey ? 'center' : 'center'}
          exit={animationKey ? 'popRight' : 'popLeft'}
          variants={mobile && !shouldReduceMotion ? variants : {}}
          key={animationKey}
          className="w-screen overflow-hidden"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Transition;

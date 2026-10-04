'use client';

import { motion } from 'framer-motion';
import React, { ReactNode } from 'react';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  id?: string;
  style?: React.CSSProperties;
}

export function AnimatedSection({ children, className = '', delay = 0, direction = 'up', id, style }: AnimatedSectionProps) {
  const getVariants = () => {
    switch (direction) {
      case 'up': return { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };
      case 'down': return { hidden: { opacity: 0, y: -24 }, visible: { opacity: 1, y: 0 } };
      case 'left': return { hidden: { opacity: 0, x: 24 }, visible: { opacity: 1, x: 0 } };
      case 'right': return { hidden: { opacity: 0, x: -24 }, visible: { opacity: 1, x: 0 } };
      case 'none': return { hidden: { opacity: 0 }, visible: { opacity: 1 } };
    }
  };

  return (
    <motion.div
      id={id}
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '0px' }}
      transition={{ duration: 0.6, delay: delay, ease: [0.16, 1, 0.3, 1] }}
      variants={getVariants()}
      style={style}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedStaggerGroup({ children, className = '', delay = 0, style }: { children: ReactNode, className?: string, delay?: number, style?: React.CSSProperties }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '0px' }}
      style={style}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            delayChildren: delay,
            staggerChildren: 0.08
          }
        }
      }}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedStaggerItem({ children, className = '', style }: { children: ReactNode, className?: string, style?: React.CSSProperties }) {
  return (
    <motion.div
      className={className}
      style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', minWidth: 0, ...style }}
      variants={{
        hidden: { opacity: 0, y: 16 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } }
      }}
    >
      {children}
    </motion.div>
  );
}

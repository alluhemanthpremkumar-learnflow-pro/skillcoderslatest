import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlowTextProps {
  children: ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
  color?: 'blue' | 'purple' | 'gradient';
  animate?: boolean;
}

const GlowText = ({
  children,
  className,
  as: Component = 'span',
  color = 'blue',
  animate = true,
}: GlowTextProps) => {
  const colorStyles = {
    blue: {
      color: 'hsl(199, 89%, 48%)',
      textShadow: `
        0 0 10px hsla(199, 89%, 48%, 0.8),
        0 0 20px hsla(199, 89%, 48%, 0.6),
        0 0 40px hsla(199, 89%, 48%, 0.4),
        0 0 60px hsla(199, 89%, 48%, 0.2)
      `,
    },
    purple: {
      color: 'hsl(262, 83%, 58%)',
      textShadow: `
        0 0 10px hsla(262, 83%, 58%, 0.8),
        0 0 20px hsla(262, 83%, 58%, 0.6),
        0 0 40px hsla(262, 83%, 58%, 0.4),
        0 0 60px hsla(262, 83%, 58%, 0.2)
      `,
    },
    gradient: {
      background: 'linear-gradient(135deg, hsl(262, 83%, 58%), hsl(199, 89%, 48%), hsl(0, 84%, 60%))',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
  };

  const content = (
    <Component
      className={cn('font-bold', className)}
      style={colorStyles[color]}
    >
      {children}
    </Component>
  );

  if (!animate) return content;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {content}
    </motion.div>
  );
};

export default GlowText;

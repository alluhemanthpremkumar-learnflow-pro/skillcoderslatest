import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: 'blue' | 'purple' | 'red' | 'cyan';
  hover?: boolean;
}

const GlowCard = ({
  children,
  className,
  glowColor = 'blue',
  hover = true,
}: GlowCardProps) => {
  const glowColors = {
    blue: 'hsla(199, 89%, 48%, 0.3)',
    purple: 'hsla(262, 83%, 58%, 0.3)',
    red: 'hsla(0, 84%, 60%, 0.3)',
    cyan: 'hsla(187, 92%, 69%, 0.3)',
  };

  const borderColors = {
    blue: 'hsla(199, 89%, 48%, 0.5)',
    purple: 'hsla(262, 83%, 58%, 0.5)',
    red: 'hsla(0, 84%, 60%, 0.5)',
    cyan: 'hsla(187, 92%, 69%, 0.5)',
  };

  return (
    <motion.div
      className={cn(
        "relative bg-card rounded-xl p-6 border border-border overflow-hidden",
        hover && "hover:border-transparent transition-colors duration-300",
        className
      )}
      whileHover={hover ? { scale: 1.02, y: -5 } : undefined}
      transition={{ duration: 0.3 }}
    >
      {/* Gradient border on hover */}
      {hover && (
        <motion.div
          className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300 -z-10"
          style={{
            background: `linear-gradient(135deg, ${borderColors[glowColor]}, transparent, ${borderColors[glowColor]})`,
            padding: '1px',
          }}
        />
      )}
      
      {/* Corner glow */}
      <div
        className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-20"
        style={{ background: glowColors[glowColor] }}
      />
      
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

export default GlowCard;

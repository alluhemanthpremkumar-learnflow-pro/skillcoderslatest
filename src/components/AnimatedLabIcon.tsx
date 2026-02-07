import { motion } from 'framer-motion';

interface AnimatedLabIconProps {
  icon: string;
  name: string;
}

const getAnimation = (name: string) => {
  switch (name) {
    case 'Kali Linux':
      // Dragon: breathing fire effect - scale pulse + slight rotation
      return {
        animate: {
          scale: [1, 1.15, 1.05, 1.2, 1],
          rotate: [0, -8, 5, -3, 0],
          y: [0, -3, 1, -2, 0],
        },
        transition: {
          duration: 3,
          repeat: Infinity,
          repeatDelay: 2,
          ease: 'easeInOut' as const,
        },
      };
    case 'Ubuntu Server':
      // Penguin: waddle walk + "snow throw" bounce
      return {
        animate: {
          x: [0, 6, -6, 4, -4, 0],
          rotate: [0, 8, -8, 5, -5, 0],
          y: [0, -2, 0, -4, 0, 0],
        },
        transition: {
          duration: 2.5,
          repeat: Infinity,
          repeatDelay: 1.5,
          ease: 'easeInOut' as const,
        },
      };
    case 'Parrot OS':
      // Parrot: fly and rotate
      return {
        animate: {
          y: [0, -10, -5, -12, 0],
          x: [0, 5, -3, 4, 0],
          rotate: [0, 15, -10, 20, 0],
          scale: [1, 1.1, 0.95, 1.1, 1],
        },
        transition: {
          duration: 3,
          repeat: Infinity,
          repeatDelay: 1,
          ease: 'easeInOut' as const,
        },
      };
    case 'Windows 7':
    case 'Windows 10':
    case 'Windows Server':
      // Windows: smooth 3D-ish rotation
      return {
        animate: {
          rotateY: [0, 360],
          scale: [1, 1.1, 1],
        },
        transition: {
          duration: 2.5,
          repeat: Infinity,
          repeatDelay: 3,
          ease: 'easeInOut' as const,
        },
      };
    default:
      return {
        animate: { scale: [1, 1.05, 1] },
        transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' as const },
      };
  }
};

const AnimatedLabIcon = ({ icon, name }: AnimatedLabIconProps) => {
  const { animate, transition } = getAnimation(name);

  return (
    <motion.div
      className="text-4xl inline-block cursor-default select-none"
      animate={animate}
      transition={transition}
      style={{ perspective: 800 }}
    >
      {icon}
    </motion.div>
  );
};

export default AnimatedLabIcon;

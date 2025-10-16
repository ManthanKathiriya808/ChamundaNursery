import { motion } from 'framer-motion';

/**
 * Scroll Animation Utilities for ChamundaNursery
 * 
 * This file contains reusable animation variants and components for scroll-triggered animations.
 * All animations are optimized for performance and accessibility.
 * 
 * Usage:
 * - Import the desired animation variant
 * - Apply to motion components with whileInView prop
 * - Customize timing and easing as needed
 */

// Basic fade animations
export const fadeInVariants = {
  hidden: { 
    opacity: 0,
    transition: { duration: 0.3 }
  },
  visible: { 
    opacity: 1,
    transition: { 
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

// Slide up animations (most common for sections)
export const slideUpVariants = {
  hidden: { 
    opacity: 0, 
    y: 60,
    transition: { duration: 0.3 }
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94] // Custom easing for smooth feel
    }
  }
};

// Slide in from left
export const slideInLeftVariants = {
  hidden: { 
    opacity: 0, 
    x: -60,
    transition: { duration: 0.3 }
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

// Slide in from right
export const slideInRightVariants = {
  hidden: { 
    opacity: 0, 
    x: 60,
    transition: { duration: 0.3 }
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

// Scale animations for cards and images
export const scaleInVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.8,
    transition: { duration: 0.3 }
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

// Stagger container for animating children in sequence
export const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Delay between each child animation
      delayChildren: 0.2    // Initial delay before first child
    }
  }
};

// Stagger item for use with stagger container
export const staggerItemVariants = {
  hidden: { 
    opacity: 0, 
    y: 30,
    transition: { duration: 0.3 }
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

// Bounce animation for CTAs and interactive elements
export const bounceInVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.3,
    transition: { duration: 0.3 }
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: 0.8,
      ease: [0.68, -0.55, 0.265, 1.55] // Bounce easing
    }
  }
};

// Rotate animation for icons and decorative elements
export const rotateInVariants = {
  hidden: { 
    opacity: 0, 
    rotate: -180,
    transition: { duration: 0.3 }
  },
  visible: { 
    opacity: 1, 
    rotate: 0,
    transition: { 
      duration: 1,
      ease: "easeOut"
    }
  }
};

// Flip animation for cards
export const flipInVariants = {
  hidden: { 
    opacity: 0, 
    rotateY: -90,
    transition: { duration: 0.3 }
  },
  visible: { 
    opacity: 1, 
    rotateY: 0,
    transition: { 
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

// Draw animation for SVG paths and lines
export const drawVariants = {
  hidden: { 
    pathLength: 0,
    opacity: 0
  },
  visible: { 
    pathLength: 1,
    opacity: 1,
    transition: { 
      pathLength: { duration: 2, ease: "easeInOut" },
      opacity: { duration: 0.3 }
    }
  }
};

/**
 * Reusable Animation Components
 */

// Animated Section Wrapper
export const AnimatedSection = ({ children, variant = slideUpVariants, className = "", ...props }) => (
  <motion.section
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-100px" }}
    variants={variant}
    className={className}
    {...props}
  >
    {children}
  </motion.section>
);

// Animated Container for staggered children
export const StaggerContainer = ({ children, className = "", delay = 0.2, stagger = 0.1, ...props }) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-50px" }}
    variants={{
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: stagger,
          delayChildren: delay
        }
      }
    }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
);

// Animated Item for use within StaggerContainer
export const StaggerItem = ({ children, variant = staggerItemVariants, className = "", ...props }) => (
  <motion.div
    variants={variant}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
);

// Animated Text that reveals character by character
export const AnimatedText = ({ text, className = "", delay = 0 }) => {
  const words = text.split(' ');
  
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.05,
            delayChildren: delay
          }
        }
      }}
      className={className}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { 
              opacity: 1, 
              y: 0,
              transition: { duration: 0.5 }
            }
          }}
          className="inline-block mr-2"
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};

// Animated Counter for statistics
export const AnimatedCounter = ({ from = 0, to, duration = 2, className = "" }) => {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className={className}
    >
      <motion.span
        initial={{ textContent: from }}
        whileInView={{ textContent: to }}
        viewport={{ once: true }}
        transition={{ duration, ease: "easeOut" }}
        onUpdate={(latest) => {
          if (typeof latest.textContent === 'number') {
            latest.textContent = Math.round(latest.textContent);
          }
        }}
      />
    </motion.span>
  );
};

/**
 * Viewport Configuration Presets
 */
export const viewportConfig = {
  // Standard viewport - triggers when 20% of element is visible
  standard: { once: true, margin: "-20%" },
  
  // Early trigger - starts animation before element is fully visible
  early: { once: true, margin: "-100px" },
  
  // Late trigger - waits until element is mostly visible
  late: { once: true, margin: "20%" },
  
  // Repeat animations - for elements that should animate every time they come into view
  repeat: { once: false, margin: "-50px" }
};

/**
 * Performance Optimized Animation Settings
 */
export const performanceConfig = {
  // Reduced motion for users who prefer less animation
  reducedMotion: {
    transition: { duration: 0.01 },
    variants: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 }
    }
  },
  
  // GPU-accelerated properties only
  gpuOptimized: {
    transform: true,
    opacity: true,
    filter: true
  }
};

export default {
  fadeInVariants,
  slideUpVariants,
  slideInLeftVariants,
  slideInRightVariants,
  scaleInVariants,
  staggerContainerVariants,
  staggerItemVariants,
  bounceInVariants,
  rotateInVariants,
  flipInVariants,
  drawVariants,
  AnimatedSection,
  StaggerContainer,
  StaggerItem,
  AnimatedText,
  AnimatedCounter,
  viewportConfig,
  performanceConfig
};
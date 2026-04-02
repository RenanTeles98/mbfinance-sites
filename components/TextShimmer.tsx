"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface TextShimmerProps {
  children: string;
  as?: React.ElementType;
  className?: string;
  duration?: number;
  baseColor?: string;
  shimmerColor?: string;
}

export function TextShimmer({
  children,
  as: Component = 'span',
  className = '',
  duration = 3,
  baseColor = '#ffffff',
  shimmerColor = 'rgba(255,255,255,0.4)',
}: TextShimmerProps) {
  const MotionComponent = motion(Component);

  // Robust shimmer using a single background gradient
  // We use the baseColor as the main background and the shimmerColor as a highlight
  const backgroundStyle = baseColor.includes('gradient') 
    ? baseColor 
    : `linear-gradient(90deg, ${baseColor} 0%, ${baseColor} 100%)`;

  return (
    <MotionComponent
      className={`relative inline-block bg-clip-text text-transparent ${className}`}
      initial={{ backgroundPosition: '-200% center' }}
      animate={{ backgroundPosition: '200% center' }}
      transition={{
        repeat: Infinity,
        duration,
        ease: 'linear',
      }}
      style={{
        backgroundImage: `linear-gradient(90deg, transparent 0%, ${shimmerColor} 50%, transparent 100%), ${backgroundStyle}`,
        backgroundSize: '200% 100%',
        backgroundRepeat: 'no-repeat',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
      }}
    >
      {children}
    </MotionComponent>
  );
}

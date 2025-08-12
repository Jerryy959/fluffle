// src/app/AnimatedSprite.tsx
import { useState, useEffect, useRef, memo } from 'react';

interface SpriteFrame {
  frame: { x: number; y: number; w: number; h: number };
  duration: number;
}

interface SpriteConfig {
  frames: { [key: string]: SpriteFrame };
  meta: {
    size: { w: number; h: number };
  };
}

interface AnimatedSpriteProps {
  spriteSheet: string;
  config: SpriteConfig;
  isPlaying?: boolean;
  scale?: number;
  className?: string;
  style?: React.CSSProperties;
}

const AnimatedSprite = ({ 
  spriteSheet, 
  config, 
  isPlaying = true, 
  scale = 1,
  className = '',
  style = {}
}: AnimatedSpriteProps) => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const frameTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const frames = Object.values(config.frames);
  const currentFrameData = frames[currentFrame];

  useEffect(() => {
    if (!isPlaying || frames.length === 0) return;

    const nextFrame = () => {
      setCurrentFrame(prev => (prev + 1) % frames.length);
    };

    frameTimeoutRef.current = setTimeout(nextFrame, currentFrameData.duration);

    return () => {
      if (frameTimeoutRef.current) {
        clearTimeout(frameTimeoutRef.current);
      }
    };
  }, [currentFrame, isPlaying, frames.length, currentFrameData.duration]);

  if (!currentFrameData) return null;

  const spriteStyle: React.CSSProperties = {
    width: currentFrameData.frame.w * scale,
    height: currentFrameData.frame.h * scale,
    backgroundImage: `url(${spriteSheet})`,
    backgroundPosition: `-${currentFrameData.frame.x * scale}px -${currentFrameData.frame.y * scale}px`,
    backgroundSize: `${config.meta.size.w * scale}px ${config.meta.size.h * scale}px`,
    imageRendering: 'pixelated',
    ...style
  };

  return (
    <div 
      className={className}
      style={spriteStyle}
    />
  );
};

export default memo(AnimatedSprite);

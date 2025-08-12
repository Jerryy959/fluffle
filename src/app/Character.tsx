// src/app/Character.tsx
import { useState, useEffect, useRef, memo } from 'react';
import { isInsideIsland, islands } from './paths';
import AnimatedSprite from './AnimatedSprite';

// 角色类型定义
const CHARACTER_TYPES = ['Fluf', 'Mush', 'Rishi'] as const;
type CharacterType = typeof CHARACTER_TYPES[number];

// 精灵配置接口
interface SpriteConfig {
  frames: { [key: string]: { frame: { x: number; y: number; w: number; h: number }; duration: number } };
  meta: {
    size: { w: number; h: number };
  };
}

// 角色属性定义
interface CharacterProps {
  id: number;
  islandId: number;
  numCharacters: number;
  isSelected: boolean;
  targetPosition: { x: number; y: number } | null;
  onReachTarget: () => void;
}

const Character = ({ 
  id, 
  islandId, 
  numCharacters, 
  isSelected, 
  targetPosition, 
  onReachTarget 
}: CharacterProps) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isMoving, setIsMoving] = useState(false);
  const [facingDirection, setFacingDirection] = useState<'left' | 'right'>('right');
  const [bounceOffset, setBounceOffset] = useState(0);
  const [spriteConfig, setSpriteConfig] = useState<SpriteConfig | null>(null);
  const animationRef = useRef<number | null>(null);
  const bounceRef = useRef<number | null>(null);

  // 根据角色ID选择角色类型
  const characterType: CharacterType = CHARACTER_TYPES[id % CHARACTER_TYPES.length];
  
  // 获取当前角色所在的岛屿
  const currentIsland = islands.find(island => island.id === islandId);

  // 加载角色精灵配置
  useEffect(() => {
    const loadSpriteConfig = async () => {
      try {
        const response = await fetch(`/assets/world/sprites/${characterType}/idle/${characterType}.json`);
        const config = await response.json();
        setSpriteConfig(config);
      } catch (error) {
        console.error(`Failed to load sprite config for ${characterType}:`, error);
      }
    };

    loadSpriteConfig();
  }, [characterType]);

  // 初始化角色位置在岛屿中心
  useEffect(() => {
    if (currentIsland) {
      // 为每个角色分配不同的初始位置，避免重叠
      const angle = (id / numCharacters) * 2 * Math.PI;
      const radius = Math.min(50, currentIsland.radius * 0.3);
      const x = currentIsland.x + Math.cos(angle) * radius;
      const y = currentIsland.y + Math.sin(angle) * radius;
      
      setPosition({ x, y });
    }
  }, [islandId, id, numCharacters, currentIsland]);

  // 跳跃动画效果
  useEffect(() => {
    if (!isMoving) {
      setBounceOffset(0);
      return;
    }

    const animateBounce = () => {
      const time = Date.now() * 0.01;
      const bounce = Math.sin(time) * 8; // 上下跳动8像素
      setBounceOffset(bounce);
      bounceRef.current = requestAnimationFrame(animateBounce);
    };

    bounceRef.current = requestAnimationFrame(animateBounce);

    return () => {
      if (bounceRef.current) {
        cancelAnimationFrame(bounceRef.current);
      }
    };
  }, [isMoving]);

  // 移动到目标位置的动画函数
  const moveToTarget = (target: { x: number; y: number }) => {
    if (!currentIsland) return;

    const startPos = { ...position };
    
    // 确定面向方向
    const deltaX = target.x - startPos.x;
    if (Math.abs(deltaX) > 5) { // 只有在明显移动时才改变方向
      setFacingDirection(deltaX > 0 ? 'right' : 'left');
    }
    
    // 如果目标位置不在岛屿内，找到最近的有效位置
    let validTarget = target;
    if (!isInsideIsland(currentIsland, target.x, target.y)) {
      // 计算从岛屿中心到目标点的方向
      const directionX = target.x - currentIsland.x;
      const directionY = target.y - currentIsland.y;
      const targetDistance = Math.sqrt(directionX * directionX + directionY * directionY);
      
      // 将目标点限制在岛屿边界内
      const maxDistance = currentIsland.radius - 25; // 留一些边距
      const scale = maxDistance / targetDistance;
      
      validTarget = {
        x: currentIsland.x + directionX * scale,
        y: currentIsland.y + directionY * scale
      };
    }

    const validDistance = Math.sqrt(
      Math.pow(validTarget.x - startPos.x, 2) + Math.pow(validTarget.y - startPos.y, 2)
    );

    if (validDistance < 5) {
      onReachTarget();
      return;
    }

    const duration = Math.max(800, validDistance * 4); // 稍微慢一点的移动速度
    const startTime = Date.now();
    
    setIsMoving(true);

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // 使用缓动函数让移动更自然
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      
      const currentX = startPos.x + (validTarget.x - startPos.x) * easeProgress;
      const currentY = startPos.y + (validTarget.y - startPos.y) * easeProgress;
      
      setPosition({ x: currentX, y: currentY });
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsMoving(false);
        onReachTarget();
      }
    };
    
    animationRef.current = requestAnimationFrame(animate);
  };

  // 监听目标位置变化
  useEffect(() => {
    if (targetPosition) {
      moveToTarget(targetPosition);
    }
  }, [targetPosition]);

  // 清理动画
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (bounceRef.current) {
        cancelAnimationFrame(bounceRef.current);
      }
    };
  }, []);

  // 处理角色点击 (不再需要，因为主角色不再通过点击选择)
  // const handleClick = (e: React.MouseEvent) => {
  //   e.stopPropagation();
  //   onSelect(id);
  // };

  if (!spriteConfig) {
    // 加载中显示静态图片
    return (
      <div
        style={{
          position: 'absolute',
          left: position.x - 25,
          top: position.y - 25 + bounceOffset,
          cursor: 'pointer',
          transition: isSelected ? 'transform 0.2s ease' : 'none',
          transform: `scale(${isSelected ? 1.1 : 1}) scaleX(${facingDirection === 'left' ? -1 : 1})`,
          zIndex: isSelected ? 10 : 1,
        }}
        className={`character ${isSelected ? 'selected' : ''} ${isMoving ? 'moving' : ''}`}
      >
        <img
          src={`/assets/world/sprites/${characterType}/${characterType}-cover.png`}
          alt={`Character ${id}`}
          width={50}
          height={50}
          style={{
            filter: isSelected ? 'drop-shadow(0 0 10px #00ff00)' : 'none',
            imageRendering: 'pixelated',
          }}
        />
        {/* 选中指示器 */}
        {isSelected && (
          <div
            style={{
              position: 'absolute',
              bottom: -10,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 60,
              height: 4,
              backgroundColor: '#00ff00',
              borderRadius: 2,
              animation: 'pulse 1s infinite',
            }}
          />
        )}
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'absolute',
        left: position.x - 25,
        top: position.y - 25 + bounceOffset,
        cursor: 'pointer',
        transition: isSelected ? 'transform 0.2s ease' : 'none',
        transform: `scale(${isSelected ? 1.1 : 1}) scaleX(${facingDirection === 'left' ? -1 : 1})`,
        zIndex: isSelected ? 10 : 1,
      }}
      className={`character ${isSelected ? 'selected' : ''} ${isMoving ? 'moving' : ''}`}
    >
      <AnimatedSprite
        spriteSheet={`/assets/world/sprites/${characterType}/idle/${characterType}.png`}
        config={spriteConfig}
        isPlaying={true}
        scale={0.2} // 缩小到合适大小
        style={{
          filter: isSelected ? 'drop-shadow(0 0 10px #00ff00)' : 'none',
        }}
      />
      
      {/* 选中指示器 */}
      {isSelected && (
        <div
          style={{
            position: 'absolute',
            bottom: -10,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 60,
            height: 4,
            backgroundColor: '#00ff00',
            borderRadius: 2,
            animation: 'pulse 1s infinite',
          }}
        />
      )}
    </div>
  );
};

export default memo(Character);
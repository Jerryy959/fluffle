// src/app/page.tsx
'use client';
import { useEffect, useState, useRef } from 'react';
import { islands, isInsideIsland } from './paths';
import Character from './Character';

const NUM_CHARACTERS = 1;
const ISLAND_ID = 1;

export default function Home() {
  const [targetPosition, setTargetPosition] = useState<{ x: number; y: number } | null>(null);
  const [hoveredIsland, setHoveredIsland] = useState<number | null>(null);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  // 处理鼠标移动，检测是否悬停在岛屿上
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = gameAreaRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 检查鼠标是否在任何岛屿内
    let foundIsland = null;
    for (const island of islands) {
      if (isInsideIsland(island, x, y)) {
        foundIsland = island.id;
        break;
      }
    }

    setHoveredIsland(foundIsland);
  };



  // 处理岛屿点击移动
  const handleGameAreaClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // 确保点击事件不是来自角色本身，避免冲突
    if ((e.target as HTMLElement).closest(".character")) return;

    const rect = gameAreaRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // 只有在点击岛屿内部时才移动角色
    let clickedIsland = null;
    for (const island of islands) {
      if (isInsideIsland(island, x, y)) {
        clickedIsland = island;
        break;
      }
    }

    if (clickedIsland) {
      setTargetPosition({ x, y });
    }
  };

  // 处理角色到达目标
  const handleReachTarget = () => {
    setTargetPosition(null);
  };

  // 处理键盘事件（ESC取消选择）
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setTargetPosition(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="home-page">


      {/* 游戏区域 */}
      <div 
        ref={gameAreaRef}
        className={`island relative w-full h-screen bg-gradient-to-b from-sky-400 to-green-200 overflow-hidden ${
          hoveredIsland ? 'cursor-pointer' : 'cursor-default'
        }`}
        onClick={handleGameAreaClick}
        onMouseMove={handleMouseMove}
      >
        {/* 渲染岛屿 */}
        {islands.map((island) => (
          <div key={island.id}>
            {/* 岛屿可视化边界 */}
            <div
              style={{
                position: 'absolute',
                left: island.x - island.radius,
                top: island.y - island.radius,
                width: island.radius * 2,
                height: island.radius * 2,
                borderRadius: '50%',
                backgroundColor: hoveredIsland === island.id 
                  ? 'rgba(34, 197, 94, 0.4)' 
                  : 'rgba(34, 197, 94, 0.2)',
                border: hoveredIsland === island.id 
                  ? '3px solid rgba(34, 197, 94, 0.8)' 
                  : '2px dashed rgba(34, 197, 94, 0.5)',
                pointerEvents: 'none',
                transition: 'all 0.2s ease',
              }}
            />
            
            {/* 岛屿中心标记 */}
            <div
              style={{
                position: 'absolute',
                left: island.x - 5,
                top: island.y - 5,
                width: 10,
                height: 10,
                borderRadius: '50%',
                backgroundColor: hoveredIsland === island.id 
                  ? 'rgba(34, 197, 94, 1)' 
                  : 'rgba(34, 197, 94, 0.8)',
                pointerEvents: 'none',
                transition: 'all 0.2s ease',
                transform: hoveredIsland === island.id ? 'scale(1.2)' : 'scale(1)',
              }}
            />
            
            {/* 岛屿标签 */}
            <div
              style={{
                position: 'absolute',
                left: island.x - 30,
                top: island.y - island.radius - 30,
                backgroundColor: hoveredIsland === island.id 
                  ? 'rgba(0, 0, 0, 0.9)' 
                  : 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 'bold',
                pointerEvents: 'none',
                transition: 'all 0.2s ease',
                transform: hoveredIsland === island.id ? 'scale(1.1)' : 'scale(1)',
              }}
            >
              岛屿 {island.id}
              {hoveredIsland === island.id && (
                <span style={{ marginLeft: '4px', color: '#4ade80' }}>
                  ← 点击移动
                </span>
              )}
            </div>
          </div>
        ))}

        {/* 渲染主角色 */}
        <Character 
          key={0} 
          id={0} 
          islandId={ISLAND_ID} 
          numCharacters={NUM_CHARACTERS}
          isSelected={true} // 主角色始终选中
          targetPosition={targetPosition}
          onReachTarget={handleReachTarget}
        />

        {/* 目标位置指示器 */}
        {targetPosition && (
          <div
            style={{
              position: 'absolute',
              left: targetPosition.x - 10,
              top: targetPosition.y - 10,
              width: 20,
              height: 20,
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 0, 0, 0.6)',
              border: '2px solid red',
              animation: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
              pointerEvents: 'none',
            }}
          />
        )}
      </div>

      {/* CSS动画 */}
      <style jsx>{`
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        
        .character:hover {
          transform: scale(1.05) !important;
        }
        
        .character.selected {
          z-index: 10;
        }
      `}</style>
    </div>
  );
}
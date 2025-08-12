// src/app/BackgroundToggle.tsx
import { useState } from 'react';
import { useDayNight } from './DayNightContext'; // 导入全局状态

const BackgroundToggle = ({ toggleBackground }: { toggleBackground: (arg0: boolean) => void }) => {
  const { isDay, toggleDayNight } = useDayNight(); // 使用全局状态
  const [animating, setAnimating] = useState(false); // 判断是否正在执行动画

  const handleClick = () => {
    if (animating) return; // 如果动画正在进行，忽略点击

    setAnimating(true);
    toggleDayNight(); // 切换白天/夜晚状态
    toggleBackground(isDay);
    // 动画完成后，准备下一次动画
    setTimeout(() => {
      setAnimating(false);
    }, 100); // 动画持续时间1秒
  };

  return (
    <div
      onClick={handleClick}
      style={{
        position: 'absolute',
        top: '160px',
        right: '30px',
        width: '60px',
        height: '15px',
        borderRadius: '15px',
        backgroundColor: isDay ? '#fff' : '#000', // 白天是白色，晚上是黑色
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: '5px',
        cursor: 'pointer',
        overflow: 'hidden',
        transition: 'background-color 1s ease', // 渐变效果
      }}
    >
      {/* 小太阳 SVG */}
      {isDay && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            position: 'absolute',
            right: '5px', // 小太阳初始位置
            transition: 'transform 0.5s ease', // 动画效果
            transform: animating ? 'translateX(100px)' : 'translateX(0)', // 动画效果
          }}
        >
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      )}

      {/* 小云朵 SVG */}
      {!isDay && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            position: 'absolute',
            left: '-20px', // 小云朵初始位置
            transition: 'transform 0.5s ease', // 动画效果
            transform: animating ? 'translateX(20px)' : 'translateX(0)', // 动画效果
            stroke: '#fff', // 小云朵在黑色背景下使用白色线条
          }}
        >
          <path
            d="M20.39 15.61A4.992 4.992 0 0019 10a5 5 0 00-9.4-3.39A5.003 5.003 0 003 12a5 5 0 0010 0c0 1.09.45 2.08 1.18 2.82 1.35-.48 2.82-.82 4.21-.58.39-.32.61-.72.61-1.14-.01-.75-.56-1.39-1.4-1.49z"
            stroke={isDay ? '#000' : '#fff'} // 小云朵的线条颜色：白天是黑色，夜晚是白色
          />
        </svg>
      )}
    </div>
  );
};

export default BackgroundToggle;

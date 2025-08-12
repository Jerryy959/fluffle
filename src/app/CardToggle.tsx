// src/app/CardToggle.tsx
import { useState } from 'react';

const CardToggle = () => {
  const [isOutfit, setIsOutfit] = useState(false); // 控制卡片内容的状态

  // 切换卡片内容
  const toggleCard = () => {
    setIsOutfit((prev) => !prev);
  };

  return (
    <div
      onClick={toggleCard} // 点击卡片切换内容
      style={{
        position: 'absolute',
        top: '20px', // 放置在左上角
        left: '20px',
        width: '200px', // 设置卡片的宽度
        height: '200px', // 设置卡片的高度
        backgroundColor: '#fff', // 卡片的背景色
        borderRadius: '15px', // 圆角效果
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)', // 添加阴影效果
        cursor: 'pointer', // 鼠标悬浮时显示为点击状态
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transition: 'transform 0.3s ease', // 动画效果
      }}
    >
      {/* 根据状态显示不同内容 */}
      {isOutfit ? (
        <div
          style={{
            textAlign: 'center',
            color: '#333',
          }}
        >
          <h3>换装卡片</h3>
          <p>选择你喜欢的服装！</p>
        </div>
      ) : (
        <div
          style={{
            textAlign: 'center',
            color: '#333',
          }}
        >
          <h3>普通卡片</h3>
          <p>这是一个普通卡片。</p>
        </div>
      )}
    </div>
  );
};

export default CardToggle;

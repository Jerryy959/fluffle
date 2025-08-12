// src/app/AudioPlayer.tsx
import { useState, useRef } from 'react';

const AudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);  // 播放/暂停状态
  const audioRef = useRef<HTMLAudioElement | null>(null); // 音频引用

  // 切换播放/暂停
  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();  // 暂停音频
      } else {
        audioRef.current.play();   // 播放音频
      }
      setIsPlaying(!isPlaying); // 更新播放状态
    }
  };

  return (
    <div
      onClick={togglePlayback}  // 点击按钮切换播放状态
      style={{
        position: 'absolute',
        top: '90px',
        right: '40px',
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        backgroundColor: '#ff6347',  // 背景色（可以根据需要调整）
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        transition: 'background-color 0.3s ease',
      }}
    >
      {/* 播放/暂停图标 */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="30"
        height="30"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          transform: isPlaying ? 'rotate(90deg)' : 'rotate(0deg)',  // 播放时旋转图标
          transition: 'transform 0.3s ease',
        }}
      >
        {/* 播放时为暂停图标, 暂停时为播放图标 */}
        {isPlaying ? (
          <g>
            <line x1="6" y1="6" x2="6" y2="18" />
            <line x1="18" y1="6" x2="18" y2="18" />
          </g>
        ) : (
          <polygon points="5,3 19,12 5,21" />
        )}
      </svg>

      {/* 音频播放器 */}
      <audio ref={audioRef} src="https://archive.org/download/testmp3testfile/mpthreetest.mp3" />
    </div>
  );
};

export default AudioPlayer;

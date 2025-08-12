// src/app/layout.tsx
'use client';
import './globals.css'; // 引入全局样式
import { Inter } from 'next/font/google'; // 可以选择自己喜欢的字体
import { useState } from 'react';
import BackgroundToggle  from './BackgroundToggle';
import { DayNightProvider } from './DayNightContext';
import AudioPlayer from './AudioPlayer';
import CardToggle from './CardToggle'; // 引入 CardToggle 组件
import AccessComponent from './AnimatedSection';
const inter = Inter({ subsets: ['latin'] });

export default function Layout({
  children, // 页面内容
}: {
  children: React.ReactNode;
}) {
  const [isBlackBackground, setIsBlackBackground] = useState(false);
  const toggleBackgroundColor = () => {
    setIsBlackBackground((prev) => !prev);
  };

  return (
    <html lang="en">
      <head>
        <title>Job Tracker</title>
        <meta name="description" content="Track your job applications" />
        <meta charSet="UTF-8" />
      </head>
      <body className={inter.className}>
         <AccessComponent />
        <DayNightProvider>
        <div className="container">
          {/* 背景视频 */}
          <div className="background-video">
            <video autoPlay loop muted className="bg-video">
              <source src="/assets/world/bg.webm" type="video/webm" />
            </video>
          </div>

          <div
            className="background-layer"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: isBlackBackground ? '#2f2f2f' : 'transparent',
              zIndex: -2,
            }}
          />
          {/* <AnimatedSection /> */}

          {/* 主要内容区域 */}
          <div className="content">{children}</div>
          
          {/* 卡片切换功能 */}
          <CardToggle />

          <BackgroundToggle toggleBackground={toggleBackgroundColor} />
          <AudioPlayer />
        </div>
        </DayNightProvider>
      </body>
    </html>
  );
}

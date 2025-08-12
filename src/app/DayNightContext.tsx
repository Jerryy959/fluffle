// src/app/DayNightContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

// 定义Context类型
interface DayNightContextType {
  isDay: boolean;
  toggleDayNight: () => void;
}

// 创建一个 Context
const DayNightContext = createContext<DayNightContextType | null>(null);

export const useDayNight = () => {
  const context = useContext(DayNightContext);
  if (!context) {
    throw new Error('useDayNight must be used within a DayNightProvider');
  }
  return context;
};

// 创建一个提供者组件，用于管理 `isDay` 状态
export const DayNightProvider = ({ children }: { children: ReactNode }) => {
  const [isDay, setIsDay] = useState(true); // 默认是白天

  const toggleDayNight = () => {
    setIsDay((prev) => !prev);
  };

  return (
    <DayNightContext.Provider value={{ isDay, toggleDayNight }}>
      {children}
    </DayNightContext.Provider>
  );
};

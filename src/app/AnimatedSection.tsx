// src/app/AnimatedSection.tsx
import { useState } from "react";
import styles from './AnimatedSection.module.css';

const AccessComponent: React.FC = () => {
  const [isAccessClicked, setIsAccessClicked] = useState(false);

  const handleClick = () => {
    setIsAccessClicked(true);
  };

  return (
    <div className={styles.container}>
      {/* 上方部分 */}
      <div className={styles.topSection}>
        {!isAccessClicked ? (
          <>
            <button onClick={handleClick} className={styles.button}>
              Early Access
            </button>
            <p className={styles.line}>867 in line</p>
          </>
        ) : (
          <>
            <a 
              href="https://www.linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className={styles.button}
            >
              LinkedIn
            </a>
            <p className={styles.line}>900+ in line</p>
          </>
        )}
      </div>

      {/* 中间部分 */}
      <div className={styles.textContainer}>
        <p>
          {isAccessClicked 
            ? "New content after Early Access" 
            : "Imagine leveling up your design career like an old-school RPG—powered by real alumni insights."
          }
        </p>
      </div>

      {/* 下方部分 */}
      <div>
        {!isAccessClicked && (
          <a href="#" onClick={handleClick} className={styles.underline}>
            More details
          </a>
        )}
      </div>
    </div>
  );
};

export default AccessComponent;

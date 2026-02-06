import React from 'react';
import styles from './index.module.scss';

interface ProgressCircleProps {
  percentage: number;
}

const ProgressCircle: React.FC<ProgressCircleProps> = ({ percentage }) => {
  return (
    <div className={styles.progressCircle} style={{ '--progress': `${percentage}%` } as React.CSSProperties}>
      <div className={styles.progressCircleInner}>
        <div className={styles.progressCirclePercentage}>{percentage}%</div>
      </div>
    </div>
  );
};

export default ProgressCircle;

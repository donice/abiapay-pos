import React from 'react';
import styles from './loader.module.scss';

type LoaderProps = {
  width?: string;
  height?: string;
};

const LoaderSkeleton: React.FC<LoaderProps> = ({ width, height = '100px' }) => {
  return (
    <div
      className={styles.loader}
      style={{ '--loader-width': width, '--loader-height': height } as React.CSSProperties}
    ></div>
  );
};

export default LoaderSkeleton;

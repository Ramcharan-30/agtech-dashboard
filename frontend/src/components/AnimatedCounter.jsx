import { useState, useEffect, useRef } from 'react';

const AnimatedCounter = ({ end, duration = 1200, prefix = '', suffix = '', decimals = 0 }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const startTime = useRef(null);

  useEffect(() => {
    const target = Number(end) || 0;

    const animate = (timestamp) => {
      if (!startTime.current) startTime.current = timestamp;
      const elapsed = timestamp - startTime.current;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic for smooth deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(eased * target);

      if (progress < 1) {
        countRef.current = requestAnimationFrame(animate);
      }
    };

    countRef.current = requestAnimationFrame(animate);

    return () => {
      if (countRef.current) cancelAnimationFrame(countRef.current);
    };
  }, [end, duration]);

  const display = decimals > 0 ? count.toFixed(decimals) : Math.round(count);

  return (
    <span className="animated-counter">
      {prefix}{display}{suffix}
    </span>
  );
};

export default AnimatedCounter;

import React, { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const GraphingCalculator: React.FC = () => {
  const calculatorRef = useRef<HTMLDivElement>(null);
  const [calculator, setCalculator] = useState<any>(null);

  useEffect(() => {
    if (calculatorRef.current && !calculator) {
      const calc = window.Desmos.GraphingCalculator(calculatorRef.current, {
        expressions: true,
        settingsMenu: false,
        zoomButtons: false,
        border: false,
      });
      setCalculator(calc);
    }

    return () => {
      calculator?.destroy();
    };
  }, []);

  return (
    <div className="h-full">
      <div ref={calculatorRef} className="w-full h-full" />
    </div>
  );
};

export default GraphingCalculator;
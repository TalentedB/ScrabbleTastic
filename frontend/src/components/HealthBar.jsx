import { useMemo } from "react";

const getGradientColor = (value) => {
  value = Math.min(Math.max(value, 0), 100);

  let r, g, b;

  if (value <= 50) {
    r = 255;
    g = Math.floor((value / 50) * 255);
    b = 0;
  } else {
    r = Math.floor(255 - ((value - 50) / 50) * 255);
    g = 255;
    b = 0;
  }

  return `rgb(${r}, ${g}, ${b})`;
};

// Refactor Good
export const HealthBar = ({ health }) => {
  const healthBarColor = useMemo(() => {
    return getGradientColor(health);
  }, [health]);

  return (
    <div>
      <div name="healthBar" className="w-[150px] h-3 bg-gray-600 mb-3 mt-2">
        <div
          name="healthBarFilled"
          className="h-3"
          style={{
            backgroundColor: healthBarColor,
            width: `${health}%`,
          }}
        ></div>
      </div>
    </div>
  );
};

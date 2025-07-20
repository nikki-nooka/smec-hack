import React from 'react';

interface TinyLineChartProps {
  data: number[];
  width?: number;
  height?: number;
  strokeColor?: string;
  strokeWidth?: number;
}

export const TinyLineChart: React.FC<TinyLineChartProps> = ({
  data,
  width = 100,
  height = 40,
  strokeColor = '#ef4444', // red-500
  strokeWidth = 2,
}) => {
  if (!data || data.length < 2) {
    return null;
  }

  const maxVal = Math.max(...data);
  const minVal = Math.min(...data);
  const range = maxVal - minVal === 0 ? 1 : maxVal - minVal;

  const points = data
    .map((d, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((d - minVal) / range) * height;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(' ');

  const pathD = `M ${points}`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      xmlns="http://www.w3.org/2000/svg"
      className="overflow-visible"
    >
      <path
        d={pathD}
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
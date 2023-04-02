import { FC } from 'react';

export const FutureThresholdLegendIcon: FC = ({}) => (
  <div className="flex flex-col gap-1 justify-start">
    <div className="flex gap-2 items-center justify-end">
      <p className="text-[10px] text-white text-right leading-none">Forecast</p>
      <div className="not-sr-only w-[27px] h-[2px] border-b-2 border-dotted border-white"></div>
    </div>
    <div className="flex gap-2 items-center justify-end">
      <p className="text-[10px] text-ocf-yellow text-right leading-none">
        Threshold
      </p>
      <div className="not-sr-only w-[27px] h-[2px] border-b-2 border-dotted border-ocf-yellow"></div>
    </div>
  </div>
);

export const UpArrowIcon: FC = ({}) => (
  <svg
    width="16"
    height="19"
    viewBox="0 0 16 19"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8.70711 0.792892C8.31658 0.402369 7.68342 0.402369 7.29289 0.792892L0.928932 7.15685C0.538407 7.54738 0.538407 8.18054 0.928932 8.57107C1.31946 8.96159 1.95262 8.96159 2.34315 8.57107L8 2.91421L13.6569 8.57107C14.0474 8.96159 14.6805 8.96159 15.0711 8.57107C15.4616 8.18054 15.4616 7.54738 15.0711 7.15685L8.70711 0.792892ZM9 18.5L9 1.5L7 1.5L7 18.5L9 18.5Z"
      fill="white"
    />
  </svg>
);

export const DownArrowIcon: FC = ({}) => (
  <svg
    width="16"
    height="18"
    viewBox="0 0 16 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8.70711 17.7071C8.31658 18.0976 7.68342 18.0976 7.29289 17.7071L0.928932 11.3431C0.538407 10.9526 0.538407 10.3195 0.928932 9.92893C1.31946 9.53841 1.95262 9.53841 2.34315 9.92893L8 15.5858L13.6569 9.92893C14.0474 9.53841 14.6805 9.53841 15.0711 9.92893C15.4616 10.3195 15.4616 10.9526 15.0711 11.3431L8.70711 17.7071ZM9 4.37114e-08L9 17L7 17L7 -4.37114e-08L9 4.37114e-08Z"
      fill="white"
    />
  </svg>
);

interface InputProps {
  x: number;
  y: number;
}

export const LineCircle: FC<InputProps> = ({ x, y }) => (
  <>
    <circle cx={x} cy={y} r="10.0159" stroke="#FFD053" fill="#444444" />
    <circle cx={x} cy={y} r="5.25796" fill="#FFD053" />
  </>
);

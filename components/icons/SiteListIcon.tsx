import { FC } from 'react';

interface SiteListIconProps {
  color: string;
}

const SiteListIcon: FC<SiteListIconProps> = ({ color }) => {
  return (
    <svg
      width="21"
      height="14"
      viewBox="0 0 21 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M4.875 1.75C4.875 1.12868 5.37868 0.625 6 0.625H19.5C20.1213 0.625 20.625 1.12868 20.625 1.75C20.625 2.37132 20.1213 2.875 19.5 2.875H6C5.37868 2.875 4.875 2.37132 4.875 1.75ZM4.875 7C4.875 6.37868 5.37868 5.875 6 5.875H19.5C20.1213 5.875 20.625 6.37868 20.625 7C20.625 7.62132 20.1213 8.125 19.5 8.125H6C5.37868 8.125 4.875 7.62132 4.875 7ZM4.875 12.25C4.875 11.6287 5.37868 11.125 6 11.125H19.5C20.1213 11.125 20.625 11.6287 20.625 12.25C20.625 12.8713 20.1213 13.375 19.5 13.375H6C5.37868 13.375 4.875 12.8713 4.875 12.25Z"
        fill={'currentColor'}
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M0.75 1.75C0.75 0.921573 1.42157 0.25 2.25 0.25C3.07843 0.25 3.75 0.921573 3.75 1.75C3.75 2.57843 3.07843 3.25 2.25 3.25C1.42157 3.25 0.75 2.57843 0.75 1.75Z"
        fill={'currentColor'}
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M0.75 7C0.75 6.17157 1.42157 5.5 2.25 5.5C3.07843 5.5 3.75 6.17157 3.75 7C3.75 7.82843 3.07843 8.5 2.25 8.5C1.42157 8.5 0.75 7.82843 0.75 7Z"
        fill={'currentColor'}
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M0.75 12.25C0.75 11.4216 1.42157 10.75 2.25 10.75C3.07843 10.75 3.75 11.4216 3.75 12.25C3.75 13.0784 3.07843 13.75 2.25 13.75C1.42157 13.75 0.75 13.0784 0.75 12.25Z"
        fill={'currentColor'}
      />
    </svg>
  );
};

export default SiteListIcon;

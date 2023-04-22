import React, { ReactNode } from 'react';
import Link from 'next/link';
import { LinkProps } from 'next/link';

type MenuLinkProps = {
  linkProps: LinkProps;
  label: string;
  svg: ReactNode;
  currentPath: string;
};

const MenuLink: React.FC<MenuLinkProps> = ({
  linkProps,
  label,
  svg,
  currentPath,
}) => {
  const textColor =
    linkProps.href === currentPath ? 'text-amber' : 'text-white';
  return (
    <Link {...linkProps}>
      <a>
        <div
          className={`px-4 py-2 flex items-center rounded-md text-gray-600 hover:text-gray-700 hover:bg-ocf-gray-1000 transition-colors transform`}
        >
          <div className={textColor}>{svg}</div>
          <span
            className={`mx-4 font-medium flex-1 align-center text-lg ${textColor}`}
          >
            {label}
          </span>
        </div>
      </a>
    </Link>
  );
};

export default MenuLink;

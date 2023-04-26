import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC, ReactNode } from 'react';

type MenuLinkProps = {
  href: string;
  label: string;
  svg: ReactNode;
};

const MenuLink: FC<MenuLinkProps> = ({ href, label, svg }) => {
  const { asPath: path } = useRouter();
  const active = href === path;
  const textColor = active ? 'text-amber' : 'text-white';
  return (
    <Link href={href}>
      <a>
        <div className="flex items-center gap-3 rounded-md px-4 py-2 text-gray-600 transition-all hover:bg-ocf-gray-1000 hover:text-gray-700">
          <div className={textColor}>{svg}</div>
          <span className={`text-lg font-medium ${textColor}`}>{label}</span>
        </div>
      </a>
    </Link>
  );
};

export default MenuLink;

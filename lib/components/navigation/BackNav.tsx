import { FC } from 'react';
import BackButton from '../form/BackButton';
import { NowcastingLogo } from '../icons/NavbarIcons';

interface BackNavProps {
  backButton?: boolean;
  lastPageCallback?: () => void;
}

const BackNav: FC<BackNavProps> = ({
  backButton = false,
  lastPageCallback,
}) => {
  return (
    <div className="flex h-[var(--nav-height)] w-full flex-row items-center justify-between bg-ocf-black px-5 md:justify-center md:py-2">
      <div className="mt-2 md:hidden">
        {backButton && <BackButton onClick={lastPageCallback} />}
      </div>
      <NowcastingLogo />
    </div>
  );
};

export default BackNav;

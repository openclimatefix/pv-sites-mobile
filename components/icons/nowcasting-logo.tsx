import Image from 'next/image';

type NowcastingLogoProps = {
  width: number;
  height: number;
};

export const NowcastingLogo: React.FC<NowcastingLogoProps> = ({
  width,
  height,
}) => (
  <a href="https://www.openclimatefix.org/" target="_blank" rel="noreferrer">
    <Image
      src="/nowcasting-secondary.svg"
      alt="Nowcasting logo"
      width={width}
      height={height}
    />
  </a>
);

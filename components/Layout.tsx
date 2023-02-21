import { Tooltip } from '@openclimatefix/nowcasting-ui.misc.tooltip';
import { FC, PropsWithChildren } from 'react';

const Layout: FC<PropsWithChildren<{}>> = ({ children }) => {
  return (
    <>
        <Tooltip tip="yummy"></Tooltip>
        <main className="bg-mapbox-black-500 border-red">{children}</main>
    </>
  );
};

export default Layout;

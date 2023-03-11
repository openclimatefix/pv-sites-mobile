import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import content from '../content/power-card-content.json';
import { Carousel } from 'react-responsive-carousel';
import PowerInfoCard from '~/components/PowerInfoCard';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const MoreInfo = () => {
  return (
    <div className="bg-ocf-black w-screen min-h-screen px-4">
      <h1 className="my-2 mt-4 text-ocf-gray text-3xl font-bold">More Info</h1>
      <div className="bg-ocf-gray-1000 rounded-lg">
        <Carousel showStatus={false} showThumbs={false}>
          {content.appliances.map((element) => (
            <PowerInfoCard
              key={element.name}
              src={element.icon}
              appliance={element.name}
              kW={element.kW}
            />
          ))}
        </Carousel>
      </div>
    </div>
  );
};

export default MoreInfo;

export const getServerSideProps = withPageAuthRequired();

import { withPageAuthRequired } from '~/lib/auth';
import * as data from '../data/power_card_data.json';
import { Carousel } from 'react-responsive-carousel';
import PowerInfoCard from '~/components/PowerInfoCard';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const MoreInfo = () => {
  return (
    <div className="bg-ocf-black w-screen min-h-screen px-4">
      <h1 className="my-2 mt-4 text-ocf-gray text-3xl font-bold">More Info</h1>
      <Carousel showStatus={false}>
        {data.appliances.map((element) => (
          <div key={element.name}>
            <PowerInfoCard
              src={element.icon}
              applicance={element.name}
              kWh={element.kWh}
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default MoreInfo;

export const getServerSideProps = withPageAuthRequired();

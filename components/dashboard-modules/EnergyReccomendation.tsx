import PowerInfoCard from '../PowerInfoCard';
import NumberDisplay from './NumberDisplay';

const EnergyRecommendation = () => {
  return (
    <PowerInfoCard
      key={1}
      src={'/car.svg'}
      appliance={'Car'}
      kW={'50'}
    ></PowerInfoCard>
  );
};

export default EnergyRecommendation;

import { useState, FC } from 'react';
import InverterGraphicIcon from '../icons/InverterGraphicIcon';

const LinkInverters = () => {
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  console.log(showDisclaimer);
  return (
    <div className="w-[300px] h-[500px] border-blue-500 border-[1px] flex flex-col items-center">
      <InverterGraphicIcon />
      <div className="text-white text-[20px]">
        Would you like to link your inverter with Enode to provide better
        forecasting?
      </div>
      {!showDisclaimer && (
        <button
          className="w-full text-right text-[#FFD053] underline text-[14px] mt-[5px]"
          onClick={() => setShowDisclaimer(!showDisclaimer)}
        >
          What&apos;s this?
        </button>
      )}
      {showDisclaimer && (
        <div className="w-full text-[#DDDDDD] text-[14px] mt-[20px]">
          Linking your inverter with Enode gives us access to your solar output
          data, providing you with better forecasts and more information
          available within our app.
        </div>
      )}

      {showDisclaimer && (
        <button
          className="w-full text-right text-[#FFD053] underline text-[14px] mt-[5px]"
          onClick={() => setShowDisclaimer(!showDisclaimer)}
        >
          Show less
        </button>
      )}
      <div className="flex flex-col justify-center mt-auto">
        <button className="h-[54px] w-[250px] bg-[#FFD053] rounded-md font-semibold mb-[20px]">
          Yes, link my inverter
        </button>
        <button className="w-full text-[#FFD053] underline text-[14px] mt-[5px]">
          Skip this step
        </button>
      </div>
    </div>
  );
};

export default LinkInverters;

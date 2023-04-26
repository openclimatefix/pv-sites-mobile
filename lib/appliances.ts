import content from '../content/power-card-content.json';

const parseAppliance = (appliance: (typeof content.appliances)[number]) => {
  return {
    ...appliance,
    kW: Number(appliance.kW),
    duration: Number(appliance.duration),
  };
};

export type Appliance = ReturnType<typeof parseAppliance>;

export const appliances = content.appliances.map(parseAppliance);

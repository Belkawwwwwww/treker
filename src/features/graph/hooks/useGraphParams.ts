import { useState } from "react";

export const useGraphParams = () => {
  const [selectedParams, setSelectedParams] = useState<{
    [key: string]: boolean;
  }>({
    speed: true,
    voltage: false,
    fuel1: false,
    alt: false,
    ignition: false,
    direction: false,
  });

  const handleCheckboxChange = (param: string) => {
    setSelectedParams((prevState) => ({
      ...prevState,
      [param]: !prevState[param],
    }));
  };

  return { selectedParams, handleCheckboxChange };
};

import { FC, useState } from "react";
import ChartComponent from "../2_widgets/ChartComponent";
import { MapComponent } from "../2_widgets/MapComponents";

export const Main: FC = () => {
  const [lat, setLat] = useState<number>(0); // Начальная широта
  const [lng, setLng] = useState<number>(0); // Начальная долгота

  const handlePointClick = (latitude: number, longitude: number) => {
    setLat(latitude);
    setLng(longitude);
  };
  return (
    <div>
      <MapComponent lat={lat} lng={lng} />

      <ChartComponent onPointClick={handlePointClick} />
    </div>
  );
};

import { useEffect, useState } from "react";
import { loadMapData } from "../api/mapApi";
import { LatLngExpression } from "leaflet";

export const useMapData = () => {
  const [routeData, setRouteData] = useState<L.LatLngExpression[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await loadMapData();
        if (data && data[740] && data[740][0]?.route) {
          const route = data[740][0].route;
          const coordinates: LatLngExpression[] = route.map(
            (point: { lat: number; lng: number }) => [point.lat, point.lng]
          );
          setRouteData(coordinates);
          console.log(data);
        } else {
          setError("Нет доступных данных для отображения.");
        }
      } catch (error) {
        setError("Ошибка загрузки данных карты");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { routeData, loading, error };
};

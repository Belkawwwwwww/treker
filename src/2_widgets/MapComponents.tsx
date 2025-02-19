import React, { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { initializeMap, updateMarker } from "../shared/utils/mapUtils";
import { useMapData } from "../features/map/hooks/useMapData";

type Props = {
  lat: number;
  lng: number;
};

export const MapComponent: React.FC<Props> = (props) => {
  const { routeData, loading, error } = useMapData();

  const [map, setMap] = useState<L.Map | null>(null);
  const [marker, setMarker] = useState<L.Marker | null>(null);

  useEffect(() => {
    if (!loading && routeData.length > 0 && !map) {
      setMap(initializeMap(routeData));
    } else if (map) {
      const currentMarkerCoords = marker ? marker.getLatLng() : null;
      if (
        !marker ||
        (currentMarkerCoords &&
          (currentMarkerCoords.lat !== props.lat ||
            currentMarkerCoords.lng !== props.lng))
      ) {
        setMarker(updateMarker(map, props.lat, props.lng, marker));
      }
      map.setView([props.lat, props.lng], 13);
    }
  }, [routeData, props.lat, props.lng, map, loading, marker]);

  useEffect(() => {
    return () => {
      if (map) {
        map.remove();
      }
    };
  }, [map]);
  if (loading) return <div>Загрузка карты...</div>;
  if (error) return <div>{error}</div>;

  return <div id="map" style={{ height: "300px", width: "700px" }}></div>;
};

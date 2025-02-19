import L from "leaflet";

export const initializeMap = (coordinates: L.LatLngExpression[]) => {
  const newMap = L.map("map").setView(coordinates[0] as L.LatLng, 13);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(newMap);

  const polyline = L.polyline(coordinates, { color: "red" }).addTo(newMap);
  newMap.fitBounds(polyline.getBounds());

  return newMap;
};

export const updateMarker = (
  map: L.Map,
  lat: number,
  lng: number,
  marker: L.Marker | null
) => {
  if (marker) {
    map.removeLayer(marker);
  }
  const newMarker = L.marker([lat, lng]).addTo(map);
  return newMarker;
};

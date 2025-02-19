export type ReserveData = {
  alt: number;
  fuel1: number;
  speed: number;
  voltage: number;
  ignition: number;
  direction: number;
};

export type RoutePoint = {
  datetime: string;
  lat: number;
  lng: number;
  reserve: ReserveData;
};

export type ChartDataResponse = {
  [key: string]: Array<{ route: Array<RoutePoint> }>;
};

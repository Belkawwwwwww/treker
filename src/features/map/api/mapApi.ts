import { fetchChartData, fetchToken } from "../../../shared/api/api";

export const loadMapData = async () => {
  const tokens = await fetchToken();
  if (tokens) {
    return await fetchChartData(tokens.access);
  }
  return null;
};

import { useEffect, useState } from "react";
import { getChartData } from "../../../shared/api/api";
import { RoutePoint } from "../../../shared/utils/chartUtils";

export const useGraphData = () => {
  const [graphData, setGraphData] = useState<RoutePoint[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getChartData();
        setGraphData(data?.["740"]?.[0]?.route || null);
      } catch (error) {
        setError("Ошибка при получении данных для графика.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { graphData, error, loading };
};

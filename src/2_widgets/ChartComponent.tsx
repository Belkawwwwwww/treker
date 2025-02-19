import React, { useEffect, useRef } from "react";
import { useGraphData } from "../features/graph/hooks/useGraphData";
import ChartFilters from "../features/graph/ui/GraphFilter";
import { useGraphParams } from "../features/graph/hooks/useGraphParams";
import { drawGraph } from "../shared/ui/drawGraph";

interface ChartComponentProps {
  onPointClick: (lat: number, lng: number) => void;
}

const ChartComponent: React.FC<ChartComponentProps> = ({ onPointClick }) => {
  const { graphData, error, loading } = useGraphData();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { selectedParams, handleCheckboxChange } = useGraphParams();

  useEffect(() => {
    if (graphData && canvasRef.current) {
      drawGraph(canvasRef.current, graphData, selectedParams, onPointClick);
    }
  }, [graphData, selectedParams, onPointClick]);

  if (loading) return <p>Загрузка данных...</p>;
  if (error) return <div>{error}</div>;

  return (
    <div className="chart-container">
      <ChartFilters
        selectedParams={selectedParams}
        onChange={handleCheckboxChange}
      />
      <canvas ref={canvasRef} width={700} height={300} />
    </div>
  );
};

export default ChartComponent;

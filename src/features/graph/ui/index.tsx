import React, { useEffect, useState, useRef } from "react";
import { getChartData } from "../../../shared/api/api";

interface ReserveData {
  alt: number;
  fuel1: number;
  speed: number;
  voltage: number;
  ignition: number;
  direction: number;
}

interface RoutePoint {
  datetime: string;
  reserve: ReserveData;
}

interface ChartDataResponse {
  [key: string]: Array<{ route: Array<RoutePoint> }>;
}

const ChartComponent: React.FC = () => {
  const [chartData, setChartData] = useState<Array<RoutePoint> | null>(null);
  const [error, setError] = useState<string | null>(null);
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
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleCheckboxChange = (param: string) => {
    setSelectedParams((prevState) => ({
      ...prevState,
      [param]: !prevState[param],
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data: ChartDataResponse | undefined = await getChartData();
        const route = data?.["740"]?.[0]?.route;
        console.log(data);

        if (route && route.length > 0) {
          setChartData(route);
        } else {
          setError("Не удалось получить данные для графика.");
        }
      } catch (err) {
        console.error("Ошибка при получении данных:", err);
        setError("Произошла ошибка при получении данных.");
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (chartData) {
      drawChart();
    }
  }, [chartData, selectedParams]);

  const drawChart = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Очищаем предыдущий рисунок
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Проверка на наличие данных
    if (!chartData) return; // Если нет данных, выходим

    const labels = chartData.map((point) => {
      const date = new Date(point.datetime);
      const minutes = date.getMinutes();
      return `${date.getHours()}:${minutes < 10 ? "0" + minutes : minutes}`; // Форматируем время
    });

    const datasets = [];

    if (selectedParams.speed) {
      datasets.push({
        label: "Скорость",
        data: chartData.map((point) => point.reserve.speed || 0),
        color: "rgba(75, 192, 192, 1)",
      });
    }

    if (selectedParams.voltage) {
      datasets.push({
        label: "Напряжение",
        data: chartData.map((point) => point.reserve.voltage || 0),
        color: "rgba(255, 99, 132, 1)",
      });
    }

    if (selectedParams.fuel1) {
      datasets.push({
        label: "Уровень топлива",
        data: chartData.map((point) => point.reserve.fuel1 || 0),
        color: "rgba(255, 206, 86, 1)",
      });
    }

    if (selectedParams.alt) {
      datasets.push({
        label: "Высота",
        data: chartData.map((point) => point.reserve.alt || 0),
        color: "rgba(153, 102, 255, 1)",
      });
    }

    if (selectedParams.ignition) {
      datasets.push({
        label: "Замок зажигания",
        data: chartData.map((point) => point.reserve.ignition || 0),
        color: "rgba(255, 159, 64, 1)",
      });
    }

    const maxDataValue = 80; // Фиксируем максимальное значение для оси Y
    const yScale = canvas.height / (maxDataValue + 10); // Настройка шкалы для оси Y
    const barWidth = canvas.width / labels.length;

    // Рисуем сетку по оси Y
    ctx.strokeStyle = "#e0e0e0"; // Цвет сетки
    ctx.lineWidth = 1;

    for (let i = 0; i <= maxDataValue; i += 10) {
      const y = canvas.height - i * yScale;
      ctx.beginPath();
      ctx.moveTo(0, y); // Начало линии
      ctx.lineTo(canvas.width, y); // Конец линии
      ctx.stroke(); // Рисуем линию
    }

    // Рисуем сетку по оси X
    for (let i = 0; i < labels.length; i++) {
      const x = i * barWidth;
      ctx.beginPath();
      ctx.moveTo(x, 0); // Начало вертикальной линии
      ctx.lineTo(x, canvas.height); // Конец вертикальной линии
      ctx.stroke(); // Рисуем линию
    }

    // Теперь рисуем бары
    datasets.forEach((dataset) => {
      ctx.fillStyle = dataset.color;
      ctx.beginPath();
      dataset.data.forEach((value, index) => {
        const x = index * barWidth;
        const y = canvas.height - value * yScale;
        ctx.fillRect(x, y, barWidth - 2, value * yScale); // Рисуем столбцы
      });
      ctx.closePath();
    });

    // Рисуем оси и подписи
    ctx.fillStyle = "#000";

    // Подписи по оси Y от 0 до 80
    for (let i = 0; i <= maxDataValue; i += 10) {
      const y = canvas.height - i * yScale;
      ctx.fillText(i.toString(), 5, y); // Параметр x=5 для отступа от края
    }

    // Подписи по оси X с интервалом 10 минут
    labels.forEach((label, index) => {
      const x = index * barWidth + barWidth / 2 - 10; // Центрируем текст по оси X
      if (index % 5 === 0) {
        // Каждые 5 элементов
        const date = new Date(chartData[index].datetime);
        ctx.fillText(
          `${date.getDate()}.${date.getMonth() + 1}`,
          x,
          canvas.height - 5
        ); // Подпись даты снизу
      }
      ctx.fillText(label, x, canvas.height - 15); // Текст времени
    });
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!chartData) {
    return <p>Загрузка данных...</p>;
  }

  return (
    <div className="chart-container">
      <h1>Данные для графика</h1>
      <div>
        <label>
          <input
            type="checkbox"
            checked={selectedParams.speed}
            onChange={() => handleCheckboxChange("speed")}
          />
          Скорость
        </label>
        <label>
          <input
            type="checkbox"
            checked={selectedParams.voltage}
            onChange={() => handleCheckboxChange("voltage")}
          />
          Напряжение
        </label>
        <label>
          <input
            type="checkbox"
            checked={selectedParams.fuel1}
            onChange={() => handleCheckboxChange("fuel1")}
          />
          Уровень топлива
        </label>
        <label>
          {" "}
          <input
            type="checkbox"
            checked={selectedParams.alt}
            onChange={() => handleCheckboxChange("alt")}
          />
          Высота
        </label>
        <label>
          <input
            type="checkbox"
            checked={selectedParams.ignition}
            onChange={() => handleCheckboxChange("ignition")}
          />
          Замок зажигания
        </label>
      </div>
      <canvas ref={canvasRef} width={800} height={400} />
    </div>
  );
};

export default ChartComponent;

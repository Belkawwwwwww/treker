import { RoutePoint } from "../utils/chartUtils";

export const drawGraph = (
  canvas: HTMLCanvasElement,
  graphData: RoutePoint[],
  selectedParams: { [key: string]: boolean },
  onPointClick: (lat: number, lng: number) => void
) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!graphData || graphData.length === 0) return; // Если нет данных, выходим

  // Формируем метки времени для оси X
  const labels = graphData.map((point) => {
    const date = new Date(point.datetime);
    const minutes = date.getMinutes();
    return `${date.getHours()}:${minutes < 10 ? "0" + minutes : minutes}`;
  });

  // Создаем массив для хранения наборов данных
  const datasets = [];
  let maxValue = 250; // Устанавливаем фиксированное максимальное значение для оси Y

  // Конструирование набора данных для каждого параметра
  if (selectedParams.speed) {
    const speedData = graphData.map((point) => point.reserve.speed || 0);
    datasets.push({
      data: speedData,
      color: "rgba(75,192,192,1)", // Непрозрачный цвет для линии
      fillColor: "rgba(75,192,192,0.3)", // Полупрозрачный цвет для заливки
    });
  }
  if (selectedParams.voltage) {
    const voltageData = graphData.map((point) => point.reserve.voltage || 0);
    datasets.push({
      data: voltageData,
      color: "rgba(255,99,132,1)",
      fillColor: "rgba(255,99,132,0.3)",
    });
  }
  if (selectedParams.fuel1) {
    const fuel1Data = graphData.map((point) => point.reserve.fuel1 || 0);
    datasets.push({
      data: fuel1Data,
      color: "rgba(255,206,86,1)",
      fillColor: "rgba(255,206,86,0.3)",
    });
  }
  if (selectedParams.alt) {
    const altData = graphData.map((point) => point.reserve.alt || 0);
    datasets.push({
      data: altData,
      color: "rgba(153,102,255,1)",
      fillColor: "rgba(153,102,255,0.3)",
    });
  }
  if (selectedParams.ignition) {
    const ignitionData = graphData.map((point) => point.reserve.ignition || 0);
    datasets.push({
      data: ignitionData,
      color: "rgba(255,159,64,1)",
      fillColor: "rgba(255,159,64,0.3)",
    });
  }

  // Устанавливаем yScale для фиксированного maxValue
  const yScale = canvas.height / (maxValue + 10);
  const barWidth = (canvas.width - 50) / labels.length; // Уменьшаем ширину, чтобы учесть отступ
  const leftPadding = 50; // Отступ слева

  // Рисуем график для каждого набора данных
  datasets.forEach((dataset) => {
    ctx.beginPath();
    dataset.data.forEach((value, index) => {
      const x = leftPadding + index * barWidth; // Добавляем отступ к x
      const y = canvas.height - value * yScale;

      if (index === 0) {
        ctx.moveTo(x, y); // Перемещаемся в первую точку
      } else {
        ctx.lineTo(x, y); // Соединяем точки линией
      }
    });

    ctx.strokeStyle = dataset.color;
    ctx.lineWidth = 2; // Увеличиваем толщину линии
    ctx.stroke();

    // Закрашиваем область под графиком
    ctx.lineTo(
      leftPadding + (dataset.data.length - 1) * barWidth,
      canvas.height
    ); // Опускаем до нижней части канваса
    ctx.lineTo(leftPadding, canvas.height); // Заканчиваем линию внизу канваса с учетом отступа
    ctx.closePath(); // Закрываем путь
    ctx.fillStyle = dataset.fillColor; // Устанавливаем цвет заливки
    ctx.fill(); // Заполняем область
  });

  // Подписи по оси Y
  ctx.fillStyle = "#000";
  for (let i = 0; i <= maxValue; i += 20) {
    const y = canvas.height - i * yScale;
    ctx.fillText(i.toString(), leftPadding - 30, y); // Сместите текст на 30 пикселей влево от отступа
  }

  // Подписи по оси X
  const labelOffset = 20;
  labels.forEach((label, index) => {
    const x = leftPadding + index * barWidth + barWidth / 2 - 10; // Центрируем текст по оси X с учетом отступа
    ctx.fillText(label, x, canvas.height + labelOffset); // Подписываем временные метки под графиком
  });

  // Обработка клика по графику
  canvas.addEventListener("click", (event: MouseEvent) => {
    const rect = canvas.getBoundingClientRect();
    const xClick = event.clientX - rect.left;
    const clickedIndex = Math.floor((xClick - leftPadding) / barWidth); // Находим индекс кликнутой точки

    if (clickedIndex >= 0 && clickedIndex < graphData.length) {
      const clickedPoint = graphData[clickedIndex]; // Извлекаем точку
      const valueY = clickedPoint.reserve.speed; // Берем значение Y для этого индекса
      const y = canvas.height - valueY * yScale; // Вычисляем Y на основе значения

      // Проверка, что клик был в области графика
      if (
        xClick >= leftPadding + clickedIndex * barWidth &&
        xClick <= leftPadding + (clickedIndex + 1) * barWidth
      ) {
        const latitude = clickedPoint.lat; // Извлекаем широту
        const longitude = clickedPoint.lng; // Извлекаем долготу
        onPointClick(latitude, longitude); // Вызываем функцию для обработки клика

        // Рисуем жирную точку на месте клика
        ctx.fillStyle = "red"; // Цвет точки
        ctx.beginPath();
        ctx.arc(
          leftPadding + clickedIndex * barWidth + barWidth / 2,
          y,
          5,
          0,
          Math.PI * 2
        ); // Рисуем точку радиусом 5
        ctx.fill(); // Заполняем точку
      }
    }
  });
};

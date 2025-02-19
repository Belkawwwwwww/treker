type TokenResponse = {
  token: string;
  refresh_token: string;
};
export const fetchToken = async (): Promise<{
  access: string;
  refresh: string;
} | void> => {
  try {
    const response = await fetch(
      "https://sputnic.tech/mobile_api/token/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          login: "testdemo",
          password: "demo",
        }),
      }
    );

    // Проверяем, успешен ли ответ
    if (!response.ok) {
      throw new Error(
        "Ошибка при получении токена, статус: " + response.status
      );
    }

    const data: TokenResponse = await response.json();
    return { access: data.token, refresh: data.refresh_token };
  } catch (error) {
    console.error("Ошибка:", error);
  }
};

export const fetchChartData = async (
  authToken: string
): Promise<any | void> => {
  try {
    const response = await fetch(
      "https://sputnic.tech/mobile_api/getRoutesPoint",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          id: 740,
          date_start: "2025-02-05 06:13:02",
          date_end: "2025-02-07 17:53:24",
        }),
      }
    );

    if (!response.ok) {
      throw new Error(
        "Ошибка при получении данных, статус: " + response.status
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Ошибка:", error);
  }
};
export const getChartData = async () => {
  const tokens = await fetchToken();
  if (tokens) {
    console.log("Токены получены успешно.");
    return await fetchChartData(tokens.access);
  } else {
    console.log("Не удалось получить токены.");
  }
};

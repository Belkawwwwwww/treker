export const getToken = async (): Promise<string> => {
  const response = await fetch(" https://sputnic.tech/mobile_api/token/login", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      login: "testdemo",
      password: "demo",
    }),
  });
  const data = await response.json();
  return data.access;
};
export const fetchData = async (accessToken: string): Promise<any> => {
  const response = await fetch(
    "https://sputnic.tech/mobile_api/getRoutesPoint",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        id: 740,
        date_start: "2025-02-05 06:13:02",
        date_end: "2025-02-07 17:53:24",
      }),
    }
  );
  const data = await response.json();
  return data; // Вернём все данные, полученные от API
};

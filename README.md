# Weather App

A full-stack weather lookup app. Search a city to view its current conditions, temperature, humidity, visibility, wind speed, and local sunrise and sunset times.

![Weather App](https://github.com/a2rp/weather-app/assets/5670738/2a1ed686-00bb-4889-a33f-7fa8e4ba42d8)

## Features

- Search for current weather by city or place name
- View temperature in Celsius, humidity, visibility, and wind speed
- See the selected city's local date, sunrise, and sunset times
- Keep the OpenWeatherMap API key on the server
- Responsive React interface with loading and error feedback

## Stack

- React, Vite, Material UI, Sass, and Axios
- Node.js, Express, and Axios
- OpenWeatherMap Current Weather API

## Requirements

- Node.js 18 or newer
- An OpenWeatherMap API key

## Run the API

From the repository root, install the backend dependencies:

```bash
cd backend
npm install
```

Copy `backend/.env.example` to `backend/.env` and set `OPEN_WEATHER_MAP_API_KEY` to your key. Keep `.env` private and do not commit it.

Start the API:

```bash
npm start
```

The API listens on `http://localhost:5000` by default. `GET /health` reports whether the server is running.

## Run the client

Open a second terminal from the repository root:

```bash
cd frontend
npm install
npm run dev
```

Open the local address printed by Vite, usually `http://localhost:5173`. During development, Vite forwards `/weather` requests to the API on port `5000`.

For a separately hosted client, set `VITE_WEATHER_API_URL` to the backend's base URL and set the backend's `CORS_ORIGIN` to the client origin. The API key stays in the backend environment.

## API request

```http
POST /weather
Content-Type: application/json
```

```json
{
  "location": "Delhi"
}
```

## License

This project is licensed under the ISC license listed in the backend package manifest.

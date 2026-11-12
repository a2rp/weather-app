require("dotenv").config();

const axios = require("axios");
const cors = require("cors");
const express = require("express");

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const API_KEY = process.env.OPEN_WEATHER_MAP_API_KEY?.trim();
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

const weatherClient = axios.create({
    baseURL: "https://api.openweathermap.org/data/2.5",
    timeout: 8000,
    maxContentLength: 1024 * 1024,
});

app.disable("x-powered-by");
app.use(
    cors({
        origin(origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
                return;
            }

            callback(null, false);
        },
    }),
);
app.use(express.json({ limit: "10kb" }));

app.get("/health", (_request, response) => {
    response.json({ status: "ok" });
});

app.post("/weather", async (request, response) => {
    const location =
        typeof request.body?.location === "string"
            ? request.body.location.trim()
            : "";

    if (!location || location.length > 100) {
        return response.status(400).json({
            success: false,
            message: "Enter a city or place name up to 100 characters long.",
        });
    }

    if (!API_KEY) {
        return response.status(503).json({
            success: false,
            message: "Weather search is not configured on this server.",
        });
    }

    try {
        const { data } = await weatherClient.get("/weather", {
            params: {
                q: location,
                appid: API_KEY,
                units: "metric",
            },
        });

        return response.json({
            success: true,
            message: "Weather data fetched successfully.",
            data,
        });
    } catch (error) {
        if (error.response?.status === 404) {
            return response.status(404).json({
                success: false,
                message: "No weather data was found for that place.",
            });
        }

        if ([401, 403].includes(error.response?.status)) {
            console.error("OpenWeatherMap rejected the configured API key.");

            return response.status(503).json({
                success: false,
                message: "Weather search is temporarily unavailable.",
            });
        }

        console.error(
            "Weather provider request failed:",
            error.code || error.response?.status || "unknown error",
        );

        return response.status(502).json({
            success: false,
            message: "Weather service is unavailable. Try again shortly.",
        });
    }
});

app.listen(PORT, () => {
    console.log(`Weather API listening on http://localhost:${PORT}`);
});

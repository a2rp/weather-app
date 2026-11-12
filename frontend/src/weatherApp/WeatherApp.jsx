import React, { useState } from "react";
import { Button, CircularProgress, TextField } from "@mui/material";
import axios from "axios";
import { FiSunrise, FiSunset } from "react-icons/fi";
import { TbTemperatureCelsius } from "react-icons/tb";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import styles from "./styles.module.scss";

const apiBaseUrl = (import.meta.env.VITE_WEATHER_API_URL || "").replace(
    /\/+$/,
    "",
);

const formatCityDateTime = (timestamp, timezoneOffset, options) => {
    const shiftedTimestamp =
        Number(timestamp) + (Number(timezoneOffset) || 0);

    if (!Number.isFinite(shiftedTimestamp)) {
        return "Unavailable";
    }

    return new Intl.DateTimeFormat(undefined, {
        timeZone: "UTC",
        ...options,
    }).format(new Date(shiftedTimestamp * 1000));
};

const WeatherApp = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [locationInput, setLocationInput] = useState("");
    const [weatherData, setWeatherData] = useState(null);

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        const location = locationInput.trim();

        if (!location) {
            toast.warn("Enter a city or place name.");
            return;
        }

        setIsLoading(true);
        setWeatherData(null);

        try {
            const response = await axios.post(`${apiBaseUrl}/weather`, {
                location,
            });

            if (!response.data?.success || !response.data.data) {
                toast.error(
                    response.data?.message ||
                        "Weather data could not be loaded.",
                );
                return;
            }

            setWeatherData(response.data.data);
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                    "Could not reach the weather service. Try again shortly.",
            );
        } finally {
            setIsLoading(false);
        }
    };

    const condition = weatherData?.weather?.[0];
    const timezoneOffset = weatherData?.timezone || 0;

    return (
        <main className={styles.container}>
            <section className={styles.main} aria-labelledby="weather-heading">
                <p className={styles.eyebrow}>Current conditions</p>
                <h1 className={styles.heading} id="weather-heading">
                    Weather lookup
                </h1>
                <p className={styles.intro}>
                    Search a city to see its current weather and local daylight
                    times.
                </p>

                <form className={styles.form} onSubmit={handleFormSubmit}>
                    <div className={styles.inputContainer}>
                        <TextField
                            value={locationInput}
                            onChange={(event) =>
                                setLocationInput(event.target.value)
                            }
                            label="City or place"
                            placeholder="For example, Delhi"
                            inputProps={{
                                maxLength: 100,
                                autoComplete: "address-level2",
                            }}
                            fullWidth
                        />
                        <Button
                            type="submit"
                            disabled={isLoading}
                            variant="contained"
                            className={styles.searchLocationButton}
                        >
                            {isLoading ? (
                                <CircularProgress
                                    size={22}
                                    color="inherit"
                                    aria-label="Searching weather"
                                />
                            ) : (
                                "Search"
                            )}
                        </Button>
                    </div>
                </form>

                {weatherData && (
                    <section
                        className={styles.outputContainer}
                        aria-label={`Current weather for ${weatherData.name}`}
                    >
                        <p className={styles.dateTime}>
                            Updated {" "}
                            {formatCityDateTime(
                                weatherData.dt,
                                timezoneOffset,
                                { dateStyle: "medium", timeStyle: "short" },
                            )}
                        </p>

                        <div className={styles.weatherCondition}>
                            {condition?.icon && (
                                <img
                                    className={styles.weatherIcon}
                                    src={`https://openweathermap.org/img/wn/${condition.icon}@2x.png`}
                                    alt=""
                                />
                            )}
                            <div>
                                <h2 className={styles.locationName}>
                                    {weatherData.name}
                                    {weatherData.sys?.country && (
                                        <span>, {weatherData.sys.country}</span>
                                    )}
                                </h2>
                                <p className={styles.conditionText}>
                                    {condition?.description ||
                                        condition?.main ||
                                        "Current weather"}
                                </p>
                            </div>
                        </div>

                        <p className={styles.coordinates}>
                            {weatherData.coord?.lat?.toFixed(2)}, {" "}
                            {weatherData.coord?.lon?.toFixed(2)}
                        </p>

                        <div className={styles.sunTimes}>
                            <div className={styles.sunTime}>
                                <FiSunrise aria-hidden="true" />
                                <span>Sunrise</span>
                                <strong>
                                    {formatCityDateTime(
                                        weatherData.sys?.sunrise,
                                        timezoneOffset,
                                        { hour: "numeric", minute: "2-digit" },
                                    )}
                                </strong>
                            </div>
                            <div className={styles.sunTime}>
                                <FiSunset aria-hidden="true" />
                                <span>Sunset</span>
                                <strong>
                                    {formatCityDateTime(
                                        weatherData.sys?.sunset,
                                        timezoneOffset,
                                        { hour: "numeric", minute: "2-digit" },
                                    )}
                                </strong>
                            </div>
                        </div>

                        <div className={styles.metricGrid}>
                            <div className={styles.metric}>
                                <span className={styles.metricLabel}>
                                    Temperature
                                </span>
                                <strong className={styles.metricValue}>
                                    {Number(weatherData.main?.temp).toFixed(1)}
                                    <TbTemperatureCelsius aria-hidden="true" />
                                </strong>
                            </div>
                            <div className={styles.metric}>
                                <span className={styles.metricLabel}>
                                    Humidity
                                </span>
                                <strong className={styles.metricValue}>
                                    {weatherData.main?.humidity}%
                                </strong>
                            </div>
                            <div className={styles.metric}>
                                <span className={styles.metricLabel}>
                                    Visibility
                                </span>
                                <strong className={styles.metricValue}>
                                    {(Number(weatherData.visibility) / 1000).toFixed(
                                        1,
                                    )} km
                                </strong>
                            </div>
                            <div className={styles.metric}>
                                <span className={styles.metricLabel}>
                                    Wind speed
                                </span>
                                <strong className={styles.metricValue}>
                                    {weatherData.wind?.speed} m/s
                                </strong>
                            </div>
                        </div>
                    </section>
                )}
            </section>

            <ToastContainer position="top-center" theme="dark" />
        </main>
    );
};

export default WeatherApp;

import React, { useState } from "react";
import styles from "./styles.module.scss";
import { Button, CircularProgress, TextField } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { FiSunrise, FiSunset } from "react-icons/fi";
import { TbTemperatureCelsius } from "react-icons/tb";

const WeatherApp = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [locationInput, setLocationInput] = useState("");
    const [weatherData, setWeatherData] = useState(null);

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        try {
            if (locationInput.trim().length === 0) {
                return toast.warn("Input box is empty");
            }

            const options = {
                url: "http://localhost:1198/weather",
                method: "POST",
                data: {
                    location: locationInput
                }
            };
            setIsLoading(true);
            setWeatherData(null);
            const response = await axios(options);
            // console.log(response);
            if (response.data.success) {
                setWeatherData(response.data.data);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.main}>
                <div className={styles.heading}>Weather Details App.</div>
                <form className={styles.form} onSubmit={handleFormSubmit}>
                    <div className={styles.inputContainer}>
                        <TextField
                            val={locationInput}
                            onChange={event => setLocationInput(event.target.value)}
                            label="Location"
                            placeholder="Enter location here"
                            fullWidth
                        />
                        <Button
                            type="submit"
                            disabled={isLoading}
                            variant="contained"
                            className={styles.searchLocationButton}
                        >{isLoading ? <CircularProgress sx={{ padding: "5px" }} /> : "Search"}</Button>
                    </div>
                </form>
                {weatherData != null && <>
                    <div className={styles.outputContainer}>
                        <div>{new Date(weatherData.dt * 1000).toString()}</div>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <img
                                style={{ width: "100px", height: "100px" }}
                                src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                                alt="" />
                            <div>{weatherData.weather[0].main}&nbsp;
                                [{weatherData.weather[0].description}]</div>
                        </div>
                        <div className={styles.locationName}>{weatherData.name}, {weatherData.sys.country}</div>
                        <div>
                            <span>Latitude:&nbsp;</span> {weatherData.coord.lat},&nbsp;
                            <span>Longitude:&nbsp;</span> {weatherData.coord.lon}
                        </div>
                        <div style={{ display: "flex", justifyContent: "center", gap: "50px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", gap: "15px", alignItems: "center" }}>
                                <FiSunrise style={{ fontSize: "32px" }} />{new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString()}
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", gap: "15px", alignItems: "center" }}>
                                <FiSunset style={{ fontSize: "32px" }} /> {new Date(weatherData.sys.sunset * 1000).toLocaleTimeString()}
                            </div>
                        </div>
                        <div style={{ display: "flex", justifyContent: "center", gap: "50px" }}>
                            <div><span>Temperature:&nbsp;</span> {(weatherData.main.temp - 273.15).toFixed(2)}<TbTemperatureCelsius /></div>
                            <div><span>Humidity:&nbsp;</span> {(weatherData.main.humidity)}% </div>
                            <div><span>Visibility:&nbsp;</span> {(weatherData.visibility)}m </div>
                            <div><span>Wind speed:&nbsp;</span> {(weatherData.wind.speed)}meter/sec </div>
                        </div>

                        {/* <pre>{JSON.stringify(weatherData, null, 4)}</pre> */}
                    </div>
                </>}
            </div>

            <ToastContainer />
        </div>
    )
}

export default WeatherApp;


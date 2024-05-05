require("dotenv").config();

const { default: axios } = require("axios");
const cors = require("cors");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.post("/weather", async (req, res) => {
    try {
        console.log(req.body, "req body");
        const { location } = req.body;
        if (!location || location.trim().lengt == 0) {
            throw new Error("Invalid location");
        }
        const config = {
            url: `https://api.openweathermap.org/data/2.5/weather?q=${location}&appId=${process.env.OPEN_WEATHER_MAP_API_KEY}`,
            nethod: "GET"
        };
        const response = await axios(config);
        // console.log(response.data, "response");
        res.json({
            success: true,
            message: "Weather data fetched successfully", data: response.data
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
});

app.listen(PORT, () => console.log(`server running on http://localhost://${PORT}`));


import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, RefreshCw, Cloud, Sun, Droplets, Wind, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const API_KEY = "bb0b8b639634c8a7a6c9faee7dca96e5";
const LAT = 13.0293;
const LON = 123.445;
const LOCATION_NAME = "Pio Duran, PH";

type AlertLevel = "normal" | "yellow" | "orange" | "red" | "violet";
type WeatherData = {
  location: { name: string; lat: number; lng: number };
  current: {
    temp: number;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
    windDirection: string;
    condition: string;
    heatIndex: number;
    icon: string;
  };
  forecast: Array<{
    day: string;
    date: string;
    high: number;
    low: number;
    icon: string;
  }>;
  alerts: {
    rainfall: AlertLevel;
    heat: boolean;
  };
};

const weatherIcons: Record<string, string> = {
  "01d": "☀️",
  "01n": "🌙",
  "02d": "⛅",
  "02n": "☁️",
  "03d": "☁️",
  "03n": "☁️",
  "04d": "☁️",
  "04n": "☁️",
  "09d": "🌧️",
  "09n": "🌧️",
  "10d": "🌦️",
  "10n": "🌧️",
  "11d": "⛈️",
  "11n": "⛈️",
  "13d": "❄️",
  "13n": "❄️",
  "50d": "🌫️",
  "50n": "🌫️",
};

const alertConfig: Record<
  AlertLevel,
  { color: string; label: string; icon: string }
> = {
  normal: { color: "#10B981", label: "Normal", icon: "🟢" },
  yellow: { color: "#EAB308", label: "Heavy Rainfall Watch", icon: "🟡" },
  orange: { color: "#F97316", label: "Heavy Rainfall Warning", icon: "🟠" },
  red: { color: "#EF4444", label: "Severe Warning", icon: "🔴" },
  violet: { color: "#8B5CF6", label: "Extreme Emergency", icon: "🟣" },
};

const WeatherOutlook = () => {
  const [, setLocation] = useLocation();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showAlert, setShowAlert] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleBack = () => {
    setLocation("/");
  };

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    fetchData();

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const fetchData = async () => {
    if (!isOnline) {
      setError("No internet connection");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch current weather
      const currentResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&appid=${API_KEY}&units=metric`,
      );

      if (!currentResponse.ok) {
        throw new Error("Failed to fetch current weather data");
      }

      const currentData = await currentResponse.json();

      // Fetch forecast
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${LAT}&lon=${LON}&appid=${API_KEY}&units=metric`,
      );

      if (!forecastResponse.ok) {
        throw new Error("Failed to fetch forecast data");
      }

      const forecastData = await forecastResponse.json();

      // Process data
      const processedData: WeatherData = processWeatherData(
        currentData,
        forecastData,
      );
      setWeatherData(processedData);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Error fetching weather data:", err);
      setError("Failed to load weather data. Please try again later.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };


  const processWeatherData = (current: any, forecast: any): WeatherData => {
    // Process current weather
    const currentTemp = Math.round(current.main.temp);
    const feelsLike = Math.round(current.main.feels_like);
    const humidity = current.main.humidity;
    const windSpeed = Math.round(current.wind.speed * 3.6); // Convert m/s to km/h
    const windDeg = current.wind.deg;
    const condition = current.weather[0].description;
    const icon = current.weather[0].icon;

    // Calculate wind direction
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    const index = Math.round(windDeg / 45) % 8;
    const windDirection = directions[index];

    // Simple heat index calculation (approximation)
    const heatIndex = Math.round(
      currentTemp +
        0.33 *
          (humidity / 100) *
          6.105 *
          Math.exp((17.27 * currentTemp) / (237.7 + currentTemp)) -
        4.25,
    );

    // Process forecast
    const dailyForecasts: Record<string, any[]> = {};

    forecast.list.forEach((item: any) => {
      const date = new Date(item.dt * 1000);
      const dayKey = date.toISOString().split("T")[0];

      if (!dailyForecasts[dayKey]) {
        dailyForecasts[dayKey] = [];
      }
      dailyForecasts[dayKey].push(item);
    });

    const forecastArray = Object.keys(dailyForecasts)
      .slice(0, 5)
      .map((date) => {
        const dayData = dailyForecasts[date];
        const day = new Date(date).toLocaleDateString("en-US", {
          weekday: "short",
        });
        const high = Math.round(
          Math.max(...dayData.map((d: any) => d.main.temp_max)),
        );
        const low = Math.round(
          Math.min(...dayData.map((d: any) => d.main.temp_min)),
        );
        const icon = dayData[0].weather[0].icon;

        return {
          day,
          date,
          high,
          low,
          icon,
        };
      });

    // Determine alert level based on conditions
    let rainfallAlert: AlertLevel = "normal";
    if (
      current.weather[0].main === "Rain" ||
      current.weather[0].main === "Thunderstorm"
    ) {
      rainfallAlert = "orange";
    }

    const heatAlert = heatIndex > 38;

    return {
      location: {
        name: LOCATION_NAME,
        lat: LAT,
        lng: LON,
      },
      current: {
        temp: currentTemp,
        feelsLike,
        humidity,
        windSpeed,
        windDirection,
        condition,
        heatIndex,
        icon,
      },
      forecast: forecastArray,
      alerts: {
        rainfall: rainfallAlert,
        heat: heatAlert,
      },
    };
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const getSafetyTips = () => {
    const tips = [];
    if (weatherData?.alerts.heat) {
      tips.push(
        "Stay hydrated",
        "Limit outdoor activities",
        "Wear light clothing",
      );
    }
    if (weatherData?.alerts.rainfall !== "normal") {
      tips.push(
        "Avoid flood-prone areas",
        "Prepare emergency kit",
        "Monitor updates",
      );
    }
    return tips;
  };

  if (loading && !weatherData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="mx-auto mb-4"
          >
            <Cloud className="h-12 w-12 text-[rgba(18,26,115,1)]" />
          </motion.div>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-[rgba(18,26,115,1)] text-lg font-medium"
            data-testid="text-loading"
          >
            Loading weather data...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  const alert = weatherData?.alerts.rainfall;
  const config = alert && alert !== "normal" ? alertConfig[alert] : null;
  const safetyTips = getSafetyTips();

  let heatIndexLevel = "";
  const heatIndex = weatherData?.current.heatIndex || 0;
  if (heatIndex >= 41) heatIndexLevel = "Extreme Caution";
  else if (heatIndex >= 38) heatIndexLevel = "Danger";
  else if (heatIndex >= 32) heatIndexLevel = "Caution";
  else heatIndexLevel = "Normal";

  // Get background gradient based on weather condition
  const getBackgroundGradient = () => {
    if (!weatherData) return "bg-white";

    const condition = weatherData.current.condition.toLowerCase();
    if (condition.includes("rain")) return "bg-blue-50";
    if (condition.includes("clear")) return "bg-yellow-50";
    if (condition.includes("cloud")) return "bg-gray-100";
    if (condition.includes("thunder")) return "bg-gray-200";
    return "bg-white";
  };

  return (
    <div className={`${getBackgroundGradient()} transition-all duration-1000`}>
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl p-4 mb-6 shadow-md border border-gray-200"
        >
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleBack}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                data-testid="button-back"
              >
                <ArrowLeft size={24} className="text-[rgba(18,26,115,1)]" />
              </motion.button>
              <div>
                <motion.h1
                  initial={{ x: -20 }}
                  animate={{ x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl font-bold text-[rgba(18,26,115,1)]"
                  data-testid="text-city"
                >
                  {weatherData?.location.name || LOCATION_NAME}
                </motion.h1>
              <motion.p
                initial={{ x: -20 }}
                animate={{ x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-[rgba(18,26,115,0.7)]"
                data-testid="text-coordinates"
              >
                {LAT.toFixed(4)}°N, {LON.toFixed(4)}°E
              </motion.p>
              </div>
            </div>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button
                variant="ghost"
                size="sm"
                className="text-[rgba(18,26,115,1)] hover:bg-gray-100"
                onClick={handleRefresh}
                disabled={refreshing}
                data-testid="button-refresh-header"
              >
                <RefreshCw
                  className={`h-5 w-5 ${refreshing ? "animate-spin" : ""}`}
                />
              </Button>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-2"
          >
            <div
              className={`w-3 h-3 rounded-full ${isOnline ? "bg-green-500" : "bg-red-500"} animate-pulse`}
              data-testid="indicator-online-status"
            />
            <span
              className="text-sm text-[rgba(18,26,115,0.7)]"
              data-testid="text-online-status"
            >
              {isOnline ? "Online" : "Offline"}
            </span>
            {lastUpdated && (
              <span className="text-sm text-[rgba(18,26,115,0.7)] ml-2">
                Updated:{" "}
                {lastUpdated.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            )}
          </motion.div>
        </motion.div>

        <div className="space-y-6">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-100 rounded-2xl text-red-800 border border-red-300"
            >
              {error}
            </motion.div>
          )}

          <AnimatePresence>
            {config && showAlert && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="p-4 rounded-2xl flex items-center justify-between"
                style={{ backgroundColor: config.color + "20", border: `1px solid ${config.color}40` }}
                data-testid="banner-alert"
              >
                <div className="flex-1">
                  <p
                    className="text-center font-bold text-lg"
                    style={{ color: config.color }}
                  >
                    {config.icon} {config.label}
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowAlert(false)}
                  className="ml-2 p-1 hover:opacity-70 transition-opacity rounded-full"
                  style={{ color: config.color, backgroundColor: config.color + "20" }}
                  data-testid="button-close-alert"
                >
                  <X size={20} />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {weatherData && (
            <>
              {/* Current Weather Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="p-6 bg-white rounded-3xl shadow-md border border-gray-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-bold text-[rgba(18,26,115,1)] mb-1">Current Weather</h2>
                      <motion.p 
                        className="text-6xl font-bold text-[rgba(18,26,115,1)] mb-2"
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {weatherData.current.temp}°
                      </motion.p>
                      <p className="text-[rgba(18,26,115,0.8)] capitalize text-lg">
                        {weatherData.current.condition}
                      </p>
                    </div>
                    <motion.div 
                      className="text-7xl"
                      initial={{ rotate: -10 }}
                      animate={{ rotate: 0 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                      {weatherIcons[weatherData.current.icon] || "🌤️"}
                    </motion.div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <motion.div 
                      className="flex items-center bg-yellow-50 p-3 rounded-2xl"
                      whileHover={{ scale: 1.03 }}
                    >
                      <Sun className="h-8 w-8 text-[rgba(18,26,115,1)] mr-3" />
                      <div>
                        <p className="text-[rgba(18,26,115,0.7)] text-sm">Feels Like</p>
                        <p className="font-bold text-[rgba(18,26,115,1)] text-lg">
                          {weatherData.current.feelsLike}°
                        </p>
                      </div>
                    </motion.div>

                    <motion.div 
                      className="flex items-center bg-blue-50 p-3 rounded-2xl"
                      whileHover={{ scale: 1.03 }}
                    >
                      <Wind className="h-8 w-8 text-[rgba(18,26,115,1)] mr-3" />
                      <div>
                        <p className="text-[rgba(18,26,115,0.7)] text-sm">Wind</p>
                        <p className="font-bold text-[rgba(18,26,115,1)] text-lg">
                          {weatherData.current.windSpeed} km/h
                        </p>
                      </div>
                    </motion.div>

                    <motion.div 
                      className="flex items-center bg-blue-50 p-3 rounded-2xl"
                      whileHover={{ scale: 1.03 }}
                    >
                      <Droplets className="h-8 w-8 text-[rgba(18,26,115,1)] mr-3" />
                      <div>
                        <p className="text-[rgba(18,26,115,0.7)] text-sm">Humidity</p>
                        <p className="font-bold text-[rgba(18,26,115,1)] text-lg">
                          {weatherData.current.humidity}%
                        </p>
                      </div>
                    </motion.div>

                    <motion.div 
                      className="flex items-center bg-yellow-50 p-3 rounded-2xl"
                      whileHover={{ scale: 1.03 }}
                    >
                      <Cloud className="h-8 w-8 text-[rgba(18,26,115,1)] mr-3" />
                      <div>
                        <p className="text-[rgba(18,26,115,0.7)] text-sm">Heat Index</p>
                        <p className="font-bold text-[rgba(18,26,115,1)] text-lg">
                          {weatherData.current.heatIndex}°
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </Card>
              </motion.div>

              {/* Forecast Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="p-6 bg-white rounded-3xl shadow-md border border-gray-200" data-testid="card-forecast">
                  <h2 className="text-xl font-bold text-[rgba(18,26,115,1)] mb-4">5-Day Forecast</h2>
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {weatherData.forecast.map((day, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                        whileHover={{ y: -10 }}
                        className="flex flex-col items-center min-w-[85px] p-4 rounded-2xl bg-gray-50"
                        data-testid={`forecast-day-${index}`}
                      >
                        <p className="text-[rgba(18,26,115,1)] font-bold mb-2">{day.day}</p>
                        <span className="text-4xl mb-3">
                          {weatherIcons[day.icon] || "🌤️"}
                        </span>
                        <div className="flex flex-col items-center">
                          <p className="text-[rgba(18,26,115,1)] font-bold text-xl">{day.high}°</p>
                          <p className="text-[rgba(18,26,115,0.7)]">{day.low}°</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              </motion.div>

              {/* Heat Index & Safety Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="p-6 bg-white rounded-3xl shadow-md border border-gray-200" data-testid="card-heat-index">
                  <h2 className="text-xl font-bold text-[rgba(18,26,115,1)] mb-4">Heat Index & Safety</h2>
                  <div className="mb-4">
                    <p className="text-[rgba(18,26,115,1)] text-lg flex items-center">
                      <Sun className="h-6 w-6 text-[rgba(18,26,115,1)] mr-2" />
                      Heat Index:{" "}
                      <span className="font-bold ml-2" data-testid="text-heat-index">
                        {weatherData.current.heatIndex}°C
                      </span>
                    </p>
                    <motion.p
                      className={`font-bold mt-2 text-lg ${
                        heatIndexLevel === "Danger" 
                          ? "text-red-600" 
                          : heatIndexLevel === "Caution" 
                          ? "text-orange-600" 
                          : heatIndexLevel === "Extreme Caution" 
                          ? "text-red-700" 
                          : "text-green-600"
                      }`}
                      data-testid="text-heat-level"
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {heatIndexLevel}
                    </motion.p>
                  </div>
                  {safetyTips.length > 0 && (
                    <div className="pt-4 border-t border-gray-200">
                      <p className="font-bold text-[rgba(18,26,115,1)] mb-3 flex items-center">
                        <span className="text-xl mr-2">⚠️</span> Safety Tips:
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {safetyTips.map((tip, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * index }}
                            className="flex items-center bg-yellow-50 p-3 rounded-xl"
                            data-testid={`safety-tip-${index}`}
                          >
                            <div className="w-2 h-2 rounded-full bg-[rgba(18,26,115,1)] mr-3"></div>
                            <p className="text-[rgba(18,26,115,0.9)]">{tip}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              </motion.div>

              {/* Alerts Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="p-6 bg-white rounded-3xl shadow-md border border-gray-200" data-testid="card-alerts">
                  <h2 className="text-xl font-bold text-[rgba(18,26,115,1)] mb-4">Weather Alerts</h2>
                  <div className="space-y-4">
                    <motion.div 
                      className="flex items-center justify-between p-4 rounded-2xl bg-yellow-50"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">🌧️</span>
                        <div>
                          <p className="font-bold text-[rgba(18,26,115,1)]">Rainfall Alert</p>
                          <p className="text-[rgba(18,26,115,0.8)]">
                            {config
                              ? `${config.icon} ${config.label}`
                              : "No alerts"}
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div 
                      className="flex items-center justify-between p-4 rounded-2xl bg-red-50"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">🌡️</span>
                        <div>
                          <p className="font-bold text-[rgba(18,26,115,1)]">Heat Alert</p>
                          <p className="text-[rgba(18,26,115,0.8)]">
                            {weatherData.alerts.heat
                              ? "⚠️ Heat Danger"
                              : "No heat alerts"}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </Card>
              </motion.div>
            </>
          )}

          {/* Refresh Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center py-4"
          >
            <Button
              onClick={handleRefresh}
              disabled={refreshing}
              className="w-full max-w-xs flex items-center gap-2 bg-[rgba(18,26,115,1)] hover:bg-[rgba(18,26,115,0.9)] text-white"
              data-testid="button-refresh"
            >
              <RefreshCw
                className={`h-5 w-5 ${refreshing ? "animate-spin" : ""}`}
              />
              {refreshing ? "Refreshing..." : "Refresh Data"}
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default WeatherOutlook;
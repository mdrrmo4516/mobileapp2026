import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, RefreshCw, Cloud, Sun, Droplets, Wind, ArrowLeft, MapPin, AlertTriangle, Navigation } from "lucide-react";
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
  const [typhoonData, setTyphoonData] = useState({
    name: "Typhoon Yagi",
    currentPosition: { lat: 15.2, lng: 120.5 },
    maxWind: 185,
    movement: { direction: "West", speed: 15 },
    intensity: "Severe Tropical Storm",
    forecastTrack: [
      { day: "Today", position: { lat: 15.2, lng: 120.5 }, intensity: "Severe Tropical Storm" },
      { day: "Tomorrow", position: { lat: 14.8, lng: 119.8 }, intensity: "Typhoon" },
      { day: "Day +2", position: { lat: 14.5, lng: 119.0 }, intensity: "Typhoon" },
      { day: "Day +3", position: { lat: 14.2, lng: 118.2 }, intensity: "Typhoon" },
      { day: "Day +4", position: { lat: 13.9, lng: 117.5 }, intensity: "Tropical Storm" }
    ]
  });

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
    <div className="min-h-screen bg-white flex flex-col max-w-md mx-auto shadow-none relative" style={{ background: "white" }}>
       {/* Header */}
              <header className="bg-[rgba(18,26,115,1)] text-white p-4 sticky top-0 z-20 shadow-sm flex items-center gap-3">
                <button 
                  onClick={() => setLocation("/")}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <ArrowLeft size={24} />
                </button>
                <h1 className="font-bold text-xl tracking-wide uppercase">WEATHER MONITORING</h1>
              </header>

      <div className="max-w-4xl mx-auto px-2 py-4">
       

        {/* Section 1: LOCAL WEATHER MONITORING */}
        <section className="mb-4">
          
            {weatherData && (
              <div className="flex flex-col items-center gap-1">
                {/* Current Weather Card */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl shadow-md border border-gray-200 h-full">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-[rgba(18,26,115,1)] mb-1">Current Weather</h3>
                        <p className="text-[rgba(18,26,115,0.8)]">{weatherData.location.name}</p>
                      </div>
                      <div className="text-5xl">
                        {weatherIcons[weatherData.current.icon] || "🌤️"}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-start mb-4">
                      <motion.p 
                        className="text-4xl font-bold text-[rgba(18,26,115,1)]"
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {weatherData.current.temp}°
                      </motion.p>
                      <span className="text-lg text-[rgba(18,26,115,0.8)] ml-2">
                        Feels like {weatherData.current.feelsLike}°
                      </span>
                      <p className="text-[rgba(18,26,115,0.8)] capitalize text-lg mb-4">
                      {weatherData.current.condition}
                    </p>
                    </div>
                    
                    
                    

                    <div className="grid grid-cols-2 gap-3">
                      <motion.div 
                        className="flex items-center bg-white p-3 rounded-2xl shadow-sm"
                        whileHover={{ scale: 1.03 }}
                      >
                        <Wind className="h-6 w-6 text-[rgba(18,26,115,1)] mr-2" />
                        <div>
                          <p className="text-[rgba(18,26,115,0.7)] text-xs">Wind</p>
                          <p className="font-bold text-[rgba(18,26,115,1)]">
                            {weatherData.current.windSpeed} km/h
                          </p>
                        </div>
                      </motion.div>

                      <motion.div 
                        className="flex items-center bg-white p-3 rounded-2xl shadow-sm"
                        whileHover={{ scale: 1.03 }}
                      >
                        <Droplets className="h-6 w-6 text-[rgba(18,26,115,1)] mr-2" />
                        <div>
                          <p className="text-[rgba(18,26,115,0.7)] text-xs">Humidity</p>
                          <p className="font-bold text-[rgba(18,26,115,1)]">
                            {weatherData.current.humidity}%
                          </p>
                        </div>
                      </motion.div>
                    </div>


                    <div className="grid grid-cols-2 mt-2 gap-3">
                      <motion.div 
                        className="flex items-center bg-white p-3 rounded-2xl shadow-sm"
                        whileHover={{ scale: 1.03 }}
                      >
                        <Wind className="h-6 w-6 text-[rgba(18,26,115,1)] mr-2" />
                        <div>
                          <p className="text-[rgba(18,26,115,0.7)] text-xs">Wind Direction</p>
                          <p className="font-bold text-[rgba(18,26,115,1)]">
                            {weatherData.current.windDirection}
                          </p>
                        </div>
                      </motion.div>

                      <motion.div 
                        className="flex items-center bg-white p-3 rounded-2xl shadow-sm"
                        whileHover={{ scale: 1.03 }}
                      >
                        <Droplets className="h-6 w-6 text-[rgba(18,26,115,1)] mr-2" />
                        <div>
                          <p className="text-[rgba(18,26,115,0.7)] text-xs">Heat Index</p>
                          <p className="font-bold text-[rgba(18,26,115,1)]">
                            {weatherData.current.heatIndex}°C
                          </p>
                        </div>
                        
                      </motion.div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-[rgba(18,26,115,1)] mt-2 mb-2">5-Day Forecast</h3>
                   <div className="grid grid-cols-5 gap-2">
                    {weatherData.forecast.map((day, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                        whileHover={{ y: -10 }}
                        className="flex flex-col justify-between items-start min-w-[85px] p-2 rounded-2xl bg-gray-100"
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
                
                 
                </div>
                  
                </motion.div>

               
              </div>
            )}

        </section>

        {/* Section 2: TYPHOON MONITORING */}
        <section className="mb-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl shadow-md border border-gray-200 p-2"
          >
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <h2 className="text-2xl font-bold text-[rgba(18,26,115,1)]">TYPHOON MONITORING</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-2">
              {/* Satellite Image Card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="p-2 bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl shadow-md border border-gray-200">

                  <div className="flex justify-center">
                    <div className="overflow-hidden border-gray-200 w-full max-w-md">
                      <img 
                        src="https://src.meteopilipinas.gov.ph/repo/mtsat-colored/24hour/latest-him-colored.gif" 
                        alt="Satellite Weather Image" 
                        className="w-full h-auto object-contain"
                      />
                    </div>
                  </div>
                  <p className="text-center text-sm text-gray-500 mt-2">
                    Live Update Himawari-8 Satellite Image
                  </p>
                </Card>
              </motion.div>

              {/* Typhoon Tracking Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="p-6 bg-gradient-to-br from-red-50 to-orange-50 rounded-3xl shadow-md border border-gray-200">
                  <h3 className="text-xl font-bold text-[rgba(18,26,115,1)] mb-4">Typhoon Tracking</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-white rounded-2xl shadow-sm">
                      <span className="text-[rgba(18,26,115,0.8)]">Typhoon Name</span>
                      <span className="font-bold text-[rgba(18,26,115,1)]">{typhoonData.name}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-white rounded-2xl shadow-sm">
                      <span className="text-[rgba(18,26,115,0.8)]">Current Position</span>
                      <span className="font-bold text-[rgba(18,26,115,1)]">
                        {typhoonData.currentPosition.lat}°N, {typhoonData.currentPosition.lng}°E
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-white rounded-2xl shadow-sm">
                      <span className="text-[rgba(18,26,115,0.8)]">Max Wind Speed</span>
                      <span className="font-bold text-[rgba(18,26,115,1)]">{typhoonData.maxWind} km/h</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-white rounded-2xl shadow-sm">
                      <span className="text-[rgba(18,26,115,0.8)]">Movement</span>
                      <span className="font-bold text-[rgba(18,26,115,1)]">
                        {typhoonData.movement.direction} at {typhoonData.movement.speed} km/h
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-white rounded-2xl shadow-sm">
                      <span className="text-[rgba(18,26,115,0.8)]">Intensity</span>
                      <span className="font-bold text-[rgba(18,26,115,1)]">{typhoonData.intensity}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="font-bold text-[rgba(18,26,115,1)] mb-2">Forecast Track</h4>
                    <div className="space-y-2">
                      {typhoonData.forecastTrack.map((day, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * index }}
                          className="flex items-center justify-between p-2 bg-white rounded-xl shadow-sm"
                        >
                          <span className="text-sm text-[rgba(18,26,115,0.8)]">{day.day}</span>
                          <span className="text-sm font-medium text-[rgba(18,26,115,1)]">
                            {day.position.lat}°N, {day.position.lng}°E
                          </span>
                          <span className="text-sm font-medium text-[rgba(18,26,115,1)]">{day.intensity}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>
            
            {/* Typhoon Path Visualization */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6"
            >
              <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl shadow-md border border-gray-200">
                <h3 className="text-xl font-bold text-[rgba(18,26,115,1)] mb-4">Typhoon Path Visualization</h3>
                <div className="relative h-64 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl overflow-hidden">
                  {/* Simulated typhoon path */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Navigation className="h-12 w-12 text-purple-600 mx-auto mb-2" />
                      <p className="text-[rgba(18,26,115,0.8)]">Interactive Typhoon Path Map</p>
                      <p className="text-sm text-[rgba(18,26,115,0.6)]">Real-time tracking visualization</p>
                    </div>
                  </div>
                  
                  {/* Path indicators */}
                  <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                  <div className="absolute top-1/3 left-1/2 w-4 h-4 bg-orange-500 rounded-full animate-pulse"></div>
                  <div className="absolute top-1/2 right-1/3 w-4 h-4 bg-yellow-500 rounded-full animate-pulse"></div>
                  <div className="absolute bottom-1/4 right-1/4 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </section>

        {/* Refresh Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
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
  );
};

export default WeatherOutlook;
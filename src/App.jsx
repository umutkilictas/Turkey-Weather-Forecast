import React, { useState } from "react";
import TurkeyMap from "turkey-map-react";
import { cities } from "./cities";

function App() {
  const [selectedCity, setSelectedCity] = useState(null);
  const [weather, setWeather] = useState(null);
  

  const getWeatherEmoji = (code) => {
    switch (code) {
      case 0: return "☀️";
      case 1: return "🌤️";
      case 2:
      case 3: return "☁️";
      case 45:
      case 48: return "🌫️";
      case 51:
      case 53:
      case 55: return "🌦️";
      case 61:
      case 63:
      case 65: return "🌧️";
      case 71:
      case 73:
      case 75: return "❄️";
      case 80:
      case 81:
      case 82: return "🌦️";
      case 95:
      case 96:
      case 99: return "⛈️";
      default: return "❓";
    }
  };

  // Bugün, Yarın veya kısa gün adı
  const getDayName = (dateStr, index) => {
    if (index === 0) return "Bugün";
    if (index === 1) return "Yarın";
    const date = new Date(dateStr);
    return date.toLocaleDateString("tr-TR", { weekday: "short" }); // Pzt, Sal, Çar...
  };

  const handleCityClick = async ({ name }) => {
    setSelectedCity(name);
    const city = cities[name];
    if (!city) {
      alert("Bu şehir için koordinat bulunamadı!");
      return;
    }

    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=Europe/Istanbul`;
      const response = await fetch(url);
      const data = await response.json();
      setWeather(data);
    } catch (error) {
      alert("Hava durumu alınamadı, tekrar deneyin.");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-purple-300 via-pink-200 to-yellow-200 p-5">
      <h1 className="text-4xl font-extrabold mb-5 text-purple-700 tracking-wide text-center">
      Türkiye Hava Durumu Haritası
      </h1>

      <div className="w-full max-w-[900px]">
        <TurkeyMap onClick={handleCityClick} hoverable={true} />
        
      </div>

      {selectedCity && weather?.daily && (
        <div className="-mt-12 -mb-8 w-full max-w-[900px]">
          <h2 className="text-2xl font-semibold text-center mb-4">{selectedCity}</h2>

          <div className="flex flex-wrap justify-between gap-4">
            {weather.daily.time.map((date, index) => (
              <div
              key={date}
              className={`p-4 rounded-xl shadow flex flex-col items-center w-27
              ${index === 0 ? "bg-yellow-200 border-2 border-yellow-400" : "bg-white bg-opacity-80 backdrop-blur-md"}`}
              >
                <p className="text-sm mb-1">{getDayName(date, index)}</p>
                <p className="text-2xl mb-1">{getWeatherEmoji(weather.daily.weathercode[index])}</p>
                <p className="text-sm font-medium">🌡️ {weather.daily.temperature_2m_max[index]}°C</p>
                <p className="text-sm font-medium">🌡️ {weather.daily.temperature_2m_min[index]}°C</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

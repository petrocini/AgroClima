"use client";

import React, { useState } from "react";
import axios from "axios";
import {
  CloudRain,
  Wind,
  Droplets,
  Search,
  MapPin,
  ThermometerSun,
  Sprout,
  Loader2,
  ArrowRight,
} from "lucide-react";

interface WeatherData {
  temperature: number;
  humidity: number;
  wind_speed: number;
  precipitation: number;
  is_day: number;
  condition_code: number;
}

interface ResponseData {
  city: string;
  data: WeatherData;
  retrieved_at: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function Home() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<ResponseData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim()) return;

    setLoading(true);
    setError("");
    setWeather(null);

    try {
      const response = await axios.get(`${API_BASE_URL}/weather/${city}`);
      setWeather(response.data);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError("Cidade não encontrada. Verifique a grafia.");
      } else {
        setError("Serviço indisponível no momento.");
      }
    } finally {
      setLoading(false);
    }
  };

  const getConditionText = (code: number) => {
    if (code === 0) return "Céu Limpo";
    if (code <= 3) return "Parcialmente Nublado";
    if (code <= 48) return "Neblina";
    if (code <= 67) return "Chuva";
    if (code <= 77) return "Granizo";
    if (code <= 82) return "Pancadas de Chuva";
    if (code <= 99) return "Tempestade";
    return "Desconhecido";
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-agro-600 to-agro-500 z-0 rounded-b-[3rem] shadow-lg" />

      <div className="z-10 w-full max-w-5xl mx-auto px-4 py-8 flex flex-col items-center">
        <header className="w-full flex flex-col items-center mb-10 text-center animate-fade-in">
          <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl mb-4 border border-white/30 shadow-xl">
            <Sprout size={48} className="text-white drop-shadow-md" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow-sm mb-2">
            AgroClima
          </h1>
          <p className="text-agro-50 text-lg font-medium opacity-90">
            Inteligência climática para sua lavoura
          </p>
        </header>

        <div
          className="w-full max-w-xl animate-slide-up"
          style={{ animationDelay: "0.1s" }}
        >
          <form onSubmit={handleSearch} className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search
                className="text-slate-400 group-focus-within:text-agro-500 transition-colors"
                size={24}
              />
            </div>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Busque sua cidade (ex: Londrina, Sorriso)"
              className="w-full py-5 pl-14 pr-16 text-lg bg-white rounded-2xl shadow-xl border-2 border-transparent focus:border-agro-400 focus:ring-4 focus:ring-agro-100 outline-none text-slate-700 placeholder:text-slate-400 transition-all"
            />
            <button
              type="submit"
              disabled={loading || !city}
              className="absolute right-3 top-3 bottom-3 aspect-square bg-agro-600 hover:bg-agro-700 disabled:bg-slate-300 text-white rounded-xl flex items-center justify-center transition-all shadow-md hover:shadow-lg disabled:shadow-none"
            >
              {loading ? <Loader2 className="animate-spin" /> : <ArrowRight />}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 flex items-center gap-3 animate-fade-in shadow-sm">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              {error}
            </div>
          )}
        </div>

        {weather && (
          <div className="w-full mt-12 animate-slide-up">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 px-2">
              <div className="flex items-center gap-3">
                <MapPin className="text-agro-600 mb-1" size={28} />
                <div>
                  <h2 className="text-3xl font-bold text-slate-800">
                    {weather.city}
                  </h2>
                  <p className="text-slate-500 font-medium">
                    {getConditionText(weather.data.condition_code)}
                  </p>
                </div>
              </div>
              <span className="text-xs text-slate-400 mt-2 md:mt-0 font-mono bg-white px-2 py-1 rounded border border-slate-100">
                Atualizado:{" "}
                {new Date().toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white p-6 rounded-3xl shadow-agro border border-slate-100 relative group overflow-hidden hover:-translate-y-1 transition-transform duration-300">
                <div className="absolute top-0 right-0 w-24 h-24 bg-orange-100 rounded-bl-[4rem] -mr-4 -mt-4 transition-transform group-hover:scale-110" />
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-200 mb-4">
                    <ThermometerSun size={24} />
                  </div>
                  <p className="text-slate-500 font-medium text-sm uppercase tracking-wide">
                    Temperatura
                  </p>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-4xl font-extrabold text-slate-800">
                      {weather.data.temperature}
                    </span>
                    <span className="text-xl text-slate-400 font-medium">
                      °C
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-agro border border-slate-100 relative group overflow-hidden hover:-translate-y-1 transition-transform duration-300">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100 rounded-bl-[4rem] -mr-4 -mt-4 transition-transform group-hover:scale-110" />
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200 mb-4">
                    <CloudRain size={24} />
                  </div>
                  <p className="text-slate-500 font-medium text-sm uppercase tracking-wide">
                    Precipitação
                  </p>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-4xl font-extrabold text-slate-800">
                      {weather.data.precipitation}
                    </span>
                    <span className="text-xl text-slate-400 font-medium">
                      mm
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-agro border border-slate-100 relative group overflow-hidden hover:-translate-y-1 transition-transform duration-300">
                <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-100 rounded-bl-[4rem] -mr-4 -mt-4 transition-transform group-hover:scale-110" />
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-cyan-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-cyan-200 mb-4">
                    <Droplets size={24} />
                  </div>
                  <p className="text-slate-500 font-medium text-sm uppercase tracking-wide">
                    Umidade
                  </p>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-4xl font-extrabold text-slate-800">
                      {weather.data.humidity}
                    </span>
                    <span className="text-xl text-slate-400 font-medium">
                      %
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-agro border border-slate-100 relative group overflow-hidden hover:-translate-y-1 transition-transform duration-300">
                <div className="absolute top-0 right-0 w-24 h-24 bg-slate-200 rounded-bl-[4rem] -mr-4 -mt-4 transition-transform group-hover:scale-110" />
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-slate-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-slate-300 mb-4">
                    <Wind size={24} />
                  </div>
                  <p className="text-slate-500 font-medium text-sm uppercase tracking-wide">
                    Vento
                  </p>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-4xl font-extrabold text-slate-800">
                      {weather.data.wind_speed}
                    </span>
                    <span className="text-xl text-slate-400 font-medium">
                      km/h
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <footer className="mt-12 text-slate-400 text-sm font-medium">
          AgroClima © {new Date().getFullYear()} • Lucas Petrocini
        </footer>
      </div>
    </main>
  );
}

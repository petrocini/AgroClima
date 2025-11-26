import httpx
import logging
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timedelta
from cachetools import TTLCache

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="API Clima Rural",
    description="Wrapper para Open-Meteo focado em produtores rurais",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

weather_cache = TTLCache(maxsize=100, ttl=600)

class WeatherData(BaseModel):
    temperature: float
    humidity: int
    wind_speed: float
    precipitation: float
    is_day: int
    condition_code: int

class CityWeatherResponse(BaseModel):
    city: str
    latitude: float
    longitude: float
    data: WeatherData
    retrieved_at: str

async def get_coordinates(city_name: str):
    """Busca latitude e longitude de uma cidade."""
    url = "https://geocoding-api.open-meteo.com/v1/search"
    params = {"name": city_name, "count": 1, "language": "pt", "format": "json"}
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, params=params)
            response.raise_for_status()
            data = response.json()
            
            if not data.get("results"):
                return None
                
            return data["results"][0]
        except httpx.HTTPError as e:
            logger.error(f"Erro na API de Geocoding: {e}")
            raise HTTPException(status_code=503, detail="Serviço de localização indisponível")

async def get_meteo_data(lat: float, lon: float):
    """Busca dados climáticos baseados na lat/lon."""
    url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": lat,
        "longitude": lon,
        "current": "temperature_2m,relative_humidity_2m,is_day,precipitation,rain,weather_code,wind_speed_10m",
        "timezone": "auto"
    }

    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, params=params)
            response.raise_for_status()
            return response.json()
        except httpx.HTTPError as e:
            logger.error(f"Erro na API Open-Meteo: {e}")
            raise HTTPException(status_code=503, detail="Serviço de clima indisponível")

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.get("/weather/{city}", response_model=CityWeatherResponse)
async def get_weather_by_city(city: str):
    """
    Retorna o clima atual para uma cidade específica.
    Utiliza cache para evitar chamadas repetitivas.
    """
    city_clean = city.strip().lower()
    
    if city_clean in weather_cache:
        logger.info(f"Cache hit para: {city}")
        return weather_cache[city_clean]

    location = await get_coordinates(city)
    if not location:
        raise HTTPException(status_code=404, detail=f"Cidade '{city}' não encontrada.")

    lat = location["latitude"]
    lon = location["longitude"]
    real_name = f"{location['name']}, {location.get('admin1', '')} - {location.get('country_code', '')}"

    meteo = await get_meteo_data(lat, lon)
    current = meteo.get("current", {})

    response_data = CityWeatherResponse(
        city=real_name,
        latitude=lat,
        longitude=lon,
        data=WeatherData(
            temperature=current.get("temperature_2m"),
            humidity=current.get("relative_humidity_2m"),
            wind_speed=current.get("wind_speed_10m"),
            precipitation=current.get("precipitation", 0.0),
            is_day=current.get("is_day"),
            condition_code=current.get("weather_code")
        ),
        retrieved_at=datetime.now().isoformat()
    )

    weather_cache[city_clean] = response_data
    
    return response_data
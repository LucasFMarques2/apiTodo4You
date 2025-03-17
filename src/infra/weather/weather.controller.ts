import { Controller, Get, Query, Req } from '@nestjs/common'
import { WeatherService } from './weather.service'
import { Request } from 'express'

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get()
  async getWeather(
    @Req() req: Request,
    @Query('lat') lat?: number,
    @Query('lon') lon?: number,
  ) {
    let city = 'Brasilia' // Fallback padrão

    if (lat && lon) {
      // Usa coordenadas se disponíveis
      return this.weatherService.getWeatherByCoords(lat, lon)
    } else {
      // Mantém a lógica de IP
      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
      city = await this.weatherService.getUserCity(ip as string)
      return this.weatherService.getWeather(city)
    }
  }
}

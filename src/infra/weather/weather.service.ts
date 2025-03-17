import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { HttpService } from '@nestjs/axios'
import { firstValueFrom } from 'rxjs'
import { Env } from '@/env'
import { isAxiosError } from 'axios'

@Injectable()
export class WeatherService {
  private weatherApiKey: string
  private weatherApiUrl = 'https://api.openweathermap.org/data/2.5/weather'
  private geoApiUrl = 'https://ipapi.co'

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService<Env, true>,
  ) {
    this.weatherApiKey = this.configService.get('OPENWEATHER_API_KEY', {
      infer: true,
    })
    console.log('Chave API:', this.weatherApiKey)
  }

  async getUserCity(ip: string): Promise<string> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.geoApiUrl}/${ip}/json/`),
      )
      return response.data.city || 'Brasilia'
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error fetching city from IP:', error.message)
      } else {
        console.error('Unknown error occurred while fetching city')
      }
      return 'Brasilia'
    }
  }

  async getWeather(city: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(this.weatherApiUrl, {
          params: {
            q: city,
            appid: this.weatherApiKey,
            units: 'metric',
            lang: 'pt',
          },
        }),
      )

      return {
        city: response.data.name,
        temp: Math.round(response.data.main.temp),
        icon: response.data.weather[0].main.toLowerCase().includes('rain')
          ? 'rain'
          : 'sun',
      }
    } catch (error) {
      if (isAxiosError(error)) {
        console.error(
          'Weather API Error:',
          error.response?.data || error.message,
        )
      } else if (error instanceof Error) {
        console.error('Weather Error:', error.message)
      } else {
        console.error('Unknown weather error occurred')
      }
      throw new Error('Failed to fetch weather data')
    }
  }

  async getWeatherByCoords(lat: number, lon: number) {
    const response = await firstValueFrom(
      this.httpService.get(this.weatherApiUrl, {
        params: {
          lat,
          lon,
          appid: this.weatherApiKey,
          units: 'metric',
          lang: 'pt',
        },
      }),
    )

    return {
      city: response.data.name,
      temp: Math.round(response.data.main.temp),
      icon: response.data.weather[0].main.toLowerCase().includes('rain')
        ? 'rain'
        : 'sun',
    }
  }
}

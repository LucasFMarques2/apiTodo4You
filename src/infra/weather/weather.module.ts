// weather.module.ts
import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios' // Importe o HttpModule
import { ConfigModule } from '@nestjs/config' // Importe o ConfigModule
import { WeatherService } from './weather.service'
import { WeatherController } from './weather.controller'

@Module({
  imports: [
    HttpModule, // Adicione esta linha
    ConfigModule, // Adicione esta linha se precisar de configurações específicas
  ],
  providers: [WeatherService],
  controllers: [WeatherController],
})
export class WeatherModule {}

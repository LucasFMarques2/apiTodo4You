// weather.module.ts
import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { ConfigModule } from '@nestjs/config'
import { WeatherService } from './weather.service'
import { WeatherController } from './weather.controller'

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [WeatherService],
  controllers: [WeatherController],
})
export class WeatherModule {}

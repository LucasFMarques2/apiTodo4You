import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { envSchemma } from './env'
import { AuthModule } from './auth/auth.module'
import { HttpModule } from './http/http.module'
import { WeatherModule } from './weather/weather.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchemma.parse(env),
      isGlobal: true,
    }),
    AuthModule,
    HttpModule,
    WeatherModule,
  ],
})
export class AppModule {}

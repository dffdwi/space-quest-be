import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import pg from 'pg';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { GameConfigModule } from './modules/game-config/game-config.module';
import { TaskModule } from './modules/task/task.module';
import { ProjectModule } from './modules/project/project.module';
import { GameModule } from './modules/game/game.module';
import { BadgeModule } from './modules/badge/badge.module';
import { MissionModule } from './modules/mission/mission.module';
import { ShopModule } from './modules/shop/shop.module';
import { DailyModule } from './modules/daily/daily.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SequelizeModule.forRoot({
      username: process.env.DB_USERNAME || 'userpsql',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'bmusic_development',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5433'),
      dialect: 'postgres',
      autoLoadModels: true,
      synchronize: false,
      dialectModule: pg,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '3600s',
        },
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    GameConfigModule,
    TaskModule,
    ProjectModule,
    GameModule,
    BadgeModule,
    MissionModule,
    ShopModule,
    DailyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

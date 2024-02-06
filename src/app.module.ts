import { Module } from '@nestjs/common';
import { RouterModule, Routes } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config'; // Added ConfigModule and ConfigService
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RequestContextModule } from 'nestjs-request-context';
import { LinkedinModule } from './module/linkedIn/linkedIn.module';

const routes: Routes = [
  {
    path: '/api',
    children: [
      { path: '/linkedin', module: LinkedinModule },
    ],
  },
];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LinkedinModule,
    RouterModule.register(routes),
    RequestContextModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ConfigService, // Added ConfigService
  ],
})
export class AppModule {}

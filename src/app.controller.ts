import { Controller, Get } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Controller()
export class AppController {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  @Get('health')
  health() {
    return {
      status: 'ok',
      db: this.dataSource.isInitialized ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString(),
    };
  }
}

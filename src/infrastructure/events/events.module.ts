import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { NestEventBus } from './nest-event-bus';

@Module({
  imports: [
    EventEmitterModule.forRoot({
      wildcard: false,
      delimiter: '.',
    }),
  ],
  providers: [
    {
      provide: 'EventBus',
      useClass: NestEventBus,
    },
  ],
  exports: ['EventBus'],
})
export class EventsModule {}
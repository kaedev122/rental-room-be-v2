import type { Provider } from '@nestjs/common';
import { Global, Module } from '@nestjs/common';
import { ApiConfigService } from './services/api-config.service';
import { SharedController } from './shared.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { HttpModule } from '@nestjs/axios';
import {
  GeneratorService,
  TranslationService,
  ValidatorService,
} from './services';

const providers: Provider[] = [
  ApiConfigService,
  ValidatorService,
  GeneratorService,
  TranslationService,
];

@Global()
@Module({
  providers,
  imports: [CqrsModule, HttpModule],
  exports: [...providers, CqrsModule],
  controllers: [SharedController],
})
export class SharedModule {}

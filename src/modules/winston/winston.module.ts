import { DynamicModule, Global, Module } from '@nestjs/common';
import { WinstonModuleOptions } from 'nest-winston';
import {
  createWinstonAsyncProviders,
  createWinstonProviders,
} from './winston.providers';
import { IWinstonModuleAsyncOptions } from './winston.interfaces';

@Global()
@Module({})
export class WinstonModule {
  /**
   * Constructor for winston module
   * @param options
   */
  public static forRoot(options: WinstonModuleOptions): DynamicModule {
    const providers = createWinstonProviders(options);

    return {
      module: WinstonModule,
      providers,
      exports: providers,
    };
  }

  /**
   * Asynchronous constructor for winston module
   * @param options
   */
  public static forRootAsync(
    options: IWinstonModuleAsyncOptions,
  ): DynamicModule {
    const providers = createWinstonAsyncProviders(options);

    return {
      module: WinstonModule,
      imports: options.imports,
      providers,
      exports: providers,
    };
  }
}

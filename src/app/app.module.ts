import { join } from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { HttpModule } from '@nestjs/axios';
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from '@apollo/server/plugin/landingPage/default';

//Propio
import { config, validationENV } from './../config/config';

import { ProductsModule, UsersModule } from '../components';

const isProduction = process.env.STATE === 'PROD';

const apolloPlugin = isProduction
  ? ApolloServerPluginLandingPageProductionDefault
  : ApolloServerPluginLandingPageLocalDefault;

@Module({
  imports: [
    //?Modulo de Ve Variables de Entorno
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
      load: [config],
      validationSchema: validationENV(),
    }),

    //?Modulo de MongoDb
    MongooseModule.forRootAsync({
      inject: [config.KEY],
      useFactory: (configService: ConfigType<typeof config>) => {
        return {
          uri: configService.URI_MONGO,
        };
      },
    }),

    //? Modulo Http
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 5000,
        maxRedirects: 5,
      }),
    }),

    //?Modulo de Graphql
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      //autoSchemaFile: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      persistedQueries: false,
      fieldResolverEnhancers: ['interceptors'],
      plugins: [apolloPlugin()],
      context: ({ req }) => ({ req }),
      introspection: isProduction ? false : true,
    }),

    //?Modulo de Usuarios
    UsersModule,

    //?Modulo Products
    ProductsModule,
  ],
})
export class AppModule {}

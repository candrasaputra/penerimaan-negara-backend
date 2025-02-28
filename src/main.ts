import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
    app.enableCors({
        origin: process.env.UI_DOMAIN, // frontends domain
        credentials: true
    })

  await app.listen(8080);
}
bootstrap();

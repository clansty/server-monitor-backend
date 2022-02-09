import Koa from "koa";
import { createLogger } from "bunyan";
import { parseJSON, writeJSON } from "./parser/index";
import KoaCors from "@koa/cors";
import router, { addRouter } from "./router/index";
import { createServer } from "http";

const logger = createLogger({
  stream: process.stdout,
  name: "http server",
});

const app = new Koa();

interface TestData {
  info: string;
  code: number;
}

// test
addRouter({
  path: "/json",
  middlewares: [
    parseJSON,
    async (ctx, next) => {
      // 如果解析post body成功json会挂在ctx.state.data上
      // 不成功的话不会到这里
      const data = <TestData>ctx.state.data;
      data.info += " ok";
      data.code = 1;
      await next();
    },
    writeJSON,
  ],
  method: "post",
});

const getServer = () => {
  app.use(KoaCors());
  app.use(async (context, next) => {
    const { url, method } = context.req;
    logger.info({ url, method });
    await next();
  });

  app.use(router.allowedMethods()).use(router.routes());
  return app.callback();
};

export const startApp = (port: number) => {
  return new Promise<void>((resolve)=> {
    const server = createServer(getServer());
    server.listen(port, resolve);
  })
};

export { app };

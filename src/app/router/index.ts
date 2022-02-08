import { Middleware } from "koa";
import Router from "koa-router";

const router = new Router();

interface RouterOptions {
  method?: "get" | "post";
  middlewares?: Middleware[];
  path: string;
}
export const addRouter = (
  { path, middlewares = [], method = "get" }: RouterOptions
) => {
  router[method](path, ...middlewares);
};

export default router;

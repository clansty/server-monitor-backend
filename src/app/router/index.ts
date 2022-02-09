import { Middleware } from "koa";
import Router from "koa-router";
import ServerInfoController from '../controllers/ServerInfoController';
import { writeJSON } from '../parser/index';

const router = new Router();

router.get('/server/infos', ServerInfoController.getInfo, writeJSON);

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

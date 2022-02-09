import config from "../../config";
import ServerClient from "../../command/server";
import { handleInfo } from "../../command/index";
import { Context, Middleware } from "koa";

const ServerArr: Array<ServerClient> = [];

config.servers.forEach((server) => {
  ServerArr.push(new ServerClient(server, config.command));
});
export default class ServerInfoController {
  public static  getInfo:Middleware = async (ctx: Context, next) => {
    const res: Record<string, any> = {};
    for (let i = 0; i < ServerArr.length; i++) {
      const client = ServerArr[i];
      const info = await client.getInfo();
      res[client.name] = info ? handleInfo(info) : {};
    }
    console.log("res: " + res);
    ctx.state.data = res;
    await next();
  }
}

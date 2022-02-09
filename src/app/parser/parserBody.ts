import { Context, Middleware } from "koa";

export type BodyParser = (data: string) => any;

export async function getBodyStr(ctx: Context) {
  const bufs: Buffer[] = [];

  for await (const chunk of ctx.req) {
    bufs.push(chunk);
  }

  return Buffer.concat(bufs).toString();
}

export const parseBodyHelper = async <T>(ctx: Context, parser: BodyParser) => {
  const data = await getBodyStr(ctx);

  if (data.length === 0) return;

  try {
    return <T>parser(data);
  } catch (e: any) {
    console.log(e);
    return;
  }
};

export const parseBody: (parser: BodyParser) => Middleware =
  (parser: BodyParser) => async (context, next) => {
    const result = await parseBodyHelper(context, parser);
    if (result === undefined) {
      context.body = "illegal body";
      return;
    }
    context.state.data = result;
    await next();
  };

type BodyWriter = (data: any) => string;

export const writeBody =
  (writer: BodyWriter): Middleware =>
  async (context, next) => {
    const data = context.state.data;
    if (data) {
      try {
        context.body = Buffer.from(writer(data));
        return;
      } catch (e: any) {
        context.body = {
          info: "write err",
          e,
        };
      }
    }

    context.status = 503;
  };

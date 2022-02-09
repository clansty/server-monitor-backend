import { parse } from "yaml";
import { readFileSync } from "fs";
import { ClientConfig } from "./command/server";
import path from "path";

export type Servers = Array<ClientConfig>;

class Config {
  static instance: Config;
  servers: Servers = [];
  command: Record<string, string> = {};
  static getInstance() {
    if (Config.instance) {
      return Config.instance;
    }
    Config.instance = new Config();
    const buffer = readFileSync(
      path.resolve(__dirname, "../server.yaml"),
      "utf-8"
    );
    const config = parse(buffer);
    Config.instance.setConfig(config);
    return Config.instance;
  }

  setConfig(config: any) {
    this.servers = config["severs"];
    this.command = config["command"];
  }
}

export default Config.getInstance();

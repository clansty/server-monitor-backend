import { Client, ConnectConfig } from "ssh2";
import { readFileSync } from "fs";

export interface ClientConfig extends ConnectConfig {
  username: string;
  privateKey?: string | Buffer;
  name: string;
}

// todo
export default class ServerClient {
  con: Client;
  config: ClientConfig;
  cmd: Record<string, string>;
  name: string;
  constructor(config: ClientConfig, cmd: Record<string, string>) {
    this.cmd = cmd;
    this.con = new Client();
    this.config = config;
    this.name = config.name;
    if (typeof this.config.privateKey === "string") {
      this.config.privateKey = readFileSync(this.config.privateKey);
    }
  }

  public start() {
    return new Promise((resolve, reject) => {
      this.config.readyTimeout! > 0 &&
        setTimeout(() => {
          reject("timeout");
        }, this.config.readyTimeout);
      this.con
        .on("ready", () => {
          resolve(true);
        })
        .connect(this.config);
    });
  }

  public exec(command: string, wait = 0) {
    return new Promise((resolve, reject) => {
      wait > 0 &&
        setTimeout(() => {
          reject("timeout");
        }, wait);
      this.start().then(
        () => {
          this.con.shell((err, stream) => {
            if (err) {
              return reject(err);
            }
            let count = 0;
            stream.on("data", (data: Buffer) => {
              if (!count) {
                stream.end(command + "\nexit\n");
              }
              count++;
              if (count === 4) {
                resolve(data.toString());
              }
            });
          });
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  public async getInfo() {
    let res: Record<string, any> = {};
    try {
      const keys = Object.keys(this.cmd);
      for (let i = 0; i < keys.length; i++) {
        res[keys[i]] = await this.exec(this.cmd[keys[i]]);
      }
      return res;
    } catch (e) {
      return null;
    }
  }
  public shell(callback: (event: "error" | "data", res: any) => void) {
    this.start().then(
      () => {
        this.con.shell((err, stream) => {
          if (err) {
            callback("error", err);
          }
          let input = false;
          stream
            .on("data", (data: Buffer) => {
              if (!input) {
                input = true;
                stream.end(this.cmd.cpu + "\nexit\n");
              } else {
                callback("data", data.toString("ascii"));
              }
            })
            .on("close", () => {
              this.con.end();
            });
        });
      },
      (err) => {
        callback("error", err);
      }
    );
  }
}

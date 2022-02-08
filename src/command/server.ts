import { Client, ConnectConfig } from "ssh2";
import { readFileSync } from "fs";

interface ClientConfig extends ConnectConfig {
  username: string;
  privateKey: string | Buffer;
}

// todo
class ServerClient {
  con: Client;
  config: ClientConfig;
  constructor(config: ClientConfig) {
    this.con = new Client();
    this.config = config;
    if (typeof this.config.privateKey === "string") {
      this.config.privateKey = readFileSync(this.config.privateKey);
    }
  }

  public start() {
    this.con.connect(this.config);
  }

  public async exec(command: string, wait = 5000) {
    return new Promise((resolve, reject) => {
      wait > 0 &&
        setTimeout(() => {
          reject("timeout");
        }, wait);
      this.con.exec(command, (err, stream) => {
        if (err) throw err;
        stream.on("data", (data: string) => {
          resolve(data);
        });
      });
    });
  }
}

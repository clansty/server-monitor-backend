import config from "./config";
import ServerClient from "./command/server";
import { cpuAndMemStringHandle,loadavgStringHandle } from './command/shellStringHandle';

const testServer = new ServerClient(config.servers[0], config.command);

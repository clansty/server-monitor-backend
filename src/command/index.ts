import {
  loadavgStringHandle,
  cpuAndMemStringHandle,
} from "./shellStringHandle";
export const handleInfo = (info: Record<string, any>) => {
  const keys = Object.keys(info);
  for (let i = 0; i < keys.length; i++) {
    if (keys[i] === "loadavg") {
      info[keys[i]] = loadavgStringHandle(info[keys[i]]);
    }
    if (keys[i] === "cpu" || keys[i] === "memory") {
      info[keys[i]] = cpuAndMemStringHandle(info[keys[i]]);
    }
  }
  return info
};

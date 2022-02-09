import { Console } from "console";
import { format } from "util";

const TaskReg = /(?<=Tasks: )[0-9]*/im;
const TimeReg = /(?<=top - ).*?(?= up)/im;
const RunningReg = /[0-9]*?(?= running)/i;
const SleepingReg = /[0-9]*?(?= sleeping)/i;
const CpuLineReg = /(?<=%Cpu\(s\):).*/i;
const MemoryLineReg = /(?<=KiB Mem :).*/i;
const filterReg = /(([0-9]|\.)|[A-Za-z])*/gi;

export const constants = {
  task: 0b00000001,
  time: 0b00000010,
  running: 0b00000100,
  sleeping: 0b00001000,
  cpu: 0b00010000,
  memory: 0b00100000,
};

export const getTopCMDInfo = (str: string, info: number = 0) => {
  const res: Record<string, any> = {};
  console.log(str);
  if (info & constants.cpu) {
    res.cpu = str.match(CpuLineReg)?.[0];
  }
  //   if (info & constants.memory) {
  //     res.memory = str
  //       .match(MemoryLineReg)?.[0]
  //       .split(",")
  //       .map((item) => item?.trimEnd().trimStart().split(" "))
  //       .reduce((memory, i) => {
  //         memory[i[1]] = i[0];
  //         return memory;
  //       }, {} as any);
  //   }
  if (info & constants.time) {
    res.time = str.match(TimeReg)?.[0];
  }
  return res;
};

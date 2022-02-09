export const cpuAndMemStringHandle = (str: string) => {
  const res: Record<string, string> = {};
  str = str.replaceAll("\t", "");
  str.split("\r\n").forEach((item) => {
    const [key, value] = item.split(":");
    if (key) {
      res[key] = value;
    }
  });
  return res;
};

export const loadavgStringHandle = (str: string) => {
  const loadavgArr = str.split(" ");
  return {
    min1: loadavgArr[0],
    min5: loadavgArr[1],
    min15: loadavgArr[2],
    processPercent: loadavgArr[3],
  };
};

import { parseBody, writeBody } from './parserBody';

export const parseJSON = parseBody(data => JSON.parse(data));
export const writeJSON = writeBody(data => JSON.stringify(data));
import { v4 as uuidv4 } from 'uuid';
import { defaultIdPrefix } from "../config";

/** 随机一个id */
export const createNodeId = () => {
  return `${defaultIdPrefix}${uuidv4()}`;
}

export * from './data';
export * from './cell';
export * from './zIndex';
export * from './rect';
export * from './rules';

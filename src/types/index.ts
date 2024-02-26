export interface ApiCommonRes<T> {
  code: number;
  message: string;
  data: T;
}

export type CmdbBizRoomConfigurationGetTreeListGetResData = {
  id: string;
  name: string;
  children: {
    id: number;
    name: string;
    type: string;
    icon: string;
  }[];
}[];

export type CmdbBizRoomConfigurationGetTreeListGetRes = ApiCommonRes<CmdbBizRoomConfigurationGetTreeListGetResData>;

export interface CmdbBizRoomConfigurationFindGetParams {
  roomId: string;
}

export type CmdbBizRoomConfigurationFindGetResData = string;

export type CmdbBizRoomConfigurationFindGetRes = ApiCommonRes<CmdbBizRoomConfigurationFindGetResData>;

export interface CmdbBizRoomConfigurationGetWaitGetParams {
  roomId: string;
}

export type CmdbBizRoomConfigurationGetWaitGetResData = {
  id: number;
  name: string;
  icon: string;
  type: string;
}[];

export type CmdbBizRoomConfigurationGetWaitGetRes = ApiCommonRes<CmdbBizRoomConfigurationGetWaitGetResData>;

export type CmdbBizRackEquTreeGetResData = {
  id: string;
  name: string;
  type: string;
  children: {
    id: number;
    name: string;
    type: string;
    icon?: string;
  }[];
}[];

export type CmdbBizRackEquTreeGetRes = ApiCommonRes<CmdbBizRackEquTreeGetResData>;

export interface CmdbBizScreenRackRateGetParams {
  roomId: string;
}

export interface CmdbBizScreenRackRateGetResData {
  netPort: string;
  fiberPort: string;
  u: string;
  itNum: number;
  pload: string;
  rackNum: number;
  rackList: {
    id: number;
    rateU: number;
    ploadRate: number;
    fiberPortRate: number;
    netPortRate: number;
    maxRate: number;
  }[];
}

export type CmdbBizScreenRackRateGetRes = ApiCommonRes<CmdbBizScreenRackRateGetResData>;

export interface CmdbBizScreenConfigurationListGetParams {
  roomId: string;
}

export type CmdbBizScreenConfigurationListGetResData = {
  id: number;
  name: string;
  type: string;
}[];

export type CmdbBizScreenConfigurationListGetRes = ApiCommonRes<CmdbBizScreenConfigurationListGetResData>;

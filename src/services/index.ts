import request from "@/utils/request";
import * as i from '@/types';

export async function cmdbBizRoomConfigurationGetTreeListGet(): Promise<i.CmdbBizRoomConfigurationGetTreeListGetRes> {
  return request('/cmdb/biz/roomConfiguration/getTreeList', {
    method: 'GET',
  });
}

export async function cmdbBizRoomConfigurationFindGet(params: i.CmdbBizRoomConfigurationFindGetParams): Promise<i.CmdbBizRoomConfigurationFindGetRes> {
  return request('/cmdb/biz/roomConfiguration/find', {
    method: 'GET',
    params,
  });
}

export async function cmdbBizRoomConfigurationGetWaitGet(params: i.CmdbBizRoomConfigurationGetWaitGetParams): Promise<i.CmdbBizRoomConfigurationGetWaitGetRes> {
  return request('/cmdb/biz/roomConfiguration/getWait', {
    method: 'GET',
    params,
  });
}

export async function cmdbBizRackEquTreeGet(): Promise<i.CmdbBizRackEquTreeGetRes> {
  return request('/cmdb/biz/rackEqu/tree', {
    method: 'GET',
  });
}

export async function cmdbBizScreenRackRateGet(params: i.CmdbBizScreenRackRateGetParams): Promise<i.CmdbBizScreenRackRateGetRes> {
  return request('/cmdb/biz/screen/rackRate', {
    method: 'GET',
    params,
  });
}

export async function cmdbBizScreenConfigurationListGet(params: i.CmdbBizScreenConfigurationListGetParams): Promise<i.CmdbBizScreenConfigurationListGetRes> {
  return request('/cmdb/biz/screen/configurationList', {
    method: 'GET',
    params,
  });
}

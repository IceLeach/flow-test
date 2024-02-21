import { cloneDeep } from 'lodash';

const mapCompleteFunction: {
  [key: string]: (
    drawData: any,
    id: string,
    nameList: { [key: string]: string },
  ) => any | undefined;
} = {
  ROOM: (drawData: any, id, nameList) => {
    // console.log('nameList', drawData, nameList);
    const completeData = cloneDeep(drawData);
    completeData.components = completeData.components.filter((c: any) => {
      if (!c.data?.id) {
        return true;
      } else if (nameList[c.data.id]) {
        return true;
      } else {
        return false;
      }
    });
    completeData.components.forEach((component: any) => {
      if (component.data?.id) {
        component.data.name = nameList[component.data.id] ?? component.data.name;
        // if (component.data.type === 'cabinetGroup') {
        //   component.data.name = nameList[`SPACE_${component.data.id}`] ?? component.data.name;
        // } else {
        //   component.data.name = nameList[`EQUIP_${component.data.id}`] ?? component.data.name;
        // }
      }
    });
    return completeData;
  },
  MICROMODULE: (drawData: any, id, nameList) => {
    // console.log('drawData', id, drawData);
    const component = drawData?.components?.find((c: any) => c.data.id === `SPACE_${id}`);
    if (component) {
      const completeData = {
        data: {
          ...component.data,
        },
        components: component.data.components ?? [],
      };
      if (completeData.data.components) {
        delete completeData.data.components;
      }
      completeData.components.forEach((c: any) => {
        if (c.data?.id) {
          c.data.name = nameList[c.data.id] ?? c.data.name;
        }
      });
      return completeData;
    }
    return undefined;
  },
};
export const getCompleteMapData = (
  category: string,
  drawData: any,
  componentId: string,
  nameList: { [key: string]: string },
) => {
  if (mapCompleteFunction[category]) {
    const completeData = mapCompleteFunction[category](drawData, componentId, nameList);
    return completeData;
  }
  return undefined;
};

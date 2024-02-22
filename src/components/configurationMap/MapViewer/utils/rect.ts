import { Node } from "@antv/x6";
import { polygon } from '@turf/helpers';
import intersect from '@turf/intersect';
import booleanContains from '@turf/boolean-contains';

/** 点坐标 [x,y] */
type NodePoint = [number, number];

/** 顶点集合 [左上,右上,右下,左下] */
type NodePoints = [NodePoint, NodePoint, NodePoint, NodePoint];

/** 获取中心点坐标 */
export const getNodeCenter = (node: Node): NodePoint => {
  const position = node.getPosition();
  const size = node.getSize();
  const { x, y } = position;
  const { width, height } = size;
  return [x + width / 2, y + height / 2];
}

/** 获取点经过旋转后的坐标 */
export const pointAfterRotate = (data: { point: NodePoint; center: NodePoint; angle: number }): NodePoint => {
  const { point, center, angle } = data;
  const radians = (Math.PI / 180) * angle;
  const [pointX, pointY] = point;
  const [centerX, centerY] = center;
  const pointXZero = pointX - centerX;
  const pointYZero = pointY - centerY;
  // x' = xcosθ - ysinθ
  const newPointX = pointXZero * Math.cos(radians) - pointYZero * Math.sin(radians) + centerX;
  // y' = xsinθ + ycosθ
  const newPointY = pointXZero * Math.sin(radians) + pointYZero * Math.cos(radians) + centerY;
  return [newPointX, newPointY];
}

/** 获取组件节点的顶点坐标 */
export const getNodePoints = (node: Node): NodePoints => {
  const position = node.getPosition();
  const size = node.getSize();
  const angle = node.getAngle();
  const { x, y } = position;
  const { width, height } = size;
  const nodeCenter = getNodeCenter(node);
  const leftTop: NodePoint = [x, y];
  const rightTop: NodePoint = [x + width, y];
  const rightBottom: NodePoint = [x + width, y + height];
  const leftBottom: NodePoint = [x, y + height];
  return [
    pointAfterRotate({ point: leftTop, center: nodeCenter, angle }),
    pointAfterRotate({ point: rightTop, center: nodeCenter, angle }),
    pointAfterRotate({ point: rightBottom, center: nodeCenter, angle }),
    pointAfterRotate({ point: leftBottom, center: nodeCenter, angle }),
  ];
}

/** 判断两组件节点是否相交 */
export const nodeIntersect = (node1: Node, node2: Node): boolean => {
  const node1Points = getNodePoints(node1);
  const node2Points = getNodePoints(node2);
  const node1Polygon = polygon([[...node1Points, node1Points[0]]]);
  const node2Polygon = polygon([[...node2Points, node2Points[0]]]);
  const intersectData = intersect(node1Polygon, node2Polygon);
  return !!intersectData;
}

/** 判断第二个节点是否在第一个节点内部 */
export const nodeContains = (container: Node, node: Node): boolean => {
  const containerPoints = getNodePoints(container);
  const nodePoints = getNodePoints(node);
  const containerPolygon = polygon([[...containerPoints, containerPoints[0]]]);
  const nodePolygon = polygon([[...nodePoints, nodePoints[0]]]);
  return booleanContains(containerPolygon, nodePolygon);
}

import Icon from '@/components/Icon';
import { ComponentConfigType } from '../types';
import pillarImg from '@/assets/mapDesigner/pillar.png';
import wallImg from '@/assets/mapDesigner/wall.png';

/** 待部署设备的显示效果 */
type DndAsset = {
  /** 图标 */
  icon: React.ReactNode;
}

/** 工具在拖拽栏上的显示效果和组件创建配置 默认使用组件定义时的配置 */
type DndTool = {
  /** 组件类型 */
  shape: string;
  /** 展示用的图标 */
  icon: React.ReactNode;
  /** 提示文字 默认使用类型名称 */
  title?: string;
  width?: number;
  height?: number;
  // zIndex?: number;
  config?: ComponentConfigType;
}

/** 待部署设备 */
export const assets: Record<string, DndAsset> = {
  STORE: {
    icon: <Icon type='icon-cunchugui' />
  },
  NET: {
    icon: <Icon type='icon-wangluogui' />
  },
  CAB: {
    icon: <Icon type='icon-peidiangui2' />,
  },
  WIRING: {
    icon: <Icon type='icon-guangxiangui' />,
  },
  IT: {
    icon: <Icon type='icon-jigui' />,
  },
  UPS: {
    icon: <Icon type='icon-UPS1' />,
  },
  BAT: {
    icon: <Icon type='icon-a-dianchixiangdianchijia' />,
  },
  BATRACK: {
    icon: <Icon type='icon-a-dianchixiangdianchijia' />,
  },
  FIREHOST: {
    icon: <Icon type='icon-xiaofangzhuji' />,
  },
  FIREBOTTLE: {
    icon: <Icon type='icon-xiaofanggangping' />,
  },
  AC: {
    icon: <Icon type='icon-kongtiao2' />,
  },
  FRESHAIR: {
    icon: <Icon type='icon-xinfeng' />,
  },
  SD: {
    icon: <Icon type='icon-yangantanceqi' />,
  },
  TAHS: {
    icon: <Icon type='icon-wenshiduchuanganqi' />,
  },
  CAMERA: {
    icon: <Icon type='icon-shexiang1' />,
  },
}

/** 工具栏 */
export const tools: DndTool[] = [
  {
    shape: 'door',
    icon: <Icon type='icon-men' />,
    config: { direction: 'upLeft' },
  },
  {
    shape: 'door',
    icon: <Icon type='icon-men' style={{ transform: 'rotate(90deg)' }} />,
    config: { direction: 'rightUp' },
  },
  {
    shape: 'door',
    icon: <Icon type='icon-men' style={{ transform: 'rotate(180deg)' }} />,
    config: { direction: 'downRight' },
  },
  {
    shape: 'door',
    icon: <Icon type='icon-men' style={{ transform: 'rotate(-90deg)' }} />,
    config: { direction: 'leftDown' },
  },
  {
    shape: 'door',
    icon: <Icon type='icon-men' style={{ transform: 'rotateY(180deg)' }} />,
    config: { direction: 'upRight' },
  },
  {
    shape: 'door',
    icon: <Icon type='icon-men' style={{ transform: 'rotateY(180deg) rotate(-90deg)' }} />,
    config: { direction: 'rightDown' },
  },
  {
    shape: 'door',
    icon: <Icon type='icon-men' style={{ transform: 'rotateY(180deg) rotate(180deg)' }} />,
    config: { direction: 'downLeft' },
  },
  {
    shape: 'door',
    icon: <Icon type='icon-men' style={{ transform: 'rotateY(180deg) rotate(90deg)' }} />,
    config: { direction: 'leftUp' },
  },
  {
    shape: 'dbDoor',
    icon: <Icon type='icon-shuangkaimen' />,
    config: { direction: 'up' },
  },
  {
    shape: 'dbDoor',
    icon: <Icon type='icon-shuangkaimen' style={{ transform: 'rotate(90deg)' }} />,
    config: { direction: 'right' },
  },
  {
    shape: 'dbDoor',
    icon: <Icon type='icon-shuangkaimen' style={{ transform: 'rotate(180deg)' }} />,
    config: { direction: 'down' },
  },
  {
    shape: 'dbDoor',
    icon: <Icon type='icon-shuangkaimen' style={{ transform: 'rotate(-90deg)' }} />,
    config: { direction: 'left' },
  },
  {
    shape: 'dashedDoor',
    icon: <Icon type='icon-xuxianmen1' />,
  },
  {
    shape: 'text',
    icon: <Icon type='icon-wenben' />,
  },
  {
    shape: 'pillar',
    icon: <img src={pillarImg} style={{ width: 30 }} />,
  },
  {
    shape: 'wall',
    icon: <img src={wallImg} style={{ width: 30 }} />,
  },
];

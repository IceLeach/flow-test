import { defineConfig } from "umi";
import dotenv from 'dotenv';
import routes from './routes';

// 环境变量
const { REACT_APP_ENV } = process.env;

const envConfig = dotenv.config({
  path: `.env.${REACT_APP_ENV}`,
}).parsed ?? {};

// 路由前缀/public根目录
const ROUTE_BASE = envConfig.ROUTE_BASE ?? '/';

export default defineConfig({
  hash: true,
  title: false,
  routes,
  define: {
    REACT_APP_ENV,
    ROUTE_BASE,
    API_URL: envConfig.API_URL,
  },
  exportStatic: {},
  base: ROUTE_BASE,
  publicPath: ROUTE_BASE,
  antd: {},
  plugins: [
    ...REACT_APP_ENV === 'pro' ? [] : ['@react-dev-inspector/umi4-plugin'],
    '@umijs/plugins/dist/antd',
    '@umijs/plugins/dist/initial-state',
    '@umijs/plugins/dist/model',
  ],
  ...(REACT_APP_ENV === 'pre'
    ? {}
    : {
      inspectorConfig: {
        excludes: [],
      },
    }),
  initialState: {},
  model: {},
  clickToComponent: {},
  npmClient: 'yarn',
});

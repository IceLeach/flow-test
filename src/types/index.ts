export interface ApiCommonRes<T> {
  code: number;
  message: string;
  data: T;
}

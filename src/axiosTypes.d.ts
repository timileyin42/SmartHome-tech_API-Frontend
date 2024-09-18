declare module 'axios' {
  export interface AxiosError<T = any> extends Error {
    config: any;
    code?: string;
    request?: any;
    response?: {
      data: T;
      status: number;
      statusText: string;
      headers: any;
    };
  }
}

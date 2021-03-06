import Axios, {AxiosPromise, AxiosResponse} from "axios";
import Logger from "../utils/logger";
import {useMock} from "./ApiHub";


Axios.defaults.withCredentials = true;
Axios.defaults.headers = {
  'Content-Type': "application/json;charset=utf8"
};

export interface HttpResponse<T> {
  data: T;
  code: String;
  message: String;
}

/**
 * 自定义http状态
 * @type {{SUCCESS: string, ERROR: string}}
 */
export const HttpCodes = {
  SUCCESS: "SUCCESS",
  ERROR: "ERROR"
};

export class Http {
  static _baseUrl = "http://106.14.178.184:8080/board";
  static _logger = Logger.getLogger("http");

  static async _handleResult<T>(responsePromise: AxiosPromise<AxiosResponse<T>>): Promise<T> {
    const response = await responsePromise;
    this._logger.info("请求得到", response);
    if (response.status !== 200) {
      throw new Error("网络错误");
    } else {
      const httpResponse: HttpResponse = response.data;
      if (httpResponse.code !== HttpCodes.SUCCESS) {
        throw httpResponse;
      } else {
        return httpResponse.data;
      }
    }
  }

  static async post<T>(url: String, body, params: Object = {}): Promise<T> {
    this._logger.info(`请求${url}，Body:${JSON.stringify(body)}，参数：${JSON.stringify(params)}`);
    url = this._baseUrl + url;
    return this._handleResult(Axios.post(url, body, {params}));
  }

  static async get<T>(url: String, params: Object = {}): Promise<T> {
    this._logger.info(`请求${url}，参数：${JSON.stringify(params)}`);
    url = this._baseUrl + url;
    return this._handleResult(
      Axios.get(url, {
        params: params
      })
    );
  }

  static async uploadFile(file: File): Promise<String> {
    if (useMock) {
      return URL.createObjectURL(file);
    } else {
      const form = new FormData();
      form.append("file", file);
      const res = await Axios.request({
        method: "POST",
        data: form,
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        url: this._baseUrl + "/uploadFile"
      });
      const url = res.data.data;
      return url;
    }
  }
}

/**
 * 模拟请求
 */
export class HttpMock {
  static success<T>(data): Promise<T> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(data);
      }, 1000);
    })
  }
}

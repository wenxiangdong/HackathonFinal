import Axios, {AxiosPromise, AxiosResponse} from "axios";
import Logger from "../utils/logger";


Axios.defaults.withCredentials = true;
Axios.defaults.headers = {
  'Content-Type': "application/json;charset=utf8"
};

interface HttpResponse<T> {
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
  static _baseUrl = "http://localhost/nju_admit_server";
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

  static async post<T>(url: String, params: Object = {}): Promise<T> {
    this._logger.info(`请求${url}，参数：${JSON.stringify(params)}`);
    url = this._baseUrl + url;
    return this._handleResult(Axios.post(url, params));
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

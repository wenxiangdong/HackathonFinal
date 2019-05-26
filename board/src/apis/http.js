import Axios from "axios";
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

export class Http {
    static _baseUrl = "http://localhost/nju_admit_server";
    static _logger = Logger.getLogger("http");
    static async _handleResult(responsePromise): Promise<HttpResponse<T>> {
        const response = await responsePromise;
        this._logger.info("请求得到", response);
        if (response.status !== 200) {
            throw new Error("网络错误");
        } else {
            return response.data;
        }
    }

    static async post<T>(url: String, params: Object = {}): Promise<HttpResponse<T>> {
        url = this._baseUrl + url;
        return this._handleResult(Axios.post(url, params));
        // return this._handleResult(Axios.post(url, JSON.stringify(params)));
    }
    static async get<T>(url: String, params: Object = {}): Promise<HttpResponse<T>> {
        url = this._baseUrl + url;
        return this._handleResult(
            Axios.get(url, {
                params: params
            })
        );
    }
}

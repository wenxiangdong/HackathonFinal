import type {LiveLessonData} from "../vo/vo";
import Logger from "./logger";

/**
 * 要监听消息的组件可以实现这个接口，或者传一个实现这个接口的对象
 */
export interface Subscriber {
  // 读到一条消息
  onNext: (data: LiveLessonData) => void,
  // 出错
  onError: (e: Error) => void,
  // 关闭了
  onClose: () => void
}



const logger = Logger.getLogger("websocket");

/**
 * 某个websocket的通讯流
 */
export default class WebsocketPublisher {

  constructor(url) {
    console.log(url);
    this.url = url;
    this.subscribers = [];
    this._init();
  }

  _init() {
    this.websocket = new WebSocket(this.url);
    this.websocket.onmessage = this._handleReceiveMessage;
    this.websocket.onerror = this._handleError;
    this.websocket.onclose = this._handleClose;
  }

  _handleClose = () => {
    this.subscribers
      .filter((s: Subscriber) => typeof s.onClose === "function")
      .forEach((s: Subscriber) => {
      s.onClose();
    });
  };

  _handleError = (e) => {
    this.subscribers
      .filter((s: Subscriber) => typeof s.onError === "function")
      .forEach((subscriber: Subscriber) => {
      subscriber.onError(e);
    })
  };

  _handleReceiveMessage = (ev: MessageEvent) => {
    try {
      logger.info(ev);

      const msg = JSON.parse(ev.data);
      logger.info(msg);
      this.subscribers
        .filter((s: Subscriber) => typeof s.onNext === "function")
        .forEach((subscriber: Subscriber) => {
        subscriber.onNext(msg);
      })
    } catch (e) {
      this._handleError(e);
    }
  };

  /**
   * 订阅消息
   * @param subscriber
   */
  subscribe(subscriber: Subscriber) {
    this.subscribers.findIndex(s => s === subscriber) === -1
      && this.subscribers.push(subscriber);
  }

  /**
   * 取消
   * @param subscriber
   */
  unsubscribe(subscriber: Subscriber) {
    const index = this.subscribers.findIndex(s => s === subscriber);
    if (index !== -1) {
      this.subscribers.splice(index, 1);
    }
  }

  /**
   * 手动关闭
   */
  close() {
    try {
      this.websocket.close();
    } catch (e) {

    }
  }
}




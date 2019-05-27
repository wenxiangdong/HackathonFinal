import React from "react";
import CommunicateBubble from "./CommunicateBubble";

interface IState {
  titleOne: string,
}

/**
 * MockCommunicateBubble
 * @create 2019/5/27 14:08
 */
export default class MockCommunicateBubble extends React.Component<any, IState> {

  static titles: string[] = [
    "老师好",
    "老师辛苦了",
    "老师好帅",
    "今天也要努力鸭",
    "期末考试加油！",
    "今天要好好听讲"
  ];

  timeoutOne;

  constructor(props) {
    super(props);
    this.state = {
      timeoutOne: this.getRandomTitle(),
    };
  }

  componentWillUnmount(): void {
    super.componentWillUnmount();
    this.clear(this.timeoutOne);
  }

  clear = (timeout) => {
    if (timeout !== undefined) {
      clearTimeout(timeout)
    }
  };

  getRandomTitle = () => {
    return MockCommunicateBubble.titles[Math.floor(Math.random() * MockCommunicateBubble.titles.length)];
  };

  render(): React.ReactNode {
    let time1 = Math.floor(3000 + (Math.random() * 2000));
    this.clear(this.timeoutOne);
    this.timeoutOne = setTimeout(() => {
      this.setState({titleOne: null}, () => {
        this.setState({titleOne: this.getRandomTitle()});
      })
    }, time1);

    let {titleOne} = this.state;

    return (
      <>
        {titleOne? <CommunicateBubble content={titleOne}/> :null}
      </>
    );
  }
}

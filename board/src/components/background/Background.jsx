import * as React from "react";
import "./Background.css"

interface IProp {
}

interface IState {
  mounted: boolean
}

interface BubbleInfo {
  top: string,
  left: string,
  color: string,
  delay: string
}

export default class Background extends React.Component<IProp, IState> {
  constructor(props) {
    super(props);
    this.state = {mounted: false};
    this.generateBubbles();
  }

  bubbleList: BubbleInfo[] = [];

  generateBubbles() {
    for (let i = 0; i < 34; i++) {
      this.bubbleList.push({
        top: Math.round(Math.random() * 110) - 10 + 'vh',
        left: Math.round(Math.random() * 110) - 10 + 'vw',
        color: `color-${Math.round(Math.random() * 4) % 4}`,
        delay: `${(Math.round(Math.random() * 100)) / 100 * 4}s`
      })
    }
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({mounted: true})
    })
  }

  render(): any {
    const {mounted} = this.state;

    const bubbles = this.bubbleList.map((bubbleInfo, index) => {
      return (
        <div className={'bubble-box'} style={{animationDelay: bubbleInfo.delay}}
              key={index}>
          <div className={`bubble ${bubbleInfo.color}`}
                style={{top: bubbleInfo.top, left: bubbleInfo.left, animationDelay: bubbleInfo.delay}}/>
        </div>
      )
    });

    return (
      <div className={"outside-shown-box"}>
        {mounted ? bubbles : ''}
      </div>
    )
  }
}

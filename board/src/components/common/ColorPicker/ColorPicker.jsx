import React from "react";

import "./ColorPicker.css";

interface IProp {
  onColorSelect: (string) => void,
  selectColor?: string
}

interface IState {
  selectColor: string
}

/**
 * ColorPicker
 * @create 2019/5/26 19:50
 */
export default class ColorPicker extends React.Component<IProp, IState> {
  colors:string[] = [
    "#000000",
    "#bf291c",
    "#291cbf"
  ];

  constructor(props) {
    super(props);
    this.state = {
      selectColor: this.colors[0]
    };
  }

  onColorSelect = (selectColor) => {
    this.setState({selectColor});
    this.props.onColorSelect(selectColor);
  };

  render(): React.ReactNode {
    let selectColor = this.props.selectColor? this.props.selectColor: this.state.selectColor;

    return (
      <div className={"color-wrapper"}>
        {
          this.colors.map((color) =>
            <div key={color}
                 className={"color-item" + (selectColor === color? " selected": "")}
                 onClick={() => this.onColorSelect(color)}
                 style={{backgroundColor: color}} />)
        }
      </div>
    );
  }
}

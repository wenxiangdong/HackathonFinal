import * as React from "react";

/**
 * 顶部工具栏
 * @param WrappedComponent
 * TODO 待完成
 */
export default function withToolBar(WrappedComponent) {
  return class WithToolBarComponent extends React.Component {
    render() {
      const toolBar = "lorem";
      return (
        <div>
          <div style={{position: "fixed", top: "0", left: "0"}}>
            {toolBar}
          </div>
          <WrappedComponent {...this.props} />
        </div>
      );
    }
  }
}

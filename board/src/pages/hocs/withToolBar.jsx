import * as React from "react";

export default function withToolBar(WrappedComponent) {
  return class WithToolBarComponent extends React.Component {
    render() {
      const toolBar = "lorem";
      return (
        <div>
          {toolBar}
          <WrappedComponent {...this.props} />
        </div>
      );
    }
  }
}

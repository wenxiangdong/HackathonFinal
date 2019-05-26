import * as React from "react";

export default function withToolBar(wrappedComponent) {
    return class WithToolBarComponent extends React.Component {
      render() {
        const toolBar = null;
        return (
          <div>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam at consequatur, illum incidunt perspiciatis ratione rerum sequi suscipit! Ab adipisci, dignissimos dolor expedita illo impedit labore maxime minus nobis tempora.
            {toolBar}
            {wrappedComponent}
          </div>
        );
      }
    }
}

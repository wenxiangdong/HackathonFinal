import React from "react";
import Container from "@material-ui/core/Container/Container";
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";

interface IProp {
  size?: number
}

/**
 * SimpleLoading
 * @create 2019/5/26 17:36
 */
export default class SimpleLoading extends React.Component<IProp> {
  render(): React.ReactNode {
    let size = this.props.size;
    size = size? size: 60;
    return (
      <Container style={{textAlign: "center"}}>
        <CircularProgress size={`${size}px`}/>
      </Container>
    );
  }
}

import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import PDFIcon from "@material-ui/icons/PictureAsPdf";
import UploadIcon from "@material-ui/icons/CloudUpload";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Logger from "../../../utils/logger";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import {Http} from "../../../apis/http";
import {withSnackbar} from "notistack";

export interface PDFFile extends File {
  url: string
}

interface IState {
  files: PDFFile[]
}

interface IProp {
  enqueueSnackbar?: () => void;
  onSelectPDF: (file: PDFFile) => void;
}

class PDFLoader extends React.Component<IProp, IState> {

  state = {
    files: []
  };

  _logger = Logger.getLogger(PDFLoader.name);
  _upload: HTMLInputElement = null;
  _uploadId = "input-upload";


  handleClickPDF = (file: File) => {
    this._logger.info(file);
    const {onSelectPDF = () => null} = this.props;
    onSelectPDF(file);
  };

  handleClickUpload = () => {
    if (!this._upload) {
      this._upload = document.getElementById(this._uploadId);
    }
    if (this._upload) {
      this._upload.click();
    }
  };

  handleUploadChange = async (e) => {
    e.persist();
    this._logger.info(e);
    const file = e.target.files[0];
    if (file) {
      try {
        const path = await Http.uploadFile(file);
        file.url = path;
        this.setState((pre) => ({
          files: [...pre.files, file]
        }));
      } catch (e) {
        this.props.enqueueSnackbar(`上传文件【${file.name}】失败`, {variant: "error"});
      }
    }

  };

  render(): React.ReactNode {

    const {files} = this.state;

    const fileComponents = files.map((file: File) => (
      <ListItem key={file.name} button onClick={() => this.handleClickPDF(file)}>
        <ListItemIcon><PDFIcon/></ListItemIcon>
        <ListItemText primary={file.name}/>
      </ListItem>
    ));

    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            PDF列表
          </Typography>
          <List>
            {fileComponents}
          </List>
        </CardContent>
        <CardActions>
          <Button
            size="small"
            color="primary"
            onClick={this.handleClickUpload}>
            <UploadIcon/>
            <span style={{width: "8px"}}/>
            <Typography variant="button">上传</Typography>
            <input
              id={this._uploadId}
              type="file"
              accept="application/pdf"
              hidden={true}
              onChange={this.handleUploadChange}
            />
          </Button>
        </CardActions>
      </Card>
    );
  }
}

export default withSnackbar(PDFLoader);

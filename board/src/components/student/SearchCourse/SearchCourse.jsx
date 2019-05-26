import "./SearchCourse.css";
import React from "react";
import TextField from "@material-ui/core/TextField";
import SearchIcon from "@material-ui/icons/Search";
import InputAdornment from "@material-ui/core/InputAdornment";
import type {CourseVO} from "../../../vo/vo";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Button from "@material-ui/core/Button";

import MoreIcon from "@material-ui/icons/ArrowDropDown";
import CircularProgress from "@material-ui/core/CircularProgress";
import Logger from "../../../utils/logger";
import debounce from "../../../utils/debounce";
import {apiHub} from "../../../apis/ApiHub";
import {HttpCodes} from "../../../apis/http";

import {withSnackbar} from "notistack";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton/IconButton";

import AddIcon from '@material-ui/icons/Add'
import BachIcon from '@material-ui/icons/ArrowBack'
import {withRouter} from "react-router-dom";


interface IState {
  courseList: CourseVO[];
  loading: Boolean;
  keyword: String;
}

interface IProp {
  onSelectCourse: (course: CourseVO) => void;
  enqueueSnackbar?: () => void;
  height?: String;  // list的高度
}

class SearchCourse extends React.Component<IProp, IState> {

  _logger = Logger.getLogger(SearchCourse.name);

  constructor(props) {
    super(props);
    this.state = {
      courseList: [],
      loading: false,
      keyword: ""
    };

    // 消抖
    this.searchCourses = debounce(this.searchCourses, 300);
  }

  handleInputChange = (e) => {
    const keyword = e.target.value;
    this.setState({keyword, courseList: []}, () => {
      this.checkSearchCourses(keyword, false);
    });
  };

  handleClickLoadMore = () => {
    this.checkSearchCourses(this.state.keyword, true);
  };

  checkSearchCourses = (keyword, check) => {
    if (!keyword.trim()) {
      check && this.props.enqueueSnackbar("请不要搜索空字符", {variant: "error"});
      return;
    }
    this.searchCourses(keyword, this.state.courseList.length);
  };

  searchCourses = async (keyword, index = 0, offset = 10) => {
    this._logger.info("查找" + keyword);
    try {
      this.setState({
        loading: true
      });
      const courseList = await apiHub.studentApi.searchCourses(keyword, index, offset);
      this.setState((pre) => ({
        courseList: [...pre.courseList, ...courseList]
      }));
    } catch (e) {
      switch (e.code) {
        case HttpCodes.ERROR:
        default:
          this.props.enqueueSnackbar("搜索课程失败", {variant: "error"});
          break;
      }
    } finally {
      this.setState({
        loading: false
      })
    }
  };

  jumpBack = () => {
    this.props.history.goBack();
  };

  render(): React.ReactNode {
    const {courseList, loading, keyword} = this.state;
    const {onSelectCourse = () => null, height = "500px"} = this.props;
    const courseComponents = courseList.map((course: CourseVO) => (
      <ListItem key={course.id}>
        <ListItemText
          primary={course.name}
          secondary={course.teacherName}/>
        <ListItemSecondaryAction>
          <IconButton onClick={() => onSelectCourse(course)} edge="end" aria-label="Delete">
            <AddIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    ));

    return (
      <>
        <div className={"SC__input-wrapper"}>
          <TextField
            value={keyword}
            onChange={this.handleInputChange}
            fullWidth={true}
            placeholder={"搜索课程"}
            InputProps={{
              startAdornment: (
                <InputAdornment position={"start"}>
                  <SearchIcon/>
                </InputAdornment>
              )
            }}
          />
        </div>
        <div className={"SC__course-list-wrapper"} style={{maxHeight: height}}>
          <List style={{width: "100%"}}>
            {courseComponents}
          </List>
        </div>
        <div className={"button-group"}>
          <Button
            onClick={() => this.jumpBack()}>
            <BachIcon/>
            <span>返回</span>
          </Button>
          <Button
            disabled={loading}
            onClick={this.handleClickLoadMore}>
            {loading ? <CircularProgress size={"16px"}/> : <MoreIcon/>}
            {loading ? "加载中" : "加载更多"}
          </Button>
        </div>
      </>
    );
  }
}

export default withSnackbar(withRouter(SearchCourse));

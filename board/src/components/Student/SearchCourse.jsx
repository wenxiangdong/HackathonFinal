import React from "react";
import TextField from "@material-ui/core/TextField";
import SearchIcon from "@material-ui/icons/Search";
import InputAdornment from "@material-ui/core/InputAdornment";
import type {CourseVO} from "../../vo/vo";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Button from "@material-ui/core/Button";

import MoreIcon from "@material-ui/icons/ArrowDropDown";
import CircularProgress from "@material-ui/core/CircularProgress";
import Logger from "../../utils/logger";
import debounce from "../../utils/debounce";


interface IState {
  courseList: CourseVO[];
  loading: Boolean;
  keyword: String;
}

interface IProp {
  onSelectCourse: (course: CourseVO) => void
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
    this.searchCourses(keyword);
    this.setState({
      keyword
    });
  };

  searchCourses = (keyword) => {
    this._logger.info("查找" + keyword);
  };

  render(): React.ReactNode {
    const {courseList, loading, keyword} = this.state;
    const {onSelectCourse = () => null} = this.props;
    const courseComponents = courseList.map((course: CourseVO) => (
      <ListItem key={course.id} button onClick={() => onSelectCourse(course)}>
        <ListItemText
          primary={course.name}
          secondary={course.teacherName}/>
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
        <div className={"SC__course-list-wrapper"}>
          <List>
            {courseComponents}
            <Button
              style={{fontSize: "16px", display: "flex", alignItems: "center"}}>
              {loading ? <CircularProgress size={"16px"}/> : <MoreIcon/>}
              {loading ? "加载中" : "加载更多"}
            </Button>
          </List>
        </div>
      </>
    );
  }
}

export default SearchCourse;

import React from 'react';
import './App.css';
import loadable from "@loadable/component";
import {ThemeProvider} from '@material-ui/styles';
import {HashRouter, Switch, Route} from "react-router-dom";
import Dev from "./pages/Dev";
import {blue, grey, red} from "@material-ui/core/colors";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import {SnackbarProvider} from "notistack";
import {
  DEV,
  LOGIN,
  REGISTER, STUDENT_HOME_PAGE,
  STUDENT_LESSON_ONGOING, STUDENT_LESSON_REVIEW, STUDENT_SEARCH,
  TEACHER_HOME_PAGE,
  TEACHER_LESSON
} from "./utils/router-helper";
declare var pdfjsLib;


// 引入页面
const Login = loadable(() => import("./pages/Login"));
const Register = loadable(() => import("./pages/Register"));
const StudentHomepage = loadable(() => import("./pages/Student/Index"));
const StudentSearchPage = loadable(() => import("./pages/Student/Search/Search"));
const StudentLessonOngoing = loadable(() => import("./pages/Student/Lesson/Ongoing"));
const StudentLessonReview = loadable(() => import("./pages/Student/Lesson/Review"));
const TeacherHomepage = loadable(() => import("./pages/Teacher/Index"));
const TeacherLesson = loadable(() => import("./pages/Teacher/Lesson/Index"));


function App() {

  const theme = createMuiTheme({
    palette: {
      primary: {
        main: blue[500],
      },
      secondary: {
        main: grey[100]
      },
      warning: {
        main: red[500]
      }
    },
  });

  return (
    <SnackbarProvider maxSnack={4}>
    <ThemeProvider theme={theme}>
      <HashRouter>
        <Switch>
          <Route path={TEACHER_LESSON} component={TeacherLesson}/>
          <Route path={TEACHER_HOME_PAGE} component={TeacherHomepage}/>
          <Route path={STUDENT_LESSON_ONGOING} component={StudentLessonOngoing}/>
          <Route path={STUDENT_LESSON_REVIEW} component={StudentLessonReview}/>
          <Route path={STUDENT_SEARCH} component={StudentSearchPage}/>
          <Route path={STUDENT_HOME_PAGE} component={StudentHomepage}/>
          <Route path={REGISTER} component={Register}/>
          <Route path={LOGIN} component={Login}/>
          <Route path={DEV} component={Dev}/>
          <Route component={Login}/>
        </Switch>
      </HashRouter>
    </ThemeProvider>
    </SnackbarProvider>
  );
}

export default App;

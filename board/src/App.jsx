import React from 'react';
import './App.css';
import loadable from "@loadable/component";
import {ThemeProvider} from '@material-ui/styles';
import {HashRouter, Switch, Route} from "react-router-dom";
import Dev from "./pages/Dev";
import {blue, red, yellow} from "@material-ui/core/colors";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";


// 引入页面
const Login = loadable(() => import("./pages/Login"));
const Register = loadable(() => import("./pages/Register"));
const StudentHomepage = loadable(() => import("./pages/Student/Index"));
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
        main: yellow[500],
      },
      warning: {
        main: red[500]
      }
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <HashRouter>
        <Switch>
          <Route path="/Teacher/Lesson/:id" component={TeacherLesson}/>
          <Route path="/Teacher/:id" component={TeacherHomepage}/>
          <Route path="/Student/LessonOnGoing/:id" component={StudentLessonOngoing}/>
          <Route path="/Student/LessonReview/:id" component={StudentLessonReview}/>
          <Route path="/Student/:id" component={StudentHomepage}/>
          <Route path="/Register" component={Register}/>
          <Route path="/Login" component={Login}/>
          <Route path="/dev" component={Dev}/>
          <Route component={Login}/>
        </Switch>
      </HashRouter>
    </ThemeProvider>
  );
}

export default App;

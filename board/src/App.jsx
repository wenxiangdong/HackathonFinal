import React from 'react';
import './App.css';
import loadable from "@loadable/component";
import {HashRouter, Switch, Route} from "react-router-dom";
import Dev from "./pages/Dev";


// 引入页面
const Login = loadable(() => import("./pages/Login"));
const Register = loadable(() => import("./pages/Register"));
const StudentHomepage = loadable(() => import("./pages/Student/Index"));
const StudentLessonOngoing = loadable(() => import("./pages/Student/Lesson/Ongoing"));
const StudentLessonReview = loadable(() => import("./pages/Student/Lesson/Review"));
const TeacherHomepage = loadable(() => import("./pages/Teacher/Index"));
const TeacherLesson = loadable(() => import("./pages/Teacher/Lesson/Index"));


function App() {
  return (
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
  );
}

export default App;

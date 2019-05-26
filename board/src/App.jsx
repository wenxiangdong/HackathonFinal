import React from 'react';
import './App.css';
import loadable from "@loadable/component";
import {HashRouter, Switch, Route} from "react-router-dom";


// 引入页面
const NotFound = loadable(() => import("./pages/NotFound"));


function App() {
  return (
      <HashRouter>
          <Switch>
              <Route component={NotFound}/>
          </Switch>
      </HashRouter>
  );
}

export default App;

import React from "react";
import { Switch } from "react-router-dom";
import { renderRoutes } from 'react-router-config';
import Routes from "./routes";

const loginLayoutStyle = {
  width: "400px",
  margin: "0 auto",
};

export default props => {
  return (
    <div>
      <Switch>
        {renderRoutes(Routes)}
      </Switch>
    </div>
  );
}
import React from "react";
import { Route, Redirect } from "react-router-dom";
import Login from "./Login";

const ProtectedRoute = ({
  component: Component,
  isLoggedIn: isLoggedIn,
  ...props
}) => {
  return (
    <Route>
      {() =>
        isLoggedIn ? <Component {...props} /> : <Redirect to="./login" />
      }
    </Route>
  );
};

export default ProtectedRoute;

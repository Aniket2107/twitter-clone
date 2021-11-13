import { Redirect, Route } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import Sidebar from "../components/sidebar/Sidebar";
import Trending from "../components/trending/Trending";

import { isAuthenticated } from "./index";

function PrivateRoute({ component: Component, ...rest }: any) {
  if (isAuthenticated()) {
    return (
      <Route
        {...rest}
        render={(routeProps) => (
          <>
            <Navbar />
            <Sidebar />
            <Trending />
            <Component {...routeProps} />
          </>
        )}
      />
    );
  } else {
    return <Redirect to={{ pathname: "/login" }} />;
  }
}

export default PrivateRoute;

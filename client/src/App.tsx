import { BrowserRouter, Route, Switch } from "react-router-dom";
import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";

import { setContext } from "apollo-link-context";

import "./App.css";
import PrivateRoute from "./helpers/PrivateRoute";
import Following from "./pages/following/Following";
import Home from "./pages/home/Home";
import Landing from "./pages/Landing";
import LikedTweet from "./pages/likedtweet/LikedTweet";
import Login from "./pages/login/Login";
import Profile from "./pages/profile/Profile";
import Register from "./pages/register/Register";
import User from "./pages/user/User";
import Tweeet from "./pages/tweeet/Tweeet";
import Search from "./pages/search/Search";

import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

const httpLink = new HttpLink({
  uri: "http://localhost:4000/",
});
const authLink = setContext(async (req, { headers }) => {
  const token = await localStorage.getItem("twitter-token");

  return {
    ...headers,
    headers: {
      Authorization: token ? `Bearer ${token}` : null,
    },
  };
});

const link = authLink.concat(httpLink as any);
const client = new ApolloClient({
  link: link as any,
  cache: new InMemoryCache(),
});

toast.configure({
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: false,
});

function App() {
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component={Landing} />
          <Route path="/login" exact component={Login} />
          <Route path="/register" exact component={Register} />

          <PrivateRoute path="/home" exact component={Home} />
          <PrivateRoute path="/profile" exact component={Profile} />
          <PrivateRoute path="/following" exact component={Following} />
          <PrivateRoute path="/liked-tweets" exact component={LikedTweet} />
          <PrivateRoute path="/search" exact component={Search} />
          <PrivateRoute path="/user/:id" exact component={User} />
          <PrivateRoute path="/tweet/:id" exact component={Tweeet} />
        </Switch>
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;

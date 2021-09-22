import React from 'react'

import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from '@apollo/client'

import './App.css'
import { setContext } from 'apollo-link-context'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import IsAuthenticated from './components/IsAuthenticated'
import Landing from './components/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Home from './pages/Home'
import Tweeet from './pages/Tweeet'
import User from './pages/User'
import FollowingPg from './pages/FollowingPg'
import LikedTweetsPg from './pages/LikedTweetsPg'

const httpLink = new HttpLink({
  uri: process.env.REACT_APP_BACKEND_URL,
})
const authLink = setContext(async (req, { headers }) => {
  const token = localStorage.getItem('twitter-token')

  return {
    ...headers,
    headers: {
      Authorization: token ? `Bearer ${token}` : null,
    },
  }
})

const link = authLink.concat(httpLink as any)
const client = new ApolloClient({
  link: link as any,
  cache: new InMemoryCache(),
})

function App() {
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Switch>
          <Route path="/" exact>
            <Landing />
          </Route>

          <Route path="/login">
            <Login />
          </Route>

          <Route path="/signup">
            <Register />
          </Route>

          <IsAuthenticated>
            <Route path="/home">
              <Home />
            </Route>

            <Route path="/profile">
              <Profile />
            </Route>

            <Route path="/tweet/:id" exact>
              <Tweeet />
            </Route>

            <Route path="/user/:id" exact>
              <User />
            </Route>

            <Route path="/following">
              <FollowingPg />
            </Route>

            <Route path="/liked-tweets">
              <LikedTweetsPg />
            </Route>
          </IsAuthenticated>
        </Switch>
      </BrowserRouter>
    </ApolloProvider>
  )
}

export default App

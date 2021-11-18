import { gql, useMutation } from "@apollo/client";
import React, { useState } from "react";
import { useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { isAuthenticated } from "../../helpers";

import "./login.css";

const LOGIN_MUTATION = gql`
  mutation login($data: loginInput!) {
    login(data: $data) {
      token
      user {
        name
        profile {
          avatar
        }
      }
    }
  }
`;

function Login() {
  const [login] = useMutation(LOGIN_MUTATION);
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const history = useHistory();

  useEffect(() => {
    if (isAuthenticated()) {
      return history.push("/home");
    }
  }, [history]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await login({
        variables: {
          data: {
            email: values.email,
            password: values.password,
          },
        },
      });

      localStorage.setItem("twitter-token", response.data.login.token);
      localStorage.setItem(
        "twitter-user",
        JSON.stringify(response.data.login.user)
      );
      history.push("/home");

      setLoading(false);

      toast.success("Login Success");
      return <ToastContainer />;
    } catch (err: any) {
      setLoading(false);

      // console.log(err);

      const msg = err
        ? err?.graphQLErrors[0].message
        : "Something went wrong, Try again";

      toast.error(msg);
      return <ToastContainer />;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const handleGuestLogin = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await login({
        variables: {
          data: {
            email: "aniket@email.com",
            password: "123456",
          },
        },
      });

      localStorage.setItem("twitter-token", response.data.login.token);
      localStorage.setItem(
        "twitter-user",
        JSON.stringify(response.data.login.user)
      );
      history.push("/home");

      setLoading(false);

      toast.success("Login Success");
      return <ToastContainer />;
    } catch (err: any) {
      setLoading(false);

      // console.log(err);

      const msg = err
        ? err?.graphQLErrors[0].message
        : "Something went wrong, Try again";
      // alert(msg);

      toast.error(msg);
      return <ToastContainer />;
    }
  };

  return (
    <div className="login">
      {/* {preformRedirect()} */}
      <div className="login_leftcontainer">
        <div className="leftcontainer_item leftcontainer_item-1">
          <i className="fa fa-search fa-fw" aria-hidden="true"></i>
          <span>Follow your interests.</span>
        </div>

        <div className="leftcontainer_item">
          <i className="fa fa-user fa-fw" aria-hidden="true"></i>
          <span>Hear what people are talking about.</span>
        </div>
        <div className="leftcontainer_item">
          <i className="fa fa-comment fa-fw" aria-hidden="true"></i>
          <span className="label">Join the conversation.</span>
        </div>
      </div>
      <div className="login_container">
        <div className="back_btn">
          <Link to="/">
            <i className="fas fa-arrow-left"></i>
          </Link>
        </div>
        <div className="login_title">
          <img src="/images/social.png" alt="Logo" />
        </div>
        <h3>Log in to amigo.</h3>

        <form onSubmit={handleLogin}>
          <div className="form-control">
            <input
              type="email"
              name="email"
              value={values.email}
              placeholder="johndoe@email.com"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-control">
            <input
              type="password"
              placeholder="********"
              minLength={6}
              name="password"
              value={values.password}
              onChange={handleChange}
              required
            />
          </div>
          <button className="login_btn" type="submit" disabled={loading}>
            {loading ? "Loading..." : "LOGIN"}
          </button>
          <br />
          <br />
          <button
            className="login_btn"
            onClick={handleGuestLogin}
            disabled={loading}
          >
            {loading ? "Loading..." : "GUEST LOGIN"}
          </button>

          <Link
            to="/register"
            style={{ textDecoration: "none", cursor: "pointer" }}
          >
            <p>Not a user? Register here</p>
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Login;

import { gql, useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { isAuthenticated } from "../../helpers";

import "../login/login.css";

const SIGNUP_MUTATION = gql`
  mutation signupUser($data: UserCreateInput!) {
    signupUser(data: $data) {
      token
      user {
        name
      }
    }
  }
`;

function Register() {
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({
    email: "",
    password: "",
    name: "",
  });

  const [signupUser] = useMutation(SIGNUP_MUTATION);

  const history = useHistory();

  useEffect(() => {
    if (isAuthenticated()) {
      return history.push("/home");
    }
  }, [history]);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await signupUser({
        variables: {
          data: {
            email: values.email,
            password: values.password,
            name: values.name,
          },
        },
      });

      localStorage.setItem("twitter-token", response.data.signupUser.token);
      localStorage.setItem(
        "twitter-user",
        JSON.stringify(response.data.signupUser.user)
      );
      history.push("/home");

      toast.success("Register successful");
      return <ToastContainer />;
    } catch (err: any) {
      setLoading(false);

      const msg = err
        ? err?.graphQLErrors[0]?.message
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

  return (
    <div className="login">
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
        <h3>Register @ amigo.</h3>

        <form onSubmit={handleRegister}>
          <div className="form-control">
            <input
              type="text"
              placeholder="John Doe"
              name="name"
              value={values.name}
              onChange={handleChange}
              minLength={3}
              required
            />
          </div>

          <div className="form-control">
            <input
              type="email"
              placeholder="johndoe@email.com"
              name="email"
              value={values.email}
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
            {loading ? "Loading..." : "Register"}
          </button>

          <Link
            to="/login"
            style={{ textDecoration: "none", cursor: "pointer" }}
          >
            <p>Already a user? Login here</p>
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Register;

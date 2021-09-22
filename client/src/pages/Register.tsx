import { gql, useMutation } from '@apollo/client'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import * as Yup from 'yup'

import TwitterLogo from '../styles/assets/twitter-logo.png'
import '../styles/login.css'

const SIGNUP_MUTATION = gql`
  mutation signupUser($data: UserCreateInput!) {
    signupUser(data: $data) {
      token
    }
  }
`

interface SignupType {
  email: string
  password: string
  confirmPassword: string
  name: string
}

const Register = () => {
  const [loading, setLoading] = useState(false)
  const [signupUser] = useMutation(SIGNUP_MUTATION)

  const history = useHistory()

  const initialValues: SignupType = {
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
  }

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email Required'),
    password: Yup.string()
      .max(20, 'Must be 20 characters or less')
      .required('Password Required'),
    confirmPassword: Yup.string().oneOf(
      [Yup.ref('password')],
      'Passwords must match',
    ),
    name: Yup.string()
      .max(15, 'Must be 15 characters or less')
      .required('Name Required'),
  })

  const handleSubmit = async (values: SignupType) => {
    setLoading(true)

    try {
      const response = await signupUser({
        variables: {
          data: {
            email: values.email,
            password: values.password,
            name: values.name,
          },
        },
      })

      localStorage.setItem('twitter-token', response.data.signupUser.token)
      history.push('/home')
    } catch (err: any) {
      setLoading(false)

      const msg = err
        ? err?.graphQLErrors[0].message
        : 'Something went wrong, Try again'
      alert(msg)
    }
  }

  return (
    <div className="container">
      <img
        src={TwitterLogo}
        alt="logo"
        style={{ width: '50px' }}
        className="logo"
      />
      <h3>Sign up</h3>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form>
          <ErrorMessage name="email" component={'p'} className="error-msg" />
          <Field name="email" type="text" placeholder="Email" />
          <ErrorMessage name="name" component={'p'} className="error-msg" />
          <Field name="name" type="text" placeholder="Name" />
          <ErrorMessage name="password" component={'p'} className="error-msg" />
          <Field name="password" type="password" placeholder="Password" />
          <ErrorMessage
            name="confirmPassword"
            component={'p'}
            className="error-msg"
          />
          <Field
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
          />
          <button type="submit" className="login-button">
            <span>{loading ? 'Loading...' : 'Sign up'}</span>
          </button>
        </Form>
      </Formik>
      <div className="register">
        <h4>Already have an account?</h4>
        <Link to="/login">Log in</Link>
      </div>
    </div>
  )
}

export default Register

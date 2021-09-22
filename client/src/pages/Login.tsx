import { gql, useMutation } from '@apollo/client'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import * as Yup from 'yup'

import TwitterLogo from '../styles/assets/twitter-logo.png'
import '../styles/login.css'

const LOGIN_MUTATION = gql`
  mutation login($data: loginInput!) {
    login(data: $data) {
      token
    }
  }
`

interface LoginType {
  email: string
  password: string
}

const Login = () => {
  const [login] = useMutation(LOGIN_MUTATION)
  const [loading, setLoading] = useState(false)

  const history = useHistory()

  const initialValues: LoginType = {
    email: '',
    password: '',
  }

  const validationSchema = Yup.object({
    email: Yup.string().email().required('Enter valid email address'),
    password: Yup.string()
      .max(20, 'Must contain min 6 and max20 chars')
      .required('Password required'),
  })

  const handleSubmit = async (values: LoginType) => {
    setLoading(true)

    try {
      const response = await login({
        variables: {
          data: {
            email: values.email,
            password: values.password,
          },
        },
      })

      localStorage.setItem('twitter-token', response.data.login.token)
      history.push('/home')

      setLoading(false)
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
      <h3>Log in to Twitter</h3>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form>
          <ErrorMessage name="email" component={'p'} className="error-msg" />
          <Field name="email" type="text" placeholder="Email" />

          <ErrorMessage name="password" component={'p'} className="error-msg" />
          <Field name="password" type="password" placeholder="Password" />

          <button type="submit" className="login-button">
            <span>{loading ? 'Loading...' : 'Login'}</span>
          </button>
        </Form>
      </Formik>
      <div className="register">
        <h4>Don't have an account?</h4>
        <Link to="/signup">Sign up</Link>
      </div>
    </div>
  )
}

export default Login

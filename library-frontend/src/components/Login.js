import React from 'react'
import LoginForm from './LoginForm'

const Login = ({ show, setToken, setPage }) => {

  if (!show) {
    return null
  }

  return (
    <div>
      {/* <Notify errorMessage={errorMessage} /> */}
      <h2>Login</h2>
      <LoginForm
        setToken={setToken}
        setPage={setPage}
      /* setError={notify} */
      />
    </div>
  )
}
export default Login
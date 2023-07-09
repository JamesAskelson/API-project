import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";
import { Link } from "react-router-dom";


function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  const demoLogin = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential: 'Demo-lition', password: 'password' }))
        .then(closeModal)
        .catch(async (res) => {
            const data = await res.json();
            if (data && data.errors) {
                setErrors(data.errors);
            }
        });
  };

const isFormInvalid = credential.length < 4 || password.length < 6;

  return (
    <>
      <h1>Log In</h1>
      {errors.credential && (
          <p className="login-errors">{errors.credential}</p>
        )}
      <form onSubmit={handleSubmit}>
        <label className="user-cred">
          Username or Email
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label className="user-password">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button className="submit-button-login" type="submit" disabled={isFormInvalid}>Log In</button>

        <Link className="demo-user-login-link" to="/" onClick={demoLogin} exact="true" >Log in as Demo User</Link>
      </form>
    </>
  );
}

export default LoginFormModal;

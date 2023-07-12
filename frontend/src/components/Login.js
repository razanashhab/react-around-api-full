import React from "react";
import { Link, withRouter } from "react-router-dom";
import errorImg from "../images/error.png";

function Login(props) {
  const [username, setUsername] = React.useState(" ");
  const [password, setPassword] = React.useState(" ");

  React.useEffect(() => {
    props.headerNav({
      email: null,
      link: "./register",
      linkName: "Sign up",
    });
  }, []);

  function handleUsernameChange(evt) {
    setUsername(evt.target.value);
  }

  function handlePasswordChange(evt) {
    setPassword(evt.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    props.auth
      .authorized(username, password)
      .then((res) => {
        if (res) {
          localStorage.setItem("jwt", res.token);
          setUsername("");
          setPassword("");
          props.handleLogin(username);
          props.history.push("/");
        }
      })
      .catch((err) => {
        console.log(`Error: ${err}`);
        props.onAuthValidation({ img: errorImg });
      });
  }

  return (
    <div className="login">
      <h3 className="login__title"> Log in </h3>{" "}
      <form className="form login__form" onSubmit={handleSubmit}>
        <fieldset className="form__fieldset">
          <input
            type="text"
            className="form__input login__input"
            id="email"
            name="email"
            placeholder="Email"
            value={username || ""}
            required
            onChange={handleUsernameChange}
          />{" "}
          <input
            type="password"
            className="form__input login__input"
            id="password"
            name="password"
            placeholder="Password"
            value={password || ""}
            required
            onChange={handlePasswordChange}
          />{" "}
        </fieldset>{" "}
        <fieldset className="form__fieldset">
          <button type="submit" className="form__submit login__submit">
            {" "}
            {props.buttonText}{" "}
          </button>{" "}
          <Link to="/register" className="login__link">
            <p> Not a member yet ? Sign up here! </p>{" "}
          </Link>{" "}
        </fieldset>{" "}
      </form>{" "}
    </div>
  );
}
export default withRouter(Login);

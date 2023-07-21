import React from "react";
import { Link, withRouter } from "react-router-dom";
import successImg from "../images/success.png";
import errorImg from "../images/error.png";

function Register(props) {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  React.useEffect(() => {
    props.headerNav({
      email: null,
      link: "./login",
      linkName: "Log in",
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
      .register(username, password)
      .then((res) => {
        if (res) {
          console.log(`res: ${res}`);
          props.onAuthValidation({ img: successImg });
          props.history.push("/login");
        }
      })
      .catch((err) => {
        console.log(`Error: ${err}`);
        props.onAuthValidation({ img: errorImg });
      });
  }

  return (
    <div className="register">
      <h3 className="register__title"> Sign up </h3>{" "}
      <form className="form register__form" onSubmit={handleSubmit}>
        <fieldset className="form__fieldset">
          <input
            type="text"
            className="form__input register__input"
            id="email"
            name="email"
            placeholder="Email"
            value={username || ""}
            required
            onChange={handleUsernameChange}
          />{" "}
          <input
            type="password"
            className="form__input  register__input"
            id="password"
            name="password"
            placeholder="Password"
            value={password || ""}
            required
            onChange={handlePasswordChange}
          />{" "}
        </fieldset>{" "}
        <fieldset className="form__fieldset">
          <button type="submit" className="form__submit register__submit">
            {" "}
            {props.buttonText}{" "}
          </button>{" "}
          <Link to="/login" className="register__link">
            Already a member ? Log in here!
          </Link>{" "}
        </fieldset>{" "}
      </form>{" "}
    </div>
  );
}
export default withRouter(Register);

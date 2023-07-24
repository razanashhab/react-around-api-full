import React from "react";
import logo from "../images/logo.svg";
import { Link, useHistory } from "react-router-dom";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function Header(props) {
  const currentUser = React.useContext(CurrentUserContext);
  const history = useHistory();
  function signOut() {
    props.logout();
    localStorage.removeItem("jwt");
    history.push("/login");
  }
  return (
    <header className="header">
      <div className="header__container">
        <img src={logo} alt="Logo" className="logo" />
        <ul className="nav">
          <li>
            <p className="nav__item nav__paragraph">
              {props.currentUserEmail.email}
            </p>
          </li>
          <li>
            {currentUser.name ? (
              <button
                type="button"
                className="nav__item nav__button"
                onClick={signOut}
              >
                Log out
              </button>
            ) : (
              <Link
                to={props.headerNav ? props.headerNav.link : "/"}
                className="nav__item nav__link"
              >
                {props.headerNav.linkName}
              </Link>
            )}
          </li>
        </ul>
      </div>
    </header>
  );
}

export default Header;

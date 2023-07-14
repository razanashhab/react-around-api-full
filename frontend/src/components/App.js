import Header from "./Header";
import React from "react";
import {
  Route,
  Switch,
  Redirect,
  withRouter,
  useHistory,
} from "react-router-dom";
import Main from "./Main";
import Footer from "./Footer";
import PopupWithForm from "./PopupWithForm";
import ImagePopup from "./ImagePopup";
import ProtectedRoute from "./ProtectedRoute";
import auth from "./../utils/auth";
import api from "../utils/api";
import Register from "./Register";
import Login from "./Login";
import InfoTooltip from "./InfoTooltip";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function App(props) {
  const [currentUser, setCurrentUser] = React.useState({});
  const [currentUserEmail, setCurrentUserEmail] = React.useState({});
  const [isEditProfilePopupOpen, setEditProfilePopupOpen] =
    React.useState(false);
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState({});
  const [cards, setCards] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [headerNav, setHeaderNav] = React.useState({
    email: null,
    link: "./login",
    linkName: "Log in",
  });

  const [infoToolTipMsg, setinfoToolTipMsg] = React.useState({});

  React.useEffect(() => {
    handleTokenCheck();
  }, []);

  function handleTokenCheck() {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      // we're checking the user's token
      auth
        .checkToken(jwt)
        .then((res) => {
          if (res) {
            loadUserAndCardInformation();
            setIsLoggedIn(true);
            setCurrentUserEmail({ email: res.data.email });
            props.history.push("/");
          }
        })
        .catch((err) => {
          console.log(`Error: ${err}`);
        });
    }
  }

  function handleLogin(user) {
    loadUserAndCardInformation();
    setCurrentUserEmail({ email: user });
    setIsLoggedIn(true);
  }

  function loadUserAndCardInformation() {
    Promise.all([api.getUserInformation(), api.getInitialCards()])
      .then(([userData, cards]) => {
        //load user info
        setCurrentUser(userData);
        //load initial cards list
        setCards(cards);
      })
      .catch((err) => {
        console.log(`Error: ${err}`);
      });
  }

  function handleLogout() {
    setIsLoggedIn(false);
    setCurrentUser({});
    setCurrentUserEmail({});
  }

  function handleEditProfileClick() {
    setEditProfilePopupOpen(true);
  }

  function handleEditAvatarClick() {
    setEditAvatarPopupOpen(true);
  }

  function handleAddPlaceClick() {
    setAddPlacePopupOpen(true);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function closeAllPopups() {
    setEditProfilePopupOpen(false);
    setEditAvatarPopupOpen(false);
    setAddPlacePopupOpen(false);
    setSelectedCard({});
    setinfoToolTipMsg({});
  }

  function handleUpdateUser(userData) {
    setIsLoading(true);
    api
      .setUserInformation(userData.name, userData.about)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => {
        // log the `Error: ${err}` message to the console
        console.log(`Error: ${err}`);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  function handleUpdateAvatar(data) {
    setIsLoading(true);
    api
      .setUserAvatar(data.avatar)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Error: ${err}`);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  function handleCardLike(card) {
    // Check one more time if this card was already liked
    const isLiked = card.likes.some((user) => user._id === currentUser._id);

    // Send a request to the API and getting the updated card data
    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((currentCard) =>
            currentCard._id === card._id ? newCard : currentCard
          )
        );
      })
      .catch((err) => {
        console.log(`Error: ${err}`);
      });
  }

  function handleCardDelete(card) {
    // Send a request to the API and update card list
    api
      .deleteCard(card._id)
      .then((res) => {
        setCards((state) =>
          state.filter((currentCard) => currentCard._id !== card._id)
        );
      })
      .catch((err) => {
        console.log(`Error: ${err}`);
      });
  }

  function handleAddPlaceSubmit(data) {
    setIsLoading(true);
    api
      .addCard(data.title, data.link)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        // log the `Error: ${err}` message to the console
        console.log(`Error: ${err}`);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  React.useEffect(() => {
    const closeByEscape = (e) => {
      if (e.key === "Escape") {
        closeAllPopups();
      }
    };

    document.addEventListener("keydown", closeByEscape);

    return () => document.removeEventListener("keydown", closeByEscape);
  }, []);

  function handleAuthValidation({ img: img }) {
    setinfoToolTipMsg({ img: img });
  }

  return (
    <div className="page">
      <CurrentUserContext.Provider value={currentUser}>
        <Header
          headerNav={headerNav}
          logout={handleLogout}
          currentUserEmail={currentUserEmail}
        />{" "}
        <Switch>
          <ProtectedRoute
            component={Main}
            isLoggedIn={isLoggedIn}
            exact
            path="/"
            onEditProfileClick={handleEditProfileClick}
            onAddPlaceClick={handleAddPlaceClick}
            onEditAvatarClick={handleEditAvatarClick}
            onCardClick={handleCardClick}
            cards={cards}
            onCardLike={handleCardLike}
            onCardDelete={handleCardDelete}
            headerNav={setHeaderNav}
          />{" "}
          <Route path="/register">
            <Register
              buttonText="Sign up"
              auth={auth}
              onAuthValidation={handleAuthValidation}
              isLoggedIn={isLoggedIn}
              headerNav={setHeaderNav}
            />{" "}
          </Route>{" "}
          <Route path="/login">
            <Login
              buttonText="Log in"
              auth={auth}
              handleLogin={handleLogin}
              onAuthValidation={handleAuthValidation}
              headerNav={setHeaderNav}
              setCurrentUser={setCurrentUser}
            />{" "}
          </Route>{" "}
          <Route path="*">
            {" "}
            {isLoggedIn ? <Redirect to="/" /> : <Redirect to="/login" />}{" "}
          </Route>{" "}
        </Switch>{" "}
        <Footer />
        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
          isLoading={isLoading}
        />{" "}
        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddNewPlace={handleAddPlaceSubmit}
          isLoading={isLoading}
        />{" "}
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
          isLoading={isLoading}
        />{" "}
        <PopupWithForm
          name="messagePopup"
          title="Are you sure"
          buttonText="Yes"
        />
        <ImagePopup
          name="picturePopup"
          selectedCard={selectedCard}
          onClose={closeAllPopups}
        />{" "}
        <InfoTooltip
          name="InfoTooltipPopup"
          infoToolTipMsg={infoToolTipMsg}
          onClose={closeAllPopups}
        ></InfoTooltip>{" "}
      </CurrentUserContext.Provider>{" "}
    </div>
  );
}

export default withRouter(App);

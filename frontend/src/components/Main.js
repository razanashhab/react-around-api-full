import React from "react";
import editProfileImg from "../images/edit-profile.svg";
import plusIcon from "../images/plus.svg";
import Card from "./Card";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function Main(props) {
  const [profileImageClass, setProfileImageClass] = React.useState("");
  const [editProfileImageClass, setEditProfileImageClass] = React.useState("");
  const currentUser = React.useContext(CurrentUserContext);

  function handleProfileImageMouseOver() {
    setProfileImageClass("profile__edit-image_opened");
    setEditProfileImageClass("profile__image-editmode");
  }
  function handleProfileImageMouseOut() {
    setProfileImageClass("");
    setEditProfileImageClass("");
  }

  return (
    <main className="content">
      <section className="profile">
        <div
          className="profile__image-container"
          id="profileImage"
          onMouseOver={handleProfileImageMouseOver}
          onMouseOut={handleProfileImageMouseOut}
        >
          <img
            className={`profile__image ${editProfileImageClass}`}
            src={currentUser.avatar}
            alt="profile image"
          />
          <button
            type="button"
            className={`profile__edit-image  ${profileImageClass}`}
            aria-label="edit button"
            id="editProfileImage"
            onClick={props.onEditAvatarClick}
          ></button>
        </div>
        <div className="profile__info">
          <div className="profile__info-wrapper">
            <h1 className="profile__name">{currentUser.name}</h1>
            <button
              type="button"
              className="profile__edit"
              aria-label="edit button"
              onClick={props.onEditProfileClick}
            >
              <img
                className="profile__icon"
                src={editProfileImg}
                alt="edit icon"
              />
            </button>
          </div>
          <p className="profile__description">{currentUser.about}</p>
        </div>
        <button
          type="button"
          className="profile__add-button"
          aria-label="add button"
          onClick={props.onAddPlaceClick}
        >
          <img src={plusIcon} alt="image of plus icon" />
        </button>
      </section>
      <section className="element">
        {props.cards.map((card) => (
          <Card
            key={card._id}
            card={card}
            onCardClick={props.onCardClick}
            onCardLike={props.onCardLike}
            onCardDelete={props.onCardDelete}
          />
        ))}
      </section>
    </main>
  );
}

export default Main;

import React from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function Card(props) {
  const currentUser = React.useContext(CurrentUserContext);
  const isOwn = props.card.owner._id === currentUser._id;
  const cardDeleteButtonClassName = `card__delete-button ${
    isOwn ? "card__delete-button_visible" : "card__delete-button_hidden"
  }`;
  const isLiked = props.card.likes.some((user) => user._id === currentUser._id);
  const cardLikeButtonClassName = `card__button ${
    isLiked ? "card__button_active" : ""
  }`;
  function handleClick() {
    props.onCardClick(props.card);
  }
  function handleLikeClick() {
    props.onCardLike(props.card);
  }
  function handleDeleteClick() {
    props.onCardDelete(props.card);
  }

  return (
    <div className="element__card card">
      <button
        type="button"
        className={cardDeleteButtonClassName}
        aria-label="delete button"
        onClick={handleDeleteClick}
      ></button>
      <img
        className="card__image"
        src={props.card.link}
        alt={`image of ${props.card.name}`}
        onClick={handleClick}
      />
      <div className="card__info">
        <h2 className="card__paragraph"> {props.card.name} </h2>
        <div className="card__wrapper">
          <button
            type="button"
            className={cardLikeButtonClassName}
            aria-label="like button"
            onClick={handleLikeClick}
          ></button>
          <label className="card__label"> {props.card.likes.length} </label>
        </div>
      </div>
    </div>
  );
}

export default Card;

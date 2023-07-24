function ImagePopup(props) {
  return (
    <div
      className={`popup popup_type_${props.name}  ${
        props.selectedCard.link != null ? "popup_opened" : ""
      }`}
    >
      <div className="popup__wrapper">
        <button
          type="button"
          className="popup__close-button"
          id="closePicturePopup"
          onClick={props.onClose}
        ></button>
        <img
          className="popup__image"
          src={props.selectedCard.link}
          alt={`image of ${props.selectedCard.name}`}
        />
        <p className="popup__image-description">{props.selectedCard.name} </p>
      </div>
    </div>
  );
}

export default ImagePopup;

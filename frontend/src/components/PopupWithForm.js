function PopupWithForm({
  isOpen,
  onClose,
  name,
  title,
  buttonText,
  children,
  onSubmit,
}) {
  return (
    <div
      className={`popup popup_type_${name} ${isOpen ? "popup_opened" : ""} `}
    >
      <div className="popup__container">
        <button
          type="button"
          className="popup__close-button"
          onClick={onClose}
        />
        <h3 className="popup__title popup__title_alter-padding"> {title} </h3>{" "}
        <form
          className="form popup__form"
          id={name}
          name={name}
          onSubmit={onSubmit}
        >
          {children}{" "}
          <fieldset className="form__fieldset">
            <button type="submit" className="form__submit">
              {" "}
              {buttonText}{" "}
            </button>{" "}
          </fieldset>{" "}
        </form>{" "}
      </div>{" "}
    </div>
  );
}

export default PopupWithForm;

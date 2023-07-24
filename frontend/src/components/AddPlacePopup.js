import React from "react";
import PopupWithForm from "./PopupWithForm";

function AddPlacePopup(props) {
  const [title, setTitle] = React.useState(" ");
  const [link, setLink] = React.useState(" ");
  React.useEffect(() => {
    setTitle("");
    setLink("");
  }, [props.isOpen]);

  function handleTitleChange(evt) {
    setTitle(evt.target.value);
  }

  function handleLinkChange(evt) {
    setLink(evt.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();

    props.onAddNewPlace({
      title: title,
      link: link,
    });
  }
  return (
    <PopupWithForm
      name="createCardPopup"
      title="New Place"
      isOpen={props.isOpen}
      onClose={props.onClose}
      buttonText={props.isLoading ? "Creating..." : "Create"}
      onSubmit={handleSubmit}
    >
      <fieldset className="form__fieldset">
        <input
          type="text"
          className="form__input"
          id="title"
          name="title"
          placeholder="Title"
          required
          minLength="1"
          maxLength="30"
          onChange={handleTitleChange}
          value={title}
        />
        <span className="title-input-error form__input-error"> </span>
        <input
          type="url"
          className="form__input"
          id="imagelink"
          name="imagelink"
          placeholder="Image link"
          required
          onChange={handleLinkChange}
          value={link}
        />
        <span className="imagelink-input-error form__input-error"> </span>
      </fieldset>
    </PopupWithForm>
  );
}

export default AddPlacePopup;

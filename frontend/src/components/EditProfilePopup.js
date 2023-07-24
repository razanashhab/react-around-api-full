import React from "react";
import PopupWithForm from "./PopupWithForm";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function EditProfilePopup(props) {
  const [name, setName] = React.useState(" ");
  const [description, setDescription] = React.useState(" ");
  // Subscription to the context
  const currentUser = React.useContext(CurrentUserContext);
  // After loading the current user from the API
  // their data will be used in managed components.
  React.useEffect(() => {
    setName(currentUser.name);
    setDescription(currentUser.about);
  }, [currentUser, props.isOpen]);

  function handleNameChange(evt) {
    setName(evt.target.value);
  }

  function handleDescriptionChange(evt) {
    setDescription(evt.target.value);
  }

  function handleSubmit(e) {
    // Prevent the browser from navigating to the form address
    e.preventDefault();

    // Pass the values of the managed components to the external handler
    props.onUpdateUser({
      name: name,
      about: description,
    });
  }

  return (
    <PopupWithForm
      name="editProfile"
      title="Edit profile"
      isOpen={props.isOpen}
      onClose={props.onClose}
      buttonText={props.isLoading ? "Saving..." : "Save"}
      onSubmit={handleSubmit}
    >
      <fieldset className="form__fieldset">
        <input
          value={name || ""}
          type="text"
          className="form__input form__input_placement"
          id="name"
          name="name"
          placeholder="Name"
          required
          minLength="2"
          maxLength="40"
          onChange={handleNameChange}
        />{" "}
        <span className="name-input-error form__input-error"> </span>{" "}
        <input
          value={description || ""}
          type="text"
          className="form__input form__input_placement"
          id="aboutme"
          name="aboutme"
          placeholder="About me"
          required
          minLength="2"
          maxLength="400"
          onChange={handleDescriptionChange}
        />{" "}
        <span className="aboutme-input-error form__input-error"> </span>{" "}
      </fieldset>{" "}
    </PopupWithForm>
  );
}

export default EditProfilePopup;

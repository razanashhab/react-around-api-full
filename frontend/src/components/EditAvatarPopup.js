import React from "react";
import PopupWithForm from "./PopupWithForm";

function EditAvatarPopup(props) {
  const avatarRef = React.useRef();

  function handleSubmit(e) {
    e.preventDefault();

    props.onUpdateAvatar({
      avatar: avatarRef.current.value,
    });
  }

  return (
    <PopupWithForm
      name="editProfilePicturePopup"
      title="Change profile picture"
      isOpen={props.isOpen}
      onClose={props.onClose}
      buttonText={props.isLoading ? "Saving..." : "Save"}
      onSubmit={handleSubmit}
    >
      <fieldset className="form__fieldset">
        <input
          type="url"
          className="form__input "
          id="profileImagelink"
          name="profileImagelink"
          placeholder="profile image link"
          ref={avatarRef}
          required
        />
        <span className="profileImagelink-input-error form__input-error">
          {" "}
        </span>{" "}
      </fieldset>{" "}
    </PopupWithForm>
  );
}

export default EditAvatarPopup;

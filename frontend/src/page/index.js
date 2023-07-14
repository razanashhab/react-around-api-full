import "./index.css";
import { Card } from "./../components/Card.js";
import { UserInfo } from "./../components/UserInfo.js";
import { FormValidator } from "./../components/FormValidator.js";
import { Section } from "./../components/Section.js";
import { PopupWithForm } from "./../components/PopupWithForm.js";
import { PopupWithImage } from "./../components/PopupWithImage.js";
import { PopupWithConfirmation } from "./../components/PopupWithConfirmation";
import { Api } from "./../components/Api.js";
import {
  formValidators,
  profileAvatar,
  profileName,
  profileDescription,
  profileEditButton,
  nameText,
  aboutmeText,
  cardCreationButton,
} from "../utils/constants.js";

const api = new Api({
  baseUrl: "https://around.nomoreparties.co/v1/cohort-3-en",
  headers: {
    authorization: "d6fcc17f-ad33-4f63-82c2-61f6c834ff3e",
    "Content-Type": "application/json",
  },
});

let renderCardList;

const renderUserProfileInfo = new UserInfo({
  userName: profileName,
  userJob: profileDescription,
  userAvatar: profileAvatar,
});

Promise.all([api.getUserInformation(), api.getInitialCards()])
  .then(([userData, cards]) => {
    //load user info
    renderUserProfileInfo.setUserInfo(userData);
    //load initial cards list
    renderCardList = new Section(
      {
        data: cards,
        renderer: (item) => {
          const cardElement = createCard(
            item._id,
            item.name,
            item.link,
            item.owner,
            item.likes
          );
          renderCardList.addItem(cardElement);
        },
      },
      ".element"
    );
    renderCardList.renderer();
  })
  .catch((err) => {
    console.log(`Error: ${err}`);
  });

const profileForm = new PopupWithForm("#editProfile", (formData) => {
  //send user profile update to server
  api
    .setUserInformation(formData.name, formData.aboutme)
    .then((res) => {
      renderUserProfileInfo.setUserInfo(res);
      profileForm.close();
    })
    .catch((err) => {
      // log the `Error: ${err}` message to the console
      console.log(`Error: ${err}`);
    })
    .finally(() => {
      profileForm.renderLoading(false);
    });
});
profileForm.setEventListeners();

const addCardForm = new PopupWithForm("#createCardPopup", (formData) => {
  //send new added card to server
  const xx = api
    .addCard(formData.title, formData.imagelink)
    .then((post) => {
      const cardElement = createCard(
        post._id,
        post.name,
        post.link,
        post.owner,
        post.likes
      );
      renderCardList.prependItem(cardElement);
      addCardForm.close();
    })
    .catch((err) => {
      // log the `Error: ${err}` message to the console
      console.log(`Error: ${err}`);
    })
    .finally(() => {
      addCardForm.renderLoading(false);
    });
});
addCardForm.setEventListeners();

const popupWithImage = new PopupWithImage("#picturePopup");
popupWithImage.setEventListeners();

const popupMessage = new PopupWithConfirmation(
  "#messagePopup",
  (card, cardId) => {
    api
      .deleteCard(cardId)
      .then((res) => {
        card.remove();
        popupMessage.close();
      })
      .catch((err) => {
        // log the `Error: ${err}` message to the console
        console.log(`Error: ${err}`);
      })
      .finally(() => {
        popupMessage.renderLoading(false);
      });
  }
);
popupMessage.setEventListeners();

const editProfileImageForm = new PopupWithForm(
  "#editProfilePicturePopup",
  (formData) => {
    api
      .updateProfileImage(formData.profileImagelink)
      .then((res) => {
        renderUserProfileInfo.setUserInfo({
          name: res.name,
          about: res.about,
          avatar: res.avatar,
          _id: res._id,
        });
        editProfileImageForm.close();
      })
      .catch((err) => {
        console.log(`Error: ${err}`);
      })
      .finally(() => {
        editProfileImageForm.renderLoading(false);
      });
  }
);
editProfileImageForm.setEventListeners();

const enableValidation = (config) => {
  const formList = Array.from(document.querySelectorAll(config.formSelector));
  formList.forEach((formElement) => {
    const validator = new FormValidator(formElement, config);
    // here you get the name of the form
    const formName = formElement.getAttribute("name");

    // here you store a validator by the `name` of the form
    formValidators[formName] = validator;
    validator.enableValidation();
  });
};

enableValidation({
  formSelector: ".form",
  inputSelector: ".form__input",
  submitButtonSelector: ".form__submit",
  inactiveButtonClass: "button_inactive",
  inputErrorClass: "form__input_type_error",
  errorClass: "form__input-error_active",
});

function createCard(id, name, link, owner, likes) {
  const cardObj = new Card(
    { id: id, title: name, imgLink: link, owner: owner, likes: likes },
    "#template",
    ({ imgSrc, imgAlt }) => {
      popupWithImage.open({
        imgSrc: imgSrc,
        imgAlt: imgAlt,
      });
    },
    (card, id) => {
      popupMessage.open();
      popupMessage.setCardId(card, id);
    },
    (likeList) => {
      //check if card owner is listed in the likes array then call remove like
      //and inactivate the like button
      const isLiked = likeList.some(function (like) {
        return like._id.includes(renderUserProfileInfo.getUserId());
      });
      if (isLiked) {
        api
          .removeLike(cardObj._id)
          .then((res) => {
            cardObj.inactivateLikeButton();
            cardObj.updateLikesCounter(res.likes);
          })
          .catch((err) => {
            // log the `Error: ${err}` message to the console
            console.log(`Error: ${err}`);
          });
      } else {
        //else add like and activate the like button
        api
          .addLike(cardObj._id)
          .then((res) => {
            cardObj.activateLikeButton();
            cardObj.updateLikesCounter(res.likes);
          })
          .catch((err) => {
            // log the `Error: ${err}` message to the console
            console.log(`Error: ${err}`);
          });
      }
    },
    renderUserProfileInfo.getUserId()
  );
  const newCard = cardObj.generateCard();
  return newCard;
}

//Profile Handler
profileEditButton.addEventListener("click", () => {
  const userInfo = renderUserProfileInfo.getUserInfo();
  nameText.value = userInfo.userName;
  aboutmeText.value = userInfo.userJob;

  profileForm.open();
});

//card creation handler
cardCreationButton.addEventListener("click", () => {
  formValidators[createCardForm.getAttribute("name")].resetValidation();
  addCardForm.open();
});

profileImage.addEventListener("mouseover", () => {
  editProfileImage.classList.add("profile__edit-image_opened");
  profileAvatar.classList.add("profile__image-editmode");
});

profileImage.addEventListener("mouseout", (evt) => {
  editProfileImage.classList.remove("profile__edit-image_opened");
  profileAvatar.classList.remove("profile__image-editmode");
});

editProfileImage.addEventListener("click", () => {
  formValidators[editProfilePictureForm.getAttribute("name")].resetValidation();
  editProfileImageForm.open();
});

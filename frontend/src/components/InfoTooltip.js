import React from "react";
import { Link, withRouter } from "react-router-dom";

function InfoTooltip(props) {
  return (
    <div
      className={`popup popup_type_${props.name}  ${
        props.infoToolTipMsg.img != null ? "popup_opened" : ""
      }`}
    >
      <div className="popup__wrapper popup__tooltip">
        <button
          type="button"
          className="popup__close-button"
          id="closeToolTipPopup"
          onClick={props.onClose}
        ></button>{" "}
        <img
          className="popup__image popup__tooltip"
          src={props.infoToolTipMsg.img}
          alt={`image of ${props.infoToolTipMsg.img}`}
        />{" "}
      </div>{" "}
    </div>
  );
}

export default InfoTooltip;

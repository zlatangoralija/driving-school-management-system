import React from "react";
import { createPortal } from "react-dom";
import { FiX } from "react-icons/fi";

const Modal = (props) => {
  React.useEffect(() => {
    if (props.status) {
      document.body.classList.add("fixedPosition");
      if (document.getElementsByClassName("headerInfoBar")[0]) {
        document.getElementsByClassName("headerInfoBar")[0].classList.add("z0");
      }

      if (document.getElementsByClassName("header _shop")[0]) {
        document.getElementsByClassName("header _shop")[0].classList.add("z0");
      }
    } else {
      document.body.classList.remove("fixedPosition");
      if (document.getElementsByClassName("headerInfoBar")[0]) {
        document
          .getElementsByClassName("headerInfoBar")[0]
          .classList.remove("z0");
      }
      if (document.getElementsByClassName("header _shop")[0]) {
        document
          .getElementsByClassName("header _shop")[0]
          .classList.remove("z0");
      }
    }
  }, [props.status]);

  return props.status ? (
    <>
      {createPortal(
        <div className="_modal">
          <div className={`${props.className ? props.className : ""}`}>
            <div className="flex items-center w-full justify-between border-b p-6">
              <div></div>
              <div className="title">
                {props.title && <h3 className="!my-0">{props.title}</h3>}
              </div>
              <button
                type="button"
                onClick={() => props.close()}
                className="icon-close"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {props.content && <div className="content">{props.content}</div>}
            {props.footer && <div className="footer">{props.footer}</div>}
          </div>
        </div>,
        document.body
      )}
    </>
  ) : null;
};

export default Modal;

import React from "react";
import { AppContext } from "../Contexts/AppContext";
import { useContext } from "react";
import "./InputBox.css";

export default function InputBox() {
  const { service } = useContext(AppContext);

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    service.next(event.target.value);
  };

  return (
    <div className="input-box">
      <input
        onChange={onChangeHandler}
        className="input-box__input"
        type="text"
        placeholder="Send Message Over Service..."
      />
    </div>
  );
}

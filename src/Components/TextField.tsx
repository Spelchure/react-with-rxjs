import { AppContext } from "../Contexts/AppContext";
import { useContext, useEffect, useState } from "react";
import "./TextField.css";

export default function TextField() {
  const { service } = useContext(AppContext);
  const [text, setText] = useState<string>("");

  useEffect(() => {
    let subscription = service.subscribe({
      next: (value) => {
        setText(value);
      },
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [service]);

  return (
    <div className="text-field">
      <p className="text-field__text">{text}</p>
    </div>
  );
}

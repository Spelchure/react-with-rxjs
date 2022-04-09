import InputBox from "./InputBox";
import "./RxJSTest.css";
import TextField from "./TextField";

export default function RxJSTest() {
  return (
    <div className="rxjs-test">
      <div className="rxjs-test__left">
        <InputBox />
      </div>
      <div className="rxjs-test__right">
        <TextField />
      </div>
    </div>
  );
}

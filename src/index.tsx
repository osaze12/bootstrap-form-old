import ReactDOM from "react-dom";
import BootstrapedForm from "./lib";
import "./lib/dist/index.css";

ReactDOM.render(
  <BootstrapedForm
    fields={{
      email: "email|required",
      password: "password|required|visibility",
      confirmPassword: "password|required|visibility",
      createAccount: "btn",
    }}
  />,
  document.getElementById("root")
);

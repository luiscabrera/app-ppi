import { Fragment } from "react";
import Exchange from "./components/exchange";
import Header from "./components/header";
import "./fonts.css";

const App = () => {
  return (
    <Fragment>
      <Header />
      <Exchange />
    </Fragment>
  );
};

export default App;

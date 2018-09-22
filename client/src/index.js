import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

import {Drizzle, generateStore} from "drizzle";
import HashStore from "./contracts/HashStore.json";

const options = {contracts: [HashStore]};

const drizzleStore = generateStore(options);
const drizzle = new Drizzle(options, drizzleStore);

ReactDOM.render(<App drizzle={drizzle} />, document.getElementById("root"));

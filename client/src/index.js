import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import {HashStore} from "./HashStore";

import {Drizzle, generateStore} from "drizzle";
import HashStoreContract from "./contracts/HashStore.json";

const options = {contracts: [HashStoreContract]};

const drizzleStore = generateStore(options);
const drizzle = new Drizzle(options, drizzleStore);

ReactDOM.render(<HashStore drizzle={drizzle} />, document.getElementById("root"));

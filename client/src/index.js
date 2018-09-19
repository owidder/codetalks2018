import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

// import drizzle functions and contract artifact
import { Drizzle, generateStore } from "drizzle";
import HashStore from "./contracts/HashStore.json";

// let drizzle know what contracts we want
const options = { contracts: [HashStore] };

// setup the drizzle store and drizzle
const drizzleStore = generateStore(options);
const drizzle = new Drizzle(options, drizzleStore);

// pass in the drizzle instance
ReactDOM.render(<App drizzle={drizzle} />, document.getElementById("root"));
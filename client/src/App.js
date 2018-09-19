import React, { Component } from 'react';

import {ReadEntries} from './ReadEntries';
import  {StoreHash} from './StoreHash';

import './App.css';

class App extends Component {
    state = { loading: true, drizzleState: null };

    componentDidMount() {
        const { drizzle } = this.props;

        // subscribe to changes in the store
        this.unsubscribe = drizzle.store.subscribe(() => {

            // every time the store updates, grab the state from drizzle
            const drizzleState = drizzle.store.getState();

            // check to see if it's ready, if so, update local component state
            if (drizzleState.drizzleStatus.initialized) {
                this.setState({ loading: false, drizzleState });
            }
        });
    }

    compomentWillUnmount() {
        this.unsubscribe();
    }

    render() {
        if (this.state.loading) return "Loading Drizzle...";
        return (
            <div className="App">
                <ReadEntries
                    drizzle={this.props.drizzle}
                    drizzleState={this.state.drizzleState}
                />
                <StoreHash
                    drizzle={this.props.drizzle}
                    drizzleState={this.state.drizzleState}
                />
            </div>
        );
    }
}
export default App;

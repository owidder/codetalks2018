import React from "react";
import {Form, Input, Button, Card} from 'antd';
import 'antd/dist/antd.css';
import './HashStore.css';
import {Drizzle, generateStore} from "drizzle";
import HashStoreContract from "./contracts/HashStore.json";

import {hashSHA256FromUtf8} from './hash';

const {TextArea} = Input;

export class HashStore extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    componentDidMount() {
        const options = {contracts: [HashStoreContract]};
        this.drizzle = new Drizzle(options, generateStore(options));

        this.unsubscribe = this.drizzle.store.subscribe(() => {
            const drizzleState = this.drizzle.store.getState();

            if (drizzleState.drizzleStatus.initialized) {
                this.setState({loaded: true, drizzleState});
            }
        });
    }

    compomentWillUnmount() {
        this.unsubscribe();
    }

    async storeHashedText() {
        const contract = this.drizzle.contracts.HashStore;
        const hashedText = await hashSHA256FromUtf8(this.text);

        const stackId = contract.methods["storeHash"].cacheSend(hashedText, {
            from: this.state.drizzleState.accounts[0]
        });

        this.setState({stackId, hashedText});

    };

    async getEntryFromHash() {
        const contract = this.drizzle.contracts.HashStore;

        const hashedText = await hashSHA256FromUtf8(this.text);

        const sourceKey = contract.methods["getSourceFromHash"].cacheCall(hashedText);
        const blockNumberKey = contract.methods["getBlockNumberFromHash"].cacheCall(hashedText);
        const blockTimestampKey = contract.methods["getBlockTimestampFromHash"].cacheCall(hashedText);

        this.setState({sourceKey, blockNumberKey, blockTimestampKey, hashedText});

    }

    renderTxStatus() {
        const {drizzleState} = this.state;
        const {transactions, transactionStack} = drizzleState;
        const txHash = transactionStack[this.state.stackId];

        if (!txHash) return null;

        return `Transaction status: ${transactions[txHash].status}`;
    };

    renderEntry() {
        const {drizzleState, sourceKey, blockNumberKey, blockTimestampKey} = this.state;
        const contract = drizzleState.contracts.HashStore;
        const source = contract.getSourceFromHash[sourceKey];
        const blockNumber = contract.getBlockNumberFromHash[blockNumberKey];
        const blockTimestamp = contract.getBlockTimestampFromHash[blockTimestampKey];

        return <Card>
            <p>Source: {source ? source.value : ""}</p>
            <p>Block number: {blockNumber ? blockNumber.value : ""}</p>
            <p>Block timestamp: {blockTimestamp ? (new Date(Number(blockTimestamp.value) * 1000)).toDateString() : ""}</p>
        </Card>
    }

    render() {
        if (!this.state.loaded) return "Loading Drizzle...";

        return (
            <div className="hashstore">
                <Card>
                    <p><TextArea onChange={(evt) => this.text = evt.target.value} placeholder="Some text" autosize/></p>
                    <p><Button type="primary" onClick={() => this.storeHashedText()}>Store hash</Button></p>
                    <p><Button type="primary" onClick={() => this.getEntryFromHash()}>Get entry</Button></p>
                    <p>{this.state.hashedText}</p>
                    <p>{this.renderTxStatus()}</p>
                </Card>
                {this.renderEntry()}
            </div>
        )
    }
}

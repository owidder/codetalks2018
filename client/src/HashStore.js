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
        const drizzleStore = generateStore(options);
        this.drizzle = new Drizzle(options, drizzleStore);

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

    async storeHashedText(evt) {
        const {drizzleState} = this.state;
        const contract = this.drizzle.contracts.HashStore;

        const text = this.textArea.props.value;
        const hashedText = await hashSHA256FromUtf8(text);

        const stackId = contract.methods["storeHash"].cacheSend(hashedText, {
            from: drizzleState.accounts[0]
        });

        this.setState({stackId, hashedText});

    };

    async getEntryFromHash() {
        const contract = this.drizzle.contracts.HashStore;

        const text = this.textArea.props.value;
        const hashedText = await hashSHA256FromUtf8(text);

        const sourceKey = contract.methods["getSourceFromHash"].cacheCall(hashedText);
        const blockNumberKey = contract.methods["getBlockNumberFromHash"].cacheCall(hashedText);
        const blockTimestampKey = contract.methods["getBlockTimestampFromHash"].cacheCall(hashedText);

        this.setState({sourceKey, blockNumberKey, blockTimestampKey, hashedText});

    }

    renderStatus() {
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

        if(source && blockNumber && blockTimestamp) {
            const date = new Date(Number(blockTimestamp.value) * 1000);
            return <Card>
                <p>{this.state.hashedText}</p>
                <p>Source: {source.value}</p>
                <p>Block number: {blockNumber.value}</p>
                <p>Block timestamp: {date.toDateString()}</p>
            </Card>
        }

        return <span></span>
    }

    render() {
        if (!this.state.loaded) return "Loading Drizzle...";

        return (
            <div className="hashstore">
                <Card>
                    <p><TextArea ref={(comp) => this.textArea = comp} placeholder="Some text" autosize/></p>
                    <p><Button type="primary" onClick={() => this.storeHashedText()}>Store hash</Button></p>
                    <p><Button type="primary" onClick={() => this.getEntryFromHash()}>Get entry</Button></p>
                    <p>{this.renderStatus()}</p>
                </Card>
                {this.renderEntry()}
            </div>
        )
    }
}

import React from "react";
import {Form, Input, Button, Card} from 'antd';
import 'antd/dist/antd.css';
import './HashStore.css';
import {Drizzle, generateStore} from "drizzle";
import HashStoreContract from "./contracts/HashStore.json";

import {hashSHA256FromUtf8} from './hash';

const FormItem = Form.Item;
const {TextArea} = Input;

export class _HashStore extends React.Component {
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

    storeHashedText(evt) {
        evt.preventDefault();
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                const {drizzleState} = this.state;
                const contract = this.drizzle.contracts.HashStore;

                const hashedText = await hashSHA256FromUtf8(values.text);

                const stackId = contract.methods["storeHash"].cacheSend(hashedText, {
                    from: drizzleState.accounts[0]
                });

                this.setState({stackId, hashedText});
            }
        })
    };

    getEntryFromHash(evt) {
        evt.preventDefault();
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                const contract = this.drizzle.contracts.HashStore;

                const hashedText = await hashSHA256FromUtf8(values.text);

                const sourceKey = contract.methods["getSourceFromHash"].cacheCall(hashedText);
                const blockNumberKey = contract.methods["getBlockNumberFromHash"].cacheCall(hashedText);
                const blockTimestampKey = contract.methods["getBlockTimestampFromHash"].cacheCall(hashedText);

                this.setState({sourceKey, blockNumberKey, blockTimestampKey, hashedText});
            }
        })
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
                <Form>
                    <FormItem label="Some text">
                        {this.props.form.getFieldDecorator('text', {rules: [{required: true, message: 'Input some text',}],
                        })(<TextArea placeholder="Some text" autosize/>)}
                    </FormItem>
                </Form>
                <Card>
                    <p><Button type="primary" onClick={(e) => this.storeHashedText(e)}>Store hash</Button></p>
                    <p><Button type="primary" onClick={(e) => this.getEntryFromHash(e)}>Get entry</Button></p>
                    <p>{this.renderStatus()}</p>
                </Card>
                {this.renderEntry()}
            </div>
        )
    }
}

export const HashStore = Form.create()(_HashStore);

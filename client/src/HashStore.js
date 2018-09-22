import React from "react";
import {Form, Input, Button, Card} from 'antd';
import 'antd/dist/antd.css';
import './HashStore.css';

import {hashSHA256FromUtf8} from './hash';

const FormItem = Form.Item;
const {TextArea} = Input;

export class _HashStore extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stackId: null,
            hashedText: null,
            sourceKey: null,
            blockNumberKey: null,
            blockTimestampKey: null,
        };
    }

    storeHashedText(evt) {
        evt.preventDefault();
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                const {drizzle, drizzleState} = this.props;
                const contract = drizzle.contracts.HashStore;

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
                const contract = this.props.drizzle.contracts.HashStore;

                const hashedText = await hashSHA256FromUtf8(values.text);

                const sourceKey = contract.methods["getSourceFromHash"].cacheCall(hashedText);
                const blockNumberKey = contract.methods["getBlockNumberFromHash"].cacheCall(hashedText);
                const blockTimestampKey = contract.methods["getBlockTimestampFromHash"].cacheCall(hashedText);

                this.setState({sourceKey, blockNumberKey, blockTimestampKey, hashedText});
            }
        })
    }

    getTxStatus() {
        const {transactions, transactionStack} = this.props.drizzleState;
        const txHash = transactionStack[this.state.stackId];

        if (!txHash) return null;

        return `Transaction status: ${transactions[txHash].status}`;
    };

    renderEntry(source, blockNumber, blockTimestamp) {
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
        const contract = this.props.drizzleState.contracts.HashStore;
        const source = contract.getSourceFromHash[this.state.sourceKey];
        const blockNumber = contract.getBlockNumberFromHash[this.state.blockNumberKey];
        const blockTimestamp = contract.getBlockTimestampFromHash[this.state.blockTimestampKey];

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
                    <p>{this.getTxStatus()}</p>
                </Card>
                {this.renderEntry(source, blockNumber, blockTimestamp)}
            </div>
        )
    }
}

export const HashStore = Form.create()(_HashStore);

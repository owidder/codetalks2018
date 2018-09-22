import React from "react";
import {Form, Input, Button, Row, Col, Card} from 'antd';
import 'antd/dist/antd.css';
import './HashStore.css';

import {hashSHA256FromUtf8} from './hash';

const FormItem = Form.Item;
const {TextArea} = Input;

export class _HashStore extends React.Component {
    state = {stackId: null, hashedText: null, dataKey: null};

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

                const dataKey = contract.methods["getEntryFromHash"].cacheCall(hashedText);

                this.setState({dataKey, hashedText});
            }
        })
    }

    getTxStatus() {
        const {transactions, transactionStack} = this.props.drizzleState;
        const txHash = transactionStack[this.state.stackId];

        if (!txHash) return null;

        return `Transaction status: ${transactions[txHash].status}`;
    };

    renderEntry(entry) {
        if(entry && entry.value) {
            const date = new Date(Number(entry.value.blockTimestamp) * 1000);
            return <Card>
                <p>{this.state.hashedText}</p>
                <p>Source: {entry.value.source}</p>
                <p>Block number: {entry.value.blockNumber}</p>
                <p>Block timestamp: {date.toDateString()}</p>
            </Card>
        }

        return <span></span>
    }

    render() {
        const contract = this.props.drizzleState.contracts.HashStore;
        const entry = contract.getEntryFromHash[this.state.dataKey];

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
                {this.renderEntry(entry)}
            </div>
        )
    }
}

export const HashStore = Form.create()(_HashStore);

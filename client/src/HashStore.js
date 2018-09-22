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

    getEntriesFromHash(evt) {
        evt.preventDefault();
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                const {drizzle, drizzleState} = this.props;
                const contract = drizzle.contracts.HashStore;

                const hashedText = await hashSHA256FromUtf8(values.text);

                const dataKey = contract.methods["getEntriesFromHash"].cacheCall();

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

    render() {
        const {drizzleState} = this.props;
        const contract = drizzleState.contracts.HashStore;
        const {getFieldDecorator} = this.props.form;

        // const entries = contract.getEntriesFromHash[this.state.dataKey];
        // console.log(entries);

        return (
            <div className="hashstore">
                <Form>
                    <FormItem label="Some text">
                        {getFieldDecorator('text', {rules: [{required: true, message: 'Input some text',}],
                        })(<TextArea placeholder="Some text" autosize/>)}
                    </FormItem>
                </Form>
                <Card>
                    <p><Button type="primary" onClick={(e) => this.storeHashedText(e)}>Store hash</Button></p>
                    <p><Button type="primary" onClick={(e) => this.getEntriesFromHash(e)}>Get entries</Button></p>
                    <p>{this.state.hashedText}</p>
                    <p>{this.getTxStatus()}</p>
                </Card>
            </div>
        )
    }
}

export const HashStore = Form.create()(_HashStore);

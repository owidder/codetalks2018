import React from "react";
import {Form, Input, Button, Row, Col} from 'antd';
import 'antd/dist/antd.css';

import {hashSHA512FromUtf8} from './hash';

const FormItem = Form.Item;
const {TextArea} = Input;

export class _HashStore extends React.Component {
    state = { stackId: null };

    storeHashedText(evt) {
        evt.preventDefault();
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                const { drizzle, drizzleState } = this.props;
                const contract = drizzle.contracts.HashStore;

                const hashedText = await hashSHA512FromUtf8(values.text);

                const stackId = contract.methods["addHashEntry"].cacheSend(hashedText, {
                    from: drizzleState.accounts[0]
                });

                this.setState({ stackId });
            }
        })
    };

    getTxStatus() {
        const { transactions, transactionStack } = this.props.drizzleState;
        const txHash = transactionStack[this.state.stackId];

        if (!txHash) return null;

        return `Transaction status: ${transactions[txHash].status}`;
    };

    componentDidMount() {
        const { drizzle } = this.props;
        drizzle.contracts.HashStore.events
            .NewHashEntry({fromBlock: 0, toBlock: 'latest'})
            .on('data', (event) => console.log(event));
    }

    render() {
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;

        return (
            <div>
                <Form>
                    <Row>
                        <Col span={1}/>
                        <Col span={22}>
                            <FormItem label="Some text">
                                {getFieldDecorator('text', {
                                    rules: [{
                                        required: true,
                                        message: 'Input some text',
                                    }],
                                })(
                                    <TextArea placeholder="Some text" autosize/>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={1}/>
                    </Row>
                    <Row>
                        <Col span={1}/>
                        <Col span={22}>
                            <Button type="primary" onClick={(e) => this.storeHashedText(e)}>Store hash</Button>
                        </Col>
                        <Col span={1}/>
                    </Row>
                </Form>
                <p>{this.getTxStatus()}</p>
            </div>
        )
    }
}

export const HashStore = Form.create()(_HashStore);

import React from "react";
import {Form, Input, Button, Row, Col} from 'antd';
import 'antd/dist/antd.css';

const FormItem = Form.Item;
const {TextArea} = Input;

export class _HashStore extends React.Component {
    state = { stackId: null };

    handleKeyDown = e => {
        // if the enter key is pressed, set the value with the string
        if (e.keyCode === 13) {
            this.setValue(e.target.value);
        }
    };

    setValue = value => {
        const { drizzle, drizzleState } = this.props;
        const contract = drizzle.contracts.HashStore;

        // let drizzle know we want to call the `set` method with `value`
        const stackId = contract.methods["addHashEntry"].cacheSend(value, {
            from: drizzleState.accounts[0]
        });

        // save the `stackId` for later reference
        this.setState({ stackId });
    };

    getTxStatus = () => {
        // get the transaction states from the drizzle state
        const { transactions, transactionStack } = this.props.drizzleState;

        // get the transaction hash using our saved `stackId`
        const txHash = transactionStack[this.state.stackId];

        // if transaction hash does not exist, don't display anything
        if (!txHash) return null;

        // otherwise, return the transaction status
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
                            <FormItem label="text to claim">
                                {getFieldDecorator('textToClaim', {
                                    rules: [{
                                        required: true,
                                        message: 'Input text to claim',
                                    }],
                                })(
                                    <TextArea placeholder="text to claim" autosize/>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={1}/>
                    </Row>
                    <Row>
                        <Col span={1}/>
                        <Col span={22}>
                            <Button type="primary" onClick={(e) => this.setValue(e)}>Check</Button>
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

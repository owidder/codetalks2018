import React from "react";

export class ReadEntries extends React.Component {
    state = { dataKey: null };

    componentDidMount() {
        const { drizzle } = this.props;
        drizzle.contracts.HashStore.events
            .NewHashEntry({fromBlock: 0, toBlock: 'latest'}, (error, event) => {
            })
            .on('data', (event) => console.log(event));
    }

    render() {
        return <p>Events!!!</p>;
    }
}

import React from 'react';

class Node extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
        };
    }

    componentDidMount() {
        // Fetch data from the server and update the state
        fetch('http://localhost:3001/api/nodes/')
            .then(response => response.json())
            .then(data => this.setState({ data }))
            .catch(error => console.log(error));
    }


    generateRandomCode() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let code = '';
        for (let i = 0; i < 4; i++) {
            code += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return code;
    }

    render() {
        const { data } = this.state;
        const randomCode = this.generateRandomCode();

        return (
            <div>
                <p>Number: {data.number}</p>
                <p>Name: {randomCode}</p>
                <p>Parent Id: {data.parent_id}</p>
            </div>
        );
    }
}

export default Node;
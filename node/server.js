const express = require('express');
const app = express();
const got = require('got');
const port = process.env.PORT || 3000;
const daprPort = process.env.DAPR_HTTP_PORT || 3500;
const stateStoreName = "statestore";
const stateURL  = `http://localhost:${daprPort}/v1.0/state/${stateStoreName}`;

app.use(express.json());

app.get('/users', (req, res) =>{
    (async () => {
        try {
            const response = await got(`${ stateUrl }/user`);
            return response.body;
        } catch (error) {
            console.log(error.response.body);
            res.status(500).send({ message: error });
        }
    })();
});

app.post('/users', (req, res) =>{
    const data = req.body.data;
    const orderId = data.orderId;
    console.log("Got a new order! Order ID: " + orderId);
    const state = [{
        key: "order",
        value: data
    }];
    (async () => {
        const {body} = await got.post(stateUrl, {
            json: JSON.stringify(state),
            responseType: 'json'
        });
        console.log(body.data);
    })();
});

app.listen(port, () => console.log(`Node App listening on port ${port}!`));
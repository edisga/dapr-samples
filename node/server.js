const express = require('express');
const app = express();
const got = require('got');
const port = process.env.PORT || 3000;
const daprPort = process.env.DAPR_HTTP_PORT || 3500;
const stateStoreName = "statestore";
const stateUrl = `http://localhost:${daprPort}/v1.0/state/${stateStoreName}`;

app.use(express.json());

app.get('/users', (req, res) =>{
    (async () => {
        await got(`${ stateUrl }/user`)
        .then(response => {
            console.log(`Response body: ${response.body}`);
            return response.body;
        })
        .catch(err =>{
            console.log(`Response error: ${err}`);
            res.status(500).send({ message: err });
        });
    })();
});

app.post('/orders', (req, res) =>{
    const data = req.body.data;
    console.log(data);
    const orderId = data.orderId;
    console.log("Got a new order! Order ID: " + orderId);

    const state = [{
        key: "order",
        value: data
    }];

    (async () => {
        await got(stateUrl, {
            json: JSON.stringify(state),
            responseType: 'json'
        })
        .then(response => {
            console.log(`Response data: ${response.data}`);
            return response.data;
        })
        .catch(err =>{
            console.log(`Response error: ${err}`);
            res.status(500).send({ message: err });
        });
    })();
});

app.listen(port, () => console.log(`Node App listening on port ${port}!`));
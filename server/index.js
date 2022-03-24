// modules

const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;

const { graphqlHTTP } = require('express-graphql');
const schema = require("./schema/schema");
const mongoose = require("mongoose");

const cors = require("cors");

// allow cross-origin requests

app.use(cors());

// middleware

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));


app.use(() => (req, next, err) => {
    console.log("Request received");
    console.log(req.method, req.url);
    console.log(`request has been sent at ${Date.now()}`);
    if (err) {
        console.log(err.stack);
    } else {
        console.log("Request has been processed");
        next();
    }
});


// connect to mongodb

mongoose.connect(`mongodb+srv://db-daniels:RLYgRwESAy5VGR5@cluster0.i5wf6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`, { useNewUrlParser: true }); // connect to mongodb

mongoose.connection.once('open', () => { // once is used to make sure that the connection is made only once
    console.log("connected to mongodb");
}).on('error', (error) => {
    console.log(error.message);
});

// Serve

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Main server at http://localhost:${PORT}`);
    console.log(`GraphQL server at http://localhost:${PORT}/graphql`);
    console.log(`Hello Master Server Daniels ! 🧔`);
});

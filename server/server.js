const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

// SERVER CONFIG
const app = express();
const PORT = 3000;

// BODY PARSING (EXPRESS' BUILT IN PARSER)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// SERVING THE BUILD FILE
app.use('/build', express.static(path.join(__dirname, '../build')));

// SERVING THE MAIN PAGE
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
});

// ROUTERS
const gcloudRouter = require('./routers/gcloudRouter');
const awsRouter = require('./routers/awsRouter');
const azureRouter = require('./routers/azureRouter');
// GCLOUD
app.use('/gcloud', gcloudRouter);

// AWS
app.use('/aws', awsRouter);

// AZURE
app.use('/azure', azureRouter);

// 404 NOT FOUND HANDLER
app.use('*', (req, res) => {
    res.status(404).send('Not Found');
});

// GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send('Internal Server Error');
});

// INITIALIZE SERVER
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});

module.exports = app;
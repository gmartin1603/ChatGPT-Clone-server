const functions = require("firebase-functions");
const express = require('express');
const cors = require('cors');
// const bodyParser = require('body-parser')
const { Configuration, OpenAIApi } = require('openai');
const OPENAI_API_KEY = require('./private/secret-key.json')

const URLs = {
    dev: true,
    prod: 'https://chatgpt-clone-f112f.web.app'
}

const configuration = new Configuration({
    organization: 'org-WzkZiwlPar8ufmx2Za26m9pi',
    apiKey: OPENAI_API_KEY.value,
});
const openai = new OpenAIApi(configuration);

//Express init
const app = express();
// app.use('*' ,cors({origin:true}));
// app.use(bodyParser.json());


app.post('/', async (req, res) => {
    console.log('Started')
    const {message} = JSON.parse(req.body)
    // const {message} = req.body
    console.log(message)
    await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: `${message}-`,
        max_tokens: 200,
        temperature: 0.7,
        }).then((response) => {
            const totalTokens = response.data.usage.total_tokens
            console.log("message",response.data.choices[0].text, "tokens",totalTokens)
            res.json({
                message: response.data.choices[0].text,
                tokens: totalTokens
            })
        })
        .catch((error) => {
            console.log(error)
            res.status(500)
        })
})

// Set Express app to deploy in Firebse Function "app"
exports.app = functions.https.onRequest(app)

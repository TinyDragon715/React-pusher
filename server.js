require('dotenv/config');
const Pusher = require('pusher');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();


app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());



const pusher = new Pusher({
  appId : "1433499",
  key : "ef8575c0c6ecb6f1f5bc",
  secret : "73882dd9501620d66547",
  cluster : "eu",
  useTLS: true
});

app.post('/pusher/auth', (req, res) => {
  let socketId = req.body.socket_id;
  let channel = req.body.channel_name;
  let random_string = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
  let presenceData = {
      user_id: random_string,
      user_info: {
          username: '@' + random_string,
      }
  };
  let auth = pusher.authenticate(socketId, channel, presenceData);
  res.send(auth);
});

app.set('PORT', 3333);


app.post('/message', (req, res) => {
  const payload = req.body;
  pusher.trigger('orders', 'client-message', payload);
  res.send(payload)
});


app.listen(app.get('PORT'), () => 
  console.log('Listening at ' + app.get('PORT')))
require('dotenv/config');
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const Pusher = require("pusher");

const pusher = new Pusher({
  appId: process.env.PUSHER_APPID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true,
});
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.post("/pusher/auth", (req, res) => {
  const socketId = req.body.socket_id;
  const channel = req.body.channel_name;
  const auth = pusher.authenticate(socketId, channel);
  res.send(auth);
});

app.post('/message', (req, res) => {
  const payload = req.body;
  pusher.trigger('private-orders', 'message', payload);
  res.send(payload)
});

app.set('PORT', process.env.API_PORT || 5000);
app.listen(app.get('PORT'), () => 
  console.log('Listening at ' + app.get('PORT')))
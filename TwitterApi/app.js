const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const posts = require('./routes/posts');
const users = require('./routes/users');
const subscription = require('./routes/subscription');
const cors = require('cors');
const webPush = require("web-push");
const { VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_EMAIL } = require("./config");

// Configurer web-push avec les clés VAPID
webPush.setVapidDetails(VAPID_EMAIL, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use('/posts', posts);
app.use('/user', users);
app.use('/subscription', subscription);

app.listen(5000, () => {
  console.log('Server is running on port 5000.');
});
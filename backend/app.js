require('dotenv').config()
require('./models/userDetails');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const cron = require('node-cron');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRoute = require('./routes/user');

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(bodyParser.json());
app.use(cors());
app.use(userRoute);

const User = mongoose.model('userInfo');
const MONGOURL = process.env.MONGOURL;
const JWT_SECRET = process.env.JWT_SECRET;
const PORT = process.env.PORT;

mongoose.set('strictQuery', true);
mongoose.connect(MONGOURL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});
mongoose.connection.on("error", err => {
  console.log("Error connecting", err);
});
mongoose.connection.on("disconnected", () => {
  console.log("Mongoose is still disconnected");
});

app.post('/register', async (req, res) => {
  const { fname, lname, email, password } = req.body;
  const encryptedPassword = await bcrypt.hash(password, 10);
  try {
    const oldUser = await User.findOne({ email });
    if (oldUser) {
      return res.json({ error: 'User Exists' });
    }
    await User.create({
      fname,
      lname,
      email,
      password: encryptedPassword
    });
    res.send({ status: 'ok' });
  } catch (error) {
    res.send({ status: 'error' });
  }
});

app.post('/login-user', async (req, res) => {
  const { email, password } = req.body; // at first we have collected email & password here 
  const user = await User.findOne({ email }); // we checked whether that email exists or not
  if (!user) {
    return res.json({ error: 'User not found' });
  }
  if (await bcrypt.compare(password, user.password)) { // we compared the password with user password
    const token = jwt.sign({ email: user.email }, JWT_SECRET); // if the password is true then it will generate jwt token with the use of our jwt secret
    if (res.status(201)) { // if everything goes well it would return a token with status ok
      return res.json({ status: 'ok', data: token });
    } else {
      return res.json({ error: 'error' });
    }
  }
  res.json({ status: 'error', error: 'Invalid Password' });
});

app.post('/userData', async (req, res) => {
  const { token } = req.body;
  try {
    const user = jwt.verify(token, JWT_SECRET);
    const useremail = user.email;
    User.findOne({ email: useremail })
      .then((data) => {
        res.send({ status: 'ok', data: data });
      })
      .catch((error) => {
        res.send({ status: 'error', data: error });
      });
  } catch (error) { }
});

app.listen(PORT, () => {
  console.log(`Server has started on port ${PORT}`);
});
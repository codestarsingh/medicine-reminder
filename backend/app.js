const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cron = require('./cron');
const route = require('./routes/route');
require('dotenv').config();
require('./models/adminInfo');

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(route);

const adminInfo = mongoose.model('adminInfo');
const MONGOURL = process.env.MONGOURL;
const PORT = process.env.PORT;
const JWT_SECRET = process.env.JWT_SECRET;

mongoose.set('strictQuery', true);
mongoose.connect(MONGOURL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB ATLAS');
});
mongoose.connection.on('error', err => {
  console.log('Error connecting', err);
});
mongoose.connection.on('disconnected', () => {
  console.log('Mongoose is still disconnected');
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const admin = await adminInfo.findOne({ email });
  if (!admin) {
    return res.json({ message: 'Admin not found' });
  }
  if (await bcrypt.compare(password, admin.password)) {
    const token = jwt.sign({ email: admin.email }, JWT_SECRET);
    if (res.status(200)) {
      return res.json({ status: 'ok', token: token });
    } else {
      return res.json({ message: 'error' });
    }
  }
  res.json({ status: 'error', message: 'Invalid password' });
});

app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  const encryptedPassword = await bcrypt.hash(password, 10);
  try {
    const oldAdmin = await adminInfo.findOne({ email });
    if (oldAdmin) {
      return res.json({ error: 'Admin exists' });
    }
    await adminInfo.create({
      name,
      email,
      password: encryptedPassword
    });
    res.send({ status: 'ok' });
  } catch (error) {
    res.send({ status: 'error' });
  }
});

cron.sendMailAllUser();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
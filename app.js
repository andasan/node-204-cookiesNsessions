require('dotenv').config();
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//dummy auth
app.use((req, res, next) => {
  User.findById('5ecf15ec3d660a69553f8db9') //change the ID to a user id on your DB (create a users collection)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Connected!');

    //not necessary for production, just to create a user to get an id for dummy auth
    User.findOne().then(user => {
      if(!user){
        const user = new User({
          name: 'Maki',
          email: 'maki@zushi.com',
          cart: {
            items: []
          }
        });
        user.save();
      }
    });
    
    
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });;
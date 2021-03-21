const express = require('express');
const app = express();
const port = 3003;
const middleware = require('./middleware');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose
    .connect(
        'mongodb+srv://nadar:nadar123@twitterclonecluster.ipvg9.mongodb.net/TwitterCloneDB?retryWrites=true&w=majority'
    )
    .then(() => console.log('Database connection successful'))
    .catch((err) => console.log('Database connection error ' + err));

const server = app.listen(port, () => console.log('Server listening on port: ' + port));

app.set('view engine', 'pug');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

/** Routes */
const loginRoutes = require('./routes/loginRoutes');
const registerRoutes = require('./routes/registerRoutes');

app.use('/login', loginRoutes);
app.use('/register', registerRoutes);

app.get('/', middleware.requireLogin, (req, res, next) => {
    const payload = {
        pageTitle: 'Home',
    };
    res.status(200).render('home', payload);
});

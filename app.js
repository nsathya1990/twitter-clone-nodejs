const express = require('express');
const app = express();
const port = 3003;
const middleware = require('./middleware');
const path = require('path');

const server = app.listen(port, () => console.log('Server listening on port: ' + port));

app.set('view engine', 'pug');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));

/** Routes */
const loginRoutes = require('./routes/loginRoutes');
app.use('/login', loginRoutes);

app.get('/', middleware.requireLogin, (req, res, next) => {
    const payload = {
        pageTitle: 'Home',
    };
    res.status(200).render('home', payload);
});

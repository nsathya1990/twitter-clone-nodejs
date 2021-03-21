const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const User = require('../schemas/UserSchema');

app.set('view engine', 'pug');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));

router.get('/', (req, res, next) => {
    res.status(200).render('register');
});

router.post('/', async (req, res, next) => {
    console.log(req.body);

    const firstName = req.body.firstName.trim();
    const lastName = req.body.lastName.trim();
    const username = req.body.username.trim();
    const email = req.body.email.trim();
    const password = req.body.password;

    const payload = req.body;

    if (firstName && lastName && username && email && password) {
        console.log('SUCCESS');
        const user = await User.findOne({
            $or: [{ username: username }, { email: email }],
        });
        console.log(`user is ${user}`);
        console.log('hello');
    } else {
        console.log('ERROR');
        payload.errorMessage = 'Make sure each field has a valid value.';
        res.status(200).render('register', payload);
    }
});

module.exports = router;

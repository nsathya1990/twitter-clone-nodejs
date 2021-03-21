const mongoose = require('mongoose');
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useUnifiedTopology', true);

class Database {
    constructor() {
        this.connect();
    }

    connect() {
        mongoose
            .connect(
                'mongodb+srv://nadar:nadar123@twitterclonecluster.ipvg9.mongodb.net/TwitterCloneDB?retryWrites=true&w=majority'
            )
            .then(() => console.log('Database connection successful'))
            .catch((err) => console.log('Database connection error ' + err));
    }
}

module.exports = new Database();

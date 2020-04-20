const mongoose = require('mongoose');
const password = 'p%40ssword';

mongoose.Promise = global.Promise
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

const database = {

    connect: function () {
        mongoose.connect(`mongodb+srv://carlos:${password}@mpdatabase-l4c9f.mongodb.net/test?retryWrites=true&w=majority`, { 
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })

        mongoose.connection.on('error', error => { throw error });
    }
}


module.exports = database;

const mongoose = require('mongoose');
const password = 'p%40ssword';

mongoose.Promise = global.Promise
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

const database = {

    connect: function () {
        mongoose.connect(`mongodb://carlos:p%40ssword@mpdatabase-shard-00-00-l4c9f.mongodb.net:27017,mpdatabase-shard-00-01-l4c9f.mongodb.net:27017,mpdatabase-shard-00-02-l4c9f.mongodb.net:27017/test?ssl=true&replicaSet=MPDatabase-shard-0&authSource=admin&retryWrites=true&w=majority`, { 
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })

        mongoose.connection.on('error', error => { throw error });
    }
}


module.exports = database;

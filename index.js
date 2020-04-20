const express = require ('express');
const db = require ('./models/db');
const cors = require ('cors');
const userRoutes = require ('./routes/userAuthenticationRoutes');
const songRoutes = require ('./routes/songDBRoutes');
const playlistRoutes = require ('./routes/playlistRoutes');

const app = express();

const port = process.env.PORT || 3000;

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//routes
app.use('/api/user', userRoutes);
app.use('/api/song', songRoutes);
app.use('/api/playlist', playlistRoutes);

db.connect();

if(process.env.NODE_ENV === 'production') {
    app.use(express.static(__dirname + '/public/'));
    app.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/index.html'));
}

app.listen(port, () => console.log(`App listening at port ${port}`));
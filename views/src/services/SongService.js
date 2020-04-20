import axios from "axios";

const songurl = 'http://localhost:3000/api/song';
const playlisturl = 'http://localhost:3000/api/playlist';

class SongService {
    static addSong(song) {
        return axios.post(`${songurl}/upload`, song);
    }

    static searchSong(query) {
        return axios.get(`${songurl}/search/${query}`);
    }

    static deleteSong(url) {
        return axios.delete(`${songurl}/delete/${url}`);
    }

    static updateSong(song) {
        return axios.patch(`${songurl}/update`, song);
    }

    static getAllSongs() {
        return axios.get(`${songurl}/list`);
    }

    static retrievePlaylist(username) {
        return axios.get(`${playlisturl}/${username}`);
    }

    static addToPlaylist(username, song) {
        return axios.post(`${playlisturl}/add`, {username, song});
    }

    static deleteFromPlaylist(username, song) {
        return axios.patch(`${playlisturl}/delete`, {username, song});
    }

    static updatePlaylistName(username, name) {
        return axios.post(`${playlisturl}/edit`, {username, name});
    }
}

export default SongService;
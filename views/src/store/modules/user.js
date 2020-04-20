import axios from 'axios';

const state = {
    token: localStorage.getItem('access_token') || null,
    user: JSON.parse(localStorage.getItem('user')) || null
};

const getters = {
    loggedIn(state) {
        return state.token !== null;
    },
    isAdmin(state) {
        return state.user !== null && state.user.isAdmin;
    },
    userInfo(state) {
        return state.user.username; 
    }
};

const actions = {
    retrieveToken(context, res) {
        localStorage.setItem('user', JSON.stringify(res.data.user));
        localStorage.setItem('access_token', res.data.token);
        axios.defaults.headers.common['Authorization'] = context.token;
        context.commit('login', res.data.user);
        context.commit('retrieveToken', res.data.token);
    },
    destroyToken(context) {
        if(context.getters.loggedIn) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('user');
            delete axios.defaults.headers.common['Authorization'];
            context.commit('destroyToken');
        }
    }
};

const mutations = {
    login(state, user) {
        state.user = user;
    },
    retrieveToken(state, token) {
        state.token = token;
    },
    destroyToken(state) {
        state.user = null;
        state.token = null;
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};
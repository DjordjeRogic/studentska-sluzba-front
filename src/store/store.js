import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

const baseUrl = "http://localhost:8080";

export const store =  new Vuex.Store({
    state: {
        token: localStorage.getItem("access_token") || null,
        userRole: localStorage.getItem("userRole") || null,
        currentUserId: localStorage.getItem("currentUserId") || null

    },
    getters:{
        loggedIn(state){
            return state.token !== null;
        },
        userRole(state){
            return state.userRole;
        },
        currentUserId(state)
        {
            return state.currentUserId;
        }
    },
    mutations:{
        retrievedToken(state, token){
            state.token = token;
        },
        destroyedToken(state){
            state.token = null;
        },
        retrievedUserRole(state, userRole){
            state.userRole = userRole;
        },
        destroyedUserRole(state){
            state.userRole = null;
        },
        retrievedCurrentUserId(state, currentUserId)
        {
            state.currentUserId = currentUserId;
        },
        destroyedCurrentUserId(state)
        {
            state.currentUserId = null;
        }
    },
    actions:{
        retrieveToken(context, credentials){
            return new Promise((resolve, reject) => {
                axios.post(baseUrl + '/auth/login',{
                    email: credentials.email,
                    password: credentials.password
                })
                    .then(response => {
                        const token = response.data.accessToken;
                        console.log(token);
                        localStorage.setItem("access_token", token);
                        context.commit('retrievedToken', token);
                        resolve(response);
                    })
                    .catch(error => {
                        console.log(error);
                        reject(error);
                    })
            })
        },
        destroyToken(context){
            localStorage.removeItem("access_token");
            context.commit('destroyedToken');
            console.log("push to login");
        },
        retrieveCurrentUser(context){
            return new Promise((resolve, reject) => {
                axios.get(baseUrl + '/user/currentUser')
                    .then(response => {
                        const currentUser = response.data;
                        localStorage.setItem("currentUser", JSON.stringify(currentUser));
                        localStorage.setItem('userRole', currentUser.role);
                        context.commit('retrievedUserRole', currentUser.role);
                        localStorage.setItem('currentUserId', currentUser.id);
                        context.commit('currentUserId', currentUser.id);
                        resolve(response);
                    })
                    .catch(error => {
                        console.log(error);
                        reject(error);
                    })
            })
        },
        destroyCurrentUser(context){
            localStorage.removeItem("currentUser");
            localStorage.removeItem("userRole");
            context.commit('destroyedUserRole');
            localStorage.removeItem('currentUserId');
            context.commit('destroyedCurrentUserId');
        }
    }
})
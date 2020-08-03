import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '../components/HelloWorld.vue'
import Login from '../components/Login.vue'
import ProfesorList from '../components/ProfesorList.vue'
import PredmetList from '../components/PredmetList.vue'
import SmerList from '../components/SmerList.vue'
import SmerDetails from '../components/SmerDetails.vue'

Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'Login',
            component: Login
        },
        {
            path: '/hello',
            name: 'HelloWorld',
            component: HelloWorld
        },
        {
            path: '/profesorList',
            name: 'ProfesorList',
            component: ProfesorList
        },
        {
            path: '/predmetList',
            name: 'PredmetList',
            component: PredmetList
        },
        {
            path: '/smerList',
            name: 'SmerList',
            component: SmerList
        },
        {
            path: '/smer/:id',
            name: 'SmerDetails',
            component: SmerDetails
        },
    ]
})
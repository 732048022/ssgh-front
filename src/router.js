import Vue from "vue";
import Router from "vue-router";
Vue.use(Router);
import Home from "./views/Home.vue"
import Add from "./views/children/Add.vue"
import Select from "./views/children/Select.vue"
import Login from "./views/Login.vue"
import Regist from "./views/Regist.vue"
import Hello from "./views/children/Hello.vue"
import Show from "./views/children/Show.vue"
export default new Router({
    mode: 'history',
    routes: [
        {
            path:'/',
            component:Login,
        },
        {
            path:'/login',
            component:Login,
        },
        {
            path:'/regist',
            component:Regist,
        },
        {
            path: '/index',
            component: Home,
            children:[{
                path:'/index/add',
                component:Add,

            },
            {
                path:'/index/tables',
                component:Select,
            },
            {
                path:'/index/show',
                component:Show
            },
            {
                path:'/',
                component:Hello,
            }
            ]
        }
    ],
})
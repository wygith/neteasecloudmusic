import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store/index'

Vue.use(VueRouter)

const Home = () => import(/* webpackChunkName: 'home', webpackPrefetch: true */ '@/views/Home')
const Find = () => import(/* webpackChunkName: 'home', webpackPrefetch: true */ '@/views/Home/children/find.vue')
const Mine = () => import(/* webpackChunkName: 'home', webpackPrefetch: true */ '@/views/Home/children/mine.vue')

const Search = () => import(/* webpackChunkName: 'search', webpackPrefetch: true */ '@/views/Search')
const List = () => import(/* webpackChunkName: 'search', webpackPrefetch: true */ '@/views/Search/children/search.vue')
const Details = () => import(/* webpackChunkName: 'search', webpackPrefetch: true */ '@/views/Search/children/details.vue')



const Login = () => import(/* webpackChunkName: 'login', webpackPrefetch: true */ '@/views/Login')
const Register = () => import(/* webpackChunkName: 'login', webpackPrefetch: true */ '@/views/Login/register.vue')

const PlaylistDetails = () => import(/* webpackChunkName: 'PlaylistDetails', webpackPrefetch: true */ '@/views/playlistDetails')

const Ranking = () => import(/* webpackChunkName: 'PlaylistDetails', webpackPrefetch: true */ '@/views/Ranking')
const PlayList = () => import(/* webpackChunkName: 'PlaylistDetails', webpackPrefetch: true */ '@/views/playlist')
const Suggest = () => import(/* webpackChunkName: 'PlaylistDetails', webpackPrefetch: true */ '@/views/suggest')
const Artist = () => import(/* webpackChunkName: 'PlaylistDetails', webpackPrefetch: true */ '@/views/artist')

const History = () => import(/* webpackChunkName: 'history', webpackPrefetch: true */ '@/views/history')

const routes = [
  {
    path: '/',
    redirect: '/home/find',
  },
  {
    name: 'home',
    path: '/home',
    component: Home,
    meta: {
      keepAlive: true
    },
    children: [
      {
        path: '/home/find',
        component: Find,
        meta: {
          keepAlive: true
        }
      },
      {
        name: 'mine',
        path: '/home/mine',
        component: Mine,
        meta: {
          keepAlive: true
        }
      },
    ]
  },
  {
    name: 'login',
    path: '/login',
    component: Login,
    meta: {
      keepAlive: false
    }
  },
  {
    name: 'register',
    path: '/register',
    component: Register,
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/search',
    redirect: '/search/details',
    component: Search,
    meta: {
      keepAlive: true
    },
    children: [
      {
        path: '/search/list',
        component: List,
        meta: {
          keepAlive: true
        }
      },
      {
        path: '/search/details',
        component: Details,
        meta: {
          keepAlive: true
        }
      },
    ]
  },
  {
    name: 'playlistDetails',
    path: '/playlistDetails',
    component: PlaylistDetails,
    meta: {
      keepAlive: false
    }
  },
  {
    name: 'Ranking',
    path: '/ranking',
    component: Ranking,
    meta: {
      keepAlive: true
    }
  },
  {
    name: 'playlist',
    path: '/playlist',
    component: PlayList,
    meta: {
      keepAlive: false
    }
  },
  {
    name: Suggest,
    path: '/suggest',
    component: Suggest,
    meta: {
      keepAlive: true
    }
  },
  {
    name: Artist,
    path: '/artist',
    component: Artist,
    meta: {
      keepAlive: false
    }
  },
  {
    name: History,
    path: '/history',
    component: History,
    meta: {
      keepAlive: true
    }
  }
]




const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  console.log(store.state);
  next()
})

export default router

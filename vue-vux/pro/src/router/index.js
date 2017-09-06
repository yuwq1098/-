import Vue from 'vue'
import Router from 'vue-router'

/* eslint-disable no-new */
const Home = r => require.ensure([], () => r(require('@/components/HelloFromVux')), 'Home')
const Hello = r => require.ensure([], () => r(require('@/components/Hello')), 'Hello')
const promise = r => require.ensure([], () => r(require('@/components/promise')), 'promise')

Vue.use(Router)

/* eslint-disable no-new */
export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/promise'
    },
    {
      path: 'home',
      name: 'Home',
      component: Home
    },
    {
      path: '/hello',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/promise',
      name: 'promise',
      component: promise
    }
  ]
})

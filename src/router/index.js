import Vue from "vue";
import VueRouter from "vue-router";
//import App from "../App.vue";
import LayoutView from "../views/LayoutView.vue";
//import EtapePresentation from "../formulaires/EtapePresentation.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "presentation",
    component: LayoutView,
    meta: {
      requiresAuth: false,
      hideFooter: true,
    },
    children: [
      {
        path: "/presentation",
        name: "presentation",
        meta: {
          requiresAuth: false,
          hideFooter: true,
        },
        component: () => import("../formulaires/EtapePresentation.vue"),
      },
      {
        path: "/experience",
        name: "experience",
        meta: {
          requiresAuth: false,
          hideFooter: true,
        },
        component: () => import("../formulaires/EtapeExperience.vue"),
      },
      {
        path: "/formation",
        name: "Formation",
        meta: {
          requiresAuth: false,
          hideFooter: true,
        },
        component: () => import("../formulaires/EtapeFormation.vue"),
      },
      {
        path: "/layouts-sections/:keySections/:idEtape",
        name: "dynamique-section",
        meta: {
          requiresAuth: false,
          hideFooter: true,
        },
        props: true,
        component: () => import("../formulaires/EtapeDynamiqueSection.vue"),
      },
      {
        path: "/login",
        name: "Connection / inscription",
        meta: {
          requiresAuth: false,
          hideFooter: true,
        },
        component: () => import("../formulaires/EtapeLogin.vue"),
      },
      {
        path: "/save-cv",
        name: "Save datas",
        meta: {
          requiresAuth: false,
          hideFooter: true,
        },
        component: () => import("../formulaires/SaveForms.vue"),
      },
    ],
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
];

const router = new VueRouter({
  //mode: "history",
  mode: "hash",
  base: process.env.BASE_URL,
  routes,
});

export default router;

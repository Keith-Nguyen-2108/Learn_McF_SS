import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import HelloWorld from "@/views/HelloWorld.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "helloWorld",
    component: HelloWorld,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;

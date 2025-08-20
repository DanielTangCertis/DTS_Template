import type { RouteRecordRaw } from "vue-router";


export const HomeItem: Array<RouteRecordRaw> = [

	{
		name: "page1",
		path: "page1",
		component: () => import("@/views/home/page1/index.vue"),
	},
	{
		name: "page2",
		path: "page2",
		component: () => import("@/views/home/page2/index.vue"),
	},
	{
		name: "page3",
		path: "page3",
		component: () => import("@/views/home/page3/index.vue"),
	},
];

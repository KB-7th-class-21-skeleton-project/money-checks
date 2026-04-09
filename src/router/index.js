import { createRouter, createWebHistory } from "vue-router";

// Layout
const MainLayout = () => import("@/layouts/MainLayout.vue");

// Lazy loading components using new folder structure
const AccountList = () => import("@/views/Account/page.vue");
const AccountDetail = () => import("@/views/Account/Detail/page.vue");
const AccountEdit = () => import("@/views/Account/Edit/page.vue");
const Chart = () => import("@/views/Chart/page.vue");
const Profile = () => import("@/views/Profile/page.vue");
const Test = () => import("@/views/Test.vue");

const routes = [
	{
		path: "/",
		component: MainLayout,
		children: [
			{
				path: "",
				redirect: "/account",
			},
			{
				path: "account",
				name: "AccountList",
				component: AccountList,
			},
			{
				path: "chart",
				name: "Chart",
				component: Chart,
			},
			{
				path: "profile",
				name: "Profile",
				component: Profile,
			},
		],
	},
	{
		path: "/account/edit/:id",
		name: "AccountEdit",
		component: AccountEdit,
	},
	{
		path: "/account/:id",
		name: "AccountDetail",
		component: AccountDetail,
	},
	{
		path: "/test",
		name: "Test",
		component: Test,
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router;

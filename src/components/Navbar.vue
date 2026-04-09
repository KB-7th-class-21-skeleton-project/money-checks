<template>
	<nav
		class="fixed bottom-0 inset-x-0 mx-auto max-w-[720px] w-full h-fit py-2 bg-gray-900 flex justify-around items-center"
	>
		<RouterLink
			v-for="tab in tabs"
			:key="tab.name"
			:to="tab.path"
			class="flex flex-col items-center justify-center gap-1 w-16 transition-colors duration-200"
			:class="[isActive(tab.path) ? 'text-primary' : 'text-white']"
		>
			<component :is="tab.icon" class="size-6" :stroke-width="2.5" />
			<span class="text-[0.65rem] font-medium tracking-tight">{{ tab.label }}</span>
		</RouterLink>
	</nav>
</template>

<script setup>
import { useRoute } from "vue-router";
import { House, ChartLine, User } from "lucide-vue-next";

const route = useRoute();

const tabs = [
	{ name: "home", label: "홈", path: "/account", icon: House },
	{ name: "chart", label: "차트", path: "/chart", icon: ChartLine },
	{ name: "profile", label: "프로필", path: "/profile", icon: User },
];

const isActive = (path) => {
	return route.path === path || route.path.startsWith(path + "/");
};
</script>

<style scoped>
a {
	-webkit-tap-highlight-color: transparent;
}
</style>

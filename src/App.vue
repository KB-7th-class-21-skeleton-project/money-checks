<script setup></script>

<template>
	<div
		class="min-h-screen flex flex-col bg-background max-w-[720px] mx-auto w-full shadow-sm ring-1 ring-border/50"
	>
		<main class="flex-1 w-full">
			<router-view v-slot="{ Component }">
				<Suspense>
					<component :is="Component" />
				</Suspense>
			</router-view>
		</main>
	</div>
</template>

<style></style>

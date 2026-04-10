<script setup>
import Avatar from "@/components/Avatar.vue";
import { X } from "lucide-vue-next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import { getMeOption, getUsersOption } from "@/query/options/user.js";
import { updateMe } from "@/api/user.js";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

const queryClient = useQueryClient();
const router = useRouter();

const { data: meRes } = useQuery(getMeOption());
const { data: usersRes } = useQuery(getUsersOption());

const me = computed(() => meRes.value);
const users = computed(() => usersRes.value || []);

const friends = computed(() => {
	if (!me.value || !users.value) return [];
	return users.value.filter((user) => me.value.friendIds?.includes(user.id));
});

const { mutate: removeFriendMutation } = useMutation({
	mutationFn: (newFriendIds) => updateMe({ friendIds: newFriendIds }),
	onSuccess: () => {
		queryClient.invalidateQueries({ queryKey: ["me"] });
	},
});

const handleRemoveFriend = (friendId) => {
	if (!me.value) return;
	const newFriendIds = me.value.friendIds.filter((id) => id !== friendId);
	removeFriendMutation(newFriendIds);
};

const goToAccount = (friendId) => {
	router.push(`/account`);
};

const isEditing = ref(false);
const editName = ref("");
const editEmail = ref("");

const startEditing = () => {
	if (!me.value) return;
	editName.value = me.value.name;
	editEmail.value = me.value.email || "";
	isEditing.value = true;
};

const cancelEditing = () => {
	isEditing.value = false;
};

const { mutate: updateProfileMutation } = useMutation({
	mutationFn: (data) => updateMe(data),
	onSuccess: () => {
		queryClient.invalidateQueries({ queryKey: ["me"] });
		isEditing.value = false;
	},
});

const saveEditing = () => {
	updateProfileMutation({ name: editName.value, email: editEmail.value });
};
</script>

<template>
	<div class="px-[16px] w-full" v-if="me">
		<section class="flex flex-row items-center justify-between py-[24px] px-[16px] w-full">
			<div class="flex flex-row items-center gap-[16px] flex-1">
				<Avatar class="size-[64px]" :src="me.profileUrl" />
				<div class="flex flex-col gap-[4px] justify-center flex-1">
					<template v-if="!isEditing">
						<p class="text-[16px] font-semibold text-gray-900">{{ me.name }}</p>
						<p class="text-[16px] font-normal text-gray-900" v-if="me.email">{{ me.email }}</p>
					</template>
					<template v-else>
						<input
							v-model="editName"
							class="text-[16px] font-semibold text-gray-900 border-b border-gray-300 focus:outline-none focus:border-primary px-1 bg-transparent w-[140px]"
							placeholder="이름"
						/>
						<input
							v-model="editEmail"
							class="text-[14px] font-normal text-gray-900 border-b border-gray-300 focus:outline-none focus:border-primary px-1 bg-transparent w-[140px] mt-1"
							placeholder="이메일"
						/>
					</template>
				</div>
			</div>

			<div class="flex flex-row gap-[4px] shrink-0">
				<template v-if="!isEditing">
					<button
						@click="startEditing"
						class="!px-[8px] !py-[4px] !text-[12px] !rounded-[4px] !bg-primary !text-white !border-transparent cursor-pointer font-medium whitespace-nowrap outline-none"
					>
						프로필 편집
					</button>
				</template>
				<template v-else>
					<button
						@click="cancelEditing"
						class="!px-[8px] !py-[4px] !text-[12px] !rounded-[4px] !bg-transparent !text-gray-700 border !border-gray-400 cursor-pointer font-medium whitespace-nowrap outline-none"
					>
						취소
					</button>
					<button
						@click="saveEditing"
						class="!px-[8px] !py-[4px] !text-[12px] !rounded-[4px] !bg-transparent !text-primary border !border-primary cursor-pointer font-medium whitespace-nowrap outline-none"
					>
						저장
					</button>
				</template>
			</div>
		</section>
		<hr class="bg-gray-400 w-full h-[1px]" />
		<section class="py-[4px] px-[16px] flex flex-col w-full">
			<div class="flex flex-row gap-[4px] align-center justify-start py-[4px]">
				<p class="text-[14px] font-medium text-gray-900">친구 목록</p>
				<p class="text-[13px] font-semibold text-gray-700">{{ friends.length }}명</p>
			</div>
			<div class="flex flex-col py-[4px] w-full gap-[12px]">
				<div
					v-for="friend in friends"
					:key="friend.id"
					class="flex flex-row w-full h-fit items-center justify-between cursor-pointer"
					@click="goToAccount(friend.id)"
				>
					<div class="flex flex-row items-center">
						<Avatar class="size-[48px]" :src="friend.profileUrl" />
						<div class="flex flex-col ml-[16px]">
							<p class="text-[12px] font-normal text-gray-900" v-if="friend.email">
								{{ friend.email }}
							</p>
							<p class="text-[12px] font-semibold text-gray-900">{{ friend.name }}</p>
						</div>
					</div>
					<button
						class="bg-transparent border-none p-0 outline-none flex items-center justify-center cursor-pointer"
						@click.stop="handleRemoveFriend(friend.id)"
					>
						<X :size="16" :stroke-width="1" class="text-gray-900" />
					</button>
				</div>
			</div>
		</section>
	</div>
</template>

<style scoped></style>

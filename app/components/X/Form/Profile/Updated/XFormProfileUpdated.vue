<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'

  const { update } = useProfileApi()

  const props = defineProps({
    profile: {
      type: Object as PropType<UserResource>,
      required: true,
    },
  })

  const form = reactive({
    username: props.profile.username,
    email: props.profile.email,
    firstName: props.profile.firstName,
    lastName: props.profile.lastName,
    bio: props.profile.bio,
  })

  async function handlerSubmit (event: FormSubmitEvent<{
    username: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    bio: string | null;
  }>) {
    const { session } = useAuth()
    update(form)
  }
</script>

<template>
  <UForm :schema="ProfileFormSchema" :state="form" class="flex flex-col space-y-6" @submit.prevent="handlerSubmit">
    <x-card-action>
      <template #title>
        Username
      </template>

      <template #description>
        Usernames can only contain letters, numbers, underscores, and dots.
        Changing the username will also change the profile link.
      </template>

      <template #content>
        <u-input 
          v-model="form.username" 
          color="primary"
          label="Username" 
          icon="material-symbols:person-3-rounded" 
          name="profile_name"
          class="w-full"
          placeholder="Username"
          autofocus
        />
      </template>
    </x-card-action>
    
    <x-card-action>
      <template #title>
        Email
      </template>

      <template #description>
        Your email address is used to log in and receive notifications.
      </template>

      <template #content>
        <u-input 
          v-model="form.email" 
          color="primary"
          label="Email"
          type="email"
          icon="material-symbols:mark-email-unread-sharp" 
          name="profile_email"
          placeholder="Email"
          class="w-full"
          autofocus 
        />
      </template>
    </x-card-action>

    <x-card-action>
      <template #title>
        First name
      </template>

      <template #description>
        Your first and last name is used to personalize your experience.
      </template>

      <template #content>
        <div class="flex flex-col space-y-6">
          <u-input 
            v-model="form.firstName" 
            color="primary"
            label="First name" 
            icon="material-symbols:person-3-rounded" 
            name="profile_firstName"
            placeholder="First name"
            class="w-full"
            autofocus 
          />

          <u-input 
            v-model="form.lastName" 
            color="primary"
            label="Last name" 
            icon="material-symbols:person-3-rounded" 
            name="profile_firstName"
            placeholder="Last name"
            class="w-full"
            autofocus
          />
        </div>
      </template>
    </x-card-action>

    <x-card-action>
      <template #title>
        Bio
      </template>

      <template #description>
        Write a short bio about yourself.
      </template>

      <template #content>
        <u-textarea 
          v-model="form.bio"
          color="primary"
          label="Bio"
          name="profile_bio"
          :cols="30" 
          :rows="10"
          :maxlength="1000"
          placeholder="Bio"
          class="w-full"
        />
      </template>
    </x-card-action>

    <div class="flex items-center justify-end px-10">
      <UButton type="submit" color="primary" rounded="lg">
        <span class="mx-6 font-medium text-[15px]">Save</span>
      </UButton>
    </div>
  </UForm>
</template>
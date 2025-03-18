<script setup lang="ts">
const form = useForm({
  email: "",
  password: "",
});

const canSeeThePassword = ref(true);

async function handlerSubmit() {
  form.submit(
    "/api/auth/login",
    "POST",
    {
      success: async () => {
        // Poczekaj na zaktualizowanie sesji
        const { fetch } = useUserSession();
        await fetch();

        useModalHelper().toggleLoginModal();
        form.reset();
        navigateTo("/dashboard");
      },
    },
    {}
  );
}
</script>

<template>
  <form
    class="relative w-full h-full flex flex-col"
    @submit.prevent="handlerSubmit"
  >
    <span
      v-if="form.errors && form.errors.error"
      class="bg-error-200 text-error-600 flex justify-center items-center w-full h-10 rounded-lg"
    >
      {{ form.errors.error }}
    </span>

    <div class="pt-5 space-y-8">
      <x-input
        v-model="form.body.email"
        label="Email"
        type="email"
        icon="material-symbols:mark-email-unread-sharp"
        name="email_login"
        autofocus
      />

      <div>
        <x-input
          v-model="form.body.password"
          :type="canSeeThePassword ? 'text' : 'password'"
          label="Hasło"
          icon="teenyicons:password-solid"
          right-icon
          name="password_login"
        >
          <template #right-icon>
            <Icon
              v-if="canSeeThePassword"
              name="mdi:eye-off-outline"
              class="text-xl text-blue-600 hover:text-green-600 cursor-pointer"
              @click="canSeeThePassword = !canSeeThePassword"
            />

            <Icon
              v-if="!canSeeThePassword"
              name="mdi:eye-outline"
              class="text-xl hover:text-red-600 cursor-pointer"
              @click="canSeeThePassword = !canSeeThePassword"
            />
          </template>
        </x-input>

        <XModalAuthForgotPassword />
      </div>

      <div class="w-full space-y-6">
        <x-btn
          :disabled="!form.body.email || !form.body.password"
          type="submit"
          color="success"
          :loading="form.loading"
          shadow
          block
        >
          Sign in
        </x-btn>
      </div>

      <XDivider label="OR" />

      <div class="mb-6">
        <XBtnOAuthLogin />
      </div>
    </div>
  </form>
</template>

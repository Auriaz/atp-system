<script setup lang="ts">
  import * as v from 'valibot'
  const auth = useAuthStore()
  const { registerForm } = storeToRefs(auth)
  const { onSubmitRegister } = auth

  const canSeeThePassword = ref(false)
  const canSeeTheConfirmPassword = ref(false)

  const isOpenAgreementModel = ref<boolean>(false)
  const lang = ref('en')

  const itemsSelected = ref(['en', 'pl'])

  function agreement(value: boolean) {
    registerForm.value.data.isAgreedToTerms = value
    isOpenAgreementModel.value = false
  }

// const {data: terms} = await useAsyncData(() => queryCollection('content').path(`/terms/${lang.value}`).first())

// watch(() => lang.value, async () => {
//   terms.value = await queryCollection('content').path(`/terms/${lang.value}`).first()
// })
</script>

<template>
  <div class="w-full">
    <UForm :schema="v.safeParser(registerSchema)" :state="registerForm.data" class="w-full space-y-6 px-6 overflow-y-auto" @submit="onSubmitRegister" >
      <UFormField required label="Username" name="username" class="w-full">
        <UInput v-model="registerForm.data.username" class="w-full" />
      </UFormField>
      
      <UFormField label="First Name" name="first_name" class="w-full">
        <UInput v-model="registerForm.data.firstName" class="w-full" />
      </UFormField>

      <UFormField label="Last Name" name="last_name" class="w-full">
        <UInput v-model="registerForm.data.lastName" class="w-full" />
      </UFormField>

      <UFormField required label="Email" name="email" class="w-full">
        <UInput v-model="registerForm.data.email" class="w-full" />
      </UFormField>

      <UFormField required class="w-full relative" label="Password" name="password">
        <UInput v-model="registerForm.data.password" :type="canSeeThePassword ? 'text' : 'password'" class="w-full">
          <template #trailing>
            <UButton
              @click="canSeeThePassword = !canSeeThePassword"
              color="secondary"
              size="sm"
              variant="link"
              :icon="canSeeThePassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
              :aria-label="canSeeThePassword ? 'Hide password' : 'Show password'"
              :aria-pressed="canSeeThePassword"
              aria-controls="password"
            />
          </template>
        </UInput>
      </UFormField>

      <UFormField required class="w-full relative" label="Confirm Password" name="password_confirmation">
        <UInput v-model="registerForm.data.password_confirmation" :type="canSeeTheConfirmPassword ? 'text' : 'password'" class="w-full">
          <template #trailing>
            <UButton
              @click="canSeeTheConfirmPassword = !canSeeTheConfirmPassword"
              color="secondary"
              size="sm"
              variant="link"
              :icon="canSeeTheConfirmPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
              :aria-label="canSeeTheConfirmPassword ? 'Hide password' : 'Show password'"
              :aria-pressed="canSeeTheConfirmPassword"
              aria-controls="password"
            />
          </template>
        </UInput>
      </UFormField>

      <UCheckbox v-model="registerForm.data.isAgreedToTerms" required color="primary">
        <template #label>
          <span class="italic">I accept the 
            <UButton variant="link" label="Terms and Conditions" class="p-0" @click="isOpenAgreementModel = true" />
          </span>
        </template>
      </UCheckbox>

      <UButton type="submit" color="primary" variant="solid" block class="text-bold">
        Submit
      </UButton>
    </UForm>

    <UModal
      v-model:open="isOpenAgreementModel" 
      title="Terms and Conditions"        
      :close="{
        color: 'primary',
        variant: 'outline',
        class: 'rounded-full'
      }"
    >
      <template #body>
        <div class="w-full relative  p-4">
      <div class="absolute top-2 right-4 flex items-center space-x-2">
        <p class="text-sm text-bold">lang:</p>

        <USelect v-model="lang" label="Language" :items="itemsSelected" />
      </div>

      <h2 class="text-xl font-semibold pb-4">Terms and Conditions</h2>

      <div  class="w-full overflow-y-auto h-80  p-4 bg-gray-100 dark:bg-gray-800 text-justify rounded">
        <!-- 
          <ContentRenderer :value="terms" />
         -->
         

          <div class="terms-content">
            <h1>Terms and Conditions</h1>
            
            <h2>Introduction</h2>
            <p>The project is in Beta phase. This means it's a test version that may contain errors and irregularities. All information contained in the project is fictional and has no real-world application. The project is created for educational purposes and is not intended for commercial use.</p>
            
            <p>Welcome to ATP (Advanced Training Platform) at atp.nuxt.dev. These Terms and Conditions govern your use of our platform, which is currently in the preparation and testing phase. By accessing or using ATP, you agree to comply with and be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use our platform.</p>
            
            <h2>Project Description</h2>
            <p>ATP (Advanced Training Platform) is a comprehensive and modern fitness platform designed to help users create personalized training plans, analyze their progress, and maintain a workout journal. Our mission is to support users in achieving their fitness goals by providing precise and effective tools.</p>
            
            <h2>Features</h2>
            <ul>
              <li><strong>Personalized Training Plans:</strong> Create plans tailored to your needs and goals.</li>
              <li><strong>Workout Data Analysis:</strong> Use advanced tools to monitor your progress and adjust your plans.</li>
              <li><strong>Workout Journal:</strong> Keep a detailed log of your workouts to track progress and stay motivated.</li>
              <li><strong>Community Support:</strong> Join a community of like-minded individuals for support and motivation.</li>
              <li><strong>Progress Tracking:</strong> Utilize tools to monitor your progress and generate reports to see your achievements.</li>
            </ul>
            
            <h2>Acceptance of Terms</h2>
            <p>By using ATP, you confirm that you have read, understood, and agree to be bound by these Terms and Conditions, along with our Privacy Policy. If you do not agree to these terms, please do not use the platform.</p>
            
            <h2>Eligibility</h2>
            <p>You must be at least 18 years old to use ATP. By using the platform, you represent and warrant that you meet this eligibility requirement.</p>
            
            <h2>User Account</h2>
            <p>To access certain features of ATP, you may be required to create an account. You agree to provide accurate and complete information during the registration process and to keep your account information up-to-date. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
            
            <h2>Usage Restrictions</h2>
            <p>You agree not to:</p>
            <ul>
              <li>Use ATP for any unlawful purpose.</li>
              <li>Reproduce, duplicate, copy, sell, or exploit any part of the platform without express permission.</li>
              <li>Interfere with or disrupt the platform or servers connected to the platform.</li>
              <li>Use any automated means to access the platform for any purpose without our express written permission.</li>
            </ul>
            
            <h2>Intellectual Property</h2>
            <p>All content, features, and functionality on ATP, including but not limited to text, graphics, logos, and software, are the exclusive property of ATP and its licensors and are protected by intellectual property laws. You may not use, reproduce, or distribute any content from ATP without our express written permission.</p>
            
            <h2>Privacy</h2>
            <p>Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your personal information.</p>
            
            <h2>Limitation of Liability</h2>
            <p>ATP is provided on an "as-is" and "as-available" basis. We do not warrant that the platform will be uninterrupted, error-free, or free of viruses or other harmful components. To the fullest extent permitted by law, ATP disclaims all warranties, express or implied, including but not limited to implied warranties of merchantability and fitness for a particular purpose.</p>
            
            <p>In no event shall ATP be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the platform.</p>
            
            <h2>Indemnification</h2>
            <p>You agree to indemnify, defend, and hold harmless ATP, its officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses, including reasonable attorneys' fees, arising out of or in any way connected with your access to or use of the platform.</p>
            
            <h2>Changes to Terms and Conditions</h2>
            <p>We reserve the right to modify these Terms and Conditions at any time. We will notify you of any changes by posting the new Terms and Conditions on this page. Your continued use of ATP after such changes are posted will constitute your acceptance of the new terms.</p>
            
            <h2>Governing Law</h2>
            <p>These Terms and Conditions shall be governed by and construed in accordance with the laws of the jurisdiction in which ATP operates, without regard to its conflict of law principles.</p>
            
            <h2>Contact Us</h2>
            <p>If you have any questions or concerns about these Terms and Conditions, please contact us at [email address].</p>
            
            <p>By using ATP, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.</p>
          </div>
     

      </div>

      <div class="w-full mt-4 flex justify-between">
        <UButton variant="solid" color="error" label="Decline" @click="agreement(false)" />

        <UButton variant="solid" color="primary" label="Accept" @click="agreement(true)" />
      </div>
    </div>
      </template>
    </UModal>
  </div>
</template>

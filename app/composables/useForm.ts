// @ts-nocheck
import cloneDeep from 'lodash.clonedeep'
import isEqual from 'lodash.isequal'

export default function useForm(body) {
  let defaults = body
  let recentlySuccessfulTimeoutId
  const toast = useToast()

  const form: IForm = reactive({
    body: cloneDeep(body),
    errors: {},
    error: null as string | null,
    dirty: false as boolean,
    hasErrors: false as boolean,
    loading: false as boolean,
    wasSuccessful: false as boolean,
    recentlySuccessful: false as boolean,

    async submit(path, hooks = {}, options = {}) {
      if (this.loading) return

      const _hooks = {
        onBefore: async () => {
          this.loading = true
          this.wasSuccessful = false
          this.recentlySuccessful = false

          clearTimeout(recentlySuccessfulTimeoutId)

          if (hooks.start) await hooks.start()
        },

        onSuccess: async (res) => {
          this.clearErrors()
          this.wasSuccessful = true
          this.recentlySuccessful = true

          recentlySuccessfulTimeoutId = setTimeout(() => {
            this.recentlySuccessful = false
          }, 2000)

          if (hooks.success) await hooks.success(res)

          defaults = cloneDeep(this.body)
          if (res.toast) toast.add({ title: res.toast.title, description: res.toast.description, color: res.toast.color })
          if (res.refresh) location.reload()

          return res.data
        },

        onError: async (error) => {
          this.hasErrors = true
          // const err = await handleError(error.data)

          this.clearErrors()
          this.setErrors(err)

          if (hooks.error) await hooks.error(err)
          return err
        },

        onFinish: async () => {
          this.loading = false
          if (hooks.finish) await hooks.finish()
        },
      }

      await _hooks.onBefore()

      return await $fetch(path, {
        method: 'POST',
        body: this.body,
        ...hooks.options,
      }).then(async (res: IFormResponse) => {
        return await _hooks.onSuccess(res)
      }).catch(async (error) => {
        return await _hooks.onError(error)
      }).finally(async () => {
        await _hooks.onFinish()
      })
    },

    reset(...body) {
      const clonedDefaults = cloneDeep(defaults)

      if (body.length === 0) {
        this.body = clonedDefaults
      }
      else {
        body.forEach((key) => {
          if (clonedDefaults[key] !== undefined) this.body[key] = clonedDefaults[key]
        })
      }
    },

    clearErrors(...body) {
      if (body.length === 0) {
        this.errors = {}
        this.hasErrors = false
      }
      else {
        body.forEach((key: number) => delete this.errors[key])
      }

      this.hasErrors = Object.keys(this.errors).length > 0
    },

    setErrors(errors) {
      this.errors = {
        ...this.errors,
        ...errors,
      }

      this.hasErrors = Object.keys(this.errors).length > 0
    },

    clearError() {
      this.error = null
    },

    setError(error) {
      this.error = error
    },
  })

  watch(() => form.body, () => {
    form.dirty = !isEqual(form.body, defaults)
  }, {
    immediate: true, deep: true,
  })

  return form
}

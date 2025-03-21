import { defineStore } from 'pinia'

export const useUsersStore = defineStore('Users', () => {
  const toast = useToast()
  let state = reactive({
    data: [] as IUserResource[],
    pagination: {},
    loading: true,
  })

  // This is a fake implementation, you should replace it with a real API call
  const fetchUsers = async () => {
    await $fetch('/api/users')
      .then(res => {
        if (res.payload) {
          state.data = res.payload.data || []
          state.pagination = res.payload.pagination || {}
        }
      })
      .catch(err => {
        toast.add({
          title: 'Error',
          description: err.message,
          color: 'error',
        })
      }).finally(() => {
        state.loading = false
      })
  }

  return {
    state,
    fetchUsers
  }
})

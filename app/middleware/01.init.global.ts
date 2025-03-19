export default defineNuxtRouteMiddleware(async (to, from) => {
    const { session, loggedIn } = useUserSession()

    const dateTime = new Date().toISOString();

    if (!import.meta.server) {
        if (loggedIn.value) {

        }
    }
})
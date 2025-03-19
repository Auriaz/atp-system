<script setup lang="ts">
import type { ISidebarLink } from '@@/types/sidebar'

const { sidebar } = useSidebar()
const { session } = useUserSession()
const { filterLinksByRoles } = useGuard()

function typeLinks(type: string) {
  const links: ISidebarLink[] = []
  // const filteredLinks = filterLinksByRoles(sidebar.value.links)
  const filteredLinks = sidebar.value.links

  filteredLinks.forEach((link) => {
    if (link?.type === type) {
      links.push(link)
    }
  })

  return links
}
</script>

<template>
  <div>
    <transition
      enter-active-class="transition ease-out duration-500"
      :enter-from-class="`transform ${sidebar.isRightSide ? 'translate-x-64' : '-translate-x-64'}`"
      enter-to-class="transform  translate-x-0"
      leave-active-class="transition ease-in duration-500"
      leave-from-class="transform translate-x-0"
      :leave-to-class="`transform  ${sidebar.isRightSide ? 'translate-x-64' : '-translate-x-64'}`"
    >
      <aside
        v-show="sidebar.isShow"
        class="fixed z-30 h-screen top-0 transition-all  duration-500"
        :class="[
          sidebar.isRightSide ? 'right-0' : 'left-0',
          sidebar.isRail ? 'w-24' : ' w-64',
        ]"
      >
        <nav
          :class="[
            sidebar.isRail ? 'w-24' : 'w-64',
          ]"
          class="w-full h-screen transition-all duration-500 top-0 box-border flex justify-center rounded-xl p-4 "
        >
          <div
            class="h-full pt-24 flex flex-col justify-between transition-all duration-500  box-borderr"
            :class="[
              sidebar.isRail ? 'w-14' : 'w-60',
            ]"
          >
            <div class="w-full h-full flex flex-col justify-between">
              <div
                class="w-full flex flex-col mt-10 bg-secondary-200 dark:bg-secondary-950 backdrop-blur shadow-xl shadow-black rounded-lg"
              >
                <div
                  v-if="session?.user"
                  class="w-full flex justify-center items-center py-5"
                >
                  <UAvatar
                    :src="session.user.avatarUrl"
                    :size="sidebar.isRail ? 'md' : '3xl'"
                    class="transition duration-500"
                  />
                </div>

                <div class="w-full">
                  <ul
                    class="w-full list-none overflow-y-auto flex flex-col py-2 box-border"
                    :class="[sidebar.isRail ? 'w-12 px-2' : 'w-full']"
                  >
                    <XDashboardSidebarLink
                      v-for="(link, index) in typeLinks('basic')"
                      :key="index"
                      :link="link"
                    />
                  </ul>
                </div>
              </div>

              <div class="w-full relative">
                <div class="bg-secondary-200 dark:bg-secondary-950 backdrop-blur shadow-xl shadow-black rounded-lg">
                  <ul
                    class="list-none overflow-y-auto flex flex-col justify-center items-start py-2  box-border"
                    :class="[sidebar.isRail ? 'w-12 px-2' : 'w-full']"
                  >
                    <XDashboardSidebarLink
                      v-for="(link, index) in typeLinks('settings')"
                      :key="index"
                      :link="link"
                    />
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </aside>
    </transition>

    <transition
      enter-active-class="transition ease-out duration-500"
      enter-from-class="transform -translate-x-80"
      enter-to-class="transform  translate-x-0"
      leave-active-class="transition ease-in duration-500"
      leave-from-class="transform translate-x-0"
      leave-to-class="`transform  -translate-x-80"
    >
      <div
        v-if="sidebar.isShowMenuBar"
        class="fixed left-0 z-30 lg:z-40 top-24 lg:top-3 bg-secondary-200 dark:bg-secondary-950  p-2 rounded-r-lg transition-all duration-500"
      >
        <div class="flex flex-row justify-start items-center space-x-2 ">
          <UTooltip
            :text="sidebar.isShow ? 'Close sidebar' : 'Open sidebar'"
            position="bottom"
          >
            <XBtnCloseToOpen
              :switcher="sidebar.isShow"
              @click="sidebar.isShow = !sidebar.isShow"
            />
          </UTooltip>

          <UTooltip
            v-if="sidebar.isShow"
            :text="sidebar.isRail ? 'Shrink sidebar' : 'Enlarge sidebar'"
          >
            <UButton
              color="primary"
              variant="ghost"
              square
              :icon="sidebar.isRail ? 'i-line-md-arrows-horizontal' : 'i-line-md-arrows-horizontal-alt'"
              @click="sidebar.isRail = !sidebar.isRail"
            />
          </UTooltip>

          <UTooltip
            v-if="sidebar.isShow"
            :text="sidebar.isRightSide ? 'Change sidebar to left side' : 'Change sidebar to right side'"
          >
            <UButton
              color="primary"
              variant="ghost"
              square
              :icon="sidebar.isRightSide ? 'i-line-md-arrow-left-square-twotone' : 'i-line-md-arrow-right-square-twotone'"
              @click="sidebar.isRightSide = !sidebar.isRightSide"
            />
          </UTooltip>

          <UTooltip
            :text="sidebar.isShowHelperBar ? 'Close Helper Bar' : 'Open Helper Bar'"
          >
            <UButton
              color="primary"
              variant="ghost"
              square
              :icon="sidebar.isShowHelperBar ? 'i-line-md-cog-filled-loop' : 'i-line-md-cog-off-filled-loop'"
              @click="sidebar.isShowHelperBar = !sidebar.isShowHelperBar"
            />
          </UTooltip>
        </div>
      </div>
    </transition>
  </div>
</template>

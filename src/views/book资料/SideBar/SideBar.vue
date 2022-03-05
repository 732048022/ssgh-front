<template>
  <div class="sidebar-container">
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        default-active="2"
        class="el-menu-vertical-demo"
        unique-opened
        router
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF">
      <sidebar-item v-for="menu in menuList" :key="menu.href" :item="menu" />
    </el-menu>
  </el-scrollbar>
  </div>
</template>
<script>
import SidebarItem from './SidebarItem.vue'
export default {
  name: 'Sidebar',
  components: { SidebarItem },
  props: {
    menuList: {
      type: Array,
      required: true
    }
  }
}
</script>
<style lang="less" scoped>
</style>

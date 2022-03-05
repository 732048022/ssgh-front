<template>

    <transition name="fade" mode="out-in">
<router-view ></router-view></transition>
</template>

<script>
export default {
}
</script>

<style scoped>
.fade-enter {
opacity:0;
}
.fade-leave{
opacity:1;
}
.fade-enter-active{
transition:opacity .5s;
}
.fade-leave-active{
opacity:0;
transition:opacity .5s;
}
</style>

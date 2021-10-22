<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "app",
  provide() {
    return {
      reload: this.reload,
    };
  },
  data() {
    return {
      isRouterAlive: true,
    };
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(function () {
        this.isRouterAlive = true;
      });
    },
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
}

html,
body,
#app,
.wrapper {
  height: 100%;
  overflow: hidden;
  min-width: 1280px;
}

.el-header {
  padding: 0;
}

.el-menu--horizontal {
  border-bottom: solid 1px transparent;
}

.wrapper,
.page {
  position: relative;
}

.page {
  width: 100%;
  height: 100%;
}

a {
  text-decoration: none;
  color: inherit;
  outline: none;
}

@media screen and (max-width: 768px) {
  .el-aside {
    width: 58px !important;
  }
}
</style>

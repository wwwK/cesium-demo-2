<template>
  <div
    id="app">
    <div
      id="cesiumContainer">
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted () {
    const Cesium = this.cesium
    // Initialize the viewer widget with several custom options and mixins.
    // eslint-disable-next-line no-unused-vars
    var viewer = new Cesium.Viewer('cesiumContainer', {
      infoBox: false
    })
  }
}
</script>

<style lang="scss">
#cesiumContainer {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>

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
    let viewer = new Cesium.Viewer('cesiumContainer', {
      infoBox: false
    })
    console.log(viewer)

    // 事件
    let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
    handler.setInputAction(function (event) {
      console.log('左键单击事件：', event, event.position)
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

    handler.setInputAction(function (event) {
      console.log('左键双击事件：', event)
    }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)

    handler.setInputAction(function (event) {
      console.log('左键按下事件：', event)
    }, Cesium.ScreenSpaceEventType.LEFT_DOWN)

    handler.setInputAction(function (event) {
      console.log('左键弹起事件：', event)
    }, Cesium.ScreenSpaceEventType.LEFT_UP)

    handler.setInputAction(function (event) {
      console.log('中键单击事​​件：', event)
    }, Cesium.ScreenSpaceEventType.MIDDLE_CLICK)

    handler.setInputAction(function (event) {
      console.log('中键按下事件：', event)
    }, Cesium.ScreenSpaceEventType.MIDDLE_DOWN)

    handler.setInputAction(function (event) {
      console.log('中键弹起事件：', event)
    }, Cesium.ScreenSpaceEventType.MIDDLE_UP)

    handler.setInputAction(function (movement) {
      console.log('移动事件：', movement, movement.endPosition)
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

    handler.setInputAction(function (click) {
      console.log('右键单击事件', click.position)
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)

    handler.setInputAction(function (event) {
      console.log('右键按下事件：', event)
    }, Cesium.ScreenSpaceEventType.RIGHT_DOWN)

    handler.setInputAction(function (event) {
      console.log('右键弹起事件：', event)
    }, Cesium.ScreenSpaceEventType.RIGHT_UP)

    handler.setInputAction(function (wheelment) {
      console.log('滚轮事件：', wheelment)
    }, Cesium.ScreenSpaceEventType.WHEEL)

    // 删除事件
    handler.removeInputAction(Cesium.ScreenSpaceEventType.WHEEL)

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

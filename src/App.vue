<template>
  <div
    id="app">
    <div
      id="cesiumContainer">
      <div
        class="operation">
        <input
          type="button"
          @click="handleChangeMap">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted () {
    this.initMap()
  },
  methods: {
    handleChangeMap () {
    },
    initMap () {
      const Cesium = this.cesium
      // 设置默认视角
      // const china = Cesium.Rectangle.fromDegrees(100, 10, 120, 70)
      // Cesium.Camera.DEFAULT_VIEW_RECTANGLE = china
      // Initialize the viewer widget with several custom options and mixins.
      const viewer = new Cesium.Viewer('cesiumContainer', {
        terrainProvider: Cesium.createWorldTerrain(),
        animation: false, // 是否显示左下角的仪表盘
        baseLayerPicker: false, // 是否显示图层选择器按钮，右上角那个地图图标
        fullscreenButton: false, // 是否显示全屏按钮
        vrButton: false, // 是否显示VR按钮
        geocoder: false, // 是否显示搜索按钮
        homeButton: false, // 是否显示主页按钮
        infoBox: false, // 是否显示提示信息
        sceneModePicker: false, // 是否显示右上角的模式切换按钮
        selectionIndicator: false, // 是否显示选取指示器组件
        timeline: false, // 是否显示下边的时间轴
        navigationHelpButton: false, // 是否显示右上角的帮助按钮
        navigationInstructionsInitiallyVisible: true, // 是不显示导航
        scene3DOnly: true, // 是否指定仅为三维模式，全部使用三维模式可节约 GPU 资源
        requestRenderMode: true,
        imageryProvider: new Cesium.UrlTemplateImageryProvider({
          url: 'https://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}' // 高德地图
        })
      })
      console.log(viewer)

      // 添加行政区划图层
      viewer.imageryLayers.addImageryProvider(
        new Cesium.UrlTemplateImageryProvider({
          url: 'http://webst02.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8'
        })
      )

      const pointEntity = new Cesium.Entity({
        id: 666,
        name: 'pointEntity',
        position: Cesium.Cartesian3.fromDegrees(116.3, 39.9),
        point: new Cesium.PointGraphics({
          show: true,
          pixelSize: 20,
          heightReference: Cesium.HeightReference.NONE,
          color: new Cesium.Color(255, 255, 0, 1),
          outlineColor: new Cesium.Color('#fff'),
          outlineWidth: 5,
          scaleByDistance: new Cesium.NearFarScalar(0, 1, 5e10, 1),
          translucencyByDistance: new Cesium.NearFarScalar(0, 1, 5e10, 1),
          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 4.8e10),
        })
      })
      viewer.entities.add(pointEntity)
      // viewer.zoomTo(viewer.entities)

      // 事件
      const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
      handler.setInputAction(function (event) {
        console.log('左键单击事件：', event)
        // 平面坐标系转笛卡尔空间直角坐标系
        /**
          position: Cartesian2 {x: 683.0753784179688, y: 512.71826171875}
          转
          Cartesian3{x: -2174106.926252774, y: 4386734.375324652, z: 4074136.167795586}
         */
        console.log('平面坐标系转笛卡尔空间直角坐标系', viewer.scene.pickPosition(event.position))

        // 空间直角坐标系转经纬度
        const cartographic = Cesium.Cartographic.fromCartesian(viewer.scene.pickPosition(event.position))
        console.log('空间直角坐标系转经纬度', cartographic)

        const pick = viewer.scene.pick(event.position) // 单个对象
        const list = viewer.scene.drillPick(event.position) // 列表
        if (Cesium.defined(pick) && pick.id.id) {
          console.log('实体', pick, list)
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

      // 跳转到指定坐标
      // viewer.camera.flyTo({
      //   // 摄像机在WGS84（世界）坐标中的最终位置或从上向下视图中可见的矩形。 
      //   destination: Cesium.Cartesian3.fromDegrees(116.3, 39.9, 800.0),
      //   // 包含方向和向上属性或航向，俯仰和横滚属性的对象。默认情况下，方向将指向在3D中朝向帧中心，在哥伦布视图中沿负z方向。向上方向将指向3D局部正北哥伦布视图中的y方向。在无限滚动模式下，二维不使用方向。
      //   orientation: {
      //     heading: Cesium.Math.toRadians(20),
      //     pitch: Cesium.Math.toRadians(-20),
      //   }
      //   // 其他属性
      //   // http://cesium.xin/cesium/cn/Documentation1.72/Camera.html#flyTo
      // })

      // 设置视角位置及角度
      setTimeout(() => {
        viewer.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(117.209816, 39.090207, 200), // 视野点
          orientation: {
            heading: Cesium.Math.toRadians(20),
            pitch: Cesium.Math.toRadians(-20)
          }
        })
        viewer.entities.add({
          position: Cesium.Cartesian3.fromDegrees(117.209816, 39.090207),
          point: {
            pixelSize: 20,
            color: Cesium.Color.RED
          }
        })
      }, 3000)

      // 二维三维切换
      // viewer.scene.morphTo2D(1)
      // viewer.scene.morphTo3D(1)

      // 监听地图缩放等级
      // viewer.scene.camera.moveEnd.addEventListener(function () {
      //   const currentMagnitude = viewer.camera.getMagnitude()
      //   console.log('currentMagnitude - ' + currentMagnitude)
      // })

      // 添加 GeoServer 发布的地图
      // const imageryProvider = new Cesium.WebMapServiceImageryProvider({
      //   // GeoServer 服务点击查看图层的 url
      //   url: 'https://ahocevar.com/geoserver/wms',
      //   // 图层名称
      //   layers: 'topp:states',
      //   parameters: {
      //     service: 'WMS',
      //     format: 'image/png',
      //     transparent: true
      //   }
      // })
      // viewer.imageryLayers.addImageryProvider(imageryProvider)

      // 添加 OSM 建筑
      // viewer.scene.primitives.add(Cesium.createOsmBuildings())
      // viewer.scene.camera.flyTo({
      //   destination: Cesium.Cartesian3.fromDegrees(-74.019, 40.6912, 750),
      //   orientation: {
      //     heading: Cesium.Math.toRadians(20),
      //     pitch: Cesium.Math.toRadians(-20),
      //   }
      // })

      // 添加 ArcGis 服务
      const esri = new Cesium.ArcGisMapServerImageryProvider({
        url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
      })
      viewer.imageryLayers.addImageryProvider(esri)
      // http://cesium.xin/cesium/cn/Documentation1.62/ArcGisMapServerImageryProvider.html?classFilter=addImageryProvider

      // 实体
      // 创建实体
      // let boxEntities = {
      //   id: 'boxEntities',
      //   name: 'Red box with black outline',
      //   position: Cesium.Cartesian3.fromDegrees(116.363449, 39.954759, 3000.0),
      //   box: {
      //     dimensions: new Cesium.Cartesian3(4000.0, 3000.0, 5000.0),
      //     material: Cesium.Color.RED.withAlpha(0.5),
      //     outline: true,
      //     outlineColor: Cesium.Color.BLACK
      //   }
      // }
      // viewer.entities.add(boxEntities)
      // viewer.zoomTo(viewer.entities)

      // // 获取实体
      // console.log(viewer.entities.getById('boxEntities'))

      // // 删除实体
      // setTimeout(() => {
      //   // 方法一：针对性删除某一个
      //   // viewer.entities.remove(boxEntities)
      //   // 方法二：通过id删除
      //   // viewer.entities.remove(viewer.entities.getById('boxEntities'))
      //   // 方法三：删除所有实体
      //   // viewer.entities.removeAll()
      // }, 3000)

      // handler.setInputAction(function (event) {
      //   console.log('左键双击事件：', event)
      // }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)

      // handler.setInputAction(function (event) {
      //   console.log('左键按下事件：', event)
      // }, Cesium.ScreenSpaceEventType.LEFT_DOWN)

      // handler.setInputAction(function (event) {
      //   console.log('左键弹起事件：', event)
      // }, Cesium.ScreenSpaceEventType.LEFT_UP)

      // handler.setInputAction(function (event) {
      //   console.log('中键单击事件：', event)
      // }, Cesium.ScreenSpaceEventType.MIDDLE_CLICK)

      // handler.setInputAction(function (event) {
      //   console.log('中键按下事件：', event)
      // }, Cesium.ScreenSpaceEventType.MIDDLE_DOWN)

      // handler.setInputAction(function (event) {
      //   console.log('中键弹起事件：', event)
      // }, Cesium.ScreenSpaceEventType.MIDDLE_UP)

      // handler.setInputAction(function (movement) {
      //   console.log('移动事件：', movement, movement.endPosition)
      // }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

      // handler.setInputAction(function (event) {
      //   console.log('右键单击事件', event)
      // }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)

      // handler.setInputAction(function (event) {
      //   console.log('右键按下事件：', event)
      // }, Cesium.ScreenSpaceEventType.RIGHT_DOWN)

      // handler.setInputAction(function (event) {
      //   console.log('右键弹起事件：', event)
      // }, Cesium.ScreenSpaceEventType.RIGHT_UP)

      // handler.setInputAction(function (wheelment) {
      //   console.log('滚轮事件：', wheelment)
      // }, Cesium.ScreenSpaceEventType.WHEEL)

      // // 删除事件
      // handler.removeInputAction(Cesium.ScreenSpaceEventType.WHEEL)
    }
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
.operation {
  position: absolute;
  right: 50px;
  top: 50px;
  background: #fff;
  z-index: 999;
}
</style>

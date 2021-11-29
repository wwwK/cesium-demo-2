<template>
  <div
    id="app">
    <div
      id="cesiumContainer">
      <div
        class="operation">
        <input
          type="button"
          value="添加图层"
          @click="addLayer()">
        <input
          type="button"
          value="图层(arcgis)"
          @click="addLayer('arcgis')">
        <input
          type="button"
          value="图层(GeoServer)"
          @click="addLayer('GeoServer')">
        <input
          type="button"
          value="图层(osm)"
          @click="addLayer('osm')">
        <input
          type="button"
          value="添加实体"
          @click="addEntities()">
        <input
          type="button"
          value="切换位置视角"
          @click="changeView()">
        <input
          type="button"
          value="二维三维切换"
          @click="changeDimensional()">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      dimensionalType: true,
      viewer: null
    }
  },
  mounted () {
    this.initMap()
  },
  methods: {
    // 添加线
    AddPolyline (params) {
      const _this = this
      const Cesium = this.cesium
      if (params.positions.length === 0) {
        alert('其提供边点!');
        return;
      }
      let entity = new Cesium.Entity({
        name: '线',
        show: true,
        polyline: new Cesium.PolylineGraphics({
          show: true,
          positions: params.positions,
          width: params.width || 5,
          material: params.material || Cesium.Color.RED
        })
      })
      _this.viewer.entities.add(entity)
      return entity
    },
    // 添加点
    addPointFun (lon, lat) {
      const _this = this
      const Cesium = this.cesium
      // 实体
      // 创建实体
      const pointEntity = new Cesium.Entity({
        name: 'pointEntity',
        position: Cesium.Cartesian3.fromDegrees(lon, lat),
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
      _this.viewer.entities.add(pointEntity)
      return pointEntity
    },
    changeDimensional () {
      // 二维三维切换
      this.dimensionalType = !this.dimensionalType
      if (this.dimensionalType) {
        this.viewer.scene.morphTo3D(1)
      } else {
        this.viewer.scene.morphTo2D(1)
      }
    },
    changeView () {
      const _this = this
      const Cesium = this.cesium
      _this.viewer.camera.flyTo({
        // 摄像机在WGS84（世界）坐标中的最终位置或从上向下视图中可见的矩形。 
        destination: Cesium.Cartesian3.fromDegrees(116.3, 39.9), // 视野点
        // 包含方向和向上属性或航向，俯仰和横滚属性的对象。默认情况下，方向将指向在3D中朝向帧中心，在哥伦布视图中沿负z方向。向上方向将指向3D局部正北哥伦布视图中的y方向。在无限滚动模式下，二维不使用方向。
        orientation: {
          heading: Cesium.Math.toRadians(20),
          pitch: Cesium.Math.toRadians(-20)
        }
        // http://cesium.xin/cesium/cn/Documentation1.72/Camera.html#flyTo
      })
      _this.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(117.209816, 39.090207),
        point: {
          pixelSize: 20,
          color: Cesium.Color.RED
        }
      })
    },
    handleMapClick (event) {
      const _this = this
      const Cesium = this.cesium
      console.log('左键单击事件：', event)
      // 平面坐标系转笛卡尔空间直角坐标系
      /**
        position: Cartesian2 {x: 683.0753784179688, y: 512.71826171875}
        转
        Cartesian3{x: -2174106.926252774, y: 4386734.375324652, z: 4074136.167795586}
       */
      console.log('平面坐标系转笛卡尔空间直角坐标系', _this.viewer.scene.pickPosition(event.position))

      // 空间直角坐标系转经纬度
      const cartographic = Cesium.Cartographic.fromCartesian(_this.viewer.scene.pickPosition(event.position))
      console.log('空间直角坐标系转经纬度', cartographic)

      const pick = _this.viewer.scene.pick(event.position) // 单个对象
      const list = _this.viewer.scene.drillPick(event.position) // 列表
      if (Cesium.defined(pick) && pick.id.id) {
        console.log('实体', pick, list)
        alert('ID：' + pick.id._id + '，' + 'name：' + pick.id._name)
      }
    },
    addEntities () {
      const _this = this
      const Cesium = this.cesium
      // 实体
      // 创建实体
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
      _this.viewer.entities.add(pointEntity)

      const boxEntities = {
        id: 'boxEntities',
        name: 'Red box with black outline',
        position: Cesium.Cartesian3.fromDegrees(116.363449, 39.954759, 3000.0),
        box: {
          dimensions: new Cesium.Cartesian3(4000.0, 3000.0, 5000.0),
          material: Cesium.Color.RED.withAlpha(0.5),
          outline: true,
          outlineColor: Cesium.Color.BLACK
        }
      }
      _this.viewer.entities.add(boxEntities)

      _this.viewer.zoomTo(_this.viewer.entities)

      // // 获取实体
      // console.log(_this.viewer.entities.getById('boxEntities'))

      // // 删除实体
      // setTimeout(() => {
      //   // 方法一：针对性删除某一个
      //   // _this.viewer.entities.remove(boxEntities)
      //   // 方法二：通过id删除
      //   // _this.viewer.entities.remove(_this.viewer.entities.getById('boxEntities'))
      //   // 方法三：删除所有实体
      //   // _this.viewer.entities.removeAll()
      // }, 3000)

    },
    addLayer (type) {
      const _this = this
      const Cesium = this.cesium
      if (type === 'arcgis') {
        // 添加 ArcGis 服务
        const esri = new Cesium.ArcGisMapServerImageryProvider({
          url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
        })
        _this.viewer.imageryLayers.addImageryProvider(esri)
        // http://cesium.xin/cesium/cn/Documentation1.62/ArcGisMapServerImageryProvider.html?classFilter=addImageryProvider
      } else if (type === 'GeoServer') {
        // 添加 GeoServer 发布的地图
        const imageryProvider = new Cesium.WebMapServiceImageryProvider({
          // GeoServer 服务点击查看图层的 url
          url: 'https://ahocevar.com/geoserver/wms',
          // 图层名称
          layers: 'topp:states',
          parameters: {
            service: 'WMS',
            format: 'image/png',
            transparent: true
          }
        })
        _this.viewer.imageryLayers.addImageryProvider(imageryProvider)
      } else if (type === 'osm') {
        // 添加 OSM 建筑
        _this.viewer.scene.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(-74.019, 40.6912, 1500),
          orientation: {
            heading: Cesium.Math.toRadians(20),
            pitch: Cesium.Math.toRadians(-20),
          }
        })
        _this.viewer.scene.primitives.add(Cesium.createOsmBuildings())
      } else {
        // 添加行政区划图层
        _this.viewer.imageryLayers.addImageryProvider(
          new Cesium.UrlTemplateImageryProvider({
            url: 'http://webst02.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8'
          })
        )
      }
    },
    initMap () {
      const _this = this
      const Cesium = this.cesium
      // 设置默认视角
      const china = Cesium.Rectangle.fromDegrees(100, 10, 120, 70)
      Cesium.Camera.DEFAULT_VIEW_RECTANGLE = china
      // Initialize the viewer widget with several custom options and mixins.
      _this.viewer = new Cesium.Viewer('cesiumContainer', {
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
      console.log(_this.viewer)

      // 监听地图缩放等级
      // _this.viewer.scene.camera.moveEnd.addEventListener(function () {
      //   const currentMagnitude = _this.viewer.camera.getMagnitude()
      //   console.log('currentMagnitude - ' + currentMagnitude)
      // })

      // 事件
      const handler = new Cesium.ScreenSpaceEventHandler(_this.viewer.scene.canvas)
      handler.setInputAction(function (event) {
        _this.handleMapClick(event)
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

      handler.setInputAction(function (event) {
        console.log('左键双击事件：', event)
        let earthPosition = _this.viewer.camera.pickEllipsoid(event.position, _this.viewer.scene.globe.ellipsoid)
        if (Cesium.defined(earthPosition)) {
          let ellipsoid = _this.viewer.scene.globe.ellipsoid
          let cartographic = ellipsoid.cartesianToCartographic(earthPosition)
          let lon = Cesium.Math.toDegrees(cartographic.longitude)
          let lat = Cesium.Math.toDegrees(cartographic.latitude)
          _this.addPointFun(lon, lat)
        }
      }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)

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

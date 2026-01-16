import type { ScreenSpaceEventHandler } from 'cesium'
import * as Cesium from 'cesium'

export interface ViewOptions {
  center: [number, number],
  height: number
}
export interface SettingOptions {
  debugShowFramesPerSecond?: boolean
  skyBox?: boolean
}

export const useCesium = (
  containerRef: ShallowRef<HTMLElement | null>,
  options?: Cesium.Viewer.ConstructorOptions,
  view?: ViewOptions
) => {
  const viewer: ShallowRef<Cesium.Viewer | null> = ref(null)
  const isReady = ref(false)

  const defaultOptions: Cesium.Viewer.ConstructorOptions = {
    geocoder: false, // 关闭地理编码搜索
    homeButton: false, // 关闭主页按钮
    sceneModePicker: false, // 关闭场景模式选择器
    baseLayerPicker: false, // 关闭底图选择器
    navigationHelpButton: false, // 关闭导航帮助
    animation: false, // 关闭动画控件
    timeline: false, // 关闭时间轴
    fullscreenButton: false, // 关闭全屏按钮
    baseLayer: false, // 关闭默认地图
    scene3DOnly: true, // 3DOnly
    skyBox: false, // 关闭天空盒
    skyAtmosphere: false, // 关闭大气
    ...options
  }

  const initViewer = () => {
    if (!containerRef) {
      throw new Error('Cesium 容器元素没有找到！')
    }

    Cesium.Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_TOKEN
    try {
      viewer.value = new Cesium.Viewer(containerRef.value!, defaultOptions)
      viewer.value.scene.debugShowFramesPerSecond = true

      // 初始位置存在，设定
      if (view) {
        viewer.value.camera.setView({
          destination: Cesium.Cartesian3.fromDegrees(...view.center, view.height),
          orientation: {
            heading: Cesium.Math.toRadians(0),
            pitch: Cesium.Math.toRadians(-90),
            roll: 0.0
          }
        })
      }

      // 去除logo
      (viewer.value.cesiumWidget.creditContainer as any).style.display = 'none'

      isReady.value = true
    } catch (error) {
      throw new Error(`Cesium 初始化失败！${error}`)
    }
  }

  onMounted(() => {
    initViewer()
  })

  onUnmounted(() => {
    if (viewer.value) {
      viewer.value.destroy()
      viewer.value = null
      isReady.value = false
    }
  })

  // 添加实体方法
  const addEntity = (entity: Cesium.Entity | Cesium.Entity.ConstructorOptions) => {
    if (!viewer.value) return
    return viewer.value.entities.add(entity)
  }

  // 添加多个实体
  const addEntities = (entities: Cesium.Entity[] | Cesium.Entity.ConstructorOptions[]) => {
    if (!viewer.value) return
    entities.forEach(entity => viewer.value?.entities.add(entity))
  }

  // 移除实体
  const removeEntity = (entity: Cesium.Entity) => {
    if (!viewer.value) return
    viewer.value.entities.remove(entity)
  }

  // 获取当前相机位置
  const getCurrentCameraPosition = () => {
    if (!viewer.value) return null
    return {
      position: viewer.value.camera.positionCartographic,
      heading: viewer.value.camera.heading,
      pitch: viewer.value.camera.pitch,
      roll: viewer.value.camera.roll
    }
  }

  // 平滑到指定位置
  const flyTo = (destination: Cesium.Cartesian3 | Cesium.Rectangle, options?: any) => {
    if (!viewer.value) return
    viewer.value.camera.flyTo({
      destination,
      ...options
    })
  }

  // 添加影像图层
  const addImageryLayer = (
    imageryProvider: Cesium.ImageryProvider,
    rectangle?: number
  ) => {
    if (!viewer.value) return
    return viewer.value.imageryLayers.addImageryProvider(imageryProvider, rectangle)
  }

  // 加载 geojson 数据
  const loadGeojson = async (geoJson: any, options?: Cesium.GeoJsonDataSource.LoadOptions, flyTo = false) => {
    if (!viewer.value) return
    const dataSource = await Cesium.GeoJsonDataSource.load(geoJson, options)
    viewer.value.dataSources.add(dataSource)
    flyTo && viewer.value.flyTo(dataSource, { duration: 3 })
  }

  // 裁剪地图
  const clipMap = (geojson: any) => {
    if (!viewer.value || !geojson) return
    // const coors = geojson.features[0].geometry.coordinates.flat(Infinity)
    const coors = geojson.geometry.coordinates.flat(Infinity)
    const area = new Cesium.ClippingPolygon({
      positions: Cesium.Cartesian3.fromDegreesArray(coors),
    })
    viewer.value.scene.globe.clippingPolygons = new Cesium.ClippingPolygonCollection({
      polygons: [area],
      inverse: true
    })
  }

  // 添加事件
  const addEvent = (
    action: ScreenSpaceEventHandler.PositionedEventCallback | ScreenSpaceEventHandler.MotionEventCallback | ScreenSpaceEventHandler.WheelEventCallback | ScreenSpaceEventHandler.TwoPointEventCallback | ScreenSpaceEventHandler.TwoPointMotionEventCallback,
    type: Cesium.ScreenSpaceEventType = Cesium.ScreenSpaceEventType.LEFT_CLICK,
    modifier?: Cesium.KeyboardEventModifier
  ) => {
    if (!viewer.value) return
    viewer.value.screenSpaceEventHandler.setInputAction(action, type, modifier)
  }

  // 移除事件
  const removeEvent = (type: Cesium.ScreenSpaceEventType) => {
    if (!viewer.value) return
    viewer.value.screenSpaceEventHandler.removeInputAction(type)
  }

  // 销毁所有事件
  const destroyEvents = () => {
    if (!viewer.value) return
    viewer.value.screenSpaceEventHandler.destroy()
  }

  // 禁用/启用相机交互
  const changeCameraController = () => {
    if (!viewer.value) return
    let enable = viewer.value.scene.screenSpaceCameraController.enableInputs
    enable = !enable
  }

  return {
    viewer,
    isReady,
    Cesium,
    addEntity,
    addEntities,
    removeEntity,
    getCurrentCameraPosition,
    flyTo,
    addImageryLayer,
    loadGeojson,
    clipMap,
    addEvent,
    removeEvent,
    destroyEvents,
    changeCameraController
  }
}

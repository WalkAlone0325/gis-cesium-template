<script setup lang="ts">
import { useCesium } from '@/hooks/useCesium'
import full from './full.json'
import type { Cartesian2 } from 'cesium'

// 天地图TOKEN
// const token = import.meta.env.VITE_CESIUM_TDT_TOKEN
const token = '05be06461004055923091de7f3e51aa6'
const cesiumRef = useTemplateRef('cesiumRef')

const {
  addImageryLayer,
  loadGeojson,
  getCurrentCameraPosition,
  clipMap,
  addEntity,
  addEvent,
  Cesium,
  viewer
} = useCesium(cesiumRef, {}, { center: [111.760311, 37.479323], height: 800000, heading: 30, pitch: -45 })
// { center: [112.53, 37.87], height: 800000 }

// 加载天地图
const initMap = () => {
  const gaodeProvider = new Cesium.UrlTemplateImageryProvider({
    url: "https://webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}",
    subdomains: ["1", "2", "3", "4"],
  })
  // // 以下为天地图及天地图标注加载
  // const tiandituProvider = new Cesium.WebMapTileServiceImageryProvider({
  //   url:
  //     "http://{s}.tianditu.gov.cn/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=" +
  //     token,
  //   // url: 'http://t0.tianditu.gov.cn/img_c/wmts?tk=' + token,
  //   layer: "img",
  //   style: "default",
  //   format: "tiles",
  //   tileMatrixSetID: "w",
  //   subdomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"], // 子域名
  //   maximumLevel: 18,
  //   credit: new Cesium.Credit("天地图影像"),
  // })
  //
  // 添加地理标注
  const labelProvider = new Cesium.WebMapTileServiceImageryProvider({
    url:
      "http://{s}.tianditu.gov.cn/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&tileMatrix={TileMatrix}&tileRow={TileRow}&tileCol={TileCol}&style=default&format=tiles&tk=" +
      token,
    layer: "img",
    style: "default",
    format: "tiles",
    tileMatrixSetID: "w",
    subdomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"], // 子域名轮询
    maximumLevel: 18,
    credit: new Cesium.Credit("天地图标注"),
  })

  // 天地图影像添加到viewer实例的影像图层集合中
  addImageryLayer(gaodeProvider)
  // addImageryLayer(tiandituProvider)
  addImageryLayer(labelProvider)
}

const addPoint = () => {
  const positions = Cesium.Cartesian3.fromDegreesArray([
    112.275624, 38.011309,
    112.292630, 37.675164,
    112.780108, 37.692378,
    112.780340, 38.039077
  ])

  const pointEntity = addEntity({
    position: Cesium.Cartesian3.fromDegrees(112.53, 37.87),
    point: {
      pixelSize: 10,
      color: Cesium.Color.CYAN,
      outlineColor: Cesium.Color.WHITE,
      outlineWidth: 2
    },
    polygon: {
      hierarchy: positions,
      material: Cesium.Color.CYAN.withAlpha(0.4),
      outline: true,
      outlineWidth: 10,
      outlineColor: Cesium.Color.WHITE
    }
  })
}

const getClickPosition = () => {
  addEvent((e: { position: Cartesian2 }) => {
    const position = viewer.value!.scene.pickPosition(e.position)

    // 判断坐标是否有效
    if (Cesium.defined(position)) {
      // 笛卡尔坐标转弧度坐标
      const cartographic = Cesium.Cartographic.fromCartesian(position)
      // 弧度转度数并保留6位小数
      const longitude = Cesium.Math.toDegrees(cartographic.longitude).toFixed(6)
      const latitude = Cesium.Math.toDegrees(cartographic.latitude).toFixed(6)
      const height = cartographic.height.toFixed(2)
      console.log('🚀:>> ', `经度: ${longitude}, 纬度: ${latitude}, 高度: ${height}米`)
    } else {
      console.log('🚀:>> ', '无法获取有效坐标（可能点击了天空或地形外区域）')
    }
  })
}

const handleGeometry = () => {
  const instance = new Cesium.GeometryInstance({
    geometry: new Cesium.PolygonGeometry({
      polygonHierarchy: new Cesium.PolygonHierarchy(
        Cesium.Cartesian3.fromDegreesArray([
          112.275624, 38.011309,
          112.292630, 37.675164,
          112.780108, 37.692378,
          112.780340, 38.039077
        ])
      ),
      extrudedHeight: 6000,
      vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT
    })
  })

  const primitive = new Cesium.Primitive({
    geometryInstances: instance,
    appearance: new Cesium.MaterialAppearance({
      material: Cesium.Material.fromType('Color', {
        color: Cesium.Color.CYAN
      }),
      translucent: true
    }),
  })
  viewer.value!.scene.primitives.add(primitive)
}

const handle = async (sxData: any) => {
  const dataSource = await loadGeojson(sxData, {
    stroke: Cesium.Color.CYAN,
    // fill: Cesium.Color.CYAN.withAlpha(0.5),
    strokeWidth: 3,
    // clampToGround: true
    clampToGround: false // 不贴地
  })
  dataSource?.entities.values.forEach(entity => {
    // 1. 获取多边形的坐标位置
    const hierarchy = entity!.polygon!.hierarchy!.getValue(Cesium.JulianDate.fromDate(new Date()))
    // 2. 创建实体实现拉伸
    const extrudedEntity = addEntity({
      name: '3D 拉伸区域',
      polygon: {
        hierarchy,
        material: new Cesium.ColorMaterialProperty(
          Cesium.Color.fromCssColorString('#2994FF').withAlpha(0.7) // 半透明蓝色
        ),
        // 2. 拉伸高度：决定立体感的厚度
        extrudedHeight: 20000,
        // 3. 距离地面高度
        height: 1000,
        // 4. 侧面材质：这是实现“水晶条纹/深蓝渐变”的关键
        perPositionHeight: true,
        // 如果想要侧面有特殊的纹理（如条纹），可以使用 ImageMaterialProperty
        // 但图中看起来更像是简单的深色透明材质
        outline: true, // 显示轮廓
        outlineColor: Cesium.Color.fromCssColorString('#4DA6FF').withAlpha(0.9), // 轮廓颜色
        outlineWidth: 2,
      }
    })
  })
  viewer.value!.dataSources.add(dataSource!)
}

onMounted(() => {
  initMap()
  const sxData = full.features.find(item => item.properties.name === '山西省')
  handle(sxData)
  // loadGeojson(sxData, {
  //   stroke: Cesium.Color.CYAN,
  //   // fill: Cesium.Color.CYAN.withAlpha(0.5),
  //   strokeWidth: 3,
  //   // clampToGround: true
  //   clampToGround: false // 不贴地
  // })
  clipMap(sxData)

  addPoint()
  getClickPosition()
  // handleGeometry()
})

const click = () => {
  const position = getCurrentCameraPosition()
  console.log('🚀:>> ', position)
}
</script>

<template>
  <div class="w-full h-full">
    <div ref="cesiumRef" class="w-full h-full"></div>
  </div>
</template>

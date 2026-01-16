<script setup lang="ts">
import { useCesium } from '@/hooks/useCesium'
import full from './full.json'

// 天地图TOKEN
// const token = import.meta.env.VITE_CESIUM_TDT_TOKEN
const token = '05be06461004055923091de7f3e51aa6'
const cesiumRef = useTemplateRef('cesiumRef')

const { addImageryLayer, loadGeojson, getCurrentCameraPosition, clipMap, addEntity, Cesium, viewer } = useCesium(cesiumRef, {}, { center: [112.53, 37.87], height: 150000 })

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
  const pointEntity = addEntity({
    position: Cesium.Cartesian3.fromDegrees(112.53, 37.87),
    point: {
      pixelSize: 10,
      color: Cesium.Color.RED,
      outlineColor: Cesium.Color.WHITE,
      outlineWidth: 2
    }
  })
}

onMounted(() => {
  initMap()
  const sxData = full.features.find(item => item.properties.name === '山西省')
  loadGeojson(sxData, {
    stroke: Cesium.Color.YELLOWGREEN,
    fill: Cesium.Color.YELLOWGREEN.withAlpha(0.4),
    strokeWidth: 3,
    clampToGround: true
  })
  // clipMap(sxData)

  addPoint()
})

const click = () => {
  const position = getCurrentCameraPosition()
  console.log('🚀:>> ', position)
}
</script>

<template>
  <div class="cesium-viewer">
    <div class="cesium-toolbar">
      <!-- <button @click="click">获取当前相机位置</button> -->
    </div>
    <div ref="cesiumRef" class="cesium-container"></div>
  </div>
</template>

<style lang="scss" scoped>
.cesium-viewer {
  width: 100%;
  height: 100%;
  min-height: 100vh;

  .cesium-container {
    width: 100%;
    height: 100%;
  }
}
</style>

import { isElement } from 'lodash-es'
import * as echarts from 'echarts/core'
import { BarChart, LineChart } from 'echarts/charts'
import {
  TooltipComponent,
  GridComponent,
  LegendComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { LabelLayout } from 'echarts/features'
import { GaugeChart } from 'echarts/charts'
import type { EChartsOption } from 'echarts'

echarts.use([
  TooltipComponent,
  GridComponent,
  LegendComponent,
  BarChart,
  LineChart,
  CanvasRenderer,
  LabelLayout,
  GaugeChart,
])

export function useEcharts() {
  const container = useTemplateRef<HTMLElement>('container')
  const chart = shallowRef()

  const resize = () => chart.value?.resize()
  const clear = () => chart.value?.clear()

  const bootstrap = (theme = 'light') => {
    if(chart.value) chart.value?.dispose()
    if (isElement(container.value)) {
      chart.value = echarts.init(container.value, theme)
    } else {
      console.warn('容器还未初始化')
    }
    window.removeEventListener('resize', resize)
    window.addEventListener('resize', resize)
  }

  const setOption = (option: EChartsOption) => {
    if (!chart.value) bootstrap()
    chart.value?.setOption(option)
  }

  onUnmounted(() => {
    window.removeEventListener('resize', resize)
  })
  onMounted(() => {
    window.addEventListener('resize', resize)
  })

  return {
    chart,
    container,
    echarts,
    setOption,
    clear,
    resize
  }
}

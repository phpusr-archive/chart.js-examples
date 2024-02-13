importScripts('https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.0/chart.umd.js')

const data = {}
onmessage = function (event) {

  //console.log('this', this)

  const { action, canvas, config } = event.data
  //console.log('canvas', canvas, event.data.config)

  if (action === 'create') {
    data.chart = new Chart(canvas, config)
  } else if (action === 'update') {
    data.chart.data.datasets.forEach(dataset => {
      dataset.data.push({ x: 12, y: 12 })
    })
    console.log('dataset', data.chart.data.datasets)
    data.chart.update()

    // Resizing the chart must be done manually, since OffscreenCanvas does not include event listeners.
    // canvas.width = 600;
    // canvas.height = 800;
    // chart.resize();
  } else if (action === 'trigger') {
    console.log('trigger')
    const tooltip = data.chart.tooltip
    if (tooltip.getActiveElements().length > 0) {
      tooltip.setActiveElements([], { x: 0, y: 0 })
    } else {
      //console.log('area', data.chart.chartArea)
      const chartArea = data.chart.chartArea
      tooltip.setActiveElements(
        [{ datasetIndex: 0, index: 10 }],
        {
          x: (chartArea.left + chartArea.right) / 2,
          y: (chartArea.top + chartArea.bottom) / 2,
        }
      )
    }
    data.chart.update()
  } else if (action === 'mousemove') {
    const { x, y } = event.data
    const dataX = data.chart.scales.x.getValueForPixel(x)
    const indexY = data.chart.scales.y.getValueForPixel(y)
    const dataY = data.chart.data.labels[indexY]
    //console.log('x', dataX, 'y', dataY)

    const active = data.chart.data.datasets.map((dataset, datasetIndex) => {
      const index = dataset.data.findIndex(it => it.y === dataY && Math.abs(it.x - dataX) < 0.2)
      if (index >= 0) {
        return { datasetIndex, index }
      }
    }).filter(it => it != null)

    //console.log('active', active)

    const tooltip = data.chart.tooltip
    tooltip.setActiveElements(active)
    data.chart.update()
  }
}

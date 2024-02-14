importScripts('https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.0/chart.umd.js')

const data = {}

onmessage = function (event) {
  const { action } = event.data

  if (action === 'create') {
    const { canvas, config } = event.data
    data.chart = new Chart(canvas, config)
  } else if (action === 'update') {
    const { chartData } = event.data
    updateData(chartData)
  } else if (action === 'mousemove') {
    const { x, y } = event.data
    showTooltip(x, y)
  }

};

function updateData(chartData) {
  chartData.forEach((dataset, datasetIndex) => {
    data.chart.data.labels = dataset.map(it => it.time)
    data.chart.data.datasets[datasetIndex * 2].data = dataset
    data.chart.data.datasets[datasetIndex * 2 + 1].data = dataset
  })
  data.chart.update()
}

function showTooltip(x, y) {
  const dataX = data.chart.scales.x.getValueForPixel(x)
  const indexY = data.chart.scales.y.getValueForPixel(y)
  const dataY = data.chart.data.labels[indexY]

  //console.log('x', dataX, 'y', dataY)

  const active = data.chart.data.datasets.map((dataset, datasetIndex) => {
    const index = dataset.data.findIndex(it => it.time === dataY && Math.abs(it.min - dataX) < 0.5)
    if (index >= 0) {
      return { datasetIndex, index }
    }
  }).filter(it => it != null)

  //console.log('active', active)

  const tooltip = data.chart.tooltip
  tooltip.setActiveElements(active)

  data.chart.update()
}

importScripts('https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.0/chart.umd.js')

const data = {}

onmessage = function (event) {
  const { action } = event.data

  if (action === 'create') {
    const { canvas, config } = event.data
    console.log('canvas', canvas, config)
    data.chart = new Chart(canvas, config);
  } else if (action === 'update') {
    const { chartData } = event.data
    updateData(chartData)
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

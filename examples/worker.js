importScripts('https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.0/chart.umd.js')

const data = {}

onmessage = function (event) {
  //console.log('this', this)

  const { action ,canvas, config } = event.data
  console.log('canvas', canvas, event.data.config)

  if (action === 'create') {
    data.chart = new Chart(canvas, config);
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
  }

};

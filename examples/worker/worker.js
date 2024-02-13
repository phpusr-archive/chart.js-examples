importScripts('https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.0/chart.umd.js')

const data = {}

onmessage = function (event) {
  //console.log('this', this)

  const { action ,canvas, config } = event.data
  console.log('canvas', canvas, event.data.config)

  if (action === 'create') {
    data.chart = new Chart(canvas, config);
  } else if (action === 'update') {
    data.chart.update()
  }

};

importScripts('https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.0/chart.umd.js')


onmessage = function (event) {
  const {canvas, config} = event.data;
  const chart = new Chart(canvas, config);

  // Resizing the chart must be done manually, since OffscreenCanvas does not include event listeners.
  //canvas.width = 600;
  //canvas.height = 800;
  chart.resize();
};

const chartCount = 4
const lineCount = 20
const size = 20000
const chunkSize = 600
const diffSize = 30
const loadTime = 0

const minValue = 0
const maxValue = 100
// data[Chart[Line[]]]
const data = []

for (let chartIndex = 0; chartIndex < chartCount; chartIndex++) {
  const chartContainer = document.createElement('div')
  document.querySelector('#charts').append(chartContainer)
  chartContainer.style.width = '33vw'
  chartContainer.style.height = '90vh'
  const canvas = document.createElement('canvas')
  canvas.id = `chart-${chartIndex}`
  canvas.setAttribute('height', '800px')
  chartContainer.append(canvas)

  const chartData = []
  data.push(chartData)

  for (let lineIndex = 0; lineIndex < lineCount; lineIndex++) {
    const lineData = []
    chartData.push(lineData)
    let prevValue = 20
    for (let i = 0; i < size; i++) {
      const up = Math.random() > 0.5

      const diff = Math.random() * 100

      let min = prevValue + (diff * up ? 1 : -1)
      min = min > minValue ? min : minValue
      min = min < maxValue ? min : maxValue

      let max = min + Math.random() * 0.1
      max = max < maxValue ? max : maxValue

      lineData.push({ time: i, min, max })
      prevValue = min
    }
  }
}

console.log('data', data)

const segment = {
  borderColor: ctx => {
    return ctx.p0.raw.temp || ctx.p1.raw.temp ? 'rgb(0, 0, 0, 0.2)' : undefined
  },
  borderDash: ctx => {
    return ctx.p0.raw.temp || ctx.p1.raw.temp ? [6, 6] : undefined
  }
}

const workers = data.map((chartData, chartIndex) => {
  const config =  {
    type: 'line',
    options: {
      animation: false,
      spanGaps: true,
      showLine: true,
      indexAxis: 'y',
      datasets: {
        line: {
          pointRadius: 0
        }
      },
      elements: {
        point: {
          radius: 0
        },
        line: {
          borderWidth: 2
        }
      },
      scales: {
        x: {
          min: 0,
          max: 100,
          ticks: {
            minRotation: 0,
            maxRotation: 0,
            sampleSize: 1
          }
        },
        y: {
          ticks: {
            minRotation: 0,
            maxRotation: 0,
            sampleSize: 1
          }
        }
      },
      plugins: {
        legend: {
          display: false
        }
      }
    },
    data: {
      labels: [],
      datasets: []
    }
  }

  for (let lineIndex = 0; lineIndex < lineCount; lineIndex++) {
    config.data.datasets.push({
      label: `Line ${lineIndex} (min)`,
      //backgroundColor: "#693a9d",
      //borderColor: "#693a9d",
      data: [],
      parsing: {
        xAxisKey: "min",
        yAxisKey: "time"
      },
      fill: lineIndex * 2 + 1,
      //spanGaps: true
    })
    config.data.datasets.push({
      label: `Line ${lineIndex} (max)`,
      //backgroundColor: "#693a9d",
      //borderColor: "#693a9d",
      data: [],
      parsing: {
        xAxisKey: "max",
        yAxisKey: "time"
      },
      fill: false,
      hidden: false
    })
  }

  const canvas = document.getElementById(`chart-${chartIndex}`).transferControlToOffscreen()
  const worker = new Worker('worker.js')
  worker.postMessage({ action: 'create', canvas, config }, [canvas])

  return worker
})

let offset = 0
let loadTimeout

updateData()


function updateData(diffOffset = 0) {
  if (offset <= 0 && diffOffset < 0 || offset + diffOffset > data[0][0].length) {
    return
  }

  if (loadTimeout) {
    clearTimeout(loadTimeout)
  }

  offset += diffOffset
  const offsetLocal = offset

  workers.forEach((worker, workerIndex) => {
    const chartData = data[workerIndex].map(lineData => {
      return lineData.slice(offsetLocal, offsetLocal + chunkSize)
    })

    worker.postMessage({ action: 'update', chartData })
  })
}

document.querySelector('body').addEventListener('wheel', ({ deltaY }) => {
  const value = deltaY > 0 ? diffSize : -diffSize
  updateData(value)
})

document.querySelector('#scrollDown').addEventListener('click', () => {
  updateData(diffSize)
})

document.querySelector('#scrollUp').addEventListener('click', () => {
  updateData(-diffSize)
})

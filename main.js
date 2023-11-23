
const data = [
  { time: 1, min: 0, max: 0 },
  { time: 2, min: 10, max: 12 },
  { time: 3, min: 15, max: 17 }
]

const size = 2000
const minValue = 0
const maxValue = 100
let prevValue = 20
for (let i = 4; i < size; i++) {
  const up = Math.random() > 0.5

  const diff = Math.random() * 100

  let min = prevValue + (diff * up ? 1 : -1)
  min = min > minValue ? min : minValue
  min = min < maxValue ? min : maxValue

  let max = min + Math.random() * 2
  max = max < maxValue ? max : maxValue

  data.push({ time: i, min, max })
  prevValue = min
}

const segment = {
  borderColor: ctx => {
    return ctx.p0.raw.temp || ctx.p1.raw.temp ? 'rgb(0, 0, 0, 0.2)' : undefined
  },
  borderDash: ctx => {
    return ctx.p0.raw.temp || ctx.p1.raw.temp ? [6, 6] : undefined
  }
}

const config =  {
  type: 'line',
  options: {
    animation: false,
    indexAxis: 'y',
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
      }
    }
  },
  data: {
    labels: [],
    datasets: [
      {
        label: 'Test (min)',
        backgroundColor: "#693a9d",
        borderColor: "#693a9d",
        data: [],
        parsing: {
          xAxisKey: "min",
          yAxisKey: "time"
        },
        fill: 1,
        segment,
        //spanGaps: true
      },
      {
        label: 'Test (max)',
        backgroundColor: "#693a9d",
        borderColor: "#693a9d",
        data: [],
        parsing: {
          xAxisKey: "max",
          yAxisKey: "time"
        },
        fill: false,
        segment,
        hidden: false
      }
    ]
  }
}

const myChart = new Chart(
  document.getElementById('myChart'),
  config
)

const chunkSize = 100
const diffSize = 30
let offset = 0
let loadTimeout
let lastValue = null
let datasetFills = {}

updateData()


function updateData(diffOffset = 0) {
  if (offset <= 0 && diffOffset < 0) {
    return
  }

  if (loadTimeout) {
    clearTimeout(loadTimeout)
  }

  offset += diffOffset
  const axisData = data.slice(offset, offset + chunkSize)
  myChart.data.labels = axisData.map(it => it.time)
  myChart.data.datasets.forEach(dataset => {
    if (dataset.fill !== false) {
      datasetFills[dataset.label] = dataset.fill
    }
    dataset.fill = false

    if (diffOffset === 0) {
      dataset.data = []
      return
    }

    if (diffOffset > 0) {
      dataset.data = dataset.data.slice(diffOffset, dataset.data.length)
      lastValue = dataset.data[dataset.data.length - 1] || lastValue

      if (dataset.data.length === 0) {
        dataset.data.push({
          time: offset,
          min: lastValue.min,
          max: lastValue.max,
          temp: true
        })
      }

      dataset.data.push({
        time: offset + chunkSize,
        min: lastValue.min,
        max: lastValue.max,
        temp: true
      })
      return
    }

    dataset.data = dataset.data.slice(0, dataset.data.length + diffOffset)
    lastValue = dataset.data[0] || lastValue

    dataset.data.unshift({
      time: offset,
      min: lastValue.min,
      max: lastValue.max,
      temp: true
    })

    if (dataset.data.length === 1) {
      dataset.data.push({
        time: offset + chunkSize,
        min: lastValue.min,
        max: lastValue.max,
        temp: true
      })
    }
  })

  myChart.update()

  loadTimeout = setTimeout(() => {
    console.log('Loaded')
    myChart.data.datasets.forEach(dataset => {
      dataset.fill = datasetFills[dataset.label]
      dataset.data = axisData.slice()
    })
    myChart.update()
  }, 500)
}

document.querySelector('#scrollDown').addEventListener('click', () => {
  updateData(diffSize)
})

document.querySelector('#scrollUp').addEventListener('click', () => {
  updateData(-diffSize)
})

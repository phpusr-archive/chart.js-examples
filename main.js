
const data = [
  { time: 1, min: 0, max: 0 },
  { time: 2, min: 10, max: 12 },
  { time: 3, min: 15, max: 17 }
]

const size = 2000
const minValue = 0
const maxValue = 1000
let prevValue = 20
for (let i = 4; i < size; i++) {
  const up = Math.random() > 0.5
  const diff = Math.random() * 10
  const min = prevValue + (diff * up ? 1 : -1)
  const max = min + Math.random() * 2
  data.push({
    time: i,
    min,
    max
  })
  prevValue = min
}

const segment = {
  borderColor: ctx => {
    return ctx.p0.raw.temp || ctx.p1.raw.temp ? 'rgb(0, 0, 0, 0.2)' : undefined
  },
  borderDash: ctx => {
    return ctx.p0.raw.temp || ctx.p1.raw.temp ? [5, 6] : undefined
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
        fill: 0,
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
let diffOffset = 0
let loadTimeout

updateData()


function updateData() {
  if (loadTimeout) {
    clearTimeout(loadTimeout)
  }

  offset += diffOffset
  const axisData = data.slice(offset, offset + chunkSize)
  myChart.data.labels = axisData.map(it => it.time)
  myChart.data.datasets.forEach(dataset => {
    const fromIndex = diffOffset > 0 ? diffOffset : 0
    const toIndex = diffOffset > 0 ? dataset.data.length : dataset.data.length + diffOffset
    dataset.data = dataset.data.slice(fromIndex, toIndex)

    if (diffOffset === 0) {
      return
    }

    const lastValue = diffOffset > 0 ? dataset.data[dataset.data.length - 1] : dataset.data[0]
    const item = {
      time: lastValue.time + diffOffset,
      min: lastValue.min,
      max: lastValue.max,
      temp: true
    }

    if (diffOffset > 0) {
      dataset.data.push(item)
    } else {
      dataset.data.unshift(item)
    }
  })
  myChart.update()

  loadTimeout = setTimeout(() => {
    console.log('Loaded')
    myChart.data.datasets.forEach(dataset => {
      dataset.data = axisData.slice()
    })
    myChart.update()
  }, 500)
}

document.querySelector('#scrollDown').addEventListener('click', () => {
  diffOffset = diffSize
  console.log({ offset })
  updateData()
})

document.querySelector('#scrollUp').addEventListener('click', () => {
  diffOffset = -diffSize
  console.log({ offset })
  updateData()
})

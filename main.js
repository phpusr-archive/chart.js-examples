
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
        fill: 1
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
    console.log({ fromIndex, toIndex })
    dataset.data = dataset.data.slice(fromIndex, toIndex)
  })
  myChart.update()

  loadTimeout = setTimeout(() => {
    myChart.data.datasets.forEach(dataset => {
      dataset.data = axisData.slice()
    })
    myChart.update()
  }, 500)
}

document.querySelector('#scrollDown').addEventListener('click', () => {
  diffOffset = 10
  console.log({ offset })
  updateData()
})

document.querySelector('#scrollUp').addEventListener('click', () => {
  diffOffset = -10
  console.log({ offset })
  updateData()
})

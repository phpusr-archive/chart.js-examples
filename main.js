
const lineCount = 1
const size = 20000
const chunkSize = 1000
const diffSize = 30
const loadTime = 0

const minValue = 0
const maxValue = 100
const data = []

for (let lineIndex = 0; lineIndex < lineCount; lineIndex++) {
  const lineData = []
  data.push(lineData)
  let prevValue = 20
  for (let i = 0; i < size; i++) {
    const up = Math.random() > 0.5

    const diff = Math.random() * 100

    let min = prevValue + (diff * up ? 1 : -1)
    min = min > minValue ? min : minValue
    min = min < maxValue ? min : maxValue

    let max = min + Math.random() * 0.1
    max = max < maxValue ? max : maxValue

    lineData.push({ time: i, value: min })
    lineData.push({ time: i, value: max })
    prevValue = min
  }
}

console.log('data', data)

// Изменение цвета и стиля графика при прокрутке
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
      xAxisKey: "value",
      yAxisKey: "time"
    },
    //fill: lineIndex * 2 + 1,
    segment,
    //spanGaps: true
  })
  /*config.data.datasets.push({
    label: `Line ${lineIndex} (max)`,
    //backgroundColor: "#693a9d",
    //borderColor: "#693a9d",
    data: [],
    parsing: {
      xAxisKey: "max",
      yAxisKey: "time"
    },
    fill: false,
    segment,
    hidden: false
  })*/
}

const myChart = new Chart(
  document.getElementById('myChart'),
  config
)

let offset = 0
let loadTimeout
let lastValue = null
let datasetFills = {}

updateData()


function updateData(diffOffset = 0) {
  if (offset <= 0 && diffOffset < 0 || offset + diffOffset > data[0].length) {
    return
  }

  if (loadTimeout) {
    clearTimeout(loadTimeout)
  }

  offset += diffOffset
  const labels = data[0].slice(offset, offset + chunkSize).map(it => it.time)
  myChart.data.labels = [...new Set(labels)]
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
          value: lastValue.value,
          temp: true
        })
      }

      dataset.data.push({
        time: offset + chunkSize,
        value: lastValue.value,
        temp: true
      })
      return
    }

    dataset.data = dataset.data.slice(0, dataset.data.length + diffOffset)
    lastValue = dataset.data[0] || lastValue

    dataset.data.unshift({
      time: offset,
      value: lastValue.value,
      temp: true
    })

    if (dataset.data.length === 1) {
      dataset.data.push({
        time: offset + chunkSize,
        value: lastValue.value,
        temp: true
      })
    }
  })

  myChart.update()

  const offsetLocal = offset
  loadTimeout = setTimeout(() => {
    console.log('Loaded')
    myChart.data.datasets.forEach((dataset, datasetIndex) => {
      const dataIndex = Math.floor(datasetIndex / 2)
      dataset.fill = datasetFills[dataset.label]
      dataset.data = data[dataIndex].slice(offsetLocal, offsetLocal + chunkSize)
    })
    myChart.update()
  }, loadTime)
}

document.querySelector('#myChart').addEventListener('wheel', ({ deltaY }) => {
  const value = deltaY > 0 ? diffSize : -diffSize
  updateData(value)
})

document.querySelector('#scrollDown').addEventListener('click', () => {
  updateData(diffSize)
})

document.querySelector('#scrollUp').addEventListener('click', () => {
  updateData(-diffSize)
})

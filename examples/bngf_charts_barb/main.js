const lineCount = 1
const showMin = false


createContainer(0)
const data = await loadData()
createChart(0)


function createContainer(chartIndex){
  const chartContainer = document.createElement('div')
  document.querySelector('#charts').append(chartContainer)
  chartContainer.style.width = '33vw'
  chartContainer.style.height = '90vh'
  const canvas = document.createElement('canvas')
  canvas.id = `chart-${chartIndex}`
  canvas.setAttribute('height', '600px')
  chartContainer.append(canvas)
}

async function loadData() {
  const res = await fetch('./run_data.json')
  const runData = await res.json()

  const data = runData.map(r => ({
    time: new Date(r.fromDate).toLocaleTimeString(),
    min: r.values['51']['min'],
    max: r.values['51']['max'],
  }))
  console.log('d', data)

  return data
}

console.log('data', data)

function createChart(chartIndex) {

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
          borderWidth: 2,
          //borderJoinStyle: 'round',
        }
      },
      scales: {
        x: {
          min: 0,
          max: 100
        }
      },
      plugins: {
        legend: {
          display: false
        }
      }
    },
    data: {
      labels: data.map(it => it.time),
      datasets: []
    }
  }

  for (let lineIndex = 0; lineIndex < lineCount; lineIndex++) {
    if (showMin) {
      config.data.datasets.push({
        label: `Line ${lineIndex} (min)`,
        //backgroundColor: "#693a9d",
        //borderColor: "#693a9d",
        data,
        parsing: {
          xAxisKey: "min",
          yAxisKey: "time"
        },
        //fill: false,
        fill: lineIndex * 2 + 1,
        segment,
        //spanGaps: true
      })
    }
    config.data.datasets.push({
      label: `Line ${lineIndex} (max)`,
      //backgroundColor: "#693a9d",
      //borderColor: "#693a9d",
      data,
      parsing: {
        xAxisKey: "max",
        yAxisKey: "time"
      },
      fill: false,
      segment,
      hidden: false
    })
  }

  new Chart(
    document.getElementById(`chart-${chartIndex}`),
    config
  )
}


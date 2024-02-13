
class ChartApp {
  chartCount = 0
  lineCount = 0
  size = 0
  chunkSize = 0
  diffSize = 0
  minValue = 0
  maxValue = 0

  workers = []
  // Structure: Data[Chart[Line[]]]
  data = []
  offset = 0

  formDom = null
  chartsDom = null


  constructor() {
    this.formDom = document.querySelector('#form')
    this.chartsDom = document.querySelector('#charts')
    this.initListeners()
    this.initData()
  }

  initListeners() {
    this.formDom.addEventListener('submit', event => {
      event.preventDefault()
      this.initData()
    })

    document.querySelector('body').addEventListener('wheel', ({ deltaY }) => {
      const value = deltaY > 0 ? this.diffSize : -this.diffSize
      this.updateData(value)
    })

    document.querySelector('#scrollDown').addEventListener('click', () => {
      this.updateData(this.diffSize)
    })

    document.querySelector('#scrollUp').addEventListener('click', () => {
      this.updateData(-this.diffSize)
    })
  }

  initData() {
    this.clear()

    const formData = new FormData(this.formDom)
    this.chartCount = +formData.get('chartCount')
    this.lineCount = +formData.get('lineCount')
    this.size = +formData.get('size')
    this.chunkSize = +formData.get('chunkSize')
    this.diffSize = +formData.get('diffSize')
    this.minValue = +formData.get('minValue')
    this.maxValue = +formData.get('maxValue')

    this.generateData()
    this.createCharts()
    this.createWorkers()
    this.updateData()
  }

  clear() {
    this.workers.forEach(it => it.terminate())
    this.chartsDom.innerHTML = ''
    this.offset = 0
  }

  generateData() {
    this.data = []
    for (let chartIndex = 0; chartIndex < this.chartCount; chartIndex++) {
      const chartData = []
      for (let lineIndex = 0; lineIndex < this.lineCount; lineIndex++) {
        const lineData = []
        chartData.push(lineData)
        let prevValue = Math.random() * 100
        for (let i = 0; i < this.size; i++) {
          const up = Math.random() > 0.5

          const diff = Math.random() * 100

          let min = prevValue + (diff * up ? 1 : -1)
          min = min > this.minValue ? min : this.minValue
          min = min < this.maxValue ? min : this.maxValue

          let max = min + Math.random() * 0.1
          max = max < this.maxValue ? max : this.maxValue

          lineData.push({time: i, min, max})
          prevValue = min
        }
      }
      this.data.push(chartData)
    }
  }

  createCharts() {
    for (let chartIndex = 0; chartIndex < this.chartCount; chartIndex++) {
      const canvas = document.createElement('canvas')
      canvas.id = `chart-${chartIndex}`
      const { clientHeight, clientWidth } = document.documentElement
      const height = Math.max(600, clientHeight - 250)
      const width = Math.max(300, clientWidth / this.chartCount - 10)
      canvas.setAttribute('height', height + 'px')
      canvas.setAttribute('width', width + 'px')
      this.chartsDom.append(canvas)
    }
  }

  createWorkers() {
    this.workers = this.data.map((chartData, chartIndex) => {
      const canvas = document.getElementById(`chart-${chartIndex}`).transferControlToOffscreen()
      const worker = new Worker('worker.js')
      worker.postMessage({ action: 'create', canvas, config: this.getConfig() }, [canvas])
      return worker
    })
  }

  updateData(diffOffset = 0) {
    if (this.offset <= 0 && diffOffset < 0 || this.offset + diffOffset > this.data[0][0].length) {
      return
    }

    this.offset += diffOffset

    this.workers.forEach((worker, workerIndex) => {
      const chartData = this.data[workerIndex].map(lineData => {
        return lineData.slice(this.offset, this.offset + this.chunkSize)
      })

      worker.postMessage({ action: 'update', chartData })
    })
  }


  getConfig() {
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
            borderWidth: 2
          }
        },
        scales: {
          x: {
            min: this.minValue,
            max: this.maxValue
          },
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

    for (let lineIndex = 0; lineIndex < this.lineCount; lineIndex++) {
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

    return config
  }
}

new ChartApp()



class ChartApp {
  chartCount = 0
  lineCount = 0
  size = 0
  chunkSize = 0
  diffSize = 0
  minValue = 0
  maxValue = 0
  multithread = false

  // For single thread
  charts = []
  // For multi thread
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
    this.multithread = formData.get('multithread') === 'on'

    this.generateData()
    this.createCharts()
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
    this.charts = []
    this.workers = []

    for (let chartIndex = 0; chartIndex < this.chartCount; chartIndex++) {
      const container = document.createElement('div')
      this.chartsDom.append(container)
      const canvas = document.createElement('canvas')
      container.append(canvas)

      const { clientHeight, clientWidth } = document.documentElement
      const width = Math.min(500, Math.max(300, clientWidth / this.chartCount - 20)) + 'px'
      const height = Math.max(600, clientHeight - 250) + 'px'
      container.style.width = width
      container.style.height = height

      canvas.id = `chart-${chartIndex}`
      canvas.setAttribute('width', width)
      canvas.setAttribute('height', height)
      console.log('w', width, 'h', height)

      if (this.multithread) {
        this.workers.push(this.createWorker(canvas))
      } else {
        this.charts.push(new Chart(canvas, this.getConfig()))
      }
    }
  }

  createWorker(canvas) {
    const offscreenCanvas = canvas.transferControlToOffscreen()
    const worker = new Worker('worker.js')
    worker.postMessage({ action: 'create', canvas: offscreenCanvas, config: this.getConfig() }, [offscreenCanvas])

    let timeout = null

    canvas.addEventListener('mousemove', (e) => {
      if (timeout) {
        clearTimeout(timeout)
      }

      timeout = setTimeout(() => {
        const rect = e.target.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        //console.log(x, y)
        worker.postMessage({ action: 'mousemove', x, y })
      }, 200)
    })

    return worker
  }

  updateData(diffOffset = 0) {
    if (this.offset <= 0 && diffOffset < 0 || this.offset + diffOffset > this.data[0][0].length) {
      return
    }

    this.offset += diffOffset

    this.charts.forEach((chart, chartIndex) => {
      this.data[chartIndex].forEach((lineData, lineIndex) => {
        const dataset = lineData.slice(this.offset, this.offset + this.chunkSize)
        //console.log('ds', dataset)
        chart.data.labels = dataset.map(it => it.time)
        chart.data.datasets[lineIndex * 2].data = dataset
        chart.data.datasets[lineIndex * 2 + 1].data = dataset
      })
      chart.update()
    })

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
      const red = Math.round(Math.random() * 255)
      const green = Math.round(Math.random() * 255)
      const blue = Math.round(Math.random() * 255)
      const lineColor = `rgba(${red}, ${green}, ${blue}, 0.9)`

      config.data.datasets.push({
        label: `Line ${lineIndex} (min)`,
        borderColor: lineColor,
        backgroundColor: lineColor,
        data: [],
        parsing: {
          xAxisKey: "min",
          yAxisKey: "time"
        },
        fill: lineIndex * 2 + 1,
      })
      config.data.datasets.push({
        label: `Line ${lineIndex} (max)`,
        borderColor: lineColor,
        backgroundColor: lineColor,
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


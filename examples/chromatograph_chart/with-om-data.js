const res = await fetch('data.json')
const { data } = await res.json()

export { data }

export const labels = data.map(it => it.time)

export const options = {
  "indexAxis": "y",
  "scales": {
    "time": {
      "axis": "y",
      "display": true,
      "id": "time",
      "type": "category",
      "ticks": {
        "display": true,
        "maxTicksLimit": 20,
        "font": {
          "size": 10
        },
        "minRotation": 0,
        "maxRotation": 50,
        "mirror": false,
        "textStrokeWidth": 0,
        "textStrokeColor": "",
        "padding": 3,
        "autoSkip": true,
        "autoSkipPadding": 3,
        "labelOffset": 0,
        "minor": {},
        "major": {},
        "align": "center",
        "crossAlign": "near",
        "showLabelBackdrop": false,
        "backdropColor": "rgba(255, 255, 255, 0.75)",
        "backdropPadding": 2,
        "color": "#666"
      },
      "grid": {
        "display": false,
        "drawBorder": false,
        "drawTicks": false,
        "lineWidth": 1,
        "drawOnChartArea": true,
        "tickLength": 8,
        "offset": false,
        "borderDash": [],
        "borderDashOffset": 0,
        "borderWidth": 1,
        "color": "rgba(0,0,0,0.1)",
        "borderColor": "rgba(0,0,0,0.1)"
      },
      "offset": false,
      "reverse": false,
      "beginAtZero": false,
      "bounds": "ticks",
      "grace": 0,
      "title": {
        "display": true,
        "text": "time",
        "padding": {
          "top": 4,
          "bottom": 4
        },
        "color": "#666"
      },
      "position": "left"
    },
    "af3fa9f9-2fc2-490f-996a-fcce4d50f493": {
      "axis": "x",
      //"type": "bngfLineScale",
      "suggestedMin": 0,
      "suggestedMax": 100,
      "stacked": true,
      "position": "top",
      "beginAtZero": false,
      "grid": {
        "borderColor": "#008000",
        "borderDash": [
          5,
          5
        ],
        "borderDashOffset": 0,
        "display": true,
        "drawBorder": true,
        "drawOnChartArea": false,
        "drawTicks": true,
        "lineWidth": 1,
        "offset": false,
        "tickLength": 4,
        "borderWidth": 1,
        "color": "rgba(0,0,0,0.1)"
      },
      "ticks": {
        "padding": 0,
        "maxRotation": 0,
        "color": "#b7b7b7",
        "minRotation": 0,
        "mirror": false,
        "textStrokeWidth": 0,
        "textStrokeColor": "",
        "display": true,
        "autoSkip": true,
        "autoSkipPadding": 3,
        "labelOffset": 0,
        "minor": {},
        "major": {},
        "align": "center",
        "crossAlign": "near",
        "showLabelBackdrop": false,
        "backdropColor": "rgba(255, 255, 255, 0.75)",
        "backdropPadding": 2
      },
      "title": {
        "display": true,
        "text": "С1 отн.",
        "padding": {
          "top": 4,
          "bottom": 4
        },
        "color": "#666"
      },
      "min": 0,
      "max": 100,
      "display": true,
      "offset": false,
      "reverse": false,
      "bounds": "ticks",
      "grace": 0,
      "id": "af3fa9f9-2fc2-490f-996a-fcce4d50f493"
    }
  },
  "maintainAspectRatio": false,
  "responsive": true,
  "interaction": {
    "mode": "nearest",
    "axis": "y",
    "intersect": true
  },
  "events": [
    "click",
    "mousemove",
    "mouseout"
  ],
  "elements": {
    "point": {
      "hitRadius": 25,
      "hoverRadius": 3
    },
    "line": {
      "borderWidth": 1
    }
  },
  "plugins": {
    "legend": {
      "display": false,
      "labels": {}
    },
    "tooltip": {},
    "updateChartArea": {
      "isUpdateRequired": true
    },
    "datalabels": {
      "id": "datalabels",
      "backgroundColor": "#ffffff",
      "padding": {
        "top": 2,
        "right": 2,
        "bottom": 0,
        "left": 2
      },
      "borderRadius": 2,
      "borderWidth": 1,
      "anchor": "center",
      "clamp": false,
      "listeners": {}
    },
    "updateScales": {
      "isUpdateRequired": true
    }
  },
  "animation": false,
  "layout": {
    "padding": {
      "top": 0
    }
  }
}

export const datasets = [
  {
    "normalized": true,
    "label": "С1 отн.",
    "fill": true,
    "backgroundColor": createGridPattern('rgb(255, 235, 15)'),
    "borderColor": "#008000",
    "bngf": {
      "paramId": 113,
      "graphId": "af3fa9f9-2fc2-490f-996a-fcce4d50f493",
      "rangeMode": 0,
      "datasetId": "max"
    },
    data,
    "parsing": {
      "xAxisKey": "113.max",
      "yAxisKey": "time"
    },
    "xAxisID": "af3fa9f9-2fc2-490f-996a-fcce4d50f493",
    "yAxisID": "time",
    "indexAxis": "y",
    "elements": {
      "point": {
        "radius": 0
      },
      "line": {
        "borderWidth": 1
      }
    },
    "hidden": false
  },
  {
    "normalized": true,
    "label": "С2 отн.",
    "fill": true,
    "backgroundColor": createGridPattern('rgba(153, 102, 255, 1)'),
    "borderColor": "#191970",
    "bngf": {
      "paramId": 114,
      "graphId": "a75c99ef-9a65-4b2d-b6d6-ed64dd7b02fb",
      "rangeMode": 0,
      "datasetId": "max"
    },
    data,
    "parsing": {
      "xAxisKey": "114.max",
      "yAxisKey": "time"
    },
    "xAxisID": "af3fa9f9-2fc2-490f-996a-fcce4d50f493",
    "yAxisID": "time",
    "indexAxis": "y",
    "elements": {
      "point": {
        "radius": 0
      },
      "line": {
        "borderWidth": 1
      }
    },
    "hidden": false
  }
]


// Функция для создания CanvasPattern с сеткой под углом 45 градусов
function createGridPattern(color) {
  console.log('createGridPattern', color)
  const canvas = document.createElement('canvas');
  const cellSize = 10
  canvas.width = cellSize;
  canvas.height = cellSize;
  const ctx = canvas.getContext('2d');

  // Настройка линии
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;

  // Рисуем диагональные линии
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(cellSize, cellSize);
  ctx.moveTo(cellSize, 0);
  ctx.lineTo(0, cellSize);
  ctx.stroke();

  // Создаем паттерн
  return ctx.createPattern(canvas, 'repeat');
}

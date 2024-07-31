class BngfLineScale extends Chart.LinearScale {
  constructor(cfg) {
    super(cfg);

    console.log('cfg', cfg)
  }

  draw(chartArea) {
    super.draw(chartArea);

    this.drawCircle()
  }

  // Метод рисования круга
  drawCircle() {
    this.left = 0
    this.right = 100
    this.top = 0
    this.bottom = 100

    const { ctx, left, right, top, bottom } = this

    const padding = 20
    const radius = 30

    // Задаем параметры круга
    const centerX = right / 2
    const centerY = padding + radius / 2

    // Настраиваем стиль
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(75, 192, 192, 1)';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  }
}

// Зарегистрируйте вашу пользовательскую шкалу
BngfLineScale.id = 'bngfLineScale';
Chart.register(BngfLineScale);

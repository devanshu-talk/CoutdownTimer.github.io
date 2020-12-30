class Timer {
    constructor(container, time = 0) {
      if (!container) {
        throw new Error('No container defined.');
      }
  
      this.backgroundColor   = '#151515';
      this.baseArcColor      = '#252424';
      this.dynamicArcColor   = '#ff9f1c';
      this.labelsColor       = '#646464';
      this.valuesColor       = '#ccc';
      this.canvas            = container;
      this.ctx               = this.canvas.getContext('2d');
  
      this.countTo           = time;
      this.min               = Math.floor(this.countTo / 60);
      this.sec               = this.countTo - (this.min * 60);
      this.counter           = 0;
      this.angle             = 270;
      this.inc               = 360 / this.countTo;
      this.noLabelsThreshold = 120;
  
      this.resize();
    }
    
    resize() {
      this.cWidth            = this.canvas.width;
      this.cHeight           = this.canvas.height;
      // magic numbers
      this.radius            = Math.floor(this.cWidth / 2 * 0.776) - 4;
      this.lineWidth         = 5 + Math.floor(this.cWidth * 0.036);
      this.labelsSize        = 9 + Math.floor(this.cWidth * 0.016);
      this.secondsSize       = 2 + Math.floor(this.cWidth * 0.192);
      this.minutesSize       = 2 + Math.floor(this.cWidth * 0.328);
    }
  
    draw() {
      
      function drawScreen(end) {
        let ctx    = this.ctx;
        let width  = this.cWidth;
        let height = this.cHeight;
        let grad   = null;
  
        //======= reset canvas
        ctx.fillStyle = this.backgroundColor;
        ctx.fillRect(0, 0, width, height);
  
        //========== base arc
        ctx.beginPath();
        ctx.strokeStyle = this.baseArcColor;
        ctx.lineWidth = this.lineWidth;
        ctx.arc(width / 2, height / 2, this.radius + this.lineWidth / 2, 0, Math.PI * 2, false);
        ctx.stroke();
        ctx.closePath();
  
        //========== dynamic arc
        ctx.beginPath();
        ctx.strokeStyle = this.dynamicArcColor;
        ctx.lineWidth = this.lineWidth;
        ctx.arc(width / 2, height / 2, this.radius + this.lineWidth / 2, Math.PI * 1.5, (Math.PI / 180) * this.angle, false);
        ctx.stroke();
        ctx.closePath();
  
        //======== inner shadow arc
        grad = ctx.createRadialGradient(width / 2, height / 2, this.radius * 0.94 - this.lineWidth / 2, width / 2, height / 2, this.radius * 1.16 + this.lineWidth / 2);
        grad.addColorStop(0.0, 'rgba(0,0,0,.4)');
        grad.addColorStop(0.5, 'rgba(0,0,0,0)');
        grad.addColorStop(1.0, 'rgba(0,0,0,0.4)');
  
        ctx.beginPath();
        ctx.strokeStyle = grad;
        ctx.lineWidth = this.lineWidth;
        ctx.arc(width / 2, height / 2, this.radius + this.lineWidth / 2 , 0, Math.PI * 2, false);
        ctx.stroke();
        ctx.closePath();
  
        //======== bevel arc
        grad = ctx.createLinearGradient(width / 2, 0, width / 2, height);
        grad.addColorStop(0.0, '#6c6f72');
        grad.addColorStop(0.5, '#252424');
  
        ctx.beginPath();
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1;
        ctx.arc(width / 2, height / 2, this.radius, 0, Math.PI * 2, true);
        ctx.stroke();
        ctx.closePath();
  
        //====== emboss arc
        grad = ctx.createLinearGradient(width / 2, 0, width / 2, height);
        grad.addColorStop(0.0, 'transparent');
        grad.addColorStop(0.98, '#6c6f72');
  
        ctx.beginPath();
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1;
        ctx.arc(width / 2, height / 2, this.radius + this.lineWidth, 0, Math.PI * 2, true);
        ctx.stroke();
        ctx.closePath();
  
        // font variables
        let textColor = this.labelsColor;
        let textSize = this.labelsSize;
        let fontFace = 'helvetica, arial, sans-serif';
  
        //====== Labels
        if (width > this.noLabelsThreshold) {
          ctx.fillStyle = textColor;
          ctx.font = textSize + 'px ' + fontFace;
          ctx.fillText('MIN', width / 2 * 0.632, height / 2 * 0.68);
          ctx.fillText('SEC', width / 2 * 1.2, height / 2 * 0.88);
        }
  
        //====== Values
        ctx.fillStyle = this.valuesColor;
  
        if (this.min > 9) {
          ctx.font = this.minutesSize + 'px ' + fontFace;
          ctx.fillText('9', width / 2 * 0.56, height / 2 * 1.28);
  
          ctx.font = this.minutesSize * 0.24 + 'px ' + fontFace;
          ctx.fillText('+', width / 2 * 0.424, height / 2 * 0.96);
        } else {
          ctx.font = this.minutesSize + 'px ' + fontFace;
          ctx.fillText(this.min, width / 2 * 0.52, height / 2 * 1.28);
        }
  
        ctx.font = this.secondsSize + 'px ' + fontFace;
        if (this.sec < 10) {
          ctx.fillText('0' + this.sec, width / 2 * 1.08, height / 2 * 1.28);
        } else {
          ctx.fillText(this.sec, width / 2 * 1.08, height / 2 * 1.28);
        }
  
  
        if (this.sec <= 0 && this.counter < this.countTo) {
          this.angle += this.inc;
          this.counter++;
          this.min--;
          this.sec = 59;
        } else
        if (this.counter >= this.countTo) {
          this.sec = 0;
          this.min = 0;
          end();
        } else {
          this.angle += this.inc;
          this.counter++;
          this.sec--;
        }
      }
  
      let interval = setInterval(drawScreen.bind(this, () => {
        clearInterval(interval);
      }), 1000);
    }
  }
  
  let t = new Timer(document.getElementById('mycanvas'), 100);
  t.draw();
  
  function resizeHandler() {
    let canvas = document.getElementById('mycanvas');
    let el = document.querySelector('.timer');
    let size = el.offsetWidth < window.innerHeight ? el.offsetWidth : window.innerHeight;
    canvas.width = size;
    canvas.height = size;
    t.resize();
  }
  
  window.onresize = resizeHandler;
  resizeHandler();
  
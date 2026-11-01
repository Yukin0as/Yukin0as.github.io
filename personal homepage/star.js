const canvas = document.getElementById('starCanvas');
const ctx = canvas.getContext('2d');

// 鼠标位置，初始在屏幕中间
let mouseX = canvas.width / 2;
let mouseY = canvas.height / 2;
// 鼠标影响半径：只有这个圆圈内的星星才会动
const influenceRadius = 1000;

function resizeCanvas(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);
window.addEventListener('mousemove',(e)=>{
  mouseX = e.clientX;
  mouseY = e.clientY;
})

const starCount = 5000;
let stars = [];

class Star {
  constructor(){
    this.reset();
  }
  reset(){
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.radius = Math.random() * 1.1 + 0.2;
    this.opacity = Math.random();
    this.twinkleSpeed = Math.random()*0.012;
    // 基础速度，默认0（静止）
    this.vx = 0;
    this.vy = 0;
  }
  draw(){
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
    ctx.fillStyle = `rgba(255,255,255,${this.opacity})`;
    ctx.fill();
  }
  update(){
    // 计算星星和鼠标之间的距离
    const dx = this.x - mouseX;
    const dy = this.y - mouseY;
    const dist = Math.sqrt(dx*dx + dy*dy);

    if(dist < influenceRadius){
      // 在鼠标范围内：向外散开
      const force = (influenceRadius - dist) / influenceRadius * 0.02;
      this.vx += dx / dist * force;
      this.vy += dy / dist * force;
    }else{
      // 离开范围持续加速
      this.vx *= 1.01;
      this.vy *= 1.01;
    }

    // 位置更新
    this.x += this.vx;
    this.y += this.vy;

    // 闪烁效果，所有星星都闪烁
    this.opacity += this.twinkleSpeed;
    if(this.opacity>1 || this.opacity<0.1) this.twinkleSpeed *= -1;

    // 跑出屏幕外重新生成
    if(this.x < 0 || this.x > canvas.width || this.y <0 || this.y>canvas.height){
      this.reset();
    }
  }
}

// 初始化星星
for(let i = 0; i < starCount; i++){
  stars.push(new Star());
}

function animate(){
  // 透明画布，透出下面的背景图片
  ctx.clearRect(0,0,canvas.width,canvas.height);
  stars.forEach(star => {
    star.update();
    star.draw();
  })
  requestAnimationFrame(animate);
}
animate()

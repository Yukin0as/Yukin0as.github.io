const canvas = document.getElementById('starCanvas');
const ctx = canvas.getContext('2d');
let mouseX = canvas.width / 2;
let mouseY = canvas.height / 2;
const influenceRadius = 1000;

function resizeCanvas(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

document.addEventListener('mousemove',(e)=>{
  mouseX = e.clientX;
})
document.addEventListener('touchmove', (e) => {
  mouseX = e.touches[0].clientX;
  mouseY = e.touches[0].clientY;
}, { passive:true });

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
    const dx = this.x - mouseX;
    const dy = this.y - mouseY;
    const dist = Math.sqrt(dx*dx + dy*dy);

    if(dist < influenceRadius){
      const force = (influenceRadius - dist) / influenceRadius * 0.02;
      this.vx += dx / dist * force;
      this.vy += dy / dist * force;
    }else{
      this.vx *= 1.005;
      this.vy *= 1.005;
    }

    this.x += this.vx;
    this.y += this.vy;

    this.opacity += this.twinkleSpeed;
    if(this.opacity>1 || this.opacity<0.1) this.twinkleSpeed *= -1;

    if(this.x < 0 || this.x > canvas.width || this.y <0 || this.y>canvas.height){
      this.reset();
    }
  }
}

for(let i = 0; i < starCount; i++){
  stars.push(new Star());
}

function animate(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  stars.forEach(star => {
    star.update();
    star.draw();
  })
  requestAnimationFrame(animate);
}
animate()

// ========== 头像菜单逻辑【修复版】 ==========
const avatarBtn = document.getElementById('avatarBtn');
const dropMenu = document.getElementById('dropMenu');
const panels = document.querySelectorAll('.panel');
const links = dropMenu.querySelectorAll('a[href^="#"]');

function toggleMenu(e){
  if(e) e.stopPropagation();
  dropMenu.classList.toggle('show');
}

avatarBtn.addEventListener('click', toggleMenu);
avatarBtn.addEventListener('touchend', function(e){
  e.preventDefault();
  toggleMenu(e);
})

// 点击空白关闭菜单：点击目标不是头像、不是下拉菜单内部，才关闭
document.addEventListener('click', (e)=>{
  if( !avatarBtn.contains(e.target) && !dropMenu.contains(e.target) ){
    dropMenu.classList.remove('show');
  }
})
document.addEventListener('touchstart', (e)=>{
  if( !avatarBtn.contains(e.target) && !dropMenu.contains(e.target) ){
    dropMenu.classList.remove('show');
  }
})

links.forEach(link=>{
  link.addEventListener('click', function(e){
    e.preventDefault();
    e.stopPropagation(); // 阻止冒泡，不会触发外层关闭
    const targetId = this.getAttribute('href').slice(1);
    panels.forEach(p=> p.classList.remove('active'));
    document.getElementById(targetId).classList.add('active');
    dropMenu.classList.remove('show');
  })
})
document.getElementById('home').classList.add('active');

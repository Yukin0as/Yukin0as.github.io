// const canvas = document.getElementById('starCanvas');
// const ctx = canvas.getContext('2d');
//
// // 鼠标位置，初始在屏幕中间
// let mouseX = canvas.width / 2;
// let mouseY = canvas.height / 2;
// // 鼠标影响半径：只有这个圆圈内的星星才会动
// const influenceRadius = 1000;
//
// function resizeCanvas(){
//   canvas.width = window.innerWidth;
//   canvas.height = window.innerHeight;
// }
// resizeCanvas();
// window.addEventListener('resize', resizeCanvas);
//
// // PC鼠标移动
// window.addEventListener('mousemove',(e)=>{
//   mouseX = e.clientX;
//   mouseY = e.clientY;
// })
// // 手机触摸滑动，星空跟随手指
// window.addEventListener('touchmove', (e) => {
//   e.preventDefault();
//   mouseX = e.touches[0].clientX;
//   mouseY = e.touches[0].clientY;
// }, { passive:false });
//
// const starCount = 5000;
// let stars = [];
//
// class Star {
//   constructor(){
//     this.reset();
//   }
//   reset(){
//     this.x = Math.random() * canvas.width;
//     this.y = Math.random() * canvas.height;
//     this.radius = Math.random() * 1.1 + 0.2;
//     this.opacity = Math.random();
//     this.twinkleSpeed = Math.random()*0.012;
//     // 基础速度，默认0（静止）
//     this.vx = 0;
//     this.vy = 0;
//   }
//   draw(){
//     ctx.beginPath();
//     ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
//     ctx.fillStyle = `rgba(255,255,255,${this.opacity})`;
//     ctx.fill();
//   }
//   update(){
//     // 计算星星和鼠标之间的距离
//     const dx = this.x - mouseX;
//     const dy = this.y - mouseY;
//     const dist = Math.sqrt(dx*dx + dy*dy);
//
//     if(dist < influenceRadius){
//       // 在鼠标范围内：向外散开
//       const force = (influenceRadius - dist) / influenceRadius * 0.02;
//       this.vx += dx / dist * force;
//       this.vy += dy / dist * force;
//     }else{
//       // 离开范围持续加速
//       this.vx *= 1.005;
//       this.vy *= 1.005;
//     }
//
//     // 位置更新
//     this.x += this.vx;
//     this.y += this.vy;
//
//     // 闪烁效果，所有星星都闪烁
//     this.opacity += this.twinkleSpeed;
//     if(this.opacity>1 || this.opacity<0.1) this.twinkleSpeed *= -1;
//
//     // 跑出屏幕外重新生成
//     if(this.x < 0 || this.x > canvas.width || this.y <0 || this.y>canvas.height){
//       this.reset();
//     }
//   }
// }
//
// // 初始化星星
// for(let i = 0; i < starCount; i++){
//   stars.push(new Star());
// }
//
// function animate(){
//   // 透明画布，透出下面的背景图片
//   ctx.clearRect(0,0,canvas.width,canvas.height);
//   stars.forEach(star => {
//     star.update();
//     star.draw();
//   })
//   requestAnimationFrame(animate);
// }
// animate()
//
// // ========== 头像下拉菜单逻辑（PC点击 + 手机触屏都支持） ==========
// const avatarBtn = document.getElementById('avatarBtn');
// const dropMenu = document.getElementById('dropMenu');
// const panels = document.querySelectorAll('.panel');
// const links = document.querySelectorAll('.dropdown-menu a[href^="#"]');
//
// function toggleMenu(e){
//   if(e) e.stopPropagation();
//   dropMenu.classList.toggle('show');
// }
//
// // PC点击
// avatarBtn.addEventListener('click', toggleMenu);
// // 手机触摸触发（touchend，防止触摸滑动误触）
// avatarBtn.addEventListener('touchend', function(e){
//   e.preventDefault();
//   toggleMenu(e);
// })
//
// // 点击页面空白关闭菜单
// document.addEventListener('click', ()=>{
//   dropMenu.classList.remove('show');
// })
// document.addEventListener('touchstart', (e)=>{
//   // 不要点头像的时候触发关闭
//   if(!avatarBtn.contains(e.target)){
//     dropMenu.classList.remove('show');
//   }
// })
//
// // 导航切换面板
// links.forEach(link=>{
//   link.addEventListener('click', function(e){
//     e.preventDefault();
//     const targetId = this.getAttribute('href').slice(1);
//     panels.forEach(p=> p.classList.remove('active'));
//     document.getElementById(targetId).classList.add('active');
//     dropMenu.classList.remove('show');
//   })
// })
// // 默认打开首页
// document.getElementById('home').classList.add('active');
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

// ✅ 监听绑定到 document，不再依赖canvas接收触摸，完美配合 pointer-events:none
document.addEventListener('mousemove',(e)=>{
  mouseX = e.clientX;
  mouseY = e.clientY;
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

// ========== 头像菜单逻辑 ==========
const avatarBtn = document.getElementById('avatarBtn');
const dropMenu = document.getElementById('dropMenu');
const panels = document.querySelectorAll('.panel');
const links = document.querySelectorAll('.dropdown-menu a[href^="#"]');

function toggleMenu(e){
  if(e) e.stopPropagation();
  dropMenu.classList.toggle('show');
}

avatarBtn.addEventListener('click', toggleMenu);
avatarBtn.addEventListener('touchend', function(e){
  e.preventDefault();
  toggleMenu(e);
})

document.addEventListener('click', ()=>{
  dropMenu.classList.remove('show');
})
document.addEventListener('touchstart', (e)=>{
  if(!avatarBtn.contains(e.target)){
    dropMenu.classList.remove('show');
  }
})

links.forEach(link=>{
  link.addEventListener('click', function(e){
    e.preventDefault();
    const targetId = this.getAttribute('href').slice(1);
    panels.forEach(p=> p.classList.remove('active'));
    document.getElementById(targetId).classList.add('active');
    dropMenu.classList.remove('show');
  })
})
document.getElementById('home').classList.add('active');

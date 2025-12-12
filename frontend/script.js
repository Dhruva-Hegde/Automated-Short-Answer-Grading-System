const gradeBtn = document.getElementById("gradeBtn");
const modelInput = document.getElementById("model_answer");
const studentInput = document.getElementById("student_answer");
const scoreText = document.getElementById("scoreText");
const progressCircle = document.getElementById("progressCircle");
const confettiCanvas = document.getElementById("confetti");
const confettiCtx = confettiCanvas.getContext("2d");

confettiCanvas.width = window.innerWidth;
confettiCanvas.height = window.innerHeight;

let confettiParticles = [];

function createConfetti() {
  for(let i=0;i<200;i++){
    confettiParticles.push({
      x: Math.random()*confettiCanvas.width,
      y: Math.random()*confettiCanvas.height,
      r: Math.random()*6+2,
      d: Math.random()*100,
      color: `hsl(${Math.random()*360},100%,50%)`,
      tilt: Math.random()*10-10
    });
  }
}

function drawConfetti(){
  confettiCtx.clearRect(0,0,confettiCanvas.width,confettiCanvas.height);
  confettiParticles.forEach(p=>{
    confettiCtx.beginPath();
    confettiCtx.moveTo(p.x+p.tilt, p.y);
    confettiCtx.lineTo(p.x+p.tilt, p.y+p.r);
    confettiCtx.strokeStyle = p.color;
    confettiCtx.lineWidth = p.r/2;
    confettiCtx.stroke();
  });
  updateConfetti();
}

function updateConfetti(){
  confettiParticles.forEach(p=>{
    p.y += Math.cos(p.d)+1+p.r/2;
    p.x += Math.sin(p.d);
    if(p.y>confettiCanvas.height){ p.y=-10; p.x=Math.random()*confettiCanvas.width; }
  });
  requestAnimationFrame(drawConfetti);
}

function showConfetti(){
  createConfetti();
  drawConfetti();
  setTimeout(()=>{ confettiParticles=[]; confettiCtx.clearRect(0,0,confettiCanvas.width,confettiCanvas.height); },3000);
}

function animateCircle(score){
  const circumference = 2 * Math.PI * 80;
  const offset = circumference - (circumference * score / 100);
  progressCircle.style.strokeDashoffset = circumference;
  setTimeout(()=>{
    progressCircle.style.transition="stroke-dashoffset 1.2s ease-out";
    progressCircle.style.strokeDashoffset = offset;
  },100);
}

gradeBtn.addEventListener("click", ()=>{
  const model = modelInput.value;
  const student = studentInput.value;

  // Animate typing effect
  scoreText.innerText = "Grading...";
  progressCircle.style.strokeDashoffset = 502.65;

  fetch("http://127.0.0.1:5000/grade", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({model_answer:model,student_answer:student})
  })
  .then(res=>res.json())
  .then(data=>{
    const score = data.score;
    let count = 0;
    const interval = setInterval(()=>{
      if(count>=score){
        clearInterval(interval);
        if(score>=80){ showConfetti(); }
      } else {
        count++;
        scoreText.innerText = `${count}%`;
      }
    }, 15);

    animateCircle(score);
  });
});

// Background particles animation
const bgCanvas = document.getElementById("bgParticles");
const bgCtx = bgCanvas.getContext("2d");
bgCanvas.width = window.innerWidth;
bgCanvas.height = window.innerHeight;

let particles = [];
for(let i=0;i<120;i++){
  particles.push({
    x: Math.random()*bgCanvas.width,
    y: Math.random()*bgCanvas.height,
    r: Math.random()*2+1,
    dx:(Math.random()-0.5)*1.5,
    dy:(Math.random()-0.5)*1.5
  });
}

function drawBGParticles(){
  bgCtx.clearRect(0,0,bgCanvas.width,bgCanvas.height);
  particles.forEach(p=>{
    bgCtx.beginPath();
    bgCtx.arc(p.x,p.y,p.r,0,Math.PI*2);
    bgCtx.fillStyle = "rgba(255,255,255,0.6)";
    bgCtx.fill();
    p.x+=p.dx; p.y+=p.dy;
    if(p.x<0||p.x>bgCanvas.width)p.dx*=-1;
    if(p.y<0||p.y>bgCanvas.height)p.dy*=-1;
  });
  requestAnimationFrame(drawBGParticles);
}
drawBGParticles();

window.addEventListener("resize", () => {
    bgCanvas.width = window.innerWidth;
    bgCanvas.height = window.innerHeight;
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
});



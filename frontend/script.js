const gradeBtn = document.getElementById("gradeBtn");
const questionInput = document.getElementById("question");
const modelInput = document.getElementById("model_answer");
const studentInput = document.getElementById("student_answer");
const scoreText = document.getElementById("scoreText");
const progressCircle = document.getElementById("progressCircle");
const confettiCanvas = document.getElementById("confetti");
const confettiCtx = confettiCanvas.getContext("2d");

// Setup canvas
confettiCanvas.width = window.innerWidth;
confettiCanvas.height = window.innerHeight;
let confettiParticles = [];

// ----------------- Confetti Functions -----------------
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
    if(p.y>confettiCanvas.height){ 
      p.y=-10; 
      p.x=Math.random()*confettiCanvas.width; 
    }
  });
  requestAnimationFrame(drawConfetti);
}

function showConfetti(){
  createConfetti();
  drawConfetti();
  setTimeout(()=>{
    confettiParticles=[];
    confettiCtx.clearRect(0,0,confettiCanvas.width,confettiCanvas.height);
  },3000);
}

// ----------------- Circle Animation -----------------
function animateCircle(score){
  const circumference = 2 * Math.PI * 100; // r=100
  const offset = circumference - (circumference * score / 100);
  progressCircle.style.strokeDashoffset = circumference;
  setTimeout(()=>{
    progressCircle.style.transition="stroke-dashoffset 1.2s ease-out";
    progressCircle.style.strokeDashoffset = offset;
  },100);
}

// ----------------- Grade Button Event -----------------
gradeBtn.addEventListener("click", ()=>{
  const model = modelInput.value;
  const student = studentInput.value;

  scoreText.innerText = "Grading...";
  progressCircle.style.transition = "none";
  progressCircle.style.strokeDashoffset = 628; // reset for r=100

  fetch("http://127.0.0.1:5000/grade", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({
      model_answer: model,
      student_answer: student
    })
  })
  .then(res => res.json())
  .then(data => {
    if (data.status === "Wrong") {
      // Show Wrong message
      scoreText.innerText = "Wrong!";
      progressCircle.style.strokeDashoffset = 628;
    } else {
      // Show Score animation
      const score = Math.min(100, Math.max(0, data.score || 0));
      let count = 0;
      const interval = setInterval(() => {
        if (count >= score) {
          clearInterval(interval);
          scoreText.innerText = `${Math.round(score)}%`;
          if (score >= 80) { showConfetti(); }
        } else {
          count++;
          scoreText.innerText = `${count}%`;
        }
      }, 15);

      animateCircle(score);
    }
    
    // Show breakdown if it exists
    if (data.details) {
      let detailDiv = document.getElementById("scoreDetails");
      if (!detailDiv) {
        detailDiv = document.createElement("div");
        detailDiv.id = "scoreDetails";
        detailDiv.style.color = "#aaa";
        detailDiv.style.fontSize = "14px";
        detailDiv.style.marginTop = "10px";
        scoreText.parentElement.appendChild(detailDiv);
      }
      detailDiv.innerText = `Rubric: ${data.details.rubric_score}% | Similarity: ${data.details.similarity_score}%`;
    }
  })
  .catch(err => {
    console.error("Grading error:", err);
    scoreText.innerText = "Error!";
  });
});

// ----------------- Background Particles -----------------
// ----------------- Background Particles -----------------
const bgCanvas = document.getElementById("bgParticles");
const bgCtx = bgCanvas.getContext("2d");
bgCanvas.width = window.innerWidth;
bgCanvas.height = window.innerHeight;

let particles = [];
// Increased particle count for starry effect
for(let i=0; i<150; i++){
  particles.push({
    x: Math.random() * bgCanvas.width,
    y: Math.random() * bgCanvas.height,
    r: Math.random() * 1.5, // Smaller stars
    dx: (Math.random() - 0.5) * 0.5, // Slower movement
    dy: (Math.random() - 0.5) * 0.5,
    alpha: Math.random() * 0.5 + 0.1 // Random opacity
  });
}

function drawBGParticles(){
  bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
  
  // Draw particles
  particles.forEach((p, index) => {
    bgCtx.beginPath();
    bgCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    // Subtle white/cyan stars
    bgCtx.fillStyle = `rgba(180, 220, 255, ${p.alpha})`; 
    bgCtx.fill();
    
    p.x += p.dx; 
    p.y += p.dy;
    
    // Wrap around screen
    if(p.x < 0) p.x = bgCanvas.width;
    if(p.x > bgCanvas.width) p.x = 0;
    if(p.y < 0) p.y = bgCanvas.height;
    if(p.y > bgCanvas.height) p.y = 0;
    
    // Twinkle effect (optional)
    if(Math.random() > 0.98) {
        p.alpha = Math.random() * 0.5 + 0.2;
    }

    // Constellation effect: Connect nearby particles
    for(let j = index + 1; j < particles.length; j++){
        const p2 = particles[j];
        const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
        if(dist < 100){
            bgCtx.beginPath();
            bgCtx.strokeStyle = `rgba(180, 220, 255, ${0.15 * (1 - dist/100)})`;
            bgCtx.lineWidth = 0.5;
            bgCtx.moveTo(p.x, p.y);
            bgCtx.lineTo(p2.x, p2.y);
            bgCtx.stroke();
        }
    }
  });
  requestAnimationFrame(drawBGParticles);
}
drawBGParticles();

// ----------------- Window Resize -----------------
window.addEventListener("resize", () => {
    bgCanvas.width = window.innerWidth;
    bgCanvas.height = window.innerHeight;
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
});

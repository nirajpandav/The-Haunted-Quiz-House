/* -------------------- Audio -------------------- */
const bgCreepy = document.getElementById("bgCreepy");
const doorSound = document.getElementById("doorSound");
const triviaMusic = document.getElementById("triviaMusic");
const scream = document.getElementById("scream");
const chaseMusic = document.getElementById("chaseMusic");

window.onload = () => {
  bgCreepy.volume = 0.25;
  bgCreepy.play().catch(() => {
    console.log("Autoplay blocked, starts after click.");
  });
};

/* -------------------- Zoom + Start -> Trivia -------------------- */
function zoomIn() {
  if (bgCreepy) bgCreepy.pause();

  if (doorSound) {
    doorSound.currentTime = 0;
    doorSound.play().catch(() => {});
  }

  const house = document.getElementById("hauntedHouse");
  house.classList.add("zoom");

  setTimeout(startGame, 3000);
}

function startGame() {
  document.getElementById("start-screen").style.display = "none";
  document.getElementById("game-screen").style.display = "flex";

  if (triviaMusic) {
    triviaMusic.currentTime = 0;
    triviaMusic.volume = 0.25;
    triviaMusic.play().catch(() => {});
  }

  currentQuestion = 0;
  score = 0;
  loadQuestion();
}

/* -------------------- Trivia Data & Flow -------------------- */
const questions = [
  {
    question: "In 'The Conjuring', which family does Ed and Lorraine Warren help?",
    options: ["The Perron Family", "The Johnson Family", "The Harris Family", "The Miller Family"],
    answerIndex: 0
  },
  {
    question: "Which movie features a videotape that kills anyone who watches it in 7 days?",
    options: ["Sinister", "The Ring", "It Follows", "The Grudge"],
    answerIndex: 1
  },
  {
    question: "In 'A Nightmare on Elm Street', what is the name of the villain?",
    options: ["Jason Voorhees", "Michael Myers", "Freddy Krueger", "Leatherface"],
    answerIndex: 2
  },
  {
    question: "Which horror movie is famous for the line 'Do you want to play a game?'",
    options: ["Saw", "Insidious", "Annabelle", "The Nun"],
    answerIndex: 0
  },
  {
    question: "Which horror film features a killer wearing a ghost mask and calling victims on the phone?",
    options: ["Scream", "I Know What You Did Last Summer", "Urban Legend", "The Grudge"],
    answerIndex: 0
  },
  {
    question: "In 'It', what shape does Pennywise often appear as?",
    options: ["A clown", "A doll", "A ghost", "A scarecrow"],
    answerIndex: 0
  },
  {
    question: "Which horror movie takes place at the Overlook Hotel?",
    options: ["The Shining", "Poltergeist", "1408", "The Haunting"],
    answerIndex: 0
  },
  {
    question: "What object is haunted in the movie 'Annabelle'?",
    options: ["A doll", "A music box", "A mirror", "A painting"],
    answerIndex: 0
  },
  {
    question: "Which horror movie's tagline was 'In space no one can hear you scream'?",
    options: ["Alien", "Predator", "Event Horizon", "The Thing"],
    answerIndex: 0
  },
  {
    question: "In 'Friday the 13th', who was the original killer in the first movie?",
    options: ["Jason Voorhees", "Mrs. Voorhees", "Camp Counselor", "Michael Myers"],
    answerIndex: 1
  }
];


let currentQuestion = 0;
let score = 0;

function loadQuestion() {
  if (currentQuestion >= questions.length) {
    if (score === questions.length) {
      showSurvived();
    } else {
      goToChaseScreen();
    }
    return;
  }

  const q = questions[currentQuestion];
  document.getElementById("question").textContent = q.question;
  const answersDiv = document.getElementById("answers");
  answersDiv.innerHTML = "";

  q.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.className = "btn";
    btn.type = "button";
    btn.textContent = opt;
    btn.onclick = () => checkAnswer(i);
    answersDiv.appendChild(btn);
  });

  document.getElementById("feedback").textContent = "";
  document.getElementById("score").textContent = `Score: ${score}`;
}

// Funny messages for correct answers
const funnyMessages = [
  "Phew! You escaped the ghost this time 👻",
  "Correct! Even the skeleton clapped 💀👏",
  "Nice one! The vampire rage quit 🦇",
  "Boom! You’re too smart for this haunted house 🎃",
  "Ghost whisper: 'Not bad, human… not bad.' 👻",
  "Correct! +10 ghost repellent points 🧄"
];

function checkAnswer(selectedIndex) {
  const q = questions[currentQuestion];
  const feedback = document.getElementById("feedback");

  if (selectedIndex === q.answerIndex) {
    score++;

    // Pick random funny message
    let msg = funnyMessages[Math.floor(Math.random() * funnyMessages.length)];
    feedback.textContent = msg;
    feedback.style.color = "lime";

    currentQuestion++;
    setTimeout(loadQuestion, 900);
  } else {
    feedback.textContent = "Wrong! The monster is coming for you now!";
    feedback.style.color = "red";

    if (triviaMusic) triviaMusic.pause();
    if (scream) scream.play();

    setTimeout(() => {
      goToChaseScreen();
    }, 1200);
  }
}


function showSurvived() {
  const container = document.getElementById("trivia-container");
  container.innerHTML = `<h2 style="color:lime">You Escaped The Haunted Quiz House… Alive!</h2><p>Score: ${score}/${questions.length}</p>`;
}

function goToChaseScreen() {
  document.getElementById("game-screen").style.display = "none";
  document.getElementById("chase-screen").style.display = "flex";

  if (chaseMusic) {
    chaseMusic.currentTime = 0;
    chaseMusic.volume = 0.25;
    chaseMusic.play();
  }

  startChase();
}

/* -------------------- Chase Game -------------------- */
let chaseRaf = null;
let chaseTimer = null;

function startChase() {
  const canvas = document.getElementById("chaseGame");
  const ctx = canvas.getContext("2d");

  const player = { x: 60, y: canvas.height / 2, size: 52, speed: 5, emoji: "🧍" };
  const monster = { x: canvas.width - 90, y: canvas.height / 2, size: 64, speed: 2.0, emoji: "👹" };
  const exitEmoji = "🚪";

  const keys = {};
  function onKeyDown(e) { keys[e.key] = true; }
  function onKeyUp(e) { keys[e.key] = false; }

  let timeLeft = 15;
  document.getElementById("chase-msg").textContent = `Survive: ${timeLeft}s`;
  document.getElementById("restart-after-chase").style.display = "none";

  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);

  chaseTimer = setInterval(() => {
    timeLeft--;
    document.getElementById("chase-msg").textContent = `Survive: ${timeLeft}s`;
    if (timeLeft <= 0) {
      endChase(true);
    }
  }, 1000);

  function loop() {
    // Player movement (WASD only)
    if (keys["w"] || keys["W"]) player.y -= player.speed;
    if (keys["s"] || keys["S"]) player.y += player.speed;
    if (keys["a"] || keys["A"]) player.x -= player.speed;
    if (keys["d"] || keys["D"]) player.x += player.speed;

    // Clamp player inside canvas
    const halfP = player.size / 2;
    player.x = Math.max(halfP, Math.min(canvas.width - halfP, player.x));
    player.y = Math.max(halfP, Math.min(canvas.height - halfP, player.y));

    // Monster chases player
    const dx = player.x - monster.x;
    const dy = player.y - monster.y;
    const dist = Math.hypot(dx, dy) || 1;
    monster.x += (dx / dist) * monster.speed;
    monster.y += (dy / dist) * monster.speed;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw exit
    ctx.font = "36px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(exitEmoji, canvas.width - 40, canvas.height / 2);

    // Draw player
    ctx.font = `${player.size}px serif`;
    ctx.fillText(player.emoji, player.x, player.y);

    // Draw monster
    ctx.font = `${monster.size}px serif`;
    ctx.fillText(monster.emoji, monster.x, monster.y);

    // Timer
    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.textAlign = "left";
    ctx.fillText(`Time Left: ${timeLeft}s`, 10, 20);

    // Collision
    const collideDistance = (player.size + monster.size) * 0.45;
    if (dist < collideDistance) {
      endChase(false);
      return;
    }

    chaseRaf = requestAnimationFrame(loop);
  }

  chaseRaf = requestAnimationFrame(loop);

  function endChase(escaped) {
    if (chaseRaf) cancelAnimationFrame(chaseRaf);
    chaseRaf = null;
    if (chaseTimer) clearInterval(chaseTimer);
    chaseTimer = null;

    window.removeEventListener("keydown", onKeyDown);
    window.removeEventListener("keyup", onKeyUp);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "28px Creepster, cursive";
    if (escaped) {
      ctx.fillStyle = "lime";
      ctx.fillText("You made it out alive! 😅", canvas.width / 2, canvas.height / 2);
    } else {
      ctx.fillStyle = "red";
      ctx.fillText("Too slow! The monster got you! 💀", canvas.width / 2, canvas.height / 2);
    }

    document.getElementById("restart-after-chase").style.display = "inline-block";
  }
}

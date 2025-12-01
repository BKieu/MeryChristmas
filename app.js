var bbiTL = new TimelineMax(),
  // logo
  frame = document.getElementById("frame"),
  happy = document.getElementById("happy"),
  merry = document.getElementById("merry"),
  christmas = document.getElementById("christmas"),
  trees = document.getElementById("trees"),
  middle_tree = document.getElementById("middle_tree"),
  left_tree = document.getElementById("left_tree"),
  right_tree = document.getElementById("right_tree");

// animations

// item drop
var totalItems = 18;
for (var i = 1; i <= totalItems; ++i) {
  var lenght = Math.random() * (4.5 - 3) + 3;
  var start = Math.random();

  // hanging
  hanging(totalItems, i, lenght, start);

  bbiTL.fromTo(
    "#item" + i,
    lenght,
    { y: -($("#item" + i).height() / 3) },
    { ease: Bounce.easeOut, y: 0 },
    start
  );
}

// item hanging

function hanging(totalItems, i, lenght, start) {
  var hangOffset = 0.3;
  var hangStart = start + lenght - 0.2;
  var delay = Math.random() * 3 + 1;
  var rotation = -((1 / lenght) * 3);
  bbiTL.to(
    "#item" + i,
    hangOffset,
    {
      rotation: rotation,
      transformOrigin: "0% 0%",
      repeatDelay: 0,
      ease: Back.easeOut.config(2),
      repeat: -1,
    },
    hangStart / 3
  );
  bbiTL.to(
    "#item" + i,
    10,
    {
      rotation: 0,
      transformOrigin: "0% 0%",
      ease: Elastic.easeOut.config(2.5, 0.1),
      repeatDelay: hangOffset,
      repeat: -1,
    },
    (hangStart + hangOffset) / 3
  );
  console.log(rotation);
}

function happyNewYear() {
  for (var h = 1; h <= 16; ++h) {
    var leters = h * 0.1;
    bbiTL.fromTo(
      ".happy_" + h,
      0.2,
      { scale: -1, opacity: 0 },
      { scale: 1, ease: Back.easeOut.config(1.4), opacity: 1 },
      leters + 4
    );
  }
}

// snow
var canvas = document.getElementById("snow"),
  ctx = canvas.getContext("2d"),
  width = (ctx.canvas.width = canvas.offsetWidth),
  height = (ctx.canvas.height = canvas.offsetHeight),
  animFrame =
    window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame,
  snowflakes = [];

window.onresize = function () {
  width = ctx.canvas.width = canvas.offsetWidth;
  height = ctx.canvas.height = canvas.offsetHeight;

  for (var i = 0; i < snowflakes.length; i++) {
    snowflakes[i].resized();
  }
};

function update() {
  for (var i = 0; i < snowflakes.length; i++) {
    snowflakes[i].update();
  }
}

function Snow() {
  this.x = random(0, width);
  this.y = random(-height, 0);
  this.radius = random(0.5, 3.0);
  this.speed = random(0.5, 2.0);
  this.wind = random(-0.1, 1.0);
  this.isResized = false;

  this.updateData = function () {
    this.x = random(0, width);
    this.y = random(-height, 0);
  };

  this.resized = function () {
    this.isResized = true;
  };
}

Snow.prototype.draw = function () {
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
  ctx.fillStyle = "#fff";
  ctx.fill();
  ctx.closePath();
};

Snow.prototype.update = function () {
  this.y += this.speed;
  this.x += this.wind;

  if (this.y > ctx.canvas.height) {
    if (this.isResized) {
      this.updateData();
      this.isResized = false;
    } else {
      this.y = 0;
      this.x = random(0, width);
    }
  }
};

function createSnow(count) {
  for (var i = 0; i < count; i++) {
    snowflakes[i] = new Snow();
  }
}

function draw() {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  for (var i = 0; i < snowflakes.length; i++) {
    snowflakes[i].draw();
  }
}

function loop() {
  draw();
  update();
  animFrame(loop);
}

function random(min, max) {
  var rand = (min + Math.random() * (max - min)).toFixed(1);
  rand = Math.round(rand);
  return rand;
}

createSnow(200);
loop();

//----------tree----------
MorphSVGPlugin.convertToPath("polygon");
var xmlns = "http://www.w3.org/2000/svg",
  xlinkns = "http://www.w3.org/1999/xlink",
  select = function (s) {
    return document.querySelector(s);
  },
  selectAll = function (s) {
    return document.querySelectorAll(s);
  },
  pContainer = select(".pContainer"),
  mainSVG = select(".mainSVG"),
  star = select("#star"),
  sparkle = select(".sparkle"),
  tree = select("#tree"),
  showParticle = true,
  particleColorArray = [
    "#E8F6F8",
    "#ACE8F8",
    "#F6FBFE",
    "#A2CBDC",
    "#B74551",
    "#5DBA72",
    "#910B28",
    "#910B28",
    "#446D39",
  ],
  particleTypeArray = ["#star", "#circ", "#cross", "#heart"],
  // particleTypeArray = ['#star'],
  particlePool = [],
  particleCount = 0,
  numParticles = 201;

gsap.set("svg", {
  visibility: "visible",
});

gsap.set(sparkle, {
  transformOrigin: "50% 50%",
  y: -100,
});

let getSVGPoints = (path) => {
  let arr = [];
  var rawPath = MotionPathPlugin.getRawPath(path)[0];
  rawPath.forEach((el, value) => {
    let obj = {};
    obj.x = rawPath[value * 2];
    obj.y = rawPath[value * 2 + 1];
    if (value % 2) {
      arr.push(obj);
    }
    //console.log(value)
  });

  return arr;
};
let treePath = getSVGPoints(".treePath"),
  treeBottomPath = getSVGPoints(".treeBottomPath"),
  mainTl = gsap.timeline({ delay: 0, repeat: 0 }),
  starTl;

function flicker(p) {
  gsap.killTweensOf(p, { opacity: true });
  gsap.fromTo(
    p,
    {
      opacity: 1,
    },
    {
      duration: 0.07,
      opacity: Math.random(),
      repeat: -1,
    }
  );
}

function createParticles() {
  var i = numParticles,
    p,
    particleTl,
    step = numParticles / treePath.length,
    pos;
  while (--i > -1) {
    p = select(particleTypeArray[i % particleTypeArray.length]).cloneNode(true);
    mainSVG.appendChild(p);
    p.setAttribute("fill", particleColorArray[i % particleColorArray.length]);
    p.setAttribute("class", "particle");
    particlePool.push(p);
    //hide them initially
    gsap.set(p, {
      x: -100,
      y: -100,
      transformOrigin: "50% 50%",
    });
  }
}

var getScale = gsap.utils.random(0.5, 3, 0.001, true);

function playParticle(p) {
  if (!showParticle) {
    return;
  }
  var p = particlePool[particleCount];
  gsap.set(p, {
    x: gsap.getProperty(".pContainer", "x"),
    y: gsap.getProperty(".pContainer", "y"),
    scale: getScale(),
  });
  var tl = gsap.timeline();
  tl.to(p, {
    duration: gsap.utils.random(0.61, 6),
    physics2D: {
      velocity: gsap.utils.random(-23, 23),
      angle: gsap.utils.random(-180, 180),
      gravity: gsap.utils.random(-6, 50),
    },
    scale: 0,
    rotation: gsap.utils.random(-123, 360),
    ease: "power1",
    onStart: flicker,
    onStartParams: [p],
    onRepeat: (p) => {
      gsap.set(p, {
        scale: getScale(),
      });
    },
    onRepeatParams: [p],
  });

  particleCount++;
  particleCount = particleCount >= numParticles ? 0 : particleCount;
}

function drawStar() {
  starTl = gsap.timeline({ onUpdate: playParticle });
  starTl
    .to(".pContainer, .sparkle", {
      duration: 6,
      motionPath: {
        path: ".treePath",
        autoRotate: false,
      },
      ease: "linear",
    })
    .to(".pContainer, .sparkle", {
      duration: 1,
      onStart: function () {
        showParticle = false;
      },
      x: treeBottomPath[0].x,
      y: treeBottomPath[0].y,
    })
    .to(
      ".pContainer, .sparkle",
      {
        duration: 2,
        onStart: function () {
          showParticle = true;
        },
        motionPath: {
          path: ".treeBottomPath",
          autoRotate: false,
        },
        ease: "linear",
      },
      "-=0"
    )
    .from(
      ".treeBottomMask",
      {
        duration: 2,
        drawSVG: "0% 0%",
        stroke: "#FFF",
        ease: "linear",
      },
      "-=2"
    );
}

createParticles();
drawStar();

mainTl
  .from([".treePathMask", ".treePotMask"], {
    duration: 6,
    drawSVG: "0% 0%",
    stroke: "#FFF",
    stagger: {
      each: 6,
    },
    duration: gsap.utils.wrap([6, 1, 2]),
    ease: "linear",
  })
  .from(
    ".treeStar",
    {
      duration: 3,
      scaleY: 0,
      scaleX: 0.15,
      transformOrigin: "50% 50%",
      ease: "elastic(1,0.5)",
    },
    "-=4"
  )

  .to(
    ".sparkle",
    {
      duration: 3,
      opacity: 0,
      ease: "rough({strength: 2, points: 100, template: linear, taper: both, randomize: true, clamp: false})",
    },
    "-=0"
  )
  .to(
    ".treeStarOutline",
    {
      duration: 1,
      opacity: 1,
      ease: "rough({strength: 2, points: 16, template: linear, taper: none, randomize: true, clamp: false})",
    },
    "+=1"
  );

// ---------- Music controls ----------
(function () {
  const audio = document.getElementById('bg-music');
  const btn = document.getElementById('music-toggle');
  let isPlaying = false;
  let interactionHandler;

  if (audio) {
    audio.volume = 0.2;
    // Đảm bảo nhạc loop
    audio.loop = true;
    // Thêm event listener để đảm bảo loop hoạt động
    audio.addEventListener('ended', function() {
      this.currentTime = 0;
      this.play();
    });
  }

  function updateButton() {
    if (!btn) return;
    btn.setAttribute('aria-pressed', isPlaying);
    btn.classList.toggle('is-playing', isPlaying);
    btn.innerHTML = isPlaying ? '<i class="fa-solid fa-volume-high"></i>' : '<i class="fa-solid fa-music"></i>';
  }

  function tryAutoplay() {
    if (!audio) return Promise.reject(new Error('no-audio'));
    return audio.play().then(function () {
      isPlaying = true;
      updateButton();
      removeInteractionListener();
    });
  }

  function addInteractionListener() {
    if (interactionHandler) return;
    interactionHandler = function onFirstInteraction() {
      if (!audio) return;
      audio.play().then(function () {
        isPlaying = true;
        updateButton();
      }).catch(function () {
        isPlaying = false;
        updateButton();
      }).finally(removeInteractionListener);
    };
    ['click', 'keydown', 'touchstart'].forEach(evt => document.addEventListener(evt, interactionHandler, { once: true, passive: true }));
  }

  function removeInteractionListener() {
    if (!interactionHandler) return;
    ['click', 'keydown', 'touchstart'].forEach(evt => document.removeEventListener(evt, interactionHandler));
    interactionHandler = null;
  }

  // Attempt autoplay on load. If blocked, add a one-time interaction listener.
  if (audio) {
    // small delay to let the page load
    window.requestAnimationFrame(function () {
      tryAutoplay().catch(function () {
        // Autoplay blocked — wait for user interaction
        isPlaying = false;
        updateButton();
        addInteractionListener();
      });
    });
  }

  if (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (!audio) return;
      if (audio.paused) {
        audio.play().then(function () {
          isPlaying = true;
          updateButton();
        }).catch(function () {
          isPlaying = false;
          updateButton();
          addInteractionListener();
        });
      } else {
        audio.pause();
        isPlaying = false;
        updateButton();
      }
    });
  }

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      if (audio && !audio.paused) {
        audio.pause();
        isPlaying = false;
        updateButton();
      }
    }
  });
  // Volume controls (open, slider, mute)
  const volWrap = document.getElementById('music-volume-wrap');
  const volSlider = document.getElementById('music-volume');
  const volOpenBtn = document.getElementById('music-open-volume');
  const muteBtn = document.getElementById('music-mute');
  const muteIcon = document.getElementById('music-mute-icon');

  function updateMuteIcon() {
    if (!muteIcon || !audio) return;
    const vol = audio.muted ? 0 : audio.volume;
    if (audio.muted || vol === 0) {
      muteIcon.className = 'fa-solid fa-volume-xmark';
    } else if (vol < 0.4) {
      muteIcon.className = 'fa-solid fa-volume-low';
    } else {
      muteIcon.className = 'fa-solid fa-volume-high';
    }
  }

  if (volSlider && audio) {
    // initialize slider from audio volume
    volSlider.value = Math.round(audio.volume * 100);
    volSlider.addEventListener('input', function () {
      const v = Math.min(100, Math.max(0, Number(this.value)));
      if (audio) {
        audio.volume = v / 100;
        audio.muted = v === 0;
      }
      updateMuteIcon();
    });
  }

  if (muteBtn && volSlider && audio) {
    muteBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (!audio) return;
      audio.muted = !audio.muted;
      if (audio.muted) {
        // remember previous volume
        volSlider.dataset.prev = volSlider.value;
        volSlider.value = 0;
      } else {
        var prev = volSlider.dataset.prev ? Number(volSlider.dataset.prev) : 30;
        volSlider.value = prev;
        audio.volume = prev / 100;
        audio.muted = false;
      }
      updateMuteIcon();
    });
  }

  if (volOpenBtn && volWrap) {
    volOpenBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      volWrap.classList.toggle('visible');
      volWrap.setAttribute('aria-hidden', String(!volWrap.classList.contains('visible')));
    });
  }

  // hide volume popup when clicking outside
  document.addEventListener('click', function (e) {
    if (!volWrap) return;
    if (!volWrap.classList.contains('visible')) return;
    var target = e.target;
    if (volWrap.contains(target)) return;
    if (volOpenBtn && volOpenBtn.contains(target)) return;
    volWrap.classList.remove('visible');
    volWrap.setAttribute('aria-hidden', 'true');
  });

  updateButton();
})();

mainTl.add(starTl, 0);
gsap.globalTimeline.timeScale(1.5);

// ------------ Preload Card Images ------------
const cardBgImage = new Image();
cardBgImage.src = 'https://www.dropbox.com/s/xsgg2exs2oparkm/front-bg.png?raw=1';
const cardPatternImage = new Image();
cardPatternImage.src = 'https://www.dropbox.com/s/8hw7guch8d151kg/pattern.png?raw=1';

let cardImagesLoaded = 0;
const totalCardImages = 2;

function onCardImageLoad() {
  cardImagesLoaded++;
  if (cardImagesLoaded === totalCardImages) {
    document.body.classList.add('card-images-ready');
  }
}

cardBgImage.onload = onCardImageLoad;
cardBgImage.onerror = onCardImageLoad;
cardPatternImage.onload = onCardImageLoad;
cardPatternImage.onerror = onCardImageLoad;

// ------------ Particle Trail Effect ------------
(function() {
  const canvas = document.createElement('canvas');
  canvas.id = 'particle-trail';
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;';
  document.body.appendChild(canvas);
  
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  const particles = [];
  const maxParticles = 50;
  const colors = ['#e83756', '#fff', '#ffd700', '#ff6347'];
  
  function createParticle(x, y) {
    return {
      x: x,
      y: y,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      life: 1.0,
      decay: Math.random() * 0.02 + 0.02,
      size: Math.random() * 3 + 2,
      color: colors[Math.floor(Math.random() * colors.length)]
    };
  }
  
  function updateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;
      
      if (p.life <= 0) {
        particles.splice(i, 1);
        continue;
      }
      
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    
    requestAnimationFrame(updateParticles);
  }
  
  let mouseX = 0, mouseY = 0;
  let lastTime = 0;
  
  document.addEventListener('mousemove', function(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    const now = Date.now();
    if (now - lastTime > 16) { // ~60fps
      if (particles.length < maxParticles) {
        particles.push(createParticle(mouseX, mouseY));
      }
      lastTime = now;
    }
  });
  
  window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
  
  updateParticles();
})();

// ------------ Snowflake Click Effect ------------
(function() {
  // Tạo canvas riêng cho click effect
  const clickCanvas = document.createElement('canvas');
  clickCanvas.id = 'snowflake-click-canvas';
  clickCanvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:5000;';
  document.body.appendChild(clickCanvas);
  
  const ctx = clickCanvas.getContext('2d');
  clickCanvas.width = window.innerWidth;
  clickCanvas.height = window.innerHeight;
  
  const clickParticles = [];
  
  function createClickParticle(x, y) {
    const count = 20;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const speed = Math.random() * 3 + 2;
      clickParticles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1.0,
        decay: Math.random() * 0.03 + 0.02,
        size: Math.random() * 5 + 3,
        color: '#fff',
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2
      });
    }
  }
  
  function drawSnowflake(x, y, size, rotation) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    
    // Vẽ hình dạng tuyết đơn giản (6 cánh)
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, size);
      ctx.stroke();
      ctx.rotate(Math.PI / 3);
    }
    
    ctx.restore();
  }
  
  function updateClickParticles() {
    ctx.clearRect(0, 0, clickCanvas.width, clickCanvas.height);
    
    for (let i = clickParticles.length - 1; i >= 0; i--) {
      const p = clickParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.98;
      p.vy *= 0.98;
      p.rotation += p.rotationSpeed;
      p.life -= p.decay;
      
      if (p.life <= 0) {
        clickParticles.splice(i, 1);
        continue;
      }
      
      ctx.globalAlpha = p.life;
      drawSnowflake(p.x, p.y, p.size, p.rotation);
    }
    
    requestAnimationFrame(updateClickParticles);
  }
  
  document.addEventListener('click', function(e) {
    createClickParticle(e.clientX, e.clientY);
  });
  
  window.addEventListener('resize', function() {
    clickCanvas.width = window.innerWidth;
    clickCanvas.height = window.innerHeight;
  });
  
  updateClickParticles();
})();

$(document).ready(function () {
  var $card = $(".card"),
    $bgCard = $(".bgCard"),
    $icon = $(".icon"),
    cartPageBottomP = document.querySelector(".cart-page-bottom p"),
    cartPageBottomH4 = document.querySelector(".cart-page-bottom h4");
    let textTitle = "Merry Christmas";
    let charArrTitle = textTitle.split('');
    // Nội dung lời chúc Giáng Sinh (không có Happy New Year)
    let text = "Chúc cậu có một mùa Giáng Sinh thật an lành, ấm áp bên những người mà cậu thương yêu. Mong rằng từng khoảnh khắc trong mùa lễ này đều tràn ngập tiếng cười, ánh đèn lung linh và những điều nhỏ bé nhưng thật hạnh phúc. Cảm ơn vì cậu đã xuất hiện trong cuộc sống của tớ, và hy vọng những điều tốt đẹp nhất sẽ luôn đồng hành cùng cậu.";
    let signature = "From BienKieu with love <3";
let charArrContent = text.split('');
    let charArrSignature = signature.split('');
var currentIndexTitle = 0;
var currentIndexContent = 0;
    var currentIndexSignature = 0;
var textIntervalTitle;
var textIntervalContent;
    var textIntervalSignature;
    var cursorInterval;
    var cursorVisible = true;
    var isTyping = false;
    
    // Thêm cursor vào title
    function updateTitleWithCursor() {
        if (cartPageBottomH4) {
            let displayText = charArrTitle.slice(0, currentIndexTitle).join('');
            cartPageBottomH4.innerHTML = displayText + (cursorVisible && isTyping ? '<span class="typing-cursor">|</span>' : '');
        }
    }
    
    // Thêm cursor vào content
    function updateContentWithCursor() {
        if (cartPageBottomP) {
            let displayText = charArrContent.slice(0, currentIndexContent).join('');
            let signatureText = '';
            if (currentIndexContent >= charArrContent.length && currentIndexSignature > 0) {
                signatureText = '<span class="signature">' + charArrSignature.slice(0, currentIndexSignature).join('') + (cursorVisible && isTyping ? '<span class="typing-cursor">|</span>' : '') + '</span>';
            } else if (currentIndexContent >= charArrContent.length) {
                signatureText = '<span class="signature">' + (cursorVisible && isTyping ? '<span class="typing-cursor">|</span>' : '') + '</span>';
            }
            cartPageBottomP.innerHTML = displayText + (currentIndexContent < charArrContent.length && cursorVisible && isTyping ? '<span class="typing-cursor">|</span>' : '') + signatureText;
        }
    }
    
    // Cursor blinking animation
    function startCursorBlink() {
        if (cursorInterval) clearInterval(cursorInterval);
        cursorInterval = setInterval(function() {
            if (!isTyping) return;
            cursorVisible = !cursorVisible;
            if (currentIndexTitle < charArrTitle.length) {
                updateTitleWithCursor();
            } else if (currentIndexContent < charArrContent.length || currentIndexSignature < charArrSignature.length) {
                updateContentWithCursor();
            }
        }, 530);
    }
    
function resetText(){
        clearInterval(textIntervalTitle);
        clearInterval(textIntervalContent);
        clearInterval(textIntervalSignature);
        if (cursorInterval) clearInterval(cursorInterval);
        if (cartPageBottomH4) cartPageBottomH4.textContent = "";
        if (cartPageBottomP) cartPageBottomP.textContent = "";
    currentIndexTitle = 0;
    currentIndexContent = 0;
        currentIndexSignature = 0;
        isTyping = false;
    }
    
    function typeTitle() {
        if (currentIndexTitle >= charArrTitle.length) {
            clearInterval(textIntervalTitle);
            // Title đã gõ xong: hiển thị lại không có cursor
            if (cartPageBottomH4) {
                cartPageBottomH4.innerHTML = charArrTitle.join('');
            }
            // Đợi một chút trước khi bắt đầu content
            setTimeout(function() {
                textIntervalContent = setInterval(typeContent, 70);
            }, 300);
            return;
        }
                currentIndexTitle++;
        updateTitleWithCursor();
    }
    
    function typeContent() {
        if (currentIndexContent >= charArrContent.length) {
            clearInterval(textIntervalContent);
            // Bắt đầu gõ signature
            if (currentIndexSignature === 0) {
                setTimeout(function() {
                    textIntervalSignature = setInterval(typeSignature, 50);
                }, 300);
            }
            return;
        }
                        currentIndexContent++;
        updateContentWithCursor();
    }
    
    function typeSignature() {
        if (currentIndexSignature >= charArrSignature.length) {
            clearInterval(textIntervalSignature);
            isTyping = false;
            // Ẩn cursor sau khi hoàn thành
            if (cartPageBottomH4) cartPageBottomH4.innerHTML = charArrTitle.join('');
            if (cartPageBottomP) {
                let signatureHtml = '<span class="signature">' + charArrSignature.join('') + '</span>';
                cartPageBottomP.innerHTML = charArrContent.join('') + signatureHtml;
            }
            return;
        }
        currentIndexSignature++;
        updateContentWithCursor();
    }
    
    $card.on("click", function () {
        $(this).toggleClass("is-opened");
        if($card.hasClass("is-opened")){
            resetText();
            isTyping = true;
            startCursorBlink();
            
            // Typing effect với tốc độ cố định
            textIntervalTitle = setInterval(typeTitle, 70);
    }
    else{
            resetText();
    }
  });

  $(".centerer").on("click", function () {
    function showCard() {
      $card.fadeIn(400, function() {
        // Sau khi card fadeIn, đảm bảo background image hiển thị
        $('.card').addClass('images-ready');
      });
    $bgCard.fadeIn();
    $icon.fadeIn();
    }
    
    if (cardImagesLoaded >= totalCardImages) {
      // Images đã load xong, hiển thị ngay
      showCard();
    } else {
      // Đợi images load xong (tối đa 2 giây)
      const checkInterval = setInterval(function() {
        if (cardImagesLoaded >= totalCardImages) {
          clearInterval(checkInterval);
          showCard();
        }
      }, 100);
      
      // Timeout sau 2 giây dù images chưa load xong
      setTimeout(function() {
        clearInterval(checkInterval);
        showCard(); // Vẫn hiển thị card
      }, 2000);
    }
  });
  $(".fa-xmark").on("click", function () {
    $card.fadeOut();
    $bgCard.fadeOut();
    $icon.fadeOut();
    $card.removeClass("is-opened");
    resetText()
  });

});
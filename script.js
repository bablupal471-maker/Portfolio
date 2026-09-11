// Cursor-follow background glow
const glow = document.getElementById('cursorGlow');
window.addEventListener('mousemove', function(e){
  const xPct = (e.clientX / window.innerWidth) * 100;
  const yPct = (e.clientY / window.innerHeight) * 100;
  glow.style.setProperty('--x', xPct + '%');
  glow.style.setProperty('--y', yPct + '%');
});

// Typewriter effect for hero role line
const roles = ["UI Developer", "WordPress Developer"];
const el = document.getElementById('typedRole');
let ri = 0, ci = 0, deleting = false;

function tick(){
  const current = roles[ri];
  if(!deleting){
    ci++;
    el.textContent = current.slice(0, ci);
    if(ci === current.length){
      deleting = true;
      setTimeout(tick, 1400);
      return;
    }
  } else {
    ci--;
    el.textContent = current.slice(0, ci);
    if(ci === 0){
      deleting = false;
      ri = (ri + 1) % roles.length;
    }
  }
  setTimeout(tick, deleting ? 45 : 90);
}
tick();

// Contact form -> sends the message straight to your inbox via Web3Forms (static site, no backend needed)
document.getElementById('contactForm').addEventListener('submit', function(e){
  e.preventDefault();
  const form = e.target;
  const statusBox = document.getElementById('cf-status');
  const btn = document.getElementById('cf-submit-btn');
  const accessKey = form.access_key.value;

  if(!accessKey || accessKey === 'PASTE_YOUR_WEB3FORMS_ACCESS_KEY_HERE'){
    statusBox.style.display = 'block';
    statusBox.style.color = '#f87171';
    statusBox.textContent = 'Form is not set up yet — add your Web3Forms access key in the code.';
    return;
  }

  const originalBtnHTML = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = 'Sending…';
  statusBox.style.display = 'none';

  const formData = new FormData(form);

  fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Accept': 'application/json' },
    body: formData
  })
  .then(res => res.json())
  .then(data => {
    statusBox.style.display = 'block';
    if(data.success){
      statusBox.style.color = '#4ade80';
      statusBox.textContent = "Thanks! Your message has been sent — I'll get back to you soon.";
      form.reset();
    } else {
      statusBox.style.color = '#f87171';
      statusBox.textContent = data.message || 'Something went wrong. Please try again.';
    }
  })
  .catch(() => {
    statusBox.style.display = 'block';
    statusBox.style.color = '#f87171';
    statusBox.textContent = 'Could not send message — check your connection and try again.';
  })
  .finally(() => {
    btn.disabled = false;
    btn.innerHTML = originalBtnHTML;
  });
});

// Count-up animation for the About stat band
const counters = document.querySelectorAll('.stat-band .num[data-count]');
function animateCounter(node){
  const target = parseInt(node.getAttribute('data-count'), 10);
  const suffix = node.getAttribute('data-suffix') || '';
  const duration = 1400;
  const startTime = performance.now();
  function step(now){
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(target * eased);
    node.textContent = value + suffix;
    if(progress < 1){
      requestAnimationFrame(step);
    } else {
      node.textContent = target + suffix;
    }
  }
  requestAnimationFrame(step);
}
const counterObserver = new IntersectionObserver(function(entries, observer){
  entries.forEach(function(entry){
    if(entry.isIntersecting){
      animateCounter(entry.target);
      observer.unobserve(entry.target);
    }
  });
}, {threshold:0.4});
counters.forEach(function(c){ counterObserver.observe(c); });

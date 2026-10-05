const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];

const cover = $("#cover");
const main = $("#mainContent");
const music = $("#bgMusic");
const musicToggle = $("#musicToggle");
const openBtn = $("#openInvitation");

function guestFromUrl(){
  const params = new URLSearchParams(location.search);
  const raw = params.get("to") || params.get("guest") || "";
  return raw ? decodeURIComponent(raw.replace(/\+/g," ")).trim() : "Bapak/Ibu/Saudara/i";
}
$("#guestName").textContent = guestFromUrl();

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => $("#preloader")?.classList.add("preloader-done"), 250);
});

function openInvitation(){
  cover.classList.add("hidden");
  main.classList.remove("hidden");
  document.body.classList.remove("no-scroll");
  music.play().then(() => setMusicUI(true)).catch(() => setMusicUI(false));
  setTimeout(() => document.querySelector("#home")?.scrollIntoView({behavior:"smooth"}), 100);
}
document.body.classList.add("no-scroll");
openBtn.addEventListener("click", openInvitation);

function setMusicUI(playing){
  musicToggle.classList.toggle("playing", playing);
  musicToggle.textContent = playing ? "❚❚" : "♫";
  musicToggle.title = playing ? "Jeda musik" : "Putar musik";
}
musicToggle.addEventListener("click", async () => {
  if(music.paused){
    try{ await music.play(); setMusicUI(true); }catch(e){}
  }else{
    music.pause(); setMusicUI(false);
  }
});
music.addEventListener("play",()=>setMusicUI(true));
music.addEventListener("pause",()=>setMusicUI(false));

const targetDate = new Date("2026-10-16T08:00:00+07:00").getTime();
function updateCountdown(){
  const diff = targetDate - Date.now();
  if(diff <= 0){
    ["days","hours","minutes","seconds"].forEach(id => $("#"+id).textContent = "00");
    $("#countdownStatus").textContent = "Hari bahagia telah tiba. Selamat menempuh hidup baru!";
    return;
  }
  const d = Math.floor(diff/86400000);
  const h = Math.floor(diff%86400000/3600000);
  const m = Math.floor(diff%3600000/60000);
  const s = Math.floor(diff%60000/1000);
  $("#days").textContent = String(d).padStart(2,"0");
  $("#hours").textContent = String(h).padStart(2,"0");
  $("#minutes").textContent = String(m).padStart(2,"0");
  $("#seconds").textContent = String(s).padStart(2,"0");
}
updateCountdown(); setInterval(updateCountdown,1000);

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => { if(entry.isIntersecting) entry.target.classList.add("visible"); });
},{threshold:.12});
$$(".reveal").forEach(el => observer.observe(el));

const parallaxEls = $$("[data-parallax]");
let ticking=false;
function parallax(){
  if(ticking) return;
  ticking=true;
  requestAnimationFrame(()=>{
    parallaxEls.forEach(el=>{
      const r=el.parentElement.getBoundingClientRect();
      const offset=(window.innerHeight/2-(r.top+r.height/2))*0.08;
      el.style.transform=`translate3d(0,${offset}px,0) scale(1.08)`;
    });
    ticking=false;
  });
}
window.addEventListener("scroll",parallax,{passive:true});
parallax();

let autoScrollEnabled = true;
let userPausedUntil = 0;
const sections = () => ["#home","#couple",".entertainment","#invited","#event","#barcode","#countdown","#story","#gallery","#gift","#rsvp"].map(sel => document.querySelector(sel)).filter(Boolean);
const AUTO_SCROLL_INTERVAL = 3000; // pindah bagian setiap 3 detik
const AUTO_SCROLL_DURATION = 1800; // gerakan scroll dibuat lembut selama 1,8 detik
let autoScrollTimer = null;
let scrollAnimationFrame = null;

function easeInOutCubic(t){
  return t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2,3)/2;
}

function smoothScrollToY(targetY, duration=AUTO_SCROLL_DURATION){
  if(scrollAnimationFrame) cancelAnimationFrame(scrollAnimationFrame);
  const startY = window.scrollY;
  const distance = targetY - startY;
  if(Math.abs(distance) < 4) return;
  const startTime = performance.now();

  function step(now){
    const progress = Math.min((now-startTime)/duration, 1);
    const eased = easeInOutCubic(progress);
    window.scrollTo(0, startY + distance*eased);
    if(progress < 1){
      scrollAnimationFrame = requestAnimationFrame(step);
    }else{
      scrollAnimationFrame = null;
    }
  }
  scrollAnimationFrame = requestAnimationFrame(step);
}

function runAutoScroll(){
  if(!autoScrollEnabled || Date.now()<userPausedUntil || !cover.classList.contains("hidden")) return;
  const list = sections();
  if(!list.length) return;
  const current = window.scrollY;
  let next = list.findIndex(section => section.offsetTop > current + 80);
  if(next < 0) next = 0;
  const target = Math.max(0, list[next].offsetTop - 4);
  smoothScrollToY(target);
}

autoScrollTimer = setInterval(runAutoScroll, AUTO_SCROLL_INTERVAL);

["wheel","touchstart","click","keydown"].forEach(evt=>{
  window.addEventListener(evt,()=>{
    userPausedUntil = Date.now() + 12000;
    if(scrollAnimationFrame) cancelAnimationFrame(scrollAnimationFrame);
  },{passive:true});
});

const galleryButtons = $$(".gallery-item");
const lightbox = $("#lightbox");
const lightboxImage = $("#lightboxImage");
let galleryIndex=0;
function showGallery(i){
  galleryIndex=(i+galleryButtons.length)%galleryButtons.length;
  lightboxImage.src=galleryButtons[galleryIndex].dataset.full;
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden","false");
}
galleryButtons.forEach((btn,i)=>btn.addEventListener("click",()=>showGallery(i)));
$("#lightboxClose").addEventListener("click",()=>{lightbox.classList.remove("open");lightbox.setAttribute("aria-hidden","true")});
$("#lightboxPrev").addEventListener("click",()=>showGallery(galleryIndex-1));
$("#lightboxNext").addEventListener("click",()=>showGallery(galleryIndex+1));
lightbox.addEventListener("click",e=>{if(e.target===lightbox) $("#lightboxClose").click()});
document.addEventListener("keydown",e=>{
  if(!lightbox.classList.contains("open")) return;
  if(e.key==="Escape") $("#lightboxClose").click();
  if(e.key==="ArrowLeft") showGallery(galleryIndex-1);
  if(e.key==="ArrowRight") showGallery(galleryIndex+1);
});

$("#copyAccount").addEventListener("click",async()=>{
  const number="427901008332539";
  try{
    await navigator.clipboard.writeText(number);
    $("#copyStatus").textContent="Nomor rekening berhasil disalin.";
  }catch(e){
    const ta=document.createElement("textarea"); ta.value=number; document.body.appendChild(ta); ta.select(); document.execCommand("copy"); ta.remove();
    $("#copyStatus").textContent="Nomor rekening berhasil disalin.";
  }
  setTimeout(()=>$("#copyStatus").textContent="",2500);
});

const storageKey="agil-inggrid-wishes-v1";
function loadMessages(){
  const list=JSON.parse(localStorage.getItem(storageKey)||"[]");
  const box=$("#messageList");
  box.innerHTML="";
  list.slice().reverse().forEach(item=>{
    const el=document.createElement("article");
    el.className="message";
    el.innerHTML=`<strong>${escapeHtml(item.name)}</strong><div class="meta">${escapeHtml(item.attendance)}</div><p>${escapeHtml(item.message)}</p>`;
    box.appendChild(el);
  });
}
function escapeHtml(str){
  return String(str).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
}
$("#rsvpForm").addEventListener("submit",e=>{
  e.preventDefault();
  const item={name:$("#rsvpName").value.trim(),attendance:$("#attendance").value,message:$("#message").value.trim(),time:new Date().toISOString()};
  const list=JSON.parse(localStorage.getItem(storageKey)||"[]");
  list.push(item);
  localStorage.setItem(storageKey,JSON.stringify(list.slice(-30)));
  e.target.reset();
  loadMessages();
  alert("Terima kasih atas ucapan dan konfirmasinya.");
});
loadMessages();

document.querySelectorAll(".mobile-nav a").forEach(link => {
  link.addEventListener("click", e => {
    const target=document.querySelector(link.getAttribute("href")); if(!target)return; e.preventDefault(); userPausedUntil=Date.now()+12000;
    const offset=window.innerWidth<=760?58:0; window.scrollTo({top:target.getBoundingClientRect().top+window.scrollY-offset,behavior:"smooth"});
  });
});

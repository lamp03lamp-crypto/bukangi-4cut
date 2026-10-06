'use strict';

/* ============================================================
 * 부캉이 네컷사진 - app.js
 * - 외부 라이브러리/서버 통신 없음. 모든 처리는 브라우저 안에서만.
 * - 사용자 입력/외부 데이터를 HTML로 삽입하지 않음 (textContent만 사용).
 * ============================================================ */

/* ---- 설정: 컷별 부캉이 포즈와 위치 (x,y,w 는 촬영 화면 대비 0~1 비율) ---- */
const SHOTS = [
  { pose: 'assets/bukangi-pose1.png', x: 0.05, y: 0.22, w: 0.287, guide: '부캉이가 왼쪽에 있어요! 오른쪽에 모여주세요' },
  { pose: 'assets/bukangi-pose2.png', x: 0.70, y: 0.22, w: 0.232, guide: '부캉이가 오른쪽으로 갔어요! 왼쪽으로 이동!' },
  { pose: 'assets/bukangi-pose3.png', x: 0.33, y: 0.45, w: 0.34, guide: '부캉이가 가운데 아래에! 위쪽 공간을 써보세요' },
  { pose: 'assets/bukangi-pose4.png', x: 0.58, y: 0.25, w: 0.35, guide: '마지막 컷! 부캉이 옆에 딱 붙어서 포즈!' },
];

/* ---- 최종 프레임 규격 (px) ---- */
const CELL_W = 1000, CELL_H = 750;       // 사진 한 칸 (4:3)
const PAD = 60, GAP = 40, FOOTER = 600;     // 아래 여백을 넓혀 배경(공원/바다)이 보이게
const FRAME_W = CELL_W + PAD * 2;                                   // 1120
const FRAME_H = PAD + CELL_H * 4 + GAP * 3 + FOOTER;                // 3780
const FRAME_BG = 'assets/frame-bg.jpg';           // 선택: 없으면 기본 배경 사용
const FRAME_OVERLAY = 'assets/frame-overlay.png'; // 선택: 투명 PNG 장식(없어도 됨)
const FRAME_TITLE = '부캉이 네컷사진';
const FRAME_PLACE = '북항친수공원';

/* ---- 요소 ---- */
const $ = (id) => document.getElementById(id);
const screens = { start: $('screen-start'), shoot: $('screen-shoot'), result: $('screen-result') };
const video = $('video'), mascotEl = $('mascot'), mascotFb = $('mascot-fallback'), stillEl = $('still');
const countdownEl = $('countdown'), flashEl = $('flash'), guideEl = $('guide');
const btnShoot = $('btn-shoot'), btnRetake = $('btn-retake'), btnNext = $('btn-next');

let stream = null;
let index = 0;                 // 현재 컷 (0~3)
let busy = false;              // 카운트다운 중 중복 클릭 방지
const shots = [];              // 촬영된 canvas
const poseImages = [];         // 로드된 포즈 이미지 (실패 시 null)
let resultCanvas = null;
let stillUrl = null;

function show(name) {
  Object.entries(screens).forEach(([k, el]) => el.classList.toggle('active', k === name));
}

function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);       // 파일이 없어도 앱이 멈추지 않게
    img.src = src;
  });
}

/* ---- 카메라 ---- */
async function startCamera() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error('이 브라우저는 카메라를 지원하지 않아요. 최신 Chrome/Safari로 열어주세요.');
  }
  stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 960 } },
    audio: false,
  });
  video.srcObject = stream;
  await video.play();
}

function stopCamera() {
  if (stream) stream.getTracks().forEach((t) => t.stop());
  stream = null;
  video.srcObject = null;
}

/* ---- 화면 갱신 ---- */
function renderProgress() {
  const box = $('progress');
  box.replaceChildren();
  for (let i = 0; i < SHOTS.length; i++) {
    const s = document.createElement('span');
    if (i < index) s.className = 'done';
    else if (i === index) s.className = 'now';
    box.appendChild(s);
  }
}

function placeMascot() {
  const cfg = SHOTS[index], img = poseImages[index];
  const pct = (v) => (v * 100).toFixed(2) + '%';
  if (img) {
    mascotFb.hidden = true;
    mascotEl.hidden = false;
    mascotEl.src = img.src;
    Object.assign(mascotEl.style, { left: pct(cfg.x), top: pct(cfg.y), width: pct(cfg.w) });
  } else {                                   // 이미지가 아직 없을 때 자리 표시
    mascotEl.hidden = true;
    mascotFb.hidden = false;
    mascotFb.textContent = '부캉이 ' + (index + 1);
    Object.assign(mascotFb.style, { left: pct(cfg.x), top: pct(cfg.y), width: pct(cfg.w) });
  }
}

function showLive() {
  stillEl.hidden = true;
  video.hidden = false;
  placeMascot();
  btnShoot.hidden = false; btnShoot.disabled = false;
  btnRetake.hidden = true; btnNext.hidden = true;
  guideEl.textContent = (index + 1) + '/4 · ' + SHOTS[index].guide;
  renderProgress();
}

function showReview(canvas) {
  if (stillUrl) URL.revokeObjectURL(stillUrl);
  canvas.toBlob((blob) => {
    stillUrl = URL.createObjectURL(blob);
    stillEl.src = stillUrl;
    stillEl.hidden = false;
    mascotEl.hidden = true; mascotFb.hidden = true;   // 이미 사진에 합성됨
  }, 'image/jpeg', 0.92);
  btnShoot.hidden = true;
  btnRetake.hidden = false;
  btnNext.hidden = false;
  btnNext.textContent = index === SHOTS.length - 1 ? '완성하기' : '다음으로';
  guideEl.textContent = '마음에 드나요? 다시 찍거나 다음으로 넘어가세요';
}

function renderThumbs() {
  const box = $('thumbs');
  box.replaceChildren();
  shots.forEach((c) => {
    const t = document.createElement('canvas');
    t.width = 200; t.height = 150;
    t.getContext('2d').drawImage(c, 0, 0, 200, 150);
    box.appendChild(t);
  });
}

/* ---- 촬영 ---- */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function shoot() {
  if (busy) return;
  busy = true;
  btnShoot.disabled = true;
  countdownEl.hidden = false;
  for (let n = 3; n >= 1; n--) {
    countdownEl.textContent = String(n);
    await sleep(1000);
  }
  countdownEl.hidden = true;

  const canvas = captureFrame(index);
  flashEl.classList.add('on');
  setTimeout(() => flashEl.classList.remove('on'), 60);

  shots[index] = canvas;
  showReview(canvas);
  busy = false;
}

/* 영상 한 프레임 + 부캉이를 같은 위치에 합성 (미리보기와 동일한 좌우반전) */
function captureFrame(i) {
  const c = document.createElement('canvas');
  c.width = CELL_W; c.height = CELL_H;
  const ctx = c.getContext('2d');

  const vw = video.videoWidth || CELL_W, vh = video.videoHeight || CELL_H;
  const scale = Math.max(CELL_W / vw, CELL_H / vh);          // object-fit: cover
  const sw = CELL_W / scale, sh = CELL_H / scale;
  const sx = (vw - sw) / 2, sy = (vh - sh) / 2;

  ctx.save();
  ctx.translate(CELL_W, 0); ctx.scale(-1, 1);
  ctx.drawImage(video, sx, sy, sw, sh, 0, 0, CELL_W, CELL_H);
  ctx.restore();

  const cfg = SHOTS[i], img = poseImages[i];
  const mw = cfg.w * CELL_W;
  if (img) {
    const mh = mw * (img.naturalHeight / img.naturalWidth);
    ctx.drawImage(img, cfg.x * CELL_W, cfg.y * CELL_H, mw, mh);
  }
  return c;
}

/* ---- 최종 프레임 합성 ---- */
function drawCover(ctx, img, w, h) {
  const s = Math.max(w / img.naturalWidth, h / img.naturalHeight);
  const dw = img.naturalWidth * s, dh = img.naturalHeight * s;
  ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

async function buildResult() {
  const [bg, overlay] = await Promise.all([loadImage(FRAME_BG), loadImage(FRAME_OVERLAY)]);
  const c = document.createElement('canvas');
  c.width = FRAME_W; c.height = FRAME_H;
  const ctx = c.getContext('2d');

  if (bg) {
    drawCover(ctx, bg, FRAME_W, FRAME_H);
  } else {
    const g = ctx.createLinearGradient(0, 0, 0, FRAME_H);
    g.addColorStop(0, '#ffe3d1'); g.addColorStop(1, '#ffc9a8');
    ctx.fillStyle = g; ctx.fillRect(0, 0, FRAME_W, FRAME_H);
  }

  shots.forEach((shot, i) => {
    const x = PAD, y = PAD + i * (CELL_H + GAP);
    ctx.save();
    roundRect(ctx, x, y, CELL_W, CELL_H, 28);
    ctx.clip();
    ctx.drawImage(shot, x, y, CELL_W, CELL_H);
    ctx.restore();
    ctx.lineWidth = 12; ctx.strokeStyle = '#ffffff';
    roundRect(ctx, x, y, CELL_W, CELL_H, 28);
    ctx.stroke();
  });

  if (overlay) ctx.drawImage(overlay, 0, 0, FRAME_W, FRAME_H);

  const footerTop = PAD + CELL_H * 4 + GAP * 3;
  // 배경 위에서도 글씨가 잘 보이도록 반투명 패널
  const panelY = footerTop + 40;            // 패널을 위쪽에 두고 아래는 배경 풍경을 보여줌
  ctx.fillStyle = 'rgba(255,255,255,0.80)';
  roundRect(ctx, PAD, panelY, CELL_W, 220, 44);
  ctx.fill();
  ctx.fillStyle = '#2b3a4a';
  ctx.textAlign = 'center';
  ctx.font = '800 92px system-ui, "Apple SD Gothic Neo", "Noto Sans KR", sans-serif';
  ctx.fillText(FRAME_TITLE, FRAME_W / 2, panelY + 105);
  ctx.font = '600 44px system-ui, "Apple SD Gothic Neo", "Noto Sans KR", sans-serif';
  const d = new Date();
  const pad2 = (n) => String(n).padStart(2, '0');
  ctx.fillText(FRAME_PLACE + ' · ' + d.getFullYear() + '.' + pad2(d.getMonth() + 1) + '.' + pad2(d.getDate()), FRAME_W / 2, panelY + 175);

  return c;
}

async function finish() {
  btnNext.disabled = true;
  stopCamera();
  resultCanvas = await buildResult();
  const view = $('result');
  view.width = resultCanvas.width; view.height = resultCanvas.height;
  view.getContext('2d').drawImage(resultCanvas, 0, 0);
  show('result');
  btnNext.disabled = false;
}

/* ---- 다운로드 (파일은 브라우저 안에서만 생성) ---- */
function download() {
  if (!resultCanvas) return;
  resultCanvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const d = new Date();
    a.href = url;
    a.download = 'bukangi-4cut-' + d.getFullYear() + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0') + '.png';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }, 'image/png');
}

/* ---- 이벤트 ---- */
$('btn-start').addEventListener('click', async () => {
  const err = $('start-error');
  err.hidden = true;
  $('btn-start').disabled = true;
  try {
    const loaded = await Promise.all(SHOTS.map((s) => loadImage(s.pose)));
    loaded.forEach((img, i) => { poseImages[i] = img; });
    await startCamera();
    index = 0; shots.length = 0;
    $('thumbs').replaceChildren();
    show('shoot');
    showLive();
  } catch (e) {
    err.textContent = (e && e.name === 'NotAllowedError')
      ? '카메라 권한이 필요해요. 브라우저 주소창의 권한 설정에서 허용해주세요.'
      : (e && e.message) || '카메라를 켤 수 없어요.';
    err.hidden = false;
  } finally {
    $('btn-start').disabled = false;
  }
});

btnShoot.addEventListener('click', shoot);

btnRetake.addEventListener('click', () => {
  shots[index] = undefined;
  showLive();
});

btnNext.addEventListener('click', () => {
  renderThumbs();
  if (index < SHOTS.length - 1) {
    index += 1;
    showLive();
  } else {
    finish();
  }
});

$('btn-download').addEventListener('click', download);

$('btn-restart').addEventListener('click', async () => {
  resultCanvas = null;
  shots.length = 0;
  index = 0;
  try {
    await startCamera();
    $('thumbs').replaceChildren();
    show('shoot');
    showLive();
  } catch (e) {
    show('start');
  }
});

/* 탭을 닫거나 이동할 때 카메라 해제 */
window.addEventListener('pagehide', stopCamera);

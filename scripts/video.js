let live = false;

/** @param {HTMLVideoElement} video  */
function registerVideoEvents(video) {
  video.ondurationchange = checkLiveStatus;
  video.onseeking = () => checkLiveStatus;

  checkLiveStatus();
}

function checkLiveStatus() {
  let diff = video.duration - video.currentTime;
  if ((diff <= 7 && !live ) || video.duration==Infinity) {
    live = true;
    $('live-btn').classList.add('live');
  } else if (diff > 10 && live) {
    live = false;
    $('live-btn').classList.remove('live');
  }
}

$('live-btn').onclick = () => {
  if (video.duration != Infinity)
    video.currentTime = video.duration - 2;
};

const volumeButton = $('volume-btn');
const volumeRange = $('volume-range');

volumeRange.oninput = () => {
  let value = volumeRange.value;
  volumeRange.style.setProperty('--val', `${value}%`);
  localStorage.setItem('volume', (value / 100).toString());
  volume = value / 100;
  if (muted && value != 0) muted = false;
  if (value == 0) muted = true;
  changeIcon(volumeButton, muted ? 'e710' : 'e050');
  localStorage.setItem('muted', muted.toString());
  updateVolume();
};


volumeButton.onclick = () => {
  if (muted) {
    muted = false;
    if (volume == 0) volume = 0.1;
    $('volume-range').value = volume * 100;
    volumeRange.style.setProperty('--val', `${volume * 100}%`);
    localStorage.setItem('volume', volume.toString());
  } else {
    muted = true;
    $('volume-range').value = 0;
    volumeRange.style.setProperty('--val', `0%`);
  }
  changeIcon(volumeButton, muted ? 'e710' : 'e050');
  localStorage.setItem('muted', muted.toString());
  updateVolume();
};


let controlTask;

window.onmousemove = showUI;
window.onmousedown = showUI;
window.ontouchstart = showUI;
screen.orientation.onchange = showUI;

function showUI() {
  $('control-bar').classList.add('visible');
  document.body.style.cursor = 'unset';
  hideUI();
}

function hideUI() {
  clearTimeout(controlTask);
  controlTask = setTimeout(() => {
    $('control-bar').classList.remove('visible');
    document.body.style.cursor = 'none';
  }, 2500);
}

const fullscreenBtn = $('fullscreen-btn');

fullscreenBtn.onclick = () => {
  if (document.fullscreenElement) {
    document.exitFullscreen();
    changeIcon(fullscreenBtn, 'e5d0');
  } else {
    document.documentElement.requestFullscreen();
    changeIcon(fullscreenBtn, 'e5d1');
  }
};

window.onresize = checkFullscreen;
checkFullscreen();

function checkFullscreen() {
  let fullscreen = window.matchMedia('(display-mode: fullscreen)').matches;
  changeIcon(fullscreenBtn, fullscreen ? 'e5d1' : 'e5d0');
}

function changeIcon(btn, code) {
  btn.firstElementChild.innerHTML = `&#x${code};`;
}
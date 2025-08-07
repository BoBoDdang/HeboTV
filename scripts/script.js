const $ = (id) => document.getElementById(id);
const API = 'https://tv-api.machang.kr';
const video = document.getElementById('video');

let streamData;

(async () => {
    await loadData();
    createPreview();
    $('play').onclick = startVideo;
})();

async function startVideo() {
    $('preview').classList.add('fadeout');
    setTimeout(() => {
        $('preview').remove();
    }, 1000);
    $('player').classList.remove('hidden');

    video.play();
}

async function loadData() {
    streamData = await (await fetch(`${API}/info`)).json();

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = streamData.streamUrl;
    } else if (Hls.isSupported()) {
        let hls = new Hls();
        hls.loadSource(streamData.streamUrl);
        hls.attachMedia(video);
    }
}

async function createPreview() {
    $('splash').classList.add('hidden');
    let data = streamData.info;
    $('title').textContent = data.title;
    if (data.subtitle) $('subtitle').textContent = data.subtitle;
    else $('subtitle').remove();
    if (data.description) $('description').textContent = data.description;
    else $('description').remove();
    if (data.image) $('bg').style.backgroundImage = `url('${API}/images/${data.image}')`;
    else {
        $('bg').remove();
        $('preview').style.paddingTop = '20px';
    }
    $('preview').classList.add(data.alignment.toLowerCase());
    $('preview').classList.remove('hidden');
}
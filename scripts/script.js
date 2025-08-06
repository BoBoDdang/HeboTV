const $ = (id) => document.getElementById(id);
const API = 'https://tv-api.machang.kr:1118';
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

    let player = videojs('video', {
        autoplay: true
    });

    player.src({
        src:  streamData.streamUrl,
        type: 'application/x-mpegURL'
    });
    player.play();


    window.p = player;
}

async function loadData() {
    streamData = await (await fetch(`${API}/info`)).json();
}

async function createPreview() {
    $('splash').classList.add('hidden');
    let data = streamData.info;
    $('title').textContent = data.title;
    if (data.subtitle) $('subtitle').textContent = data.subtitle;
    else $('subtitle').remove();
    if (data.description) $('description').textContent = data.description;
    else $('description').remove();
    if (data.image) $('bg').src = `${API}/images/${data.image}`;
    else {
        $('bg').remove();
        $('preview').style.paddingTop = '20px';
    }
    $('preview').classList.remove('hidden'); //TODO: ADD ALIGNMENT !!!!!!!!
}
const $ = (id) => document.getElementById(id);
let previewData;

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
        src: 'https://d2zihajmogu5jn.cloudfront.net/bipbop-advanced/bipbop_16x9_variant.m3u8',
        type: 'application/x-mpegURL'
    });
    player.play();


    window.p = player;
}

async function loadData() {
    previewData = await (await fetch('http://localhost:3000/info')).json();
}

async function createPreview() {
    $('splash').classList.add('hidden');
    let data = previewData.info;
    $('title').textContent = data.title;
    if (data.subtitle) $('subtitle').textContent = data.subtitle;
    else $('subtitle').remove();
    if (data.description) $('description').textContent = data.description;
    else $('description').remove();
    if (data.image) $('bg').src = `http://localhost:3000/images/${data.image}`;
    else {
        $('bg').remove();
        $('preview').style.paddingTop = '20px';
    }
    $('preview').classList.remove('hidden'); //TODO: ADD ALIGNMENT !!!!!!!!
}
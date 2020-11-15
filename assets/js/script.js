const playBtn = document.getElementById('play');
const muteBtn = document.getElementById('mute');
const reload = document.getElementById('reload');
const prev = document.querySelector('.prev');
const next = document.querySelector('.next');
const timeline = document.querySelector('.timeline');
const progresBar = document.querySelector('.progress');
const volumeBar = document.getElementById('volumeBar');
const volumeProgres = document.getElementById('volume-progress');
const musicName = document.querySelector('.music-name h3');
const currentDuration = document.getElementById('current-duration');
const fullDuration = document.getElementById('full-duration');
const playingAccording = document.querySelector("select");
const musicRow = document.querySelector('.music-row');

var audio = new Audio();
var musicPosition = false;
var activeIndex = 0;

audio.muted = false;
audio.volume = 1;
audio.src = songList[0].url;

// console.dir(audio);
// console.log(audio.duration);


// Start / Stop Music
playBtn.addEventListener('click', ()=>{
    if (!musicPosition) {
        audio.play();
        musicPosition = true;
        playBtn.setAttribute("class", "fas fa-pause")
    }else{
        audio.pause();
        musicPosition = false;
        playBtn.setAttribute("class", "fas fa-play")
    }
})

// Mute / Unmute
muteBtn.addEventListener('click', ()=>{
    if (!audio.muted) {
        audio.muted=true
        muteBtn.setAttribute("class", "fas fa-volume-mute")
    }else{
        audio.muted=false
        muteBtn.setAttribute("class", "fas fa-volume-up")
    }
})

// Reload
reload.addEventListener('click', () => {
    audio.currentTime = 0;
})

// TimeLine and progress bar working
timeline.addEventListener('click', (event) => {
    const timelineWidth = window.getComputedStyle(timeline).width;
    audio.currentTime=event.offsetX/parseInt(timelineWidth) * audio.duration;
})
setInterval(() => {
    progresBar.style.width= audio.currentTime / audio.duration *100 + '%';
}, 100);


//Volume Bar
volumeBar.addEventListener('click', (event) => {
    const volumeWidth = window.getComputedStyle(volumeBar).width;
    audio.volume=event.offsetX/parseInt(volumeWidth);
    volumeProgres.style.width= audio.volume *100 + '%';
})

//Function that switch next music
var nextMusic = function(){
    var nextRandomMusic = Math.floor(Math.random()*songList.length); 
    if(activeIndex==songList.length-1){
        if(playingAccording.value=="Shuffle"){
            activeIndex = nextRandomMusic;
        }else{
            activeIndex=0;
        }
        audio.src=songList[activeIndex].url;
        // player.setAttribute("src", songList[activeIndex].url);
        musicName.innerText=songList[activeIndex].name
    }else{
        if(playingAccording.value=="Shuffle"){
            activeIndex = nextRandomMusic;
        }else{
            activeIndex++;
        }
        audio.src=songList[activeIndex].url;
        musicName.innerText=songList[activeIndex].name
    }
    document.querySelectorAll('.music-row i').forEach((element) => {
        element.setAttribute("class", "far fa-play-circle");
        musicPosition=true;
    }); 
    document.querySelectorAll('.music-row i')[activeIndex].setAttribute('class', 'far fa-pause-circle');

    if (musicPosition) {
        audio.play();            
    }
}
// Next Music            
next.addEventListener('click', ()=>{
    nextMusic();
});

// Previous Music
prev.addEventListener('click',()=>{
    if(activeIndex==0){
        audio.src=songList[activeIndex].url;
        musicName.innerText=songList[activeIndex].name
    }else{
        activeIndex--;
        audio.src=songList[activeIndex].url;
        musicName.innerText=songList[activeIndex].name
    }
    document.querySelectorAll('.music-row i').forEach((element) => {
        element.setAttribute("class", "far fa-play-circle");
        musicPosition=true;
    }); 
    document.querySelectorAll('.music-row i')[activeIndex].setAttribute('class', 'far fa-pause-circle');
    // fullDuration.innerText=audio.duration;
    if (musicPosition) {
        audio.play();            
    }
})

// Refresh current and full time of music
setInterval(() => {
    currentDuration.innerText = `${ Math.floor(audio.currentTime/60) } : ${Math.floor(audio.currentTime)%60} `;
    fullDuration.innerText = ` ${ Math.floor(audio.duration/60) } : ${Math.floor(audio.duration)%60}`;
    if (audio.ended) {
        nextMusic();
    }
}, 500);



songList.map(element => {
    var musicRow = document.createElement('div');
    musicRow.classList.add('music-row');
    musicRow.setAttribute("data-url", element.url);
    var i = document.createElement('i');
    i.setAttribute("class", "far fa-play-circle")
    musicRow.appendChild(i)
    var name = document.createElement('span');
    if (element.name.length < 35) {
        name.innerText=element.name    
    }else{
        name.innerText=element.name.substr(0, 35) + "...";
    }
    musicRow.appendChild(name);
    document.getElementById("music-list").append(musicRow);
})

document.querySelectorAll('.music-row').forEach((element,index) => {
    element.addEventListener('click', ()=>{
        document.querySelectorAll('.music-row i').forEach(element => {
            element.setAttribute("class", "far fa-play-circle");
        });
        audio.src=element.getAttribute('data-url');
        audio.play();
        activeIndex=index;
        musicName.innerText=songList[activeIndex].name;
        playBtn.setAttribute("class", "fas fa-pause");
        element.querySelector('i').setAttribute("class", "far fa-pause-circle")
    })
});



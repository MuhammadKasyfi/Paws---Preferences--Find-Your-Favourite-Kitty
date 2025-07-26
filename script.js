const container = document.getElementById('cardContainer');
const loadingScreen = document.getElementById('loadingScreen');
const likeContainer = document.getElementById('likeContainer');
const likeCounter = document.getElementById("likeCounter");
const likeOverlay = document.getElementById('likeOverlay');
const dislikeOverlay = document.getElementById('dislikeOverlay');
const likeSummary = document.getElementById('likeSummary');
const restart = document.getElementById('restart');
const body = document.body;
let isDragging = false;
let startX = 0;
let currentCard = null;
let likeCount = 0;
let dislikeCount = 0;
let loadedImages = 0;
const url = "https://cataas.com/cat?width=300&height=400&"
const likeAudio = new Audio('Like.mp3');
likeAudio.volume = 0.8;
likeAudio.muted = false;
const dislikeAudio = new Audio('dislike.mp3');
dislikeAudio.volume = 0.8;
dislikeAudio.muted = false;

document.addEventListener('click', () => {
    likeAudio.muted = false;
    dislikeAudio.muted = false;
}, { once: true });


const catImg = [];
const totalImages = 10;
for (let i = 1; i <= totalImages; i++) {
    const imageUrl = url + i;
    const img = new Image();
    img.onload = () => {
        loadedImages++;
        if (loadedImages === totalImages) {
            loadingScreen.style.display = 'none';
            container.style.display = 'block';
        }
    };
    img.src = imageUrl;
    catImg.push(imageUrl);
}

for (let i = totalImages; i>=1; i--){
    const card = document.createElement("div");
    card.className = "card";
    card.style.backgroundImage = `url(${catImg[i-1]})`;
    container.appendChild(card);
}

function getTopCard(){
    return container.querySelector(".card:last-child");
}
container.addEventListener("mousedown", (e) => {
    currentCard = getTopCard();
    if (!currentCard) return;
    isDragging = true;
    startX = e.clientX;
    currentCard.style.transition = "none";
});

document.addEventListener("mousemove", (e) => {
    if (!isDragging || !currentCard) return;
    const deltaX = e.clientX - startX;
    currentCard.style.transform = `translateX(${deltaX}px) rotate(${deltaX/10}deg)`;

    if (deltaX > 50) {
        likeOverlay.style.opacity = 1;
        dislikeOverlay.style.opacity = 0;
    } else if (deltaX < -30) {
        likeOverlay.style.opacity = 0;
        dislikeOverlay.style.opacity = 1;
    } else {
        likeOverlay.style.opacity = 0;
        dislikeOverlay.style.opacity = 0;
    }
});

document.addEventListener("mouseup", (e) => {
    if (!isDragging || !currentCard) return;
    likeOverlay.style.opacity = 0;
    dislikeOverlay.style.opacity = 0;
    const deltaX = e.clientX - startX;
    handleSwipe(deltaX);
});

container.addEventListener("touchstart", (e) => {
    currentCard = getTopCard();
    if (!currentCard) return;
    isDragging = true;
    startX = e.touches[0].clientX;
    currentCard.style.transition = "none";
});

document.addEventListener("touchmove", (e) => {
    if (!isDragging || !currentCard) return;
    const deltaX = e.touches[0].clientX - startX;
    currentCard.style.transform = `translateX(${deltaX}px) rotate(${deltaX/10}deg)`;

    if (deltaX > 30) {
        likeOverlay.style.opacity = 1;
        dislikeOverlay.style.opacity = 0;
    } else if (deltaX < -30) {
        likeOverlay.style.opacity = 0;
        dislikeOverlay.style.opacity = 1;
    } else {
        likeOverlay.style.opacity = 0;
        dislikeOverlay.style.opacity = 0;
    }
});

document.addEventListener("touchend", (e) => {
    if (!isDragging || !currentCard) return;
    likeOverlay.style.opacity = 0;
    dislikeOverlay.style.opacity = 0;
    const deltaX = e.changedTouches[0].clientX - startX;
    handleSwipe(deltaX);
});

const likedImg = [];

function handleSwipe(deltaX) {
    const sensitivity = 50;
    if (Math.abs(deltaX) > sensitivity){
        if (deltaX > 0) {
            likeCount++;
            updateLikeImg();
            likeAudio.currentTime = 0;
            likeAudio.play();
        } else {
            dislikeCount++;
            updateDislikeCount();
            dislikeAudio.currentTime = 0;
            dislikeAudio.play();
        }
        currentCard.style.transition = "transform 0.4s ease, opacity 0.4s ease";
        currentCard.style.transform = `translateX(${deltaX > 0 ? 1000 : -1000}px) rotate(${deltaX > 0 ? 45 : -45}deg)`;
        currentCard.style.opacity = "0";
        setTimeout(() => {
            currentCard.remove();
            currentCard = null;

            if (container.querySelectorAll(".card").length === 0) {
                showLikedImages();
            }
        }, 400);
    } else {
        currentCard.style.transition = "transform 0.3s ease";
        currentCard.style.transform = "translateX(0) rotate(0)";
    }
    isDragging = false;
}

function updateDislikeCount() {
    const dislikeCounter = document.getElementById("dislikeCounter");
    dislikeCounter.textContent = `Dislikes: ${dislikeCount}`;
}

function updateLikeImg() {
    likedImg.push(currentCard.style.backgroundImage);
}

function showLikedImages() {
    container.style.display = 'none';
    body.style.overflow = 'auto';
    likeContainer.style.display = 'grid';
    likeSummary.style.display = 'block';
    restart.style.display = 'block';
    if (likeCount === 0) {
        likeSummary.textContent = "You haven't liked any cats yet... Start swiping!";
        return;
    } else if (likeCount === 1) {
        likeSummary.textContent = "You found the one for you!";
    } else if (likeCount > 1) {
        likeSummary.textContent = `Certified Cat Lover: You liked ${likeCount} cats!`;
    }
    likeContainer.innerHTML = ""; // Clear previous images

    for (let i = likedImg.length-1; i >= 0; i--) {
        const likeCard = document.createElement("div");
        likeCard.className = "like-card";
        likeCard.style.backgroundImage = likedImg[i];
        likeContainer.appendChild(likeCard);
    }
}

restart.addEventListener('click', () => location.reload());
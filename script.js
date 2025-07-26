const container = document.getElementById('cardContainer');
const loadingScreen = document.getElementById('loadingScreen');
const likeContainer = document.getElementById('likeContainer');
const likeCounter = document.getElementById("likeCounter");
let isDragging = false;
let startX = 0;
let currentCard = null;
let likeCount = 0;
let dislikeCount = 0;
let loadedImages = 0;
const url = "https://cataas.com/cat?width=300&height=400&"

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
    const cardContent = document.createElement("div");//remove
    cardContent.className = "card-content"; 
    cardContent.textContent = i; 
    card.appendChild(cardContent);
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
});

document.addEventListener("mouseup", (e) => {
    if (!isDragging || !currentCard) return;
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
});

document.addEventListener("touchend", (e) => {
    if (!isDragging || !currentCard) return;
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
        } else {
            dislikeCount++;
            updateDislikeCount();
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
    likeContainer.style.display = 'grid';
    likeCounter.style.display = 'block';
    likeCounter.textContent = `Likes: ${likeCount}`;
    likeContainer.innerHTML = ""; // Clear previous images

    for (let i = likedImg.length-1; i >= 0; i--) {
        const likeCard = document.createElement("div");
        likeCard.className = "like-card";
        likeCard.style.backgroundImage = likedImg[i];
        likeContainer.appendChild(likeCard);
    }
}
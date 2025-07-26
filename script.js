const container = document.getElementById('cardContainer');
("cardContainer");
let isDragging = false;
let startX = 0;
let currentCard = null;

const cardColors = [
    '#FF5733', // Red
    '#33FF57', // Green
    '#3357FF', // Blue
    '#F1C40F', // Yellow
    '#8E44AD', // Purple
    '#E67E22', // Orange
    '#1ABC9C', // Teal
    '#2C3E50', // Dark Blue
    '#D35400', // Dark Orange
    '#C0392B'  // Dark Red
]; // Array to store card colors, change to images

for (let i = 10; i>=1; i--){
    const card = document.createElement("div");
    card.className = "card";
    card.style.backgroundColor = cardColors[i - 1];
    const cardContent = document.createElement("div");
    cardContent = document.createElement("div");
    cardContent.className = "card-content";
    cardContent.textContent = i;
    card.appendChild(cardContent);
    cardContainer.appendChild(card);
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
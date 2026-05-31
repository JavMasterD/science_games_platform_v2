const kivyAnimals = [
    'alligator', 'ant', 'bat', 'bear', 'bee', 'bird', 'bull', 'butterfly',
    'alligator', 'ant', 'bat', 'bear', 'bee', 'bird', 'bull', 'butterfly'
];

const animalSounds = {
    'alligator': 'assets/sounds/alligator_1.wav',
    'ant': 'assets/sounds/ant_1.wav',
    'bat': 'assets/sounds/bat_1.wav',
    'bear': 'assets/sounds/bear_1.wav',
    'bee': 'assets/sounds/bee_1.wav',
    'bird': 'assets/sounds/bird_2.wav',
    'bull': 'assets/sounds/bull_1.wav',
    'butterfly': 'assets/sounds/butterfly_1.wav'
};
let currentTeam = null;
let scores = { teamA: 0, teamB: 0 };
let flippedCards = [];
let matchedPairsCount = 0;
function selectTeam(teamName) {
    playSound('click');
    currentTeam = teamName;
    document.getElementById('card-teamA').className = 'team-card' + (teamName === 'teamA' ? ' team-active-a' : '');
    document.getElementById('card-teamB').className = 'team-card' + (teamName === 'teamB' ? ' team-active-b' : '');
    document.getElementById('question-box').innerText = `تم تفعيل دور ${teamName === 'teamA' ? 'الفريق أ' : 'الفريق ب'} جاهز لتوليد السؤال العلمي..`;
}
function clearTeamSelection() {
    currentTeam = null;
    document.getElementById('card-teamA').className = 'team-card';
    document.getElementById('card-teamB').className = 'team-card';
}
function lockGrid() {
    document.getElementById('game-grid').classList.add('container-disabled');
}
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
function initGame() {
    const grid = document.getElementById('game-grid');
    grid.innerHTML = '';
    const shuffledAnimals = shuffle([...kivyAnimals]);
    shuffledAnimals.forEach((animal, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.animal = animal;
        card.dataset.index = index;
        card.innerHTML = `<div class="card-back">🧠</div><div class="card-front"><img src="assets/images/${animal}.png" alt="${animal}" class="animal-image"></div>`;
        card.addEventListener('click', flipCard);
        grid.appendChild(card);
    });
    matchedPairsCount = 0;
    scores = { teamA: 0, teamB: 0 };
    document.getElementById('scoreA').innerText = '0';
    document.getElementById('scoreB').innerText = '0';
}
function flipCard() {
    if (flippedCards.length >= 2 || this.classList.contains('card-flipped')) return;
    playSound('click');
    this.classList.add('card-flipped');
    flippedCards.push(this);
    
    // تشغيل صوت الحيوان عند كشف الكرت
    const animal = this.dataset.animal;
    if (animalSounds[animal]) {
        const animalAudio = new Audio(animalSounds[animal]);
        animalAudio.play().catch(e => console.log("Animal sound play deferred"));
    }
    
    if (flippedCards.length === 2) {
        checkMatch();
    }
}
function checkMatch() {
    const [card1, card2] = flippedCards;
    const isMatch = card1.dataset.animal === card2.dataset.animal;
    if (isMatch) {
        playSound('success');
        scores[currentTeam] += 10;
        document.getElementById('scoreA').innerText = scores.teamA;
        document.getElementById('scoreB').innerText = scores.teamB;
        flippedCards = [];
        matchedPairsCount++;
        lockGrid();
        document.getElementById('question-box').innerHTML = `🎉 تطابق ممتاز! أضيفت 10 نقاط لحساب ${currentTeam === 'teamA' ? 'الفريق أ' : 'الفريق ب'}. اختر المجموعة التالية واضغط لتوليد سؤال جديد!`;
        clearTeamSelection();
        if (matchedPairsCount === kivyAnimals.length / 2) {
            setTimeout(() => {
                alert(`انتهت اللعبة بنجاح! النتيجة النهائية:\nالفريق أ: ${scores.teamA} نقطة\nالفريق ب: ${scores.teamB} نقطة`);
                initGame();
            }, 500);
        }
    } else {
        setTimeout(() => {
            card1.classList.remove('card-flipped');
            card2.classList.remove('card-flipped');
            flippedCards = [];
            playSound('fail');
            document.getElementById('question-box').innerHTML = "❌ لم يتطابق الكرتان! ينتهي دوركم المفتوح الآن. يرجى تفعيل دور الفريق الآخر والبدء من جديد.";
            lockGrid();
            clearTeamSelection();
        }, 1000);
    }
}
function playSound(id) {
    const sound = document.getElementById('sound-' + id);
    if (sound && sound.play) {
        sound.currentTime = 0;
        sound.play().catch(e => console.log("Audio play deferred"));
    }
}
window.onload = initGame;

let currentTeam = null;
let scores = { teamA: 0, teamB: 0 };
let positions = { teamA: 1, teamB: 1 };
let diceValue = 0;
let pendingMove = false;

// تعريف السلالم والثعابين
const ladders = {
    3: 11,
    6: 17,
    9: 22,
    10: 25,
    14: 30,
    19: 38,
    28: 50,
    40: 59,
    51: 67,
    54: 72,
    63: 80
};

const snakes = {
    99: 78,
    95: 75,
    92: 70,
    87: 60,
    84: 55,
    73: 48,
    64: 45,
    58: 40,
    47: 32,
    36: 25,
    26: 10,
    16: 6
};

function selectTeam(teamName) {
    playSound('click');
    currentTeam = teamName;
    document.getElementById('card-teamA').className = 'team-card' + (teamName === 'teamA' ? ' team-active-a' : '');
    document.getElementById('card-teamB').className = 'team-card' + (teamName === 'teamB' ? ' team-active-b' : '');
    document.getElementById('question-box').innerText = `تم تفعيل دور ${teamName === 'teamA' ? 'الفريق أ' : 'الفريق ب'} جاهز لرمي النرد..`;
}

function clearTeamSelection() {
    currentTeam = null;
    document.getElementById('card-teamA').className = 'team-card';
    document.getElementById('card-teamB').className = 'team-card';
}

function rollDice() {
    if (!currentTeam) {
        alert("تنبيه: يرجى الضغط واختيار الفريق (أ) أو (ب) أولاً!");
        return;
    }
    if (pendingMove) {
        alert("يرجى إكمال الحركة الحالية أولاً!");
        return;
    }
    
    playSound('dice');
    diceValue = Math.floor(Math.random() * 6) + 1;
    document.getElementById('question-box').innerHTML = `🎲 تم رمي النرد: ${diceValue}<br><br>📢 المعلم: اسأل ${currentTeam === 'teamA' ? 'الفريق أ' : 'الفريق ب'} سؤالاً شفوياً الآن.<br><br>بعد الإجابة، اضغط على الزر المناسب أدناه:`;
    document.getElementById('action-btns').style.display = 'flex';
    document.getElementById('btn-roll').disabled = true;
    pendingMove = true;
}

function verifyAnswer(isCorrect) {
    document.getElementById('action-btns').style.display = 'none';
    document.getElementById('btn-roll').disabled = false;
    
    if (isCorrect) {
        playSound('success');
        movePlayer(diceValue);
    } else {
        playSound('fail');
        document.getElementById('question-box').innerHTML = "❌ إجابة خاطئة. ينتقل الدور تلقائياً للفريق الآخر!";
        clearTeamSelection();
        pendingMove = false;
    }
}

function movePlayer(steps) {
    const newPos = positions[currentTeam] + steps;
    if (newPos > 100) {
        document.getElementById('question-box').innerHTML = `🎲 ${currentTeam === 'teamA' ? 'الفريق أ' : 'الفريق ب'} يحتاج إلى رقم أدنى للوصول للنهاية!`;
        clearTeamSelection();
        pendingMove = false;
        return;
    }
    
    positions[currentTeam] = newPos;
    
    // التحقق من السلالم
    if (ladders[newPos]) {
        positions[currentTeam] = ladders[newPos];
        document.getElementById('question-box').innerHTML = `🪜 صعد ${currentTeam === 'teamA' ? 'الفريق أ' : 'الفريق ب'} عبر السلم من ${newPos} إلى ${ladders[newPos]}!`;
        playSound('success');
    }
    // التحقق من الثعابين
    else if (snakes[newPos]) {
        positions[currentTeam] = snakes[newPos];
        document.getElementById('question-box').innerHTML = `🐍 نزل ${currentTeam === 'teamA' ? 'الفريق أ' : 'الفريق ب'} عبر الثعبان من ${newPos} إلى ${snakes[newPos]}!`;
        playSound('fail');
    }
    else {
        document.getElementById('question-box').innerHTML = `✨ تحرك ${currentTeam === 'teamA' ? 'الفريق أ' : 'الفريق ب'} إلى الموقع ${newPos}!`;
    }
    
    updateBoard();
    
    // التحقق من الفوز
    if (positions[currentTeam] === 100) {
        scores[currentTeam] += 50;
        document.getElementById('scoreA').innerText = scores.teamA;
        document.getElementById('scoreB').innerText = scores.teamB;
        setTimeout(() => {
            alert(`🎉 فوز ${currentTeam === 'teamA' ? 'الفريق أ' : 'الفريق ب'}! وصل إلى الموقع 100!`);
            resetGame();
        }, 500);
    }
    
    clearTeamSelection();
    pendingMove = false;
}

function updateBoard() {
    document.getElementById('posA').innerText = positions.teamA;
    document.getElementById('posB').innerText = positions.teamB;
    
    // تحديث اللوحة
    const cells = document.querySelectorAll('.board-cell');
    cells.forEach(cell => {
        cell.classList.remove('team-a-pos', 'team-b-pos');
        const cellNum = parseInt(cell.dataset.number);
        if (cellNum === positions.teamA) {
            cell.classList.add('team-a-pos');
        }
        if (cellNum === positions.teamB) {
            cell.classList.add('team-b-pos');
        }
    });
}

function initBoard() {
    const board = document.getElementById('board');
    board.innerHTML = '';
    
    for (let i = 100; i >= 1; i--) {
        const cell = document.createElement('div');
        cell.classList.add('board-cell');
        cell.dataset.number = i;
        cell.innerHTML = `<span class="cell-number">${i}</span>`;
        
        // إضافة أيقونات السلالم والثعابين
        if (ladders[i]) {
            cell.classList.add('ladder-start');
            cell.innerHTML += `<span class="ladder-icon">🪜</span>`;
        }
        if (snakes[i]) {
            cell.classList.add('snake-start');
            cell.innerHTML += `<span class="snake-icon">🐍</span>`;
        }
        
        board.appendChild(cell);
    }
    
    updateBoard();
}

function resetGame() {
    positions = { teamA: 1, teamB: 1 };
    scores = { teamA: 0, teamB: 0 };
    document.getElementById('scoreA').innerText = '0';
    document.getElementById('scoreB').innerText = '0';
    document.getElementById('posA').innerText = '1';
    document.getElementById('posB').innerText = '1';
    initBoard();
    clearTeamSelection();
}

function playSound(id) {
    const sound = document.getElementById('sound-' + id);
    if (sound && sound.play) {
        sound.currentTime = 0;
        sound.play().catch(e => console.log("Audio play deferred"));
    }
}

window.onload = initBoard;

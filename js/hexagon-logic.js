let currentTeam = null;
let scores = { teamA: 0, teamB: 0 };
let cellCounts = { teamA: 0, teamB: 0 };
let selectedCell = null;
let pendingCapture = false;
const gridSize = 25; // 5x5 grid

function selectTeam(teamName) {
    playSound('click');
    currentTeam = teamName;
    document.getElementById('card-teamA').className = 'team-card' + (teamName === 'teamA' ? ' team-active-a' : '');
    document.getElementById('card-teamB').className = 'team-card' + (teamName === 'teamB' ? ' team-active-b' : '');
    document.getElementById('question-box').innerText = `تم تفعيل دور ${teamName === 'teamA' ? 'الفريق أ' : 'الفريق ب'} جاهز لاحتلال خلية..`;
}

function clearTeamSelection() {
    currentTeam = null;
    document.getElementById('card-teamA').className = 'team-card';
    document.getElementById('card-teamB').className = 'team-card';
}

function startCapture() {
    if (!currentTeam) {
        alert("تنبيه: يرجى الضغط واختيار الفريق (أ) أو (ب) أولاً!");
        return;
    }
    if (pendingCapture) {
        alert("يرجى إكمال الاحتلال الحالي أولاً!");
        return;
    }
    
    playSound('click');
    document.getElementById('question-box').innerHTML = `🎯 اختر خلية من الشبكة لاحتلالها، ثم اضغط "تأكيد الاختيار"`;
    pendingCapture = true;
    document.getElementById('btn-capture').disabled = true;
    
    // Enable cell selection
    document.querySelectorAll('.hex-cell').forEach(cell => {
        if (!cell.classList.contains('team-a') && !cell.classList.contains('team-b')) {
            cell.style.cursor = 'pointer';
            cell.onclick = selectCell;
        }
    });
}

function selectCell(e) {
    if (!pendingCapture) return;
    
    // Clear previous selection
    document.querySelectorAll('.hex-cell').forEach(cell => {
        cell.classList.remove('selected');
    });
    
    selectedCell = e.currentTarget;
    selectedCell.classList.add('selected');
    
    document.getElementById('question-box').innerHTML = `🎯 تم اختيار الخلية ${selectedCell.dataset.number}<br><br>📢 المعلم: اسأل ${currentTeam === 'teamA' ? 'الفريق أ' : 'الفريق ب'} سؤالاً شفوياً الآن.<br><br>بعد الإجابة، اضغط على الزر المناسب أدناه:`;
    document.getElementById('action-btns').style.display = 'flex';
}

function verifyAnswer(isCorrect) {
    document.getElementById('action-btns').style.display = 'none';
    document.getElementById('btn-capture').disabled = false;
    
    // Disable cell selection
    document.querySelectorAll('.hex-cell').forEach(cell => {
        cell.style.cursor = 'default';
        cell.onclick = null;
    });
    
    if (isCorrect && selectedCell) {
        playSound('success');
        captureCell(selectedCell);
    } else {
        playSound('fail');
        document.getElementById('question-box').innerHTML = "❌ إجابة خاطئة. لم يتم احتلال الخلية. ينتقل الدور للفريق الآخر!";
        if (selectedCell) {
            selectedCell.classList.remove('selected');
        }
        clearTeamSelection();
    }
    
    selectedCell = null;
    pendingCapture = false;
}

function captureCell(cell) {
    const teamClass = currentTeam === 'teamA' ? 'team-a' : 'team-b';
    cell.classList.add(teamClass);
    cell.classList.remove('selected');
    
    cellCounts[currentTeam]++;
    scores[currentTeam] += 5;
    
    document.getElementById('scoreA').innerText = scores.teamA;
    document.getElementById('scoreB').innerText = scores.teamB;
    document.getElementById('cellsA').innerText = cellCounts.teamA;
    document.getElementById('cellsB').innerText = cellCounts.teamB;
    
    document.getElementById('question-box').innerHTML = `✨ تم احتلال الخلية ${cell.dataset.number} بنجاح! أضيفت 5 نقاط لحساب ${currentTeam === 'teamA' ? 'الفريق أ' : 'الفريق ب'}.`;
    
    // Check if game is over
    const totalCells = document.querySelectorAll('.hex-cell').length;
    if (cellCounts.teamA + cellCounts.teamB >= totalCells) {
        setTimeout(() => {
            const winner = scores.teamA > scores.teamB ? 'الفريق أ' : (scores.teamB > scores.teamA ? 'الفريق ب' : 'تعادل');
            alert(`🎉 انتهت اللعبة!\nالنتيجة النهائية:\nالفريق أ: ${scores.teamA} نقطة (${cellCounts.teamA} خلية)\nالفريق ب: ${scores.teamB} نقطة (${cellCounts.teamB} خلية)\nالفائز: ${winner}`);
            resetGame();
        }, 500);
    }
    
    clearTeamSelection();
}

function initHexGrid() {
    const grid = document.getElementById('hex-grid');
    grid.innerHTML = '';
    
    for (let i = 1; i <= gridSize; i++) {
        const cell = document.createElement('div');
        cell.classList.add('hex-cell');
        cell.dataset.number = i;
        cell.innerHTML = `<span class="hex-number">${i}</span>`;
        grid.appendChild(cell);
    }
}

function resetGame() {
    scores = { teamA: 0, teamB: 0 };
    cellCounts = { teamA: 0, teamB: 0 };
    selectedCell = null;
    pendingCapture = false;
    
    document.getElementById('scoreA').innerText = '0';
    document.getElementById('scoreB').innerText = '0';
    document.getElementById('cellsA').innerText = '0';
    document.getElementById('cellsB').innerText = '0';
    
    initHexGrid();
    clearTeamSelection();
}

function playSound(id) {
    const sound = document.getElementById('sound-' + id);
    if (sound && sound.play) {
        sound.currentTime = 0;
        sound.play().catch(e => console.log("Audio play deferred"));
    }
}

window.onload = initHexGrid;

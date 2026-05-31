let currentTeam = null;
let scores = { teamA: 0, teamB: 0 };
let ropePosition = 50; // 50% = middle
let pendingPull = false;

function selectTeam(teamName) {
    playSound('click');
    currentTeam = teamName;
    document.getElementById('card-teamA').className = 'team-card' + (teamName === 'teamA' ? ' team-active-a' : '');
    document.getElementById('card-teamB').className = 'team-card' + (teamName === 'teamB' ? ' team-active-b' : '');
    document.getElementById('question-box').innerText = `تم تفعيل دور ${teamName === 'teamA' ? 'الفريق أ' : 'الفريق ب'} جاهز لسحب الحبل..`;
}

function clearTeamSelection() {
    currentTeam = null;
    document.getElementById('card-teamA').className = 'team-card';
    document.getElementById('card-teamB').className = 'team-card';
}

function startPull() {
    if (!currentTeam) {
        alert("تنبيه: يرجى الضغط واختيار الفريق (أ) أو (ب) أولاً!");
        return;
    }
    if (pendingPull) {
        alert("يرجى إكمال السحب الحالي أولاً!");
        return;
    }
    
    playSound('click');
    document.getElementById('question-box').innerHTML = `💪 ${currentTeam === 'teamA' ? 'الفريق أ' : 'الفريق ب'} سيحاول سحب الحبل!<br><br>📢 المعلم: اسأل ${currentTeam === 'teamA' ? 'الفريق أ' : 'الفريق ب'} سؤالاً شفوياً الآن.<br><br>بعد الإجابة، اضغط على الزر المناسب أدناه:`;
    document.getElementById('action-btns').style.display = 'flex';
    document.getElementById('btn-pull').disabled = true;
    pendingPull = true;
}

function verifyAnswer(isCorrect) {
    document.getElementById('action-btns').style.display = 'none';
    document.getElementById('btn-pull').disabled = false;
    
    if (isCorrect) {
        playSound('success');
        pullRope();
    } else {
        playSound('fail');
        document.getElementById('question-box').innerHTML = "❌ إجابة خاطئة. لم يتم السحب. ينتقل الدور للفريق الآخر!";
        clearTeamSelection();
    }
    
    pendingPull = false;
}

function pullRope() {
    const pullStrength = Math.floor(Math.random() * 10) + 5; // 5-15% pull
    
    if (currentTeam === 'teamA') {
        ropePosition -= pullStrength;
        scores.teamA += pullStrength;
        document.getElementById('question-box').innerHTML = `✨ ${currentTeam === 'teamA' ? 'الفريق أ' : 'الفريق ب'} سحب الحبل بقوة ${pullStrength}%!`;
    } else {
        ropePosition += pullStrength;
        scores.teamB += pullStrength;
        document.getElementById('question-box').innerHTML = `✨ ${currentTeam === 'teamA' ? 'الفريق أ' : 'الفريق ب'} سحب الحبل بقوة ${pullStrength}%!`;
    }
    
    // Keep rope within bounds
    if (ropePosition < 0) ropePosition = 0;
    if (ropePosition > 100) ropePosition = 100;
    
    updateRopeDisplay();
    
    // Check for win
    if (ropePosition <= 0) {
        scores.teamA += 50;
        setTimeout(() => {
            alert(`🎉 فوز الفريق أ! سحب الحبل بالكامل إلى منطقته!\nالنتيجة النهائية:\nالفريق أ: ${scores.teamA} نقطة\nالفريق ب: ${scores.teamB} نقطة`);
            resetGame();
        }, 500);
    } else if (ropePosition >= 100) {
        scores.teamB += 50;
        setTimeout(() => {
            alert(`🎉 فوز الفريق ب! سحب الحبل بالكامل إلى منطقته!\nالنتيجة النهائية:\nالفريق أ: ${scores.teamA} نقطة\nالفريق ب: ${scores.teamB} نقطة`);
            resetGame();
        }, 500);
    }
    
    clearTeamSelection();
}

function updateRopeDisplay() {
    document.getElementById('scoreA').innerText = scores.teamA;
    document.getElementById('scoreB').innerText = scores.teamB;
    document.getElementById('powerA').innerText = (100 - ropePosition).toFixed(0);
    document.getElementById('powerB').innerText = ropePosition.toFixed(0);
    
    const marker = document.getElementById('rope-marker');
    marker.style.left = `${ropePosition}%`;
}

function resetGame() {
    ropePosition = 50;
    scores = { teamA: 0, teamB: 0 };
    document.getElementById('scoreA').innerText = '0';
    document.getElementById('scoreB').innerText = '0';
    document.getElementById('powerA').innerText = '50';
    document.getElementById('powerB').innerText = '50';
    updateRopeDisplay();
    clearTeamSelection();
}

function playSound(id) {
    const sound = document.getElementById('sound-' + id);
    if (sound && sound.play) {
        sound.currentTime = 0;
        sound.play().catch(e => console.log("Audio play deferred"));
    }
}

window.onload = updateRopeDisplay;

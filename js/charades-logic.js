const charadesWords = [
    "الأسد الملك", "تيتانيك", "هاري بوتر", "باربي", "سبايدر مان", 
    "الجاسوس الذي أحبني", "ماتريكس", "حرب النجوم", "آفاتار", 
    "فروتين", "الجميلة والوحش", "أليس في بلاد العجائب", "بياض الثلج والأقزام السبعة",
    "سندريلا", "الملك ليون", "شريك", "الرجل العنكبوت", "باتمان",
    "سوبرمان", "الرجل الحديدي", "ثور", "كابتن أمريكا", "هلك",
    "الرجل الأخضر", "فانتوم", "الشخصية الخيالية", "الساحر",
    "الطبيب", "المحقق", "الشرطي", "اللص", "الجاسوس",
    "الملك", "الملكة", "الأمير", "الأميرة", "الفارس",
    "التنين", "الوحش", "الروبوت", "الفضائي", "المصارع",
    "المغني", "الراقص", "اللاعب", "المدرب", "الحكم"
];

let currentTeam = null;
let scores = { teamA: 0, teamB: 0 };
let roundsWon = { teamA: 0, teamB: 0 };
let currentWord = null;
let usedWords = [];
let pendingAnswer = false;

function selectTeam(teamName) {
    playSound('click');
    currentTeam = teamName;
    document.getElementById('card-teamA').className = 'team-card' + (teamName === 'teamA' ? ' team-active-a' : '');
    document.getElementById('card-teamB').className = 'team-card' + (teamName === 'teamB' ? ' team-active-b' : '');
    document.getElementById('question-box').innerText = `تم تفعيل دور ${teamName === 'teamA' ? 'الفريق أ' : 'الفريق ب'} جاهز لكشف الكلمة..`;
}

function clearTeamSelection() {
    currentTeam = null;
    document.getElementById('card-teamA').className = 'team-card';
    document.getElementById('card-teamB').className = 'team-card';
}

function revealWord() {
    if (!currentTeam) {
        alert("تنبيه: يرجى الضغط واختيار الفريق (أ) أو (ب) أولاً!");
        return;
    }
    if (pendingAnswer) {
        alert("يرجى إكمال الجولة الحالية أولاً!");
        return;
    }
    
    playSound('click');
    
    // Select random word
    let availableWords = charadesWords.filter(word => !usedWords.includes(word));
    if (availableWords.length === 0) {
        usedWords = [];
        availableWords = charadesWords;
    }
    
    const randomIndex = Math.floor(Math.random() * availableWords.length);
    currentWord = availableWords[randomIndex];
    usedWords.push(currentWord);
    
    // Show word to teacher only
    document.getElementById('secret-word').innerText = currentWord;
    document.getElementById('secret-word').classList.add('revealed');
    
    document.getElementById('question-box').innerHTML = `🎭 ${currentTeam === 'teamA' ? 'الفريق أ' : 'الفريق ب'} يمثل الكلمة صامتاً!<br><br>الفريق الآخر يحاول تخمين الكلمة...`;
    
    document.getElementById('action-btns').style.display = 'flex';
    document.getElementById('btn-reveal').disabled = true;
    pendingAnswer = true;
}

function verifyAnswer(isCorrect) {
    document.getElementById('action-btns').style.display = 'none';
    document.getElementById('btn-reveal').disabled = false;
    
    if (isCorrect) {
        playSound('success');
        scores[currentTeam] += 10;
        roundsWon[currentTeam]++;
        document.getElementById('scoreA').innerText = scores.teamA;
        document.getElementById('scoreB').innerText = scores.teamB;
        document.getElementById('roundsA').innerText = roundsWon.teamA;
        document.getElementById('roundsB').innerText = roundsWon.teamB;
        document.getElementById('question-box').innerHTML = `✨ إجابة صحيحة! الكلمة كانت: "${currentWord}"<br>أضيفت 10 نقاط لحساب ${currentTeam === 'teamA' ? 'الفريق أ' : 'الفريق ب'}.`;
    } else {
        playSound('fail');
        document.getElementById('question-box').innerHTML = `❌ إجابة خاطئة. الكلمة كانت: "${currentWord}"<br>لم تحصل على نقاط. ينتقل الدور للفريق الآخر!`;
    }
    
    // Hide the word
    document.getElementById('secret-word').innerText = 'اضغط لكشف الكلمة';
    document.getElementById('secret-word').classList.remove('revealed');
    
    clearTeamSelection();
    pendingAnswer = false;
    currentWord = null;
}

function skipWord() {
    document.getElementById('action-btns').style.display = 'none';
    document.getElementById('btn-reveal').disabled = false;
    
    playSound('click');
    document.getElementById('question-box').innerHTML = `⏭️ تم تخطي الكلمة: "${currentWord}"<br>يمكنك اختيار كلمة جديدة.`;
    
    // Remove from used words so it can be selected again
    const index = usedWords.indexOf(currentWord);
    if (index > -1) {
        usedWords.splice(index, 1);
    }
    
    // Hide the word
    document.getElementById('secret-word').innerText = 'اضغط لكشف الكلمة';
    document.getElementById('secret-word').classList.remove('revealed');
    
    pendingAnswer = false;
    currentWord = null;
}

function playSound(id) {
    const sound = document.getElementById('sound-' + id);
    if (sound && sound.play) {
        sound.currentTime = 0;
        sound.play().catch(e => console.log("Audio play deferred"));
    }
}

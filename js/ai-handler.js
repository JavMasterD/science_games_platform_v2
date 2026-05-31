const allKivyAnimals = [
    'alligator', 'ant', 'bat', 'bear', 'bee', 'bird', 'bull', 'butterfly', 'cat',
    'chicken', 'cow', 'crab', 'crocodile', 'deer', 'dog', 'donkey', 'duck', 'eagle',
    'elephant', 'fish', 'fox', 'frog', 'giraffe', 'gorilla', 'hippo', 'horse', 'insect',
    'lion', 'monkey', 'moose', 'mouse', 'owl', 'panda', 'penguin', 'pig', 'rabbit',
    'rhino', 'rooster', 'shark', 'sheep', 'snake', 'tiger', 'turkey', 'turtle', 'wolf'
];

function startTeacherQuestion() {
    if (!currentTeam) {
        alert("تنبيه: يرجى الضغط واختيار الفريق (أ) أو (ب) أولاً لتسجيل النقاط له!");
        return;
    }
    playSound('click');
    const qBox = document.getElementById('question-box');
    qBox.innerHTML = `📢 المعلم: اسأل ${currentTeam === 'teamA' ? 'الفريق أ' : 'الفريق ب'} سؤالاً شفوياً الآن.<br><br>بعد الإجابة، اضغط على الزر المناسب أدناه:`;
    document.getElementById('action-btns').style.display = 'flex';
    document.getElementById('btn-ai').disabled = true;
}

function verifyAnswer(isCorrect) {
    document.getElementById('action-btns').style.display = 'none';
    document.getElementById('btn-ai').disabled = false;
    if (isCorrect) {
        playSound('success');
        document.getElementById('question-box').innerHTML = "✨ إجابة رائعة وصحيحة! تَم فتح لوحة الذاكرة الآن.. اسحب كارتين ومطابقتهما كخطوة لفريقك الحالي!";
        document.getElementById('game-grid').classList.remove('container-disabled');
    } else {
        playSound('fail');
        document.getElementById('question-box').innerHTML = "❌ إجابة خاطئة أو انتهى الوقت. ينتقل الدور تلقائياً للفريق الآخر!";
        lockGrid();
        clearTeamSelection();
    }
}

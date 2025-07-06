// 質數學習遊戲 JavaScript 邏輯

class PrimeNumberGame {
    constructor() {
        this.selectedNumbers = new Set();
        this.isDragging = false;
        this.dragStartElement = null;
        this.primeNumbers = this.generatePrimeNumbers(100);
        this.maxNumber = 100;
        
        this.init();
    }

    // 初始化遊戲
    init() {
        this.createNumberGrid();
        this.bindEvents();
        this.updateStats();
    }

    // 生成1到n的質數列表
    generatePrimeNumbers(n) {
        const primes = [];
        const isPrime = new Array(n + 1).fill(true);
        isPrime[0] = isPrime[1] = false;

        for (let i = 2; i <= Math.sqrt(n); i++) {
            if (isPrime[i]) {
                for (let j = i * i; j <= n; j += i) {
                    isPrime[j] = false;
                }
            }
        }

        for (let i = 2; i <= n; i++) {
            if (isPrime[i]) {
                primes.push(i);
            }
        }

        return primes;
    }

    // 創建數字表格
    createNumberGrid() {
        const grid = document.getElementById('numberGrid');
        grid.innerHTML = '';

        for (let i = 1; i <= this.maxNumber; i++) {
            const numberItem = document.createElement('div');
            numberItem.className = 'number-item';
            numberItem.textContent = i;
            numberItem.dataset.number = i;
            // 不標示質數顏色，初始全部白色
            grid.appendChild(numberItem);
        }
    }

    // 綁定事件
    bindEvents() {
        const grid = document.getElementById('numberGrid');
        const checkBtn = document.getElementById('checkBtn');
        const resetBtn = document.getElementById('resetBtn');

        // 滑鼠事件
        grid.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        grid.addEventListener('mouseover', (e) => this.handleMouseOver(e));
        document.addEventListener('mouseup', () => this.handleMouseUp());

        // 觸控事件
        grid.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: false });
        grid.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
        grid.addEventListener('touchend', () => this.handleTouchEnd());

        // 點擊事件（單個數字選擇）
        grid.addEventListener('click', (e) => {
            if (e.target.classList.contains('number-item')) {
                // 僅當未拖曳時才切換選擇
                if (!this.isDragging) {
                    this.toggleNumber(e.target);
                }
            }
        });

        // 按鈕事件
        checkBtn.addEventListener('click', () => this.checkAnswer());
        resetBtn.addEventListener('click', () => this.resetGame());

        // 防止拖拽時選中文字
        grid.addEventListener('selectstart', (e) => e.preventDefault());
        grid.addEventListener('dragstart', (e) => e.preventDefault());
    }

    // 滑鼠按下
    handleMouseDown(e) {
        if (e.target.classList.contains('number-item')) {
            this.isDragging = true;
            this.dragStartElement = e.target;
        }
    }

    // 滑鼠移動
    handleMouseOver(e) {
        if (this.isDragging && e.target.classList.contains('number-item')) {
            this.toggleNumber(e.target);
        }
    }

    // 滑鼠釋放
    handleMouseUp() {
        this.isDragging = false;
        this.dragStartElement = null;
    }

    // 觸控開始
    handleTouchStart(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const element = document.elementFromPoint(touch.clientX, touch.clientY);
        
        if (element && element.classList.contains('number-item')) {
            this.isDragging = true;
            this.dragStartElement = element;
            this.toggleNumber(element);
        }
    }

    // 觸控移動
    handleTouchMove(e) {
        e.preventDefault();
        if (!this.isDragging) return;

        const touch = e.touches[0];
        const element = document.elementFromPoint(touch.clientX, touch.clientY);
        
        if (element && element.classList.contains('number-item')) {
            this.toggleNumber(element);
        }
    }

    // 觸控結束
    handleTouchEnd() {
        this.isDragging = false;
        this.dragStartElement = null;
    }

    // 切換數字選擇狀態
    toggleNumber(element) {
        const number = parseInt(element.dataset.number);
        
        if (this.selectedNumbers.has(number)) {
            this.selectedNumbers.delete(number);
            element.classList.remove('selected');
        } else {
            this.selectedNumbers.add(number);
            element.classList.add('selected');
        }

        this.updateStats();
    }

    // 更新統計資訊
    updateStats() {
        const selectedCount = document.getElementById('selectedCount');
        const primeCount = document.getElementById('primeCount');
        
        selectedCount.textContent = this.selectedNumbers.size;
        primeCount.textContent = this.primeNumbers.length;
    }

    // 檢查答案
    checkAnswer() {
        const resultArea = document.getElementById('resultArea');
        const scoreValue = document.getElementById('scoreValue');
        const feedback = document.getElementById('feedback');
        const numberItems = document.querySelectorAll('.number-item');

        // 先移除所有標示
        numberItems.forEach(item => {
            item.classList.remove('green-miss', 'red-wrong', 'selected', 'correct', 'incorrect');
        });

        let correctSelections = 0;
        let missedPrimes = 0;
        let wrongSelections = 0;

        // 標示所有格子
        for (let i = 1; i <= this.maxNumber; i++) {
            const item = document.querySelector(`.number-item[data-number='${i}']`);
            const isPrime = this.primeNumbers.includes(i);
            const isSelected = this.selectedNumbers.has(i);
            if (isPrime && isSelected) {
                // 多選（質數被選）
                item.classList.add('red-wrong');
                wrongSelections++;
            } else if (isPrime && !isSelected) {
                // 應選未選（質數未選）
                item.classList.add('green-miss');
                missedPrimes++;
            } else if (!isPrime && isSelected) {
                // 非質數選中
                item.classList.add('selected');
                correctSelections++;
            }
            // 非質數未選不標示
        }

        // 計算分數
        const totalPrimes = this.primeNumbers.length;
        const totalNonPrimes = this.maxNumber - totalPrimes;
        const totalCorrect = correctSelections;
        const accuracy = Math.round((totalCorrect / totalNonPrimes) * 100);

        // 顯示結果
        scoreValue.textContent = `${accuracy}%`;
        let msg = '';
        if (accuracy === 100 && missedPrimes === 0 && wrongSelections === 0) {
            msg = '🎉 太棒了！你完全正確！';
            feedback.className = 'feedback success';
        } else {
            msg = `正確率 ${accuracy}%。`;
            if (missedPrimes > 0) msg += ` 應該沒選的質數有 ${missedPrimes} 個。`;
            if (wrongSelections > 0) msg += ` 被多選的質數有 ${wrongSelections} 個。`;
            feedback.className = 'feedback error';
        }
        feedback.textContent = msg;
        resultArea.style.display = 'block';
        resultArea.scrollIntoView({ behavior: 'smooth' });
    }

    // 重置遊戲
    resetGame() {
        this.selectedNumbers.clear();
        // 清除所有選擇狀態與所有標示
        const numberItems = document.querySelectorAll('.number-item');
        numberItems.forEach(item => {
            item.classList.remove('selected', 'green-miss', 'red-wrong', 'correct', 'incorrect');
        });
        // 隱藏結果區域
        const resultArea = document.getElementById('resultArea');
        resultArea.style.display = 'none';
        // 更新統計
        this.updateStats();
    }

    // 獲取質數列表（用於調試）
    getPrimeNumbers() {
        return this.primeNumbers;
    }
}

// 頁面載入完成後初始化遊戲
document.addEventListener('DOMContentLoaded', () => {
    const game = new PrimeNumberGame();
    
    // 將遊戲實例掛載到全域，方便調試
    window.primeGame = game;
    
    // 添加鍵盤快捷鍵
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            game.checkAnswer();
        } else if (e.key === 'Escape') {
            game.resetGame();
        }
    });
});

// 防止右鍵選單
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

// 防止雙擊選中文字
document.addEventListener('dblclick', (e) => {
    e.preventDefault();
}); 
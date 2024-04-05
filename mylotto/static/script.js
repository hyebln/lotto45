document.addEventListener('DOMContentLoaded', function() {
    const now = new Date().getTime();
    let lastClickTime = localStorage.getItem('lastClickTime');
    lastClickTime = lastClickTime ? parseInt(lastClickTime, 10) : now;
    localStorage.setItem('lastClickTime', now.toString());

    if (now - lastClickTime >= 24 * 60 * 60 * 1000) {
        localStorage.setItem('generateButtonClickCount', '0');
        localStorage.setItem('randomGenerateButtonClickCount', '0');
    }
    
    let generateButtonClickCount = parseInt(localStorage.getItem('generateButtonClickCount') || '0', 10);
    let randomGenerateButtonClickCount = parseInt(localStorage.getItem('randomGenerateButtonClickCount') || '0', 10);

    document.querySelectorAll('.input-group input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const selectElement = this.parentNode.querySelector('select');
            if (selectElement) {
                selectElement.disabled = !this.checked;
            }
        });
    });

    document.getElementById('oddEvenCheck').addEventListener('change', function() {
        document.getElementById('oddCount').disabled = !this.checked;
    });

    document.getElementById('generateButton').addEventListener('click', function() {
        document.getElementById('numbersDisplay').innerHTML = '';
        document.getElementById('loading').style.display = 'block';

        const excludeWinning = document.getElementById("excludeWinningNumbersCheck").checked;
        const excludeThree = document.getElementById("excludeThreeNumbersCheck").checked;    
        const includeOdd = document.getElementById('oddEvenCheck').checked; 
        const includePrime = document.getElementById('primeCheck').checked;
        const includeSmallGroup = document.getElementById('smallGroupCheck').checked;
        const includeConsecutive = document.getElementById('consecutiveCheck').checked;

        let oddCnt;
        let primeCnt;
        let smallCnt;
        let consqCnt;
        
        if (includeOdd) {
            oddCnt = parseInt(document.getElementById('oddCount').value, 10);
        } else {
            oddCnt = -1;
        }

        if (includePrime) {
            primeCnt = parseInt(document.getElementById('primeCount').value, 10)
        } else {
            primeCnt = -1;
        }

        if (includeSmallGroup) {
            smallCnt = parseInt(document.getElementById('smallGroupCount').value, 10)
        } else {
            smallCnt = -1;
        }

        if (includeConsecutive) {
            consqCnt = parseInt(document.getElementById('consecutiveCount').value, 10)
        } else {
            consqCnt = -1;
        }

        if (generateButtonClickCount < 5) {
            $.ajax({
                url: '/get-lotto-data/',
                type: 'GET',
                data: {
                    'include_num': JSON.stringify(includeNumbers),
                    'exclude_win': excludeWinning,
                    'exclude_three': excludeThree,
                    'odd_cnt': oddCnt,
                    'prime_cnt': primeCnt,
                    'small_cnt': smallCnt,
                    'consq_cnt': consqCnt
                },
                dataType:'json',
                success: function(data) {
                    document.getElementById('loading').style.display = 'none';
                    const numbers = JSON.parse(data.number);
                    console.log(numbers);
                    displayLottoNumbers(numbers, 'numbersDisplay');
                    generateButtonClickCount++;
                    localStorage.setItem('generateButtonClickCount', generateButtonClickCount.toString());
                }})
        } else {
            document.getElementById('loading').style.display = 'none';
            alert("최대 5회까지만 가능합니다.");
        }
    });

    document.getElementById('randomGenerateButton').addEventListener('click', function() {
        if (randomGenerateButtonClickCount < 5) {
            const numbers = generateRandomLottoNumbers();
            displayLottoNumbers(numbers, 'randomNumbersDisplay');
            randomGenerateButtonClickCount++;
            localStorage.setItem('randomGenerateButtonClickCount', randomGenerateButtonClickCount.toString());
        } else {
            alert("최대 5회까지만 가능합니다.");
        }
    });
});

let includeNumbers = [];

function generateRandomLottoNumbers() {
    let numbers = [];
    while (numbers.length < 6) {
        const randomNumber = Math.floor(Math.random() * 45) + 1;
        if (!numbers.includes(randomNumber)) {
            numbers.push(randomNumber);
        }
    }
    return numbers.sort((a, b) => a - b);
}

function selLotto(number) {
    var element = document.getElementById("sel_" + number);
    var clickElements = document.querySelectorAll('.click');

    if (element.classList.contains("click")) {
        element.classList.remove("click");
        includeNumbers = includeNumbers.filter(n => n !== number);
    } else if (clickElements.length < 3) {
        element.classList.add("click");
        includeNumbers.push(parseInt(number, 10));
    } else {
        alert("최대 3개까지만 선택할 수 있습니다.");
    }
}

function displayLottoNumbers(numbers, displayAreaId) {
    const displayArea = document.getElementById(displayAreaId);
    displayArea.innerHTML = '';
    
    console.debug(numbers)
    console.log(typeof numbers)

    if (Object.keys(numbers).length === 0) {
        console.debug("충돌")
        displayArea.textContent = '조건이 충돌합니다.';
        return;
    }

    numbers.forEach(number => {
        const ball = document.createElement('span');
        ball.textContent = number;
        ball.className = `lotto-ball ${getBallColor(number)}`;
        displayArea.appendChild(ball);
    });

}

function getBallColor(number) {
    if (number <= 10) return 'num1-10';
    else if (number <= 20) return 'num11-20';
    else if (number <= 30) return 'num21-30';
    else if (number <= 40) return 'num31-40';
    else return 'num41-45';
}

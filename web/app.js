// 요소 선택 및 초기 스타일 계산
let Banner = document.getElementById('Banner');
let Chanel = document.getElementById('Channel');
let bb = document.getElementsByClassName("BB");
let cb = document.getElementsByClassName("CB");

// 초기 스타일 값 계산
let BStyle = window.getComputedStyle(Banner);
let BLeftValue = parseFloat(BStyle.getPropertyValue('left'));

let BCounter = 1

// 요소 스타일 변경을 위한 공통 함수
function updateElementStyle(elements, index, property, value, defaultValue) {
    Array.from(elements).forEach((element, i) => {
        element.style[property] = (i === index) ? value : defaultValue;
    });
}

// 요소 위치 업데이트 함수
function updatePosition(element, position, value) {
    if (position === 'left') {
        element.style.right = '';
        element.style.left = value;
    } else {
        element.style.left = '';
        element.style.right = value;
    }
}

// 배너 위치 업데이트 함수
function bs(num) {
    updateElementStyle(bb, 3 - num, 'background', '#FFFFFF', 'rgba(255, 255, 255, 0.3)');
    let value = BLeftValue + (1344 * (num - 2));
    Banner.style.left = `${value}px`;
}

// 채널 위치 업데이트 함수
function cs(num) {
    updateElementStyle(cb, num - 1, 'background', '#FFFFFF', 'rgba(255, 255, 255, 0.3)');
    updatePosition(Chanel, (num === 1) ? 'left' : 'right', '48px');
}

// CSS 전환 추가 (부드러운 이동 효과)
Banner.style.transition = 'left 0.5s';
Chanel.style.transition = 'left 0.5s, right 0.5s';

// 카운터 업데이트 함수 (현재 빈 상태)
function updateCounter() {
    bs(BCounter--)
    if (!BCounter) {
        BCounter = 3
    }
}

// 주기적인 카운터 업데이트 설정
setInterval(updateCounter, 7000);

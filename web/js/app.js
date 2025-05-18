// 요소 선택 및 초기 스타일 계산
let Banner = document.getElementById('Banner');
let Chanel = document.getElementById('Channel');
let bb = document.getElementsByClassName("BB");
let cb = document.getElementsByClassName("CB");

// 초기 스타일 값 계산
let BStyle = window.getComputedStyle(Banner);
let BLeftValue = parseFloat(BStyle.getPropertyValue('left'));
let BannerList = document.getElementById('BannerList');
let BCounter = 1
const scrollAmount = document.getElementById('Channel').offsetWidth;

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
    BannerList.style.left = `${value}px`;
}

// 채널 위치 업데이트 함수
function cs(num) {
    // 버튼 인디케이터 스타일 변경
    updateElementStyle(cb, num - 1, 'background', '#FFFFFF', 'rgba(255, 255, 255, 0.3)');

    // 스크롤 이동 대상
    const channelEl = document.getElementById('Channel');

    // 채널 1페이지의 너비만큼 스크롤 이동
    const scrollAmount = channelEl.offsetWidth;

    // 부드러운 스크롤 적용
    channelEl.scrollTo({
        left: (num === 1) ? 0 : scrollAmount,
        behavior: 'smooth' // ← 부드럽게 이동!
    });
}

// CSS 전환 추가 (부드러운 이동 효과)
BannerList.style.transition = 'left 0.5s';
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

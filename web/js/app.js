// 요소 선택 및 초기 설정
let Banner = document.getElementById('Banner');
let BannerList = document.getElementById('BannerList');
let bb = document.getElementsByClassName("BB");

// 배너 관련 설정 - 첫 번째 배너부터 시작
let BCounter = 1; 

// 요소 스타일 변경을 위한 공통 함수
function updateElementStyle(elements, index, property, value, defaultValue) {
    Array.from(elements).forEach((element, i) => {
        element.style[property] = (i === index) ? value : defaultValue;
    });
}

// 배너 요소들의 실제 스타일 정보 확인
function debugBannerStyles() {
    console.log('=== 배너 디버깅 정보 ===');

    if (Banner) {
        const bannerStyle = window.getComputedStyle(Banner);
        console.log(`Banner 컨테이너 - 높이: ${bannerStyle.height}, 너비: ${bannerStyle.width}, 표시: ${bannerStyle.display}`);
        console.log(`Banner 위치 - left: ${bannerStyle.left}, top: ${bannerStyle.top}`);
    }

    if (BannerList) {
        const listStyle = window.getComputedStyle(BannerList);
        console.log(`BannerList - 높이: ${listStyle.height}, 너비: ${listStyle.width}`);
        console.log(`BannerList 위치 - left: ${listStyle.left}, position: ${listStyle.position}`);
    }

    const banners = document.querySelectorAll('.banner');
    banners.forEach((banner, index) => {
        const style = window.getComputedStyle(banner);
        console.log(`배너 ${index + 1} - 높이: ${style.height}, 너비: ${style.width}, 표시: ${style.display}`);

        const img = banner.querySelector('img');
        if (img) {
            const imgStyle = window.getComputedStyle(img);
            console.log(`이미지 ${index + 1} - 높이: ${imgStyle.height}, 너비: ${imgStyle.width}, 표시: ${imgStyle.display}`);
        }
    });
}

// 배너 위치 업데이트 함수
function bs(num) {
    console.log('배너 전환:', num);

    // 버튼 인디케이터 업데이트 
    // HTML 버튼 순서: [bs(3), bs(2), bs(1)] -> 인덱스 [0, 1, 2]
    // num=1 -> 인덱스 2 (세 번째 버튼: bs(1))
    // num=2 -> 인덱스 1 (두 번째 버튼: bs(2)) 
    // num=3 -> 인덱스 0 (첫 번째 버튼: bs(3))
    let buttonIndex;
    if (num === 1) buttonIndex = 0;      // 첫 번째 배너 -> 세 번째 버튼
    else if (num === 2) buttonIndex = 1;  // 두 번째 배너 -> 두 번째 버튼
    else if (num === 3) buttonIndex = 2;  // 세 번째 배너 -> 첫 번째 버튼

    updateElementStyle(bb, buttonIndex, 'background', '#FFFFFF', 'rgba(255, 255, 255, 0.3)');

    // 배너 위치 계산 (왼쪽에서 오른쪽으로 순서대로)
    // num=1: 0px (첫 번째 배너 - 전공의)
    // num=2: -1344px (두 번째 배너 - 금주) 
    // num=3: -2688px (세 번째 배너 - 미사)
    let value = -1344 * (num - 2);
    BannerList.style.left = `${value}px`;

    console.log(`배너 ${num} 표시, 위치: ${value}px, 활성 버튼: ${buttonIndex}`);

    // 스타일 디버깅 정보 출력
    setTimeout(debugBannerStyles, 100); // 스타일 적용 후 확인
}

// 채널 위치 업데이트 함수 (Channel 요소가 있는 경우에만)
function cs(num) {
    let cb = document.getElementsByClassName("CB");
    if (cb.length > 0) {
        // 버튼 인디케이터 스타일 변경
        updateElementStyle(cb, num - 1, 'background', '#FFFFFF', 'rgba(255, 255, 255, 0.3)');

        // 스크롤 이동 대상
        const channelEl = document.getElementById('Channel');
        if (channelEl) {
            // 채널 1페이지의 너비만큼 스크롤 이동
            const scrollAmount = channelEl.offsetWidth;

            // 부드러운 스크롤 적용
            channelEl.scrollTo({
                left: (num === 1) ? 0 : scrollAmount,
                behavior: 'smooth'
            });
        }
    }
}

// CSS 전환 효과 추가
if (BannerList) {
    BannerList.style.transition = 'left 0.5s ease-in-out';
    console.log('배너 전환 효과 설정 완료');
}

// 이미지 로드 상태 확인
function checkImages() {
    const bannerImages = document.querySelectorAll('.banner img');
    console.log(`총 ${bannerImages.length}개의 배너 이미지 발견`);

    bannerImages.forEach((img, index) => {
        if (img.complete) {
            console.log(`이미지 ${index + 1} 로드 완료: ${img.src}`);
        } else {
            console.log(`이미지 ${index + 1} 로드 중: ${img.src}`);
            img.onload = () => console.log(`이미지 ${index + 1} 로드 완료`);
            img.onerror = () => console.log(`이미지 ${index + 1} 로드 실패`);
        }
    });
}

// 초기 배너 설정
bs(BCounter);

// 자동 배너 전환 함수
function autoSlide() {
    BCounter++; // 카운터 증가
    if (BCounter > 3) { // 3을 넘으면 1로 초기화
        BCounter = 1;
    }
    bs(BCounter); // 배너 전환
    console.log('자동 전환:', BCounter);
}

// 페이지 로드 후 자동 전환 시작
window.addEventListener('load', function () {
    console.log('자동 배너 전환 시작');
    checkImages(); // 이미지 로드 상태 확인
    debugBannerStyles(); // 초기 스타일 상태 확인
    // 2초마다 자동 전환
    setInterval(autoSlide, 7000);
});

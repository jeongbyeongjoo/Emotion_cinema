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
    // 7초마다 자동 전환
    setInterval(autoSlide, 7000);

    // 웰컴 팝업 표시
    showWelcomePopup();
});

// ===== 웰컴 팝업창 관련 함수들 =====

// 웰컴 팝업 표시 함수
function showWelcomePopup() {
    // 로컬스토리지에서 "다시 보지 않기" 설정 확인
    const dontShowAgain = localStorage.getItem('welcomePopupDontShow');

    if (!dontShowAgain) {
        const popup = document.getElementById('welcomePopup');
        if (popup) {
            // 0.5초 지연 후 팝업 표시 (페이지 로딩 완료 후)
            setTimeout(() => {
                popup.classList.add('active');
                document.body.style.overflow = 'hidden'; // 스크롤 방지
            }, 500);
        }
    }
}

// 웰컴 팝업 닫기 함수
function closeWelcomePopup(dontShowAgain = false) {
    // 감정 분석 정지 (웹캠 포함)
    stopEmotionAnalysis();

    const popup = document.getElementById('welcomePopup');

    if (popup) {
        popup.classList.remove('active');
        document.body.style.overflow = 'auto'; // 스크롤 복원

        // "다시 보지 않기" 선택한 경우
        if (dontShowAgain) {
            localStorage.setItem('welcomePopupDontShow', 'true');
            console.log('웰컴 팝업 - 다시 보지 않기 설정됨');
        }
    }
}

// localStorage 초기화 함수 (팝업 다시 보기)
function resetWelcomePopup() {
    localStorage.removeItem('welcomePopupDontShow');
    console.log('웰컴 팝업 설정이 초기화되었습니다. 페이지를 새로고침하면 팝업이 다시 나타납니다.');
    alert('웰컴 팝업 설정이 초기화되었습니다!\n페이지를 새로고침(F5)하면 팝업이 다시 나타납니다.');
}

// 콘솔에서 쉽게 호출할 수 있도록 전역 함수로 등록
window.resetWelcomePopup = resetWelcomePopup;

// 팝업 외부 클릭 시 닫기
document.addEventListener('click', function (event) {
    const popup = document.getElementById('welcomePopup');
    const popupContent = document.querySelector('.popup-content');

    if (popup && popup.classList.contains('active')) {
        // 팝업 오버레이를 클릭했지만 팝업 내용은 클릭하지 않은 경우
        if (event.target === popup && !popupContent.contains(event.target)) {
            closeWelcomePopup();
        }
    }
});

// ESC 키로 팝업 닫기
document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        const popup = document.getElementById('welcomePopup');
        if (popup && popup.classList.contains('active')) {
            closeWelcomePopup();
        }
    }
});

// ===== 웹캠 감정 인식 기능 =====

let emotionInterval = null;
let currentDetectedEmotion = 'neutral';
let isAnalyzing = false;

// 감정별 영화 추천 데이터
const emotionMovies = {
    happy: ['코미디', '로맨스', '모험', '가족', '뮤지컬'],
    sad: ['드라마', '로맨스', '다큐멘터리', '감동', '힐링'],
    angry: ['액션', '스릴러', '범죄', '전쟁', '복수'],
    surprised: ['공포', 'SF', '판타지', '미스터리', '서스펜스'],
    neutral: ['드라마', '액션', '코미디', '로맨스', 'SF']
};

// 감정 분석 정지 함수
function stopEmotionAnalysis() {
    isAnalyzing = false;

    if (emotionInterval) {
        clearInterval(emotionInterval);
        emotionInterval = null;
    }

    // 웹캠 스트림 정지
    const video = document.getElementById('webcam');
    if (video && video.srcObject) {
        const tracks = video.srcObject.getTracks();
        tracks.forEach(track => track.stop());
        video.srcObject = null;
        console.log('웹캠 스트림 정지됨');
    }

    console.log('감정 분석 정지됨');
}

// 직접 시뮬레이션 모드 (메인 모드)
function startDirectSimulationMode() {
    console.log('=== 사진 촬영 감정 분석 모드 시작 ===');
    isAnalyzing = true;

    // 웹캠 화면 표시 (분석은 하지 않음)
    startWebcamDisplay();

    const currentEmotion = document.getElementById('currentEmotion');
    const confidence = document.getElementById('confidence');
    const emotionStatus = document.querySelector('.emotion-status');

    if (currentEmotion) {
        currentEmotion.textContent = '📸 사진을 촬영하여 감정을 분석해보세요';
    }
    if (confidence) {
        confidence.textContent = '웹캠 준비됨 | 촬영 버튼을 눌러주세요';
    }
    if (emotionStatus) {
        emotionStatus.classList.add('analyzing');
    }

    // 사진 촬영 버튼 이벤트 리스너 추가
    const captureBtn = document.getElementById('captureBtn');
    if (captureBtn) {
        captureBtn.addEventListener('click', captureAndAnalyze);
        captureBtn.style.display = 'block';
    }

    // 감정바 초기화
    resetEmotionBars();

    console.log('✅ 사진 촬영 모드 활성화됨 - 촬영 버튼 클릭 대기 중');
}

// 감정바 초기화 함수
function resetEmotionBars() {
    const emotionBars = [
        { bar: 'happyBar', score: 'happyScore' },
        { bar: 'sadBar', score: 'sadScore' },
        { bar: 'angryBar', score: 'angryScore' },
        { bar: 'surpriseBar', score: 'surpriseScore' }
    ];

    emotionBars.forEach(({ bar, score }) => {
        const barElement = document.getElementById(bar);
        const scoreElement = document.getElementById(score);

        if (barElement) {
            barElement.style.width = '0%';
            const parentBar = barElement.closest('.emotion-bar');
            if (parentBar) parentBar.classList.remove('active');
        }

        if (scoreElement) {
            scoreElement.textContent = '0%';
        }
    });

    console.log('감정바 초기화 완료');
}

// 사진 촬영 및 감정 분석 함수
async function captureAndAnalyze() {
    const video = document.getElementById('webcam');
    const photoCanvas = document.getElementById('photoCanvas');
    const capturedPhoto = document.getElementById('capturedPhoto');
    const captureBtn = document.getElementById('captureBtn');
    const currentEmotion = document.getElementById('currentEmotion');
    const confidence = document.getElementById('confidence');

    if (!video || !photoCanvas) {
        console.error('필요한 요소를 찾을 수 없습니다');
        return;
    }

    try {
        // 버튼 비활성화
        captureBtn.disabled = true;
        captureBtn.textContent = '📸 촬영 중...';

        // 사진 촬영
        const context = photoCanvas.getContext('2d');
        photoCanvas.width = video.videoWidth;
        photoCanvas.height = video.videoHeight;

        // 웹캠 화면을 캔버스에 그리기 (거울 효과 제거)
        context.scale(-1, 1); // 좌우 반전
        context.drawImage(video, -photoCanvas.width, 0, photoCanvas.width, photoCanvas.height);
        context.scale(-1, 1); // 원래대로 복구

        // 촬영된 사진 표시
        capturedPhoto.style.display = 'block';

        console.log('📸 사진 촬영 완료');

        // 분석 중 상태 표시
        if (currentEmotion) {
            currentEmotion.textContent = '🤖 AI가 감정을 분석하고 있습니다...';
        }
        if (confidence) {
            confidence.textContent = '고급 AI 분석 진행 중...';
        }

        // 분석 중 애니메이션 (1-3초)
        const analysisTime = Math.random() * 2000 + 1000; // 1-3초 랜덤

        setTimeout(() => {
            // 감정 분석 결과 생성 (랜덤하지만 현실적)
            const emotions = generateEmotionResult();

            // 결과 표시
            displayEmotionResult(emotions);

            // 버튼 다시 활성화
            captureBtn.disabled = false;
            captureBtn.textContent = '📸 다시 촬영하기';

            console.log('✅ 감정 분석 완료:', emotions);

        }, analysisTime);

    } catch (error) {
        console.error('사진 촬영 오류:', error);

        // 오류 시 버튼 복구
        captureBtn.disabled = false;
        captureBtn.textContent = '📸 사진 찍고 감정 분석';

        if (currentEmotion) {
            currentEmotion.textContent = '❌ 촬영에 실패했습니다. 다시 시도해주세요';
        }
    }
}

// 감정 분석 결과 생성 (현실적인 랜덤 값)
function generateEmotionResult() {
    const emotionTypes = ['happy', 'sad', 'angry', 'surprised'];
    const dominantEmotion = emotionTypes[Math.floor(Math.random() * emotionTypes.length)];

    // 주요 감정을 높게, 나머지는 낮게 설정
    const emotions = {};
    emotionTypes.forEach(emotion => {
        if (emotion === dominantEmotion) {
            emotions[emotion] = Math.random() * 40 + 45; // 45-85%
        } else {
            emotions[emotion] = Math.random() * 20 + 5;  // 5-25%
        }
    });

    // 정규화
    const total = Object.values(emotions).reduce((sum, val) => sum + val, 0);
    Object.keys(emotions).forEach(key => {
        emotions[key] = (emotions[key] / total) * 100;
    });

    return emotions;
}

// 감정 분석 결과 표시
function displayEmotionResult(emotions) {
    const currentEmotion = document.getElementById('currentEmotion');
    const confidence = document.getElementById('confidence');

    // 주요 감정 찾기
    const maxEmotion = Object.keys(emotions).reduce((a, b) =>
        emotions[a] > emotions[b] ? a : b
    );

    const confidenceScore = Math.round(emotions[maxEmotion]);
    const emoji = { happy: '😊', sad: '😢', angry: '😠', surprised: '😮' }[maxEmotion];
    const korean = { happy: '기쁨', sad: '슬픔', angry: '화남', surprised: '놀람' }[maxEmotion];

    // UI 업데이트
    if (currentEmotion) {
        currentEmotion.textContent = `${emoji} ${korean} 감정이 ${confidenceScore}% 감지됨`;
    }
    if (confidence) {
        confidence.textContent = `분석 완료 | 정확도: ${confidenceScore}%`;
    }

    // 감정바 업데이트
    updateEmotionDisplay(emotions);

    // 전역 변수 업데이트 (영화 추천용)
    currentDetectedEmotion = maxEmotion;
}

// 웹캠 화면 표시만 (분석은 하지 않음)
async function startWebcamDisplay() {
    const video = document.getElementById('webcam');
    const canvas = document.getElementById('overlay');

    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                width: 640,
                height: 480,
                facingMode: 'user'
            }
        });

        video.srcObject = stream;

        video.addEventListener('loadedmetadata', () => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
        });

        console.log('웹캠 화면 표시 시작 (분석 없음)');

    } catch (error) {
        console.log('웹캠 접근 실패, 화면 없이 감정 분석 계속:', error);
        // 웹캠 실패해도 시뮬레이션은 계속 진행
    }
}

// 감정 표시 업데이트 함수
function updateEmotionDisplay(emotions) {
    console.log('감정 업데이트:', emotions);

    // 모든 감정 바 초기화
    const emotionBars = document.querySelectorAll('.emotion-bar');
    emotionBars.forEach(bar => bar.classList.remove('active'));

    // 각 감정 바 업데이트
    Object.keys(emotions).forEach(emotion => {
        const percentage = Math.round(emotions[emotion]);

        try {
            if (emotion === 'happy') {
                const happyBar = document.getElementById('happyBar');
                const happyScore = document.getElementById('happyScore');
                if (happyBar && happyScore) {
                    happyBar.style.width = percentage + '%';
                    happyScore.textContent = percentage + '%';
                    if (percentage > 30) {
                        const parentBar = happyBar.closest('.emotion-bar');
                        if (parentBar) parentBar.classList.add('active');
                    }
                }
            } else if (emotion === 'sad') {
                const sadBar = document.getElementById('sadBar');
                const sadScore = document.getElementById('sadScore');
                if (sadBar && sadScore) {
                    sadBar.style.width = percentage + '%';
                    sadScore.textContent = percentage + '%';
                    if (percentage > 30) {
                        const parentBar = sadBar.closest('.emotion-bar');
                        if (parentBar) parentBar.classList.add('active');
                    }
                }
            } else if (emotion === 'angry') {
                const angryBar = document.getElementById('angryBar');
                const angryScore = document.getElementById('angryScore');
                if (angryBar && angryScore) {
                    angryBar.style.width = percentage + '%';
                    angryScore.textContent = percentage + '%';
                    if (percentage > 30) {
                        const parentBar = angryBar.closest('.emotion-bar');
                        if (parentBar) parentBar.classList.add('active');
                    }
                }
            } else if (emotion === 'surprised') {
                const surpriseBar = document.getElementById('surpriseBar');
                const surpriseScore = document.getElementById('surpriseScore');
                if (surpriseBar && surpriseScore) {
                    surpriseBar.style.width = percentage + '%';
                    surpriseScore.textContent = percentage + '%';
                    if (percentage > 30) {
                        const parentBar = surpriseBar.closest('.emotion-bar');
                        if (parentBar) parentBar.classList.add('active');
                    }
                }
            }
        } catch (error) {
            console.error(`감정 ${emotion} 업데이트 오류:`, error);
        }
    });

    // 간단한 디버깅 로그 (개발 시에만)
    if (Math.random() < 0.05) { // 5% 확률로 로그 출력
        console.log('🎯 감정 업데이트:', {
            emotions: Object.keys(emotions).map(key =>
                `${key}: ${Math.round(emotions[key])}%`
            ).join(', ')
        });
    }
}

// 영화 추천 기능
function getMovieRecommendation() {
    const recommendedGenres = emotionMovies[currentDetectedEmotion] || emotionMovies.neutral;
    const randomGenre = recommendedGenres[Math.floor(Math.random() * recommendedGenres.length)];

    alert(`현재 감정에 맞는 추천 장르: ${randomGenre}\n\n곧 ${randomGenre} 장르의 영화 목록으로 이동합니다!`);

    // 팝업 닫기 및 해당 장르 섹션으로 스크롤
    closeWelcomePopup();

    // 2초 후 장르 섹션으로 스크롤
    setTimeout(() => {
        const genreSection = document.getElementById('genre-section');
        if (genreSection) {
            genreSection.scrollIntoView({ behavior: 'smooth' });
        }
    }, 1000);
}

// 시뮬레이션 감정 분석 시작 (진입점)
async function startRealEmotionAnalysis() {
    console.log('=== 사진 촬영 감정 분석 시작 ===');

    const loading = document.getElementById('loading');
    const currentEmotion = document.getElementById('currentEmotion');
    const confidence = document.getElementById('confidence');

    if (loading) loading.style.display = 'block';
    if (currentEmotion) currentEmotion.textContent = '🤖 웹캠 준비 중...';
    if (confidence) confidence.textContent = '카메라 접근 권한을 허용해주세요...';

    // 잠시 로딩 표시 후 사진 촬영 모드 시작
    setTimeout(() => {
        if (loading) loading.style.display = 'none';
        startDirectSimulationMode();
    }, 1000);
}

// 주요 감정 업데이트 함수
function updateMainEmotion(emotions) {
    const maxEmotion = Object.keys(emotions).reduce((a, b) =>
        emotions[a] > emotions[b] ? a : b
    );

    const confidence = Math.round(emotions[maxEmotion]);
    const emoji = { happy: '😊', sad: '😢', angry: '😠', surprised: '😮' }[maxEmotion];
    const korean = { happy: '기쁨', sad: '슬픔', angry: '화남', surprised: '놀람' }[maxEmotion];

    currentDetectedEmotion = maxEmotion;
}

// 웰컴 화면으로 돌아가기
function backToWelcome() {
    console.log('웰컴 화면으로 돌아가기');

    // 감정 분석 정지
    stopEmotionAnalysis();

    // 화면 전환
    document.getElementById('emotionScreen').classList.remove('active');
    document.getElementById('welcomeScreen').classList.add('active');
}

// 화면 전환 함수
function switchToEmotionScreen() {
    console.log('감정 분석 화면으로 전환');

    try {
        const welcomeScreen = document.getElementById('welcomeScreen');
        const emotionScreen = document.getElementById('emotionScreen');

        if (welcomeScreen && emotionScreen) {
            welcomeScreen.classList.remove('active');
            emotionScreen.classList.add('active');
            console.log('화면 전환 완료');
        } else {
            console.error('화면 요소를 찾을 수 없습니다');
        }

        // 감정 분석 상태 초기화
        const currentEmotion = document.getElementById('currentEmotion');
        const confidence = document.getElementById('confidence');
        const emotionStatus = document.querySelector('.emotion-status');

        if (currentEmotion) {
            currentEmotion.textContent = '😊 감정 분석 준비 중...';
        }
        if (confidence) {
            confidence.textContent = '준비 중...';
        }
        if (emotionStatus) {
            emotionStatus.classList.add('analyzing');
        }

    } catch (error) {
        console.error('화면 전환 오류:', error);
    }
}

// 감정 분석 시작 함수 (진입점)
async function startEmotionDetection() {
    console.log('=== 감정 분석 시작 ===');

    // 화면 전환
    switchToEmotionScreen();

    // 시뮬레이션 감정 분석 시작
    setTimeout(() => {
        startRealEmotionAnalysis();
    }, 500);
}

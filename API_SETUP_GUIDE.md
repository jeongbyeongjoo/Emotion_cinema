# 🎭 Emotion Cinema API 서버 설정 가이드

## 🚀 빠른 시작

### 1. Python 가상환경 설정
```bash
# 가상환경 생성
python -m venv emotion_cinema_env

# 가상환경 활성화 (Windows)
emotion_cinema_env\Scripts\activate

# 가상환경 활성화 (Mac/Linux)
source emotion_cinema_env/bin/activate
```

### 2. 필요한 패키지 설치
```bash
pip install -r requirements.txt
```

### 3. API 서버 실행
```bash
python api_server.py
```

서버가 성공적으로 시작되면 다음과 같은 메시지가 출력됩니다:
```
🎭 영화 추천 + 실제 감정 인식 API 서버를 시작합니다...
📽️ 영화 추천 엔드포인트:
- POST /api/extract-keywords
- POST /api/recommend-content (줄거리 + 장르 하이브리드)
- POST /api/test-weights (가중치 테스트)
- GET /api/content-stats (데이터 통계)
- POST /api/reload-data
- GET /api/health

🤖 실제 감정 인식 엔드포인트:
- POST /api/analyze-emotion (이미지 감정 분석)
- POST /api/emotion-webcam (실시간 웹캠 감정 분석)
- GET /api/emotion-test (감정 인식 시스템 테스트)
- POST /api/recommend-movies (감정 기반 영화 추천)

🤖 감정 인식 모델을 초기화하는 중...
✅ 감정 인식 모델 초기화 완료!
🚀 서버 시작!
```

## 📡 주요 API 사용법

### 1. 시스템 상태 확인
```bash
curl http://localhost:5000/api/emotion-test
```

### 2. 이미지 감정 분석
```bash
curl -X POST http://localhost:5000/api/analyze-emotion \
  -H "Content-Type: application/json" \
  -d '{
    "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
  }'
```

### 3. 감정 기반 영화 추천
```bash
curl -X POST http://localhost:5000/api/recommend-movies \
  -H "Content-Type: application/json" \
  -d '{
    "emotion": "happy",
    "confidence": 85,
    "all_emotions": {
      "happy": 0.85,
      "sad": 0.05,
      "angry": 0.03,
      "surprised": 0.04,
      "neutral": 0.03
    }
  }'
```

### 4. 콘텐츠 유사도 기반 추천
```bash
curl -X POST http://localhost:5000/api/recommend-content \
  -H "Content-Type: application/json" \
  -d '{
    "movie_id": 24428,
    "type": "movie",
    "max_recommendations": 10,
    "overview_weight": 0.7,
    "genre_weight": 0.3
  }'
```

## 🎯 감정 인식 시스템

### 지원 감정
- **happy**: 기쁨 😊
- **sad**: 슬픔 😢
- **angry**: 화남 😠
- **surprised**: 놀람 😮
- **neutral**: 무표정 😐

### 감정별 추천 장르 매핑
| 감정 | 추천 장르 ID |
|------|-------------|
| happy | 35 (코미디), 10749 (로맨스), 12 (어드벤처), 16 (애니메이션) |
| sad | 18 (드라마), 10749 (로맨스), 10402 (음악) |
| angry | 28 (액션), 53 (스릴러), 80 (범죄) |
| surprised | 28 (액션), 53 (스릴러), 27 (호러), 878 (SF) |
| neutral | 28 (액션), 35 (코미디), 18 (드라마), 12 (어드벤처) |

## 🔧 API 응답 형식

### 감정 분석 응답
```json
{
  "success": true,
  "emotions": {
    "happy": 85.2,
    "sad": 5.1,
    "angry": 3.2,
    "surprised": 4.1,
    "neutral": 2.4
  },
  "dominant_emotion": {
    "name": "happy",
    "confidence": 85.2
  },
  "detected_faces": 1,
  "face_box": [120, 80, 200, 240],
  "message": "happy 감정이 85.2% 감지되었습니다"
}
```

### 영화 추천 응답
```json
{
  "success": true,
  "emotion": "happy",
  "confidence": 85,
  "message": "😊 기쁜 감정이 85% 감지되었습니다! 즐거운 영화들을 추천드려요.",
  "total_movies": 12,
  "movie_cards": [
    "<div class=\"movie-card\" onclick=\"window.open('movie_detail/detail.html?id=550&type=movie', '_blank')\">...</div>"
  ]
}
```

## 🌐 웹 애플리케이션 연동

### 1. 실시간 감정 분석 플로우
1. 웹캠에서 프레임 캡처
2. Canvas로 Base64 이미지 생성
3. `/api/emotion-webcam` 엔드포인트로 전송
4. 감정 결과 실시간 업데이트

### 2. 영화 추천 플로우
1. 감정 분석 완료 후
2. `/api/recommend-movies` 호출
3. 새 페이지(`movie_recommendation.html`)로 이동
4. 감정에 맞는 영화 목록 표시

## ⚡ 성능 최적화

### 실시간 분석 설정
- **분석 주기**: 1초마다 (서버 부하 고려)
- **이미지 품질**: JPEG 80% 압축
- **타임아웃**: 각 요청당 5초

### 메모리 관리
- **TF-IDF 매트릭스**: 최대 3,000 features
- **콘텐츠 수**: 약 20,000개 (9,821개 유효)
- **모델 캐싱**: 서버 시작 시 한 번만 로드

## 🔍 문제 해결

### 감정 인식 모델 오류
```bash
# TensorFlow 버전 확인
python -c "import tensorflow as tf; print(tf.__version__)"

# FER 라이브러리 재설치
pip uninstall fer
pip install fer==22.5.1
```

### 웹캠 접근 오류
- HTTPS 또는 localhost에서만 사용 가능
- 브라우저 권한 설정 확인
- 다른 애플리케이션에서 카메라 사용 중인지 확인

### CORS 오류
- `flask-cors` 패키지 설치 확인
- 브라우저 개발자 도구에서 네트워크 탭 확인

### 메모리 부족
```bash
# 가벼운 모델 사용 설정
export TF_CPP_MIN_LOG_LEVEL=2
python api_server.py
```

## 🧪 테스트 방법

### 1. 감정 인식 테스트
```bash
# 시스템 상태 확인
curl http://localhost:5000/api/emotion-test

# 응답 예시
{
  "emotion_model_loaded": true,
  "available_emotions": ["angry", "happy", "neutral", "sad", "surprised"],
  "model_info": "FER (Facial Expression Recognition) with MTCNN",
  "status": "ready"
}
```

### 2. 영화 추천 테스트
```javascript
// 브라우저 콘솔에서 테스트
fetch('http://localhost:5000/api/recommend-movies', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    emotion: 'happy',
    confidence: 80
  })
}).then(r => r.json()).then(console.log);
```

## 📊 모니터링

### 로그 확인
- **INFO**: 정상 작동 로그
- **WARNING**: 감정 분석 실패 (얼굴 미감지)
- **ERROR**: 시스템 오류

### 성능 지표
- **응답 시간**: 감정 분석 ~2-3초
- **정확도**: 조명이 좋은 환경에서 85%+
- **메모리 사용량**: 약 2-3GB (모델 로드 시)

## 🔧 고급 설정

### 가중치 조정
```bash
# 줄거리 70% + 장르 30% (기본값)
curl -X POST http://localhost:5000/api/recommend-content \
  -d '{"movie_id": 550, "type": "movie", "overview_weight": 0.7, "genre_weight": 0.3}'

# 장르 중심 추천 (줄거리 30% + 장르 70%)
curl -X POST http://localhost:5000/api/recommend-content \
  -d '{"movie_id": 550, "type": "movie", "overview_weight": 0.3, "genre_weight": 0.7}'
```

### 데이터 통계 확인
```bash
curl http://localhost:5000/api/content-stats
```

---

💡 **더 자세한 사용법은 웹 애플리케이션에서 직접 체험해보세요!** 
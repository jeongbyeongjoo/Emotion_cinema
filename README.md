# 🎭 Emotion Cinema

> **AI 감정 인식 기반 맞춤 영화 추천 시스템**

얼굴 표정을 실시간으로 분석하여 현재 감정에 딱 맞는 영화를 추천해주는 웹 애플리케이션입니다.

## ✨ 주요 기능

### 🎯 핵심 기능
- **실시간 감정 인식**: 웹캠을 통한 실시간 얼굴 표정 분석
- **AI 기반 영화 추천**: 감정 상태에 따른 맞춤형 영화 추천
- **다양한 감정 분석**: 기쁨, 슬픔, 화남, 놀람, 무표정 감지
- **직관적인 UI**: 깔끔하고 사용하기 쉬운 웹 인터페이스

### 🎬 웹사이트 기능
- **영화/드라마 TOP10**: 인기 콘텐츠 순위
- **장르별 추천**: 카테고리별 영화 탐색
- **검색 기능**: 영화/드라마 제목 검색
- **상세 정보**: 줄거리, 평점, 장르 등 상세 정보 제공

## 🛠️ 기술 스택

### Backend
- **Python 3.8+**
- **Flask**: RESTful API 서버
- **TensorFlow**: AI 모델 추론
- **FER (Facial Expression Recognition)**: 감정 인식 라이브러리
- **MTCNN**: 얼굴 감지 모델
- **scikit-learn**: 콘텐츠 유사도 분석

### Frontend
- **HTML5/CSS3/JavaScript**
- **Responsive Web Design**
- **Canvas API**: 얼굴 박스 그리기
- **WebRTC**: 웹캠 스트림 처리

### 데이터
- **TMDB API**: 영화/드라마 데이터
- **TF-IDF**: 텍스트 유사도 분석
- **Jaccard 유사도**: 장르 매칭

## 🚀 설치 및 실행

### 1. 저장소 클론
```bash
git clone https://github.com/your-username/Emotion_cinema.git
cd Emotion_cinema
```

### 2. Python 환경 설정
```bash
# 가상환경 생성 (권장)
python -m venv emotion_cinema_env

# 가상환경 활성화 (Windows)
emotion_cinema_env\Scripts\activate

# 가상환경 활성화 (macOS/Linux)
source emotion_cinema_env/bin/activate
```

### 3. 의존성 설치
```bash
pip install -r requirements.txt
```

### 4. API 서버 실행
```bash
python api_server.py
```
서버가 `http://localhost:5000`에서 실행됩니다.

### 5. 웹 애플리케이션 실행
```bash
# 웹 디렉토리로 이동
cd web

# 로컬 서버 실행 (Python)
python -m http.server 8000

# 또는 Live Server 확장을 사용하여 index.html 실행
```
웹사이트가 `http://localhost:8000`에서 실행됩니다.

## 📁 프로젝트 구조

```
Emotion_cinema/
├── api_server.py              # Flask API 서버
├── requirements.txt           # Python 의존성
├── API_SETUP_GUIDE.md        # API 설정 가이드
├── README.md                  # 프로젝트 문서
└── web/                       # 웹 프론트엔드
    ├── index.html            # 메인 홈페이지
    ├── emotion_test_simple.html  # 감정 분석 페이지
    ├── movie_recommendation.html # 영화 추천 페이지
    ├── css/                  # 스타일시트
    ├── js/                   # JavaScript 파일
    ├── images/               # 이미지 리소스
    ├── movie_detail/         # 영화 상세 페이지
    └── json/                 # 영화 데이터
```

## 🎮 사용법

### 1. 홈페이지 접속
- `http://localhost:8000`으로 접속
- "감정 분석 시작하기" 버튼 클릭

### 2. 감정 분석
- 웹캠 권한 허용
- "실시간 감정 분석" 버튼 클릭
- 카메라 앞에서 자연스러운 표정 유지
- 감정이 인식되면 "맞춤 영화 추천" 버튼 활성화

### 3. 영화 추천
- "맞춤 영화 추천" 버튼 클릭
- 새 페이지에서 감정에 맞는 영화 목록 확인
- 영화 포스터 클릭 시 상세 정보 페이지로 이동

### 4. 영화 탐색
- 홈페이지에서 TOP10 영화/드라마 확인
- 장르별 영화 탐색
- 검색 기능으로 특정 영화 찾기

## 🎯 AI 모델 정보

### 감정 인식 모델
- **FER**: Facial Expression Recognition 라이브러리
- **MTCNN**: Multi-task CNN for Joint Face Detection
- **지원 감정**: 기쁨(Happy), 슬픔(Sad), 화남(Angry), 놀람(Surprised), 무표정(Neutral)

### 추천 알고리즘
- **감정-장르 매핑**: 감정별 선호 장르 분석
- **평점 기반 필터링**: 6.0 이상 평점 영화만 추천
- **다양성 보장**: 상위 12개 영화 추천

## 🎬 감정별 추천 장르

| 감정 | 추천 장르 |
|------|-----------|
| 😊 기쁨 | 코미디, 로맨스, 어드벤처, 애니메이션 |
| 😢 슬픔 | 드라마, 로맨스, 음악 |
| 😠 화남 | 액션, 스릴러, 범죄 |
| 😮 놀람 | 액션, 스릴러, 호러, SF |
| 😐 무표정 | 액션, 코미디, 드라마, 어드벤처 |

## 🔧 API 엔드포인트

### 감정 인식
- `GET /api/emotion-test`: 시스템 상태 확인
- `POST /api/analyze-emotion`: 단일 이미지 감정 분석
- `POST /api/emotion-webcam`: 실시간 웹캠 감정 분석

### 영화 추천
- `POST /api/recommend-movies`: 감정 기반 영화 추천
- `POST /api/recommend-content`: 콘텐츠 유사도 기반 추천

## 🔍 트러블슈팅

### 웹캠 접근 오류
- 브라우저에서 카메라 권한을 허용했는지 확인
- HTTPS 또는 localhost에서만 웹캠 접근 가능

### API 서버 연결 오류
- `python api_server.py`로 서버가 실행 중인지 확인
- 포트 5000이 사용 가능한지 확인

### 감정 인식 정확도
- 충분한 조명 환경에서 사용
- 카메라와 적절한 거리 유지 (1-2미터)
- 얼굴이 화면 중앙에 위치하도록 조정

## 👥 개발팀

**한국외국어대학교 글로벌캠퍼스**
- 22학번 정병주, 22학번 임준혁, 24학번 박가윤
- 오픈소스 프로젝트 과제
- 웹 기반 AI 감정 인식 영화 추천 시스템

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 🙏 감사의 말

- **FER 라이브러리**: 감정 인식 기능 제공
- **TMDB**: 영화 데이터 제공
- **Flask**: 웹 API 프레임워크
- **TensorFlow**: AI 모델 지원

---

📧 **문의사항이 있으시면 언제든지 연락해주세요!**

🎬 **Emotion Cinema로 당신만의 특별한 영화를 찾아보세요!**

# AI 키워드 추출 및 콘텐츠 추천 API 서버 설정 가이드

## 🚀 빠른 시작

### 1. Python 가상환경 설정
```bash
# 가상환경 생성
python -m venv keyword_api_env

# 가상환경 활성화 (Windows)
keyword_api_env\Scripts\activate

# 가상환경 활성화 (Mac/Linux)
source keyword_api_env/bin/activate
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
영화 키워드 추출 및 콘텐츠 추천 API 서버를 시작합니다...
엔드포인트:
- POST /api/extract-keywords
- POST /api/recommend-content
- POST /api/reload-data
- GET /api/health
콘텐츠 데이터를 로드하는 중...
로드된 콘텐츠 수: 2000
유효한 overview가 있는 콘텐츠 수: 1800
TF-IDF 매트릭스 생성 완료: (1800, 5000)
* Running on all addresses (0.0.0.0)
* Running on http://127.0.0.1:5000
```

## 📡 API 사용법

### 건상 상태 확인
```bash
curl http://localhost:5000/api/health
```

### 키워드 추출 요청
```bash
curl -X POST http://localhost:5000/api/extract-keywords \
  -H "Content-Type: application/json" \
  -d '{
    "title": "어벤져스",
    "overview": "지구가 전례 없는 위협에 직면하자, 닉 퓨리는 인류를 구하기 위해 슈퍼히어로들을 모집한다...",
    "method": "tfidf",
    "max_keywords": 8
  }'
```

### 🆕 AI 콘텐츠 추천 요청
```bash
curl -X POST http://localhost:5000/api/recommend-content \
  -H "Content-Type: application/json" \
  -d '{
    "movie_id": 24428,
    "type": "movie",
    "max_recommendations": 10
  }'
```

## 🔧 설정 옵션

### 키워드 추출 방법
- `tfidf`: TF-IDF 알고리즘 사용 (추천)
- `frequency`: 단순 빈도수 기반

### 콘텐츠 추천 매개변수
- `movie_id`: 영화/시리즈 ID (필수)
- `type`: 콘텐츠 타입 (`movie` 또는 `tv`) (필수)
- `max_recommendations`: 최대 추천 개수 (기본값: 10)

### 키워드 추출 매개변수
- `title`: 영화 제목 (선택사항)
- `overview`: 영화 줄거리 (필수)
- `method`: 추출 방법 (`tfidf` 또는 `frequency`)
- `max_keywords`: 최대 키워드 개수 (기본값: 10)

## 🌐 웹페이지에서 확인

1. API 서버가 실행 중인지 확인
2. 웹브라우저에서 `web/index.html` 열기
3. 영화를 클릭하여 상세페이지로 이동
4. "🤖 AI 추천 비슷한 컨텐츠" 섹션에서 결과 확인

## 🧠 AI 추천 시스템 작동 원리

1. **데이터 로드**: 서버 시작 시 영화/드라마 데이터와 줄거리 로드
2. **TF-IDF 벡터화**: 모든 줄거리를 TF-IDF 매트릭스로 변환
3. **유사도 계산**: 현재 콘텐츠와 다른 모든 콘텐츠 간 코사인 유사도 계산
4. **추천 생성**: 유사도가 높은 순으로 정렬하여 상위 N개 추천
5. **결과 반환**: 제목, 포스터, 유사도 점수와 함께 추천 결과 제공

## ⚠️ 주의사항

- API 서버가 실행되어야 추천 기능이 작동합니다
- 처음 실행 시 NLTK 데이터 다운로드와 TF-IDF 매트릭스 생성으로 시간이 걸릴 수 있습니다
- 영화 줄거리가 없는 콘텐츠는 추천에서 제외됩니다
- 현재는 영어 줄거리만 지원합니다

## 🔍 문제 해결

### CORS 오류가 발생하는 경우
- `flask-cors` 패키지가 설치되어 있는지 확인
- API 서버 재시작

### 추천이 작동하지 않는 경우
- 영화 줄거리(overview)가 있는지 확인
- 영어 텍스트인지 확인
- API 서버 로그에서 TF-IDF 매트릭스 생성 여부 확인
- `/api/health` 엔드포인트로 데이터 로드 상태 확인

### 메모리 부족 오류
- 더 작은 `max_features` 값 사용 (기본값: 5000)
- 데이터 파일 크기 줄이기

### 패키지 설치 오류
```bash
pip install --upgrade pip
pip install -r requirements.txt --force-reinstall
```

## 🚀 고급 기능

### 데이터 재로드
```bash
curl -X POST http://localhost:5000/api/reload-data
```

### API 응답 예시
```json
{
  "current_content": {
    "id": 24428,
    "title": "어벤져스",
    "type": "movie"
  },
  "recommendations": [
    {
      "id": 271110,
      "title": "캡틴 아메리카: 시빌 워",
      "type": "movie",
      "similarity_score": 0.8456,
      "vote_average": 7.4
    }
  ],
  "total_recommendations": 10,
  "algorithm": "TF-IDF + Cosine Similarity"
}
``` 
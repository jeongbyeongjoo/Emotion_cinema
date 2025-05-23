# AI 키워드 추출 API 서버 설정 가이드

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
영화 키워드 추출 API 서버를 시작합니다...
엔드포인트:
- POST /api/extract-keywords
- GET /api/health
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

## 🔧 설정 옵션

### 키워드 추출 방법
- `tfidf`: TF-IDF 알고리즘 사용 (추천)
- `frequency`: 단순 빈도수 기반

### 매개변수
- `title`: 영화 제목 (선택사항)
- `overview`: 영화 줄거리 (필수)
- `method`: 추출 방법 (`tfidf` 또는 `frequency`)
- `max_keywords`: 최대 키워드 개수 (기본값: 10)

## 🌐 웹페이지에서 확인

1. API 서버가 실행 중인지 확인
2. 웹브라우저에서 `web/index.html` 열기
3. 영화를 클릭하여 상세페이지로 이동
4. "🤖 AI 키워드 분석" 섹션에서 결과 확인

## ⚠️ 주의사항

- API 서버가 실행되어야 키워드 추출 기능이 작동합니다
- 처음 실행 시 NLTK 데이터 다운로드로 시간이 걸릴 수 있습니다
- 영화 줄거리가 없거나 너무 짧으면 키워드 추출이 제한될 수 있습니다

## 🔍 문제 해결

### CORS 오류가 발생하는 경우
- `flask-cors` 패키지가 설치되어 있는지 확인
- API 서버 재시작

### 키워드가 추출되지 않는 경우
- 영화 줄거리(overview)가 있는지 확인
- 영어 텍스트인지 확인 (현재는 영어만 지원)
- API 서버 로그 확인

### 패키지 설치 오류
```bash
pip install --upgrade pip
pip install -r requirements.txt --force-reinstall
``` 
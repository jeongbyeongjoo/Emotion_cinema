import requests
import json
import time

api_key = '284763b55aba06fa87a85e679c64add1'
base_url = 'https://api.themoviedb.org/3/discover/movie'
language = 'ko-KR'

all_movies = []

# 원하는 페이지 범위 설정 (1~5페이지 예시)
for page in range(1, 500):
    url = f'{base_url}?api_key={api_key}&language={language}&page={page}'
    response = requests.get(url)
    
    if response.status_code == 200:
        data = response.json()
        all_movies.extend(data['results'])
        print(f"{page} 페이지 처리 완료")
    else:
        print(f"에러 발생 (페이지 {page}):", response.status_code)
    
    time.sleep(0.3)  # 요청 속도 제한 (TMDB 권장)

# JSON 저장
with open('all_movies.json', 'w', encoding='utf-8') as f:
    json.dump(all_movies, f, ensure_ascii=False, indent=4)

print("전체 영화 데이터를 JSON 파일로 저장했습니다.")

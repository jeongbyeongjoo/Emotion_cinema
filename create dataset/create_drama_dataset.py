import requests
import json
import time

api_key = '284763b55aba06fa87a85e679c64add1'
base_url = 'https://api.themoviedb.org/3/discover/tv'
language = 'ko-KR'

all_tv_shows = []

for page in range(1, 501):  # 필요한 만큼 페이지 늘릴 수 있음
    url = f'{base_url}?api_key={api_key}&language={language}&page={page}'
    response = requests.get(url)
    
    if response.status_code == 200:
        data = response.json()
        all_tv_shows.extend(data['results'])
        print(f"{page} 페이지 완료")
    else:
        print(f"에러 (페이지 {page}):", response.status_code)

    time.sleep(0.3)  # API 요청 속도 제한

with open('all_tv_shows.json', 'w', encoding='utf-8') as f:
    json.dump(all_tv_shows, f, ensure_ascii=False, indent=4)

print("전 세계 드라마 데이터를 저장했습니다.")

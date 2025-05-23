//영화 상세 정보 출력 및 비슷한 컨텐츠 추천

const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

const GENRE_MAP = {
    28: "액션", 12: "모험", 16: "애니메이션", 35: "코미디", 80: "범죄",
    99: "다큐멘터리", 18: "드라마", 10751: "가족", 14: "판타지", 36: "역사",
    27: "공포", 10402: "음악", 9648: "미스터리", 10749: "로맨스",
    878: "SF", 10770: "TV 영화", 53: "스릴러",
    10752: "전쟁", 37: "서부"
};

// 🎲 배열 셔플 함수
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// 1. 쿼리스트링에서 id 및 type 가져오기
const params = new URLSearchParams(window.location.search);
const movieId = parseInt(params.get("id"));
const type = params.get("type"); // 'movie' 또는 'tv'

if (!movieId || !type) {
    document.body.innerHTML = `<p style="color:white; text-align:center;">영화/시리즈 ID 또는 타입이 유효하지 않습니다.</p>`;
    throw new Error("유효하지 않은 ID 또는 타입");
}

// 2. 데이터 로딩 및 출력
async function loadContentData() {
    try {
        // 영화와 드라마 데이터를 동시에 로드 (더 작은 파일 사용)
        const [moviesResponse, dramasResponse] = await Promise.all([
            fetch('../json/all_movies.json'),
            fetch('../json/all_tv_shows.json')
        ]);

        if (!moviesResponse.ok || !dramasResponse.ok) {
            throw new Error('데이터 파일을 불러올 수 없습니다.');
        }

        const movies = await moviesResponse.json();
        const dramas = await dramasResponse.json();

        // 영화 데이터에 type 추가
        const moviesWithType = movies.map(movie => ({ ...movie, type: 'movie' }));
        // 드라마 데이터에 type 추가
        const dramasWithType = dramas.map(drama => ({ ...drama, type: 'tv' }));

        // 전체 데이터 결합
        const allData = [...moviesWithType, ...dramasWithType];

        console.log('전체 데이터 로드 완료:', allData.length, '개의 항목');

        // id와 type이 모두 일치하는 항목 찾기
        let item = allData.find(m => m.id === movieId && m.type === type);

        // TOP10에서 찾지 못한 경우 큰 데이터 파일에서 검색
        if (!item) {
            console.log('TOP10에서 찾지 못함, 전체 데이터에서 검색 중...');
            try {
                const fullMoviesResponse = await fetch('../json/all_movies.json');
                const fullMovies = await fullMoviesResponse.json();

                if (type === 'movie') {
                    item = fullMovies.find(m => m.id === movieId);
                    if (item) {
                        item.type = 'movie';
                        allData.push(item); // 추천을 위해 배열에 추가
                    }
                }
            } catch (err) {
                console.log('전체 영화 데이터 로드 실패:', err);
            }
        }

        console.log('현재 콘텐츠:', item);

        if (!item) {
            document.body.innerHTML = '<p style="color:white; text-align:center;">컨텐츠를 찾을 수 없습니다.</p>';
            return;
        }

        // 2-1. 장르 텍스트 배열로 변환
        const genres = (item.genre_ids || []).map(id => GENRE_MAP[id]).filter(Boolean);
        console.log('현재 콘텐츠 장르 IDs:', item.genre_ids);
        console.log('현재 콘텐츠 장르 명칭:', genres);

        // 2-2. 상세 정보 채우기
        document.getElementById('movie-title').textContent = item.title || item.name;

        // 포스터 이미지 처리
        const posterImg = document.getElementById('movie-poster');
        if (item.poster_path && item.poster_path !== null) {
            posterImg.src = IMAGE_BASE + item.poster_path;
            posterImg.alt = item.title || item.name;
            posterImg.style.backgroundColor = 'black';
            posterImg.onerror = function () {
                this.style.display = 'none';
                this.parentElement.style.backgroundColor = 'black';
                this.parentElement.innerHTML = '<div style="width: 350px; height: 525px; background-color: black; display: flex; align-items: center; justify-content: center; color: #666; font-size: 14px; border-radius: 12px;">이미지 없음</div>';
            };
        } else {
            posterImg.style.display = 'none';
            posterImg.parentElement.innerHTML = '<div style="width: 350px; height: 525px; background-color: black; display: flex; align-items: center; justify-content: center; color: #666; font-size: 14px; border-radius: 12px;">이미지 없음</div>';
        }

        document.getElementById('movie-vote').textContent = item.vote_average;
        document.getElementById('movie-overview').textContent = item.overview || '정보가 없습니다.';
        document.getElementById('movie-date').textContent = item.release_date || item.first_air_date || '';
        document.getElementById('movie-genres').textContent = genres.join(', ');

        const tagBox = document.getElementById('movie-tags');
        tagBox.innerHTML = '';
        genres.forEach(g => {
            const span = document.createElement('span');
            span.textContent = g;
            tagBox.appendChild(span);
        });

        // 3. 🎯 AI 기반 비슷한 콘텐츠 추천
        console.log('AI 기반 비슷한 콘텐츠 찾기 시작...');

        await recommendSimilarContent(item);

    } catch (err) {
        console.error('에러 발생:', err);
        document.body.innerHTML = '<p style="color:white; text-align:center;">오류가 발생했습니다.</p>';
    }
}

// AI 기반 콘텐츠 추천 함수
async function recommendSimilarContent(item) {
    const recBox = document.getElementById('recommended-list');
    recBox.classList.add('scroll-row');

    try {
        // 로딩 상태 표시
        recBox.innerHTML = '<p style="color: #ccc; text-align: center;">🤖 AI가 비슷한 콘텐츠를 분석하고 있습니다...</p>';

        // API 서버에 추천 요청
        const response = await fetch('http://localhost:5000/api/recommend-content', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                movie_id: item.id,
                type: item.type,
                max_recommendations: 15
            })
        });

        if (!response.ok) {
            throw new Error(`API 요청 실패: ${response.status}`);
        }

        const data = await response.json();

        if (data.recommendations && data.recommendations.length > 0) {
            console.log(`AI 추천 완료: ${data.recommendations.length}개의 유사 콘텐츠 발견`);

            // 추천 콘텐츠 표시
            recBox.innerHTML = '';

            data.recommendations.forEach(rec => {
                const card = document.createElement('div');
                card.className = 'movie-card';

                // 이미지가 있는 경우와 없는 경우 처리
                let imageContent;
                if (rec.poster_path && rec.poster_path !== null) {
                    imageContent = `<img src="${IMAGE_BASE + rec.poster_path}" alt="${rec.title}" onerror="this.style.display='none'; this.parentElement.innerHTML='<div style=\\'width:100%;height:240px;background-color:black;display:flex;align-items:center;justify-content:center;color:#666;font-size:12px;border-radius:10px;\\'>이미지 없음</div>';">`;
                } else {
                    imageContent = `<div style="width: 100%; height: 240px; background-color: black; display: flex; align-items: center; justify-content: center; color: #666; font-size: 12px; border-radius: 10px;">이미지 없음</div>`;
                }

                card.innerHTML = `
                    <a href="detail.html?id=${rec.id}&type=${rec.type}">
                        ${imageContent}
                        <p>${rec.title}</p>
                    </a>
                `;
                recBox.appendChild(card);
            });

        } else {
            recBox.innerHTML = `
                <div style="text-align: center; color: #ccc; padding: 20px;">
                    <p>🤖 ${data.message || '현재 콘텐츠와 유사한 콘텐츠를 찾을 수 없습니다.'}</p>
                    <p style="font-size: 12px; color: #888;">줄거리 정보가 부족하거나 유사한 콘텐츠가 없을 수 있습니다.</p>
                </div>
            `;
        }

    } catch (error) {
        console.error('AI 추천 오류:', error);

        // 오류 시 기본 메시지 표시
        recBox.innerHTML = `
            <div style="text-align: center; color: #ff6b6b; padding: 20px;">
                <p>🔧 AI 추천 서비스에 연결할 수 없습니다</p>
                <p style="font-size: 12px; color: #888;">API 서버가 실행 중인지 확인해주세요</p>
                <button onclick="location.reload()" style="margin-top: 10px; padding: 8px 16px; background: #ff6b6b; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    다시 시도
                </button>
            </div>
        `;
    }
}

// 페이지 로드 시 실행
loadContentData();
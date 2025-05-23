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
            fetch('../json/movies_top10.json'),
            fetch('../json/dramas_top10.json')
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
        document.getElementById('movie-poster').src = IMAGE_BASE + item.poster_path;
        document.getElementById('movie-poster').alt = item.title || item.name;
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

        // 3. 🎯 비슷한 장르 컨텐츠 추천
        console.log('비슷한 콘텐츠 찾기 시작...');

        // 현재 아이템의 genre_ids 확인
        if (!item.genre_ids || item.genre_ids.length === 0) {
            console.log('⚠️ 현재 콘텐츠에 장르 ID가 없어 비슷한 콘텐츠를 찾을 수 없습니다!');
            document.getElementById('recommended-list').innerHTML = '<p>비슷한 콘텐츠를 찾을 수 없습니다.</p>';
            return;
        }

        const recommendedRaw = allData.filter(m => {
            if (m.id === item.id && m.type === item.type) return false; // 자기 자신 제외
            if (!m.genre_ids || m.genre_ids.length === 0) return false;

            // 장르 매칭 확인
            const hasMatchingGenre = m.genre_ids.some(gid => (item.genre_ids || []).includes(gid));
            return hasMatchingGenre;
        });

        console.log('필터링된 비슷한 콘텐츠 수:', recommendedRaw.length);

        if (recommendedRaw.length === 0) {
            console.log('⚠️ 비슷한 장르의 콘텐츠를 찾지 못했습니다!');
            document.getElementById('recommended-list').innerHTML = '<p>비슷한 콘텐츠를 찾을 수 없습니다.</p>';
            return;
        }

        const recommended = shuffleArray(recommendedRaw).slice(0, 20); // 랜덤 20개
        console.log('최종 표시될 비슷한 콘텐츠 수:', recommended.length);

        const recBox = document.getElementById('recommended-list');
        recBox.classList.add('scroll-row'); // 가로 스크롤 스타일 클래스 적용
        recBox.innerHTML = ''; // 기존 내용 초기화

        recommended.forEach(rec => {
            const card = document.createElement('div');
            card.className = 'movie-card';
            card.innerHTML = `
                <a href="detail.html?id=${rec.id}&type=${rec.type}">
                    <img src="${IMAGE_BASE + rec.poster_path}" alt="${rec.title || rec.name}" onerror="this.src='../images/no-image.png'">
                    <p>${rec.title || rec.name}</p>
                </a>
            `;
            recBox.appendChild(card);
        });

    } catch (err) {
        console.error('에러 발생:', err);
        document.body.innerHTML = '<p style="color:white; text-align:center;">오류가 발생했습니다.</p>';
    }
}

// 페이지 로드 시 실행
loadContentData();

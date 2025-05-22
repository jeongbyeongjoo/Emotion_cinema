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

// 2. 데이터 로딩 및 출력 (항상 all_contents.json 사용)
const dataPath = '../json/all_contents.json';

fetch(dataPath)
    .then(res => res.json())
    .then(data => {
        console.log('전체 데이터 로드 완료:', data.length, '개의 항목');

        // id와 type이 모두 일치하는 항목 찾기
        const item = data.find(m => m.id === movieId && m.type === type);
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
        document.getElementById('movie-overview').textContent = item.overview;
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

        // 장르 ID가 없는 항목 확인
        const noGenreItems = data.filter(m => !m.genre_ids || m.genre_ids.length === 0);
        console.log('장르 ID가 없는 항목 수:', noGenreItems.length);

        // 현재 아이템의 genre_ids 확인
        if (!item.genre_ids || item.genre_ids.length === 0) {
            console.log('⚠️ 현재 콘텐츠에 장르 ID가 없어 비슷한 콘텐츠를 찾을 수 없습니다!');
        }

        const recommendedRaw = data.filter(m => {
            if ((m.title === item.title) || (m.name === item.name)) return false; // 자기 자신 제외
            if (!m.genre_ids) return false;

            // 장르 매칭 확인 (디버깅)
            const hasMatchingGenre = m.genre_ids.some(gid => (item.genre_ids || []).includes(gid));

            return hasMatchingGenre;
        });

        console.log('필터링된 비슷한 콘텐츠 수:', recommendedRaw.length);
        if (recommendedRaw.length === 0) {
            console.log('⚠️ 비슷한 장르의 콘텐츠를 찾지 못했습니다!');
        }

        const recommended = shuffleArray(recommendedRaw).slice(0, 20); // 랜덤 20개
        console.log('최종 표시될 비슷한 콘텐츠 수:', recommended.length);

        const recBox = document.getElementById('recommended-list');
        recBox.classList.add('scroll-row'); // 가로 스크롤 스타일 클래스 적용

        recommended.forEach(rec => {
            const card = document.createElement('div');
            card.className = 'movie-card';
            card.innerHTML = `
        <a href="detail.html?id=${rec.id}&type=${rec.type}">
          <img src="${IMAGE_BASE + rec.poster_path}" alt="${rec.title || rec.name}">
          <p>${rec.title || rec.name}</p>
        </a>
      `;
            recBox.appendChild(card);
        });
    })
    .catch(err => {
        console.error('에러 발생:', err);
        document.body.innerHTML = '<p style="color:white; text-align:center;">오류가 발생했습니다.</p>';
    });

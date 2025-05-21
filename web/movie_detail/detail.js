//영화 상세 정보 출력 및 비슷한 컨텐츠 추천

const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

const GENRE_MAP = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime",
  99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History",
  27: "Horror", 10402: "Music", 9648: "Mystery", 10749: "Romance",
  878: "Science Fiction", 10770: "TV Movie", 53: "Thriller",
  10752: "War", 37: "Western"
};

// 🎲 배열 셔플 함수
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// 1. 쿼리스트링에서 영화 ID 가져오기
const params = new URLSearchParams(window.location.search);
const movieId = parseInt(params.get("id"));

if (!movieId) {
  document.body.innerHTML = `<p style="color:white; text-align:center;">영화 ID가 유효하지 않습니다.</p>`;
  throw new Error("유효하지 않은 영화 ID");
}

// 2. 영화 데이터 로딩 및 출력
fetch('../json/all_movies.json')
  .then(res => res.json())
  .then(data => {
    const movie = data.find(m => m.id === movieId);
    if (!movie) {
      document.body.innerHTML = '<p style="color:white; text-align:center;">영화를 찾을 수 없습니다.</p>';
      return;
    }

    // 2-1. 장르 텍스트 배열로 변환
    const genres = movie.genre_ids.map(id => GENRE_MAP[id]).filter(Boolean);

    // 2-2. 상세 정보 채우기
    document.getElementById('movie-title').textContent = movie.title;
    document.getElementById('movie-poster').src = IMAGE_BASE + movie.poster_path;
    document.getElementById('movie-poster').alt = movie.title;
    document.getElementById('movie-vote').textContent = movie.vote_average;
    document.getElementById('movie-overview').textContent = movie.overview;
    document.getElementById('movie-date').textContent = movie.release_date;
    document.getElementById('movie-genres').textContent = genres.join(', ');

    const tagBox = document.getElementById('movie-tags');
    genres.forEach(g => {
      const span = document.createElement('span');
      span.textContent = g;
      tagBox.appendChild(span);
    });

    // 3. 🎯 비슷한 장르 영화 추천
    const recommendedRaw = data.filter(m => {
      if (m.id === movie.id) return false; // 자기 자신 제외
      if (!m.genre_ids) return false;
      return m.genre_ids.some(gid => movie.genre_ids.includes(gid));
    });

    const recommended = shuffleArray(recommendedRaw).slice(0, 20); // 랜덤 10개

    const recBox = document.getElementById('recommended-list');
    recBox.classList.add('scroll-row'); // 가로 스크롤 스타일 클래스 적용

    recommended.forEach(rec => {
      const card = document.createElement('div');
      card.className = 'movie-card';
      card.innerHTML = `
        <a href="detail.html?id=${rec.id}">
          <img src="${IMAGE_BASE + rec.poster_path}" alt="${rec.title}">
          <p>${rec.title}</p>
        </a>
      `;
      recBox.appendChild(card);
    });
  })
  .catch(err => {
    console.error('에러 발생:', err);
    document.body.innerHTML = '<p style="color:white; text-align:center;">오류가 발생했습니다.</p>';
  });

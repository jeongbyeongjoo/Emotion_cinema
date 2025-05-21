const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

const GENRE_MAP = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime",
  99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History",
  27: "Horror", 10402: "Music", 9648: "Mystery", 10749: "Romance",
  878: "Science Fiction", 10770: "TV Movie", 53: "Thriller",
  10752: "War", 37: "Western"
};

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

    const genres = movie.genre_ids.map(id => GENRE_MAP[id]).filter(Boolean);

    // 요소 채우기
    document.getElementById('movie-title').textContent = movie.title;
    document.getElementById('movie-poster').src = IMAGE_BASE + movie.poster_path;
    document.getElementById('movie-poster').alt = movie.title;
    document.getElementById('movie-vote').textContent = movie.vote_average;
    document.getElementById('movie-overview').textContent = movie.overview;
    document.getElementById('movie-date').textContent = movie.release_date;
    document.getElementById('movie-genres').textContent = genres.join(', ');

    // 태그 span으로 출력
    const tagBox = document.getElementById('movie-tags');
    genres.forEach(g => {
      const span = document.createElement('span');
      span.textContent = g;
      tagBox.appendChild(span);
    });
  })
  .catch(err => {
    console.error('에러 발생:', err);
    document.body.innerHTML = '<p style="color:white; text-align:center;">오류가 발생했습니다.</p>';
  });

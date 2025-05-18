const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

const GENRE_MAP = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime",
  99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History",
  27: "Horror", 10402: "Music", 9648: "Mystery", 10749: "Romance",
  878: "Science Fiction", 10770: "TV Movie", 53: "Thriller",
  10752: "War", 37: "Western"
};

fetch('json/all_movies.json')
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById('movie-container');
    const genreMap = {};

    data.forEach(movie => {
      if (!movie.genre_ids || !movie.poster_path || !movie.title) return;

      const genres = movie.genre_ids.map(id => GENRE_MAP[id]).filter(Boolean);

      genres.forEach(genre => {
        if (!genreMap[genre]) genreMap[genre] = [];
        if (genreMap[genre].length < 20) {
          genreMap[genre].push(movie);
        }
      });
    });

    for (const [genre, movies] of Object.entries(genreMap)) {
      const section = document.createElement('div');
      section.className = 'genre-section';

      const title = document.createElement('h2');
      title.className = 'genre-title';
      title.textContent = genre;
      section.appendChild(title);

      const grid = document.createElement('div');
      grid.className = 'movie-grid';

      movies.forEach(movie => {
        // <a>가 카드 전체를 감쌈
        const card = document.createElement('a');
        card.className = 'movie-card';
        card.href = `movie_detail/detail.html?id=${movie.id}`;
        card.innerHTML = `
          <img src="${IMAGE_BASE + movie.poster_path}" alt="${movie.title}">
          <p>${movie.title}</p>
        `;
        grid.appendChild(card);
      });

      section.appendChild(grid);
      container.appendChild(section);

      enableDragScroll(grid);
    }
  })
  .catch(err => console.error('에러 발생:', err));

// 드래그 스크롤 기능
function enableDragScroll(element) {
  let isDown = false;
  let startX;
  let scrollLeft;

  element.addEventListener('mousedown', (e) => {
    isDown = true;
    element.classList.add('dragging');
    startX = e.pageX - element.offsetLeft;
    scrollLeft = element.scrollLeft;
  });

  element.addEventListener('mouseleave', () => {
    isDown = false;
    element.classList.remove('dragging');
  });

  element.addEventListener('mouseup', () => {
    isDown = false;
    element.classList.remove('dragging');
  });

  element.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - element.offsetLeft;
    const walk = (x - startX) * 1.5;
    element.scrollLeft = scrollLeft - walk;
  });
}

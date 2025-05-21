const IMAGE_BASE_GENRE = 'https://image.tmdb.org/t/p/w500';

const GENRE_MAP = {
    28: "액션",
    35: "코미디",
    16: "애니메이션",
    27: "공포",
    10402: "음악",
    10752: "전쟁"
};

// Fisher-Yates shuffle 함수
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

fetch('json/all_movies.json')
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById('genre-section');
    const genreMap = {};

    // 각 장르에 해당하는 영화 모으기
    data.forEach(movie => {
      if (!movie.genre_ids || !movie.poster_path || !movie.title) return;

      const genres = movie.genre_ids.map(id => GENRE_MAP[id]).filter(Boolean);

      genres.forEach(genre => {
        if (!genreMap[genre]) genreMap[genre] = [];
        genreMap[genre].push(movie);
      });
    });

    // 장르별 섹션 만들기
    for (const [genre, movies] of Object.entries(genreMap)) {
      const section = document.createElement('div');
      section.className = 'genre-section';

      const title = document.createElement('h2');
      title.className = 'genre-title';
      title.textContent = genre;
      section.appendChild(title);

      const grid = document.createElement('div');
      grid.className = 'movie-grid';

      // 영화 리스트 랜덤하게 섞고 최대 20개만 출력
      const selectedMovies = shuffleArray([...movies]).slice(0, 20);

      selectedMovies.forEach(movie => {
        const card = document.createElement('a');
        card.className = 'movie-card';
        card.href = `movie_detail/detail.html?id=${movie.id}`;
        card.innerHTML = `
          <img src="${IMAGE_BASE_GENRE + movie.poster_path}" alt="${movie.title}">
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

fetch('./json/movies_top10.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        const container = document.getElementById('movie-container');
        const genreMap = {};

        // 각 장르별로 영화 분류
        data.forEach(movie => {
            if (!movie.genre_ids || !movie.poster_path || !movie.title) return;

            const genres = movie.genre_ids.map(id => GENRE_MAP[id]).filter(Boolean);

            genres.forEach(genre => {
                if (!genreMap[genre]) {
                    genreMap[genre] = [];
                }
                if (movie.score) {
                    genreMap[genre].push(movie);
                }
            });
        });

        // 각 장르별로 평점순 정렬 및 상위 20개 선택
        Object.keys(genreMap).forEach(genre => {
            genreMap[genre].sort((a, b) => b.score - a.score);
            genreMap[genre] = genreMap[genre].slice(0, 20);
        });

        // 장르별 섹션 생성
        Object.entries(genreMap).forEach(([genre, movies]) => {
            const section = document.createElement('div');
            section.className = 'genre-section';

            const title = document.createElement('h2');
            title.className = 'genre-title';
            title.textContent = `${genre} 영화`;
            section.appendChild(title);

            const grid = document.createElement('div');
            grid.className = 'movie-grid';

            // 영화 카드 생성
            movies.forEach((movie, index) => {
                const card = document.createElement('a');
                card.className = 'movie-card';
                card.href = `movie_detail/detail.html?id=${movie.id}`;

                const image = document.createElement('img');
                image.src = IMAGE_BASE + movie.poster_path;
                image.alt = movie.title;

                const info = document.createElement('div');
                info.className = 'movie-info';

                const title = document.createElement('p');
                title.className = 'movie-title';
                title.textContent = `${index + 1}. ${movie.title}`;

                info.appendChild(title);
                card.appendChild(image);
                card.appendChild(info);
                grid.appendChild(card);
            });

            section.appendChild(grid);
            container.appendChild(section);

            // 드래그 스크롤 기능 추가
            enableDragScroll(grid);
        });
    })
    .catch(error => {
        console.error('영화 데이터를 불러오는 중 오류 발생:', error);
    });
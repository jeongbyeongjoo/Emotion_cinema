const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

function renderTop10(containerId, jsonPath, type) {
    fetch(jsonPath)
        .then(res => res.json())
        .then(movies => {
            const top10 = movies.sort((a, b) => b.score - a.score).slice(0, 10);
            const container = document.getElementById(containerId);
            container.innerHTML = '';  // 초기화

            top10.forEach((movie, index) => {
                const imageUrl = movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : 'no_image.jpg';

                const card = document.createElement('a');
                card.href = `movie_detail/detail.html?id=${movie.id}&type=${type}`;
                card.classList.add('top10-card');

                card.innerHTML = `
            <div class="top10-flex">
              <div class="rank-number-side">${index + 1}</div>
              <div class="poster-wrapper">
                <img src="${imageUrl}" alt="${movie.title}" class="poster">
              </div>
            </div>
          `;

                container.appendChild(card);
            });

            enableDragScroll(container);
        })
        .catch(err => console.error('에러 발생:', err));
}

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

// 영화 TOP10
renderTop10('movie-top10', 'json/movies_top10.json', 'movie');
// 시리즈 TOP10
renderTop10('drama-top10', 'json/dramas_top10.json', 'tv');  

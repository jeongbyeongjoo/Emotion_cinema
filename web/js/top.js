const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

function renderTop10(containerId, jsonPath, type) {
    fetch(jsonPath)
        .then(res => res.json())
        .then(movies => {
            const top10 = movies.sort((a, b) => b.score - a.score).slice(0, 10);
            const container = document.getElementById(containerId);
            container.innerHTML = '';  // 초기화

            top10.forEach((movie, index) => {
                const card = document.createElement('a');
                card.href = `movie_detail/detail.html?id=${movie.id}&type=${type}`;
                card.classList.add('top10-card');

                // 이미지가 있는 경우와 없는 경우 처리
                let imageContent;
                if (movie.poster_path && movie.poster_path !== null) {
                    const imageUrl = `${IMAGE_BASE}${movie.poster_path}`;
                    imageContent = `<img src="${imageUrl}" alt="${movie.title}" class="poster" onerror="this.style.display='none'; this.parentElement.style.backgroundColor='black';">`;
                } else {
                    imageContent = `<div class="poster" style="background-color: black; display: flex; align-items: center; justify-content: center; color: #666; font-size: 12px;">이미지 없음</div>`;
                }

                card.innerHTML = `
            <div class="top10-flex">
              <div class="rank-number-side">${index + 1}</div>
              <div class="poster-wrapper">
                ${imageContent}
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

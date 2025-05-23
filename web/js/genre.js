const IMAGE_BASE_GENRE = 'https://image.tmdb.org/t/p/w500';

const GENRE_MAP = {
    16: "애니메이션",
    10751: "가족",
    10402: "음악",
    9648: "미스터리",
    10749: "로맨스",
    878: "SF",
    53: "스릴러",
    10752: "전쟁",
};

// DOM이 완전히 로드된 후 실행
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('genre-section');

    if (!container) {
        console.error('genre-section을 찾을 수 없습니다');
        return;
    }

    loadMoviesByGenre(container);

    // 좌우 스크롤 버튼 기능 추가
    setTimeout(() => {
        document.querySelectorAll('.genre-section-wrapper').forEach(wrapper => {
            const leftBtn = wrapper.querySelector('.genre-left');
            const rightBtn = wrapper.querySelector('.genre-right');
            const grid = wrapper.querySelector('.movie-grid');
            if (leftBtn && grid) {
                leftBtn.onclick = () => { grid.scrollBy({ left: -400, behavior: 'smooth' }); };
            }
            if (rightBtn && grid) {
                rightBtn.onclick = () => { grid.scrollBy({ left: 400, behavior: 'smooth' }); };
            }
        });
    }, 500);
});

function loadMoviesByGenre(container) {
    fetch('json/movies_popularity.json')
        .then(res => {
            if (!res.ok) {
                throw new Error('영화 데이터를 불러올 수 없습니다.');
            }
            return res.json();
        })
        .then(data => {
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
            Object.entries(genreMap).forEach(([genre, moviesFromMap], idx) => {
                // 인기도순으로 정렬하고 상위 20개 선택
                const selectedMovies = moviesFromMap
                    .sort((a, b) => b.popularity - a.popularity)
                    .slice(0, 20);

                // Swiper 컨테이너 생성
                const section = document.createElement('div');
                section.className = 'genre-section';

                const title = document.createElement('h2');
                title.className = 'genre-title';
                title.textContent = `${genre} 영화`;
                section.appendChild(title);

                // Swiper 구조
                const swiperContainer = document.createElement('div');
                swiperContainer.className = `swiper genre-swiper genre-swiper-${idx}`;

                const swiperWrapper = document.createElement('div');
                swiperWrapper.className = 'swiper-wrapper';

                selectedMovies.forEach((movie, index) => {
                    const slide = document.createElement('div');
                    slide.className = 'swiper-slide';
                    const card = document.createElement('a');
                    card.className = 'movie-card';
                    card.href = `movie_detail/detail.html?id=${movie.id}&type=movie`;

                    // 이미지가 있는 경우와 없는 경우 처리
                    if (movie.poster_path && movie.poster_path !== null) {
                        card.innerHTML = `<img src="${IMAGE_BASE_GENRE + movie.poster_path}" alt="${movie.title}" onerror="this.style.display='none'; this.parentElement.style.backgroundColor='black'; this.parentElement.style.display='flex'; this.parentElement.style.alignItems='center'; this.parentElement.style.justifyContent='center'; this.parentElement.innerHTML='<span style=color:#666;font-size:12px;>이미지 없음</span>';">`;
                    } else {
                        card.innerHTML = `<div style="width: 100%; height: 300px; background-color: black; display: flex; align-items: center; justify-content: center; border-radius: 8px; color: #666; font-size: 12px;">이미지 없음</div>`;
                    }

                    slide.appendChild(card);
                    swiperWrapper.appendChild(slide);
                });

                // 네비게이션 버튼
                const prevBtn = document.createElement('div');
                prevBtn.className = 'swiper-button-prev';
                const nextBtn = document.createElement('div');
                nextBtn.className = 'swiper-button-next';

                swiperContainer.appendChild(swiperWrapper);
                swiperContainer.appendChild(prevBtn);
                swiperContainer.appendChild(nextBtn);

                section.appendChild(swiperContainer);
                container.appendChild(section);

                // Swiper 인스턴스 생성 (각 섹션별로)
                setTimeout(() => {
                    new Swiper(`.genre-swiper-${idx}`, {
                        slidesPerView: 6,
                        slidesPerGroup: 6,
                        spaceBetween: 20,
                        navigation: {
                            nextEl: `.genre-swiper-${idx} .swiper-button-next`,
                            prevEl: `.genre-swiper-${idx} .swiper-button-prev`,
                        },
                        loop: false,
                    });
                }, 0);
            });
        })
        .catch(err => {
            console.error('영화 데이터를 불러오는 중 오류 발생:', err);
            container.innerHTML = '<p style="color: white; text-align: center;">영화 데이터를 불러오는 중 오류가 발생했습니다.</p>';
        });
}

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
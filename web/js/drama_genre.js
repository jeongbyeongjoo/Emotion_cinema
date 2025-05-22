// 드라마 장르 매핑
const DRAMA_GENRE_MAP = {
    35: "코미디",
    9648: "미스터리",
    10759: "액션 & 어드벤처",
    10751: "가족",
    10766: "연속극",
    10768: "전쟁",
    99: "다큐멘터리"
};

// 드라마 데이터 가져오기
fetch('./json/dramas_popularity.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('드라마 데이터 로드됨:', data.length);
        const container = document.getElementById('drama-genre-section');
        if (!container) {
            console.error('drama-genre-section을 찾을 수 없습니다');
            return;
        }

        const genreMap = {};

        // 각 장르별로 드라마 분류
        data.forEach(drama => {
            if (!drama.genre_ids || !drama.poster_path || !drama.title) {
                console.log('누락된 데이터가 있는 드라마:', drama.title);
                return;
            }

            const genres = drama.genre_ids.map(id => DRAMA_GENRE_MAP[id]).filter(Boolean);

            genres.forEach(genre => {
                if (!genreMap[genre]) {
                    genreMap[genre] = [];
                }
                genreMap[genre].push(drama);
            });
        });

        // 각 장르별로 평점순 정렬 및 상위 20개 선택
        Object.keys(genreMap).forEach(genre => {
            genreMap[genre].sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
            genreMap[genre] = genreMap[genre].slice(0, 20);
        });

        // 장르별 섹션 생성
        Object.entries(genreMap).forEach(([genre, dramas], idx) => {
            if (dramas.length === 0) return;

            const section = document.createElement('div');
            section.className = 'genre-section';

            const title = document.createElement('h2');
            title.className = 'genre-title';
            title.textContent = `${genre} 시리즈`;
            section.appendChild(title);

            // Swiper 구조
            const swiperContainer = document.createElement('div');
            swiperContainer.className = `swiper drama-genre-swiper drama-genre-swiper-${idx}`;

            const swiperWrapper = document.createElement('div');
            swiperWrapper.className = 'swiper-wrapper';

            dramas.forEach((drama, index) => {
                const slide = document.createElement('div');
                slide.className = 'swiper-slide';
                const card = document.createElement('a');
                card.className = 'movie-card';
                card.href = `movie_detail/detail.html?id=${drama.id}&type=tv`;
                card.innerHTML = `<img src="https://image.tmdb.org/t/p/w500${drama.poster_path}" alt="${drama.title || drama.name}">`;
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
                new Swiper(`.drama-genre-swiper-${idx}`, {
                    slidesPerView: 6,
                    slidesPerGroup: 6,
                    spaceBetween: 20,
                    navigation: {
                        nextEl: `.drama-genre-swiper-${idx} .swiper-button-next`,
                        prevEl: `.drama-genre-swiper-${idx} .swiper-button-prev`,
                    },
                    loop: false,
                });
            }, 0);
        });
    })
    .catch(error => {
        console.error('드라마 데이터를 불러오는 중 오류 발생:', error);
    });

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
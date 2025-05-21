// 드라마 장르 매핑
const DRAMA_GENRE_MAP = {
    18: " ",
    35: "코미디",
    9648: "미스터리"
};

// 드라마 데이터 가져오기
fetch('./json/dramas_top10.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('드라마 데이터 로드됨:', data.length);
        const container = document.getElementById('drama-container');
        if (!container) {
            console.error('drama-container를 찾을 수 없습니다');
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
                if (drama.score) {
                    genreMap[genre].push(drama);
                }
            });
        });

        // 각 장르별로 평점순 정렬 및 상위 20개 선택
        Object.keys(genreMap).forEach(genre => {
            genreMap[genre].sort((a, b) => b.score - a.score);
            genreMap[genre] = genreMap[genre].slice(0, 20);
        });

        // 장르별 섹션 생성
        Object.entries(genreMap).forEach(([genre, dramas]) => {
            const section = document.createElement('div');
            section.className = 'genre-section';

            const title = document.createElement('h2');
            title.className = 'genre-title';
            title.textContent = `${genre} 드라마`;
            section.appendChild(title);

            const grid = document.createElement('div');
            grid.className = 'movie-grid';

            // 드라마 카드 생성
            dramas.forEach((drama, index) => {
                const card = document.createElement('a');
                card.className = 'movie-card';
                card.href = `movie_detail/detail.html?id=${drama.id}`;

                const image = document.createElement('img');
                image.src = 'https://image.tmdb.org/t/p/w500' + drama.poster_path;  // URL 직접 사용
                image.alt = drama.title;

                const info = document.createElement('div');
                info.className = 'movie-info';

                const title = document.createElement('p');
                title.className = 'movie-title';
                title.textContent = `${index + 1}. ${drama.title}`;

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
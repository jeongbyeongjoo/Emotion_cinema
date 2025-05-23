// 검색창에 입력하면서 그 아래 자동완성 하는 기능 구현하는 스크립트
// 구글에 검색할 때 처럼 자동완성 해줘야함
// 
// 1. json파일 불러 배열에 저장하기
// 2. 자동완성하고 영화 제목들을 HTML에 출력하기
// 3. 엔터 누르면 상세 페이지로 이동하기

let suggestions = [] // 전역변수로 영화 이름을 저장하는 배열 선언
// 1.
const jsonPath = window.location.pathname.includes('/movie_detail/')
    ? '../json/'
    : 'json/';

// 영화 데이터 로드
fetch(jsonPath + 'all_movies.json')
    .then(response => {
        if (!response.ok) throw new Error('JSON 파일을 불러오지 못했습니다.');
        return response.json();
    })
    .then(movies => {
        suggestions = suggestions.concat(movies.map(x => x.title));
    })
    .catch(err => {
        console.error('에러 발생:', err);
    });

// TV 시리즈 데이터 로드
fetch(jsonPath + 'dramas_top10.json')  // all_tv_shows.json을 dramas_top10.json으로 변경
    .then(response => {
        if (!response.ok) throw new Error('JSON 파일을 불러오지 못했습니다.');
        return response.json();
    })
    .then(tv => {
        suggestions = suggestions.concat(tv.map(x => x.title || x.name));
    })
    .catch(err => {
        console.error('에러 발생:', err);
    });

// 2.
const searchInput = document.getElementById('searchInput');
const suggestionList = document.getElementById('suggestions');
searchInput.addEventListener('input', () => {
    const input = searchInput.value.toLowerCase(); //입력값 소문자로 변경
    suggestionList.innerHTML = ''; // 자동완성 리스트 비우고 시작
    if (input === '') return; // 아직 입력을 안한 경우

    const filtered = suggestions.filter(item => item.toLowerCase().includes(input));
    //suggestions에서 filter(조건)를 만족하는 새배열을 만듬 -> filtered / 요소를 소문자로 바꾸고 입력값이 포함되어 있는 문자열이면 반환
    filtered.forEach(item => { // filtered 배열에 모든 문자열에 대해 -> 자동완성된 영화 제목들f
        const li = document.createElement('li'); //li 태그 생성
        li.textContent = item; //li 안의 내용은 item 문자열로 채움
        li.addEventListener('click', () => { // 자동완성된 제목을 누른 경우
            searchInput.value = item; // 입력값을 자동완성 시킴
            suggestionList.innerHTML = ''; // 자동완성 목록 지우기
        });
        suggestionList.appendChild(li); // ul 태그의 자식 노드로 자동완성을 집어 넣음! 끝!
    });
});

// 3. 엔터 누르면 상세 페이지로 이동하기
searchInput.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        goToUrl();
    }
});

function goToUrl() {
    const jsonPath = window.location.pathname.includes('/movie_detail/')
        ? '../json/'
        : 'json/';

    // 상세페이지에서의 URL 생성 시 올바른 상대 경로 설정
    const isDetailPage = window.location.pathname.includes('/movie_detail/');

    // 먼저 영화 검색
    fetch(jsonPath + 'all_movies.json')
        .then(response => {
            if (!response.ok) throw new Error('JSON 파일을 불러오지 못했습니다.');
            return response.json();
        })
        .then(movies => {
            let obj = movies.find(movie => movie.title === searchInput.value);
            if (obj) {
                const url = isDetailPage
                    ? `detail.html?id=${obj.id}&type=movie`
                    : `movie_detail/detail.html?id=${obj.id}&type=movie`;
                window.location.href = url;
                return;
            }

            // 영화에서 찾지 못한 경우 TV 시리즈에서 검색
            return fetch(jsonPath + 'dramas_top10.json');
        })
        .then(response => {
            if (!response.ok) throw new Error('JSON 파일을 불러오지 못했습니다.');
            return response.json();
        })
        .then(dramas => {
            let obj = dramas.find(drama => (drama.title || drama.name) === searchInput.value);
            if (obj) {
                const url = isDetailPage
                    ? `detail.html?id=${obj.id}&type=tv`
                    : `movie_detail/detail.html?id=${obj.id}&type=tv`;
                window.location.href = url;
            } else {
                alert("컨텐츠를 찾을 수 없습니다.");
            }
        })
        .catch(err => {
            console.error('에러 발생:', err);
        });
}

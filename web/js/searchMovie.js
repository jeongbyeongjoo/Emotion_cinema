// 검색창에 입력하면서 그 아래 자동완성 하는 기능 구현하는 스크립트
// 구글에 검색할 때 처럼 자동완성 해줘야함
//
let suggestions = [] // 전역변수로 영화 이름을 저장하는 배열 선언
//suggestions = [
//   'apple', 'banana', 'cherry', 'date', 'grape',
//   'kiwi', 'lemon', 'mango', 'melon', 'orange',
//   'peach', 'pear', 'pineapple', 'plum', 'strawberry', 'watermelon',
//   'iron man', 'iron man2', 'iron man3', 'ira'
// ]; 


fetch('json/top.json') // 비동기식, 데이터 파일 읽어옴
  .then(response => { // 작업 성공시 실행
    if (!response.ok) throw new Error('JSON 파일을 불러오지 못했습니다.');
    return response.json(); // 다음 .then으로 값 리턴
  })
  .then(movies => { // 영화 정보 객체를 담은 배열 가져옴
    suggestions = movies.map(x => x.title).sort() // top.json의 배열안에 있는 객체의 title만 모두 따와서 오름차순으로 정렬하고 전역변수에 담기
    //console.log(suggestions);
  })
  .catch(err => { // 오류 발생
    console.error('에러 발생:', err);
  });


const searchInput = document.getElementById('searchInput');
const suggestionList = document.getElementById('suggestions');

searchInput.addEventListener('input', () => { 
  const input = searchInput.value.toLowerCase(); //입력값 소문자로 변경
  suggestionList.innerHTML = ''; // 자동완성 리스트

  if (input === '') return; // 아직 입력을 안한 경우

  const filtered = suggestions.filter(item => item.toLowerCase().includes(input)); 
  //suggestions에서 filter(조건)를 만족하는 새배열을 만듬 -> filtered / 요소를 소문자로 바꾸고 입력값이 포함되어 있는 문자열이면 반환

  filtered.forEach(item => { // filtered 배열에 모든 문자열에 대해 -> 자동완성된 영화 제목들
    const li = document.createElement('li'); //li 태그 생성
    li.textContent = item; //li 안의 내용은 item 문자열로 채움
    li.addEventListener('click', () => { // 자동완성된 제목을 누른 경우
      searchInput.value = item; // 입력값을 자동완성 시킴
      suggestionList.innerHTML = ''; // 자동완성 목록 지우기
    });
    suggestionList.appendChild(li); // ul 태그의 자식 노드로 자동완성을 집어 넣음! 끝!
  });
});
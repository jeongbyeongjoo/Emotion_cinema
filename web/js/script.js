fetch('json/top.json')
  .then(response => {
    if (!response.ok) throw new Error('JSON 파일을 불러오지 못했습니다.');
    return response.json();
  })
  .then(movies => {
    const ul = document.getElementById('movie-list');
    movies.results.forEach(movie => {
      const li = document.createElement('li');
      li.textContent = movie.title;
      ul.appendChild(li);
    });
  })
  .catch(err => {
    console.error('에러 발생:', err);
  });

const suggestions = [
  'apple', 'banana', 'cherry', 'date', 'grape',
  'kiwi', 'lemon', 'mango', 'melon', 'orange',
  'peach', 'pear', 'pineapple', 'plum', 'strawberry', 'watermelon',
  'iron man', 'iron man2', 'iron man3', 'ira'
];

const searchInput = document.getElementById('searchInput');
const suggestionList = document.getElementById('suggestions');

searchInput.addEventListener('input', () => {
  const input = searchInput.value.toLowerCase();
  suggestionList.innerHTML = '';

  if (input === '') return;

  const filtered = suggestions.filter(item => item.toLowerCase().includes(input));

  filtered.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    li.addEventListener('click', () => {
      searchInput.value = item;
      suggestionList.innerHTML = '';
    });
    suggestionList.appendChild(li);
  });
});
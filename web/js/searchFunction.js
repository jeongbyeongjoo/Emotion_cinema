const searchBox = document.getElementById('search-box');
const autocompleteList = document.getElementById('autocomplete-list');

const suggestions = ['apple', 'banana', 'carrot', 'dragonfruit'];

searchBox.addEventListener('input', function () {
  const input = this.value.toLowerCase();
  autocompleteList.innerHTML = '';

  if (input) {
    const matches = suggestions.filter(item => item.toLowerCase().includes(input));
    matches.forEach(match => {
      const li = document.createElement('li');
      li.textContent = match;
      li.addEventListener('click', () => {
        searchBox.value = match;
        autocompleteList.innerHTML = '';
      });
      autocompleteList.appendChild(li);
    });
  }
});
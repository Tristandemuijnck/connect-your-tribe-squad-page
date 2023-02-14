const filterBtn = document.querySelector('.filter-heading');
const filterList = document.querySelector('.filter-options');

filterBtn.addEventListener('click', function() {
    filterList.classList.toggle('filter-open');
});
const filterBtn = document.querySelector('.filter-heading')
const filterList = document.querySelector('.filter-options')

filterBtn.addEventListener('click', function() {
    filterList.classList.toggle('filter-open')
});

const checkboxes = document.querySelectorAll('.filter-option input[type="radio"]')
const form = document.querySelector('.filters')

checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => form.submit());
})

console.log(window.location.href)
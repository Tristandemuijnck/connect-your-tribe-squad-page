// Open filters
const filterBtn = document.querySelector('.filter-heading')
const filterList = document.querySelector('.filter-options')

filterBtn.addEventListener('click', function() {
    filterList.classList.toggle('filter-open')
});

// Submit form on radio button change
const checkboxes = document.querySelectorAll('.filter-option input[type="radio"]')
const form = document.querySelector('.filters')

checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        form.submit()
    })
})

// Reset filters
const resetBtn = document.querySelector('.reset-btn')

resetBtn.addEventListener('click', () => {
    window.open('/', '_self')
})
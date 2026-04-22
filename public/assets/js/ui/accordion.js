// UI: Product accordion and FAQ toggle

function toggleAcc(btn) {
    var item = btn.closest('.acc-item');
    var isOpen = item.classList.contains('open');
    document.querySelectorAll('.acc-item.open').forEach(function(el) { el.classList.remove('open'); });
    if (!isOpen) item.classList.add('open');
}

function openProduct(accId) {
    var section = document.getElementById('produtos');
    var item = document.getElementById(accId);
    if (!section || !item) return;
    document.querySelectorAll('.acc-item.open').forEach(function(el){ el.classList.remove('open'); });
    item.classList.add('open');
    setTimeout(function(){
        item.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 50);
}

function toggleFAQ(button) {
    const content = button.nextElementSibling;
    const icon = button.querySelector('.faq-icon');

    // Close other items
    document.querySelectorAll('.faq-content').forEach(item => {
        if (item !== content) {
            item.style.height = '0';
            item.previousElementSibling.querySelector('.faq-icon').style.transform = 'rotate(0deg)';
        }
    });

    // Toggle current item
    if (content.style.height === '0px' || content.style.height === '') {
        content.style.height = content.scrollHeight + 'px';
        icon.style.transform = 'rotate(180deg)';
    } else {
        content.style.height = '0';
        icon.style.transform = 'rotate(0deg)';
    }
}

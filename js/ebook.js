document.addEventListener('DOMContentLoaded', () => {
    /* =============================
        RECOMMEND CHECKBOX
    ==============================*/
    document.querySelectorAll('.recommend_check').forEach(cb => {
        cb.addEventListener('change', () => {
            const checked = document.querySelectorAll('.recommend_check:checked').length;
            document.querySelector('.recommend_msg').classList.toggle('visible', checked >= 2);
        });
    });

    /* =============================
        FADE UP ANIMATION
    ==============================*/
    observeOnce('.fade_up', 'visible', 0.2);
});
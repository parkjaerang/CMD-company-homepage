document.addEventListener('DOMContentLoaded', () => {
    observeOnce('.portfolio_title_line', 'in_view', 0.3);
    observeOnce('.pf_item', 'pf--in', 0.18);
    observeOnce('.record_title_line', 'in_view', 0.3);

    /* =============================
        RECORD ITEM LOAD MORE
    ==============================*/
    const groups = document.querySelectorAll('.record_group');
    const moreBtnWrap = document.querySelector('.morebtn_wrap');
    let shownGroups = 0;

    function showMore() {
        if (shownGroups >= groups.length) return;

        const group = groups[shownGroups];
        group.classList.add('record_group--visible');

        const items = group.querySelectorAll('.record_item');
        items.forEach((item, i) => {
            const delay = i * 60;
            setTimeout(() => requestAnimationFrame(() => item.classList.add('visible')), delay);
        });

        shownGroups++;

        if (shownGroups >= groups.length && moreBtnWrap) {
            moreBtnWrap.style.display = 'none';
        }
    }

    showMore();//2024 첫 그룹은 페이지 로드 시 바로 보여주기
    showMore();//2025 두 번째 그룹도 페이지 로드 시 바로 보여주기
    showMore();//2026 세 번째 그룹도 페이지 로드 시 바로 보여주기 (총 세 그룹 노출)
    //2027년부터 더보기 버튼으로 그룹 노출 (네 번째 그룹부터 더보기 버튼으로 노출)

    if (moreBtnWrap) moreBtnWrap.addEventListener('click', showMore);

    /* =============================
        MOBILE ACCORDION
    ==============================*/
    function toggleAccordion(item) {
        const isOpen = item.classList.contains('record_item--open');
        document.querySelectorAll('.record_item--open').forEach(function(el) {
            el.classList.remove('record_item--open');
        });
        if (!isOpen) item.classList.add('record_item--open');
    }

    document.querySelectorAll('.record_item--linked, .record_item--coming').forEach(function(item) {
        // 토글 버튼: 아코디언만 열고 닫기
        const toggleBtn = item.querySelector('.record_toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                toggleAccordion(item);
            });
        }

        item.addEventListener('click', function(e) {
            // 아코디언 내부 링크 버튼: 이동 허용
            if (e.target.closest('.record_accordion_btn')) return;
            // 아코디언 내부 텍스트 링크: 이동 허용
            if (e.target.closest('.record_accordion_text')) return;
            // 아코디언 내부 이미지 클릭: 상세페이지로 이동
            if (e.target.closest('.record_accordion_inner img')) {
                const link = item.querySelector('.record_accordion_btn');
                if (link) { window.location.href = link.href; }
                return;
            }
            // 토글 버튼은 자체 핸들러가 처리   
            if (e.target.closest('.record_toggle')) return;
            // 텍스트/행 클릭: 아코디언 토글
            e.preventDefault();
            toggleAccordion(item);
        });
    });
});

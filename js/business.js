/* ============================================================
    business.js — Business 페이지 전용 인터랙션
============================================================ */

// ─── 상수 ────────────────────────────────────────────────────
const OBSERVER_THRESHOLD = { DETAIL: 0.12 };

const SECTION_LETTER_MAP = {
    service_consulting:  '.cmd_c',
    service_marketing:   '.cmd_m',
    service_development: '.cmd_d',
};

// ─── 서비스 카드 스크롤 애니메이션 ───────────────────────────
function initServiceAnimation() {
    const items = document.querySelectorAll('.service_detail');
    if (!items.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        });
    }, { threshold: OBSERVER_THRESHOLD.DETAIL });

    items.forEach(el => observer.observe(el));
}

// ─── CMD 레이블 글자 하이라이트 ──────────────────────────────
function initCmdLabel() {
    const labelEl = document.querySelector('.business_label');
    if (!labelEl) return;

    const letters = {
        service_consulting:  document.querySelector('.cmd_c'),
        service_marketing:   document.querySelector('.cmd_m'),
        service_development: document.querySelector('.cmd_d'),
    };

    const allLetters  = Object.values(letters).filter(Boolean);
    const sections    = Object.keys(letters)
        .map(id => document.getElementById(id))
        .filter(Boolean);

    let currentSection = null;

    function setActive(sectionId) {
        allLetters.forEach(l => l.classList.remove('active'));
        if (sectionId) letters[sectionId]?.classList.add('active');
    }

    function onScroll() {
        const labelBottom = labelEl.getBoundingClientRect().bottom;
        let active = null;

        for (const el of sections) {
            if (el.getBoundingClientRect().top <= labelBottom) active = el.id;
        }

        // Fix 1: active가 null(최상단 복귀)일 때도 상태 갱신
        if (active !== currentSection) {
            currentSection = active;
            setActive(active);
        }
    }

    currentSection = 'service_consulting';
    setActive('service_consulting');

    window.addEventListener('scroll', onScroll, { passive: true });

    // Fix 2: Lenis가 DOMContentLoaded 이후에 초기화될 수 있으므로 폴링으로 대기
    (function registerLenis() {
        if (window.__lenis) {
            window.__lenis.on('scroll', onScroll);
        } else {
            let attempts = 0;
            const timer = setInterval(() => {
                attempts++;
                if (window.__lenis) {
                    window.__lenis.on('scroll', onScroll);
                    clearInterval(timer);
                } else if (attempts >= 50) {
                    clearInterval(timer);
                }
            }, 100);
        }
    })();

    // Fix 3: 레이아웃 완성 후 초기 상태 계산
    requestAnimationFrame(onScroll);
}

// ─── 진입점 ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    initServiceAnimation();
    initCmdLabel();
});

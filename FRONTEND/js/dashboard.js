// ========== SIDEBAR TOGGLE ==========
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
}

// ========== ANIMATED COUNTERS ==========
function animateCounter(element, target, duration = 1500) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Number.isInteger(target) ? Math.floor(current) : current.toFixed(1);
    }, 16);
}

// ========== PROGRESS CIRCLE ANIMATION ==========
function animateProgressCircles() {
    const circles = document.querySelectorAll('.progress-circle-bar');
    circles.forEach(circle => {
        const circumference = 2 * Math.PI * 40;
        circle.style.strokeDasharray = circumference;
        circle.style.strokeDashoffset = circumference;

        setTimeout(() => {
            circle.style.transition = 'stroke-dashoffset 1.5s ease';
            circle.style.strokeDashoffset = circumference * 0.25; // 75%
        }, 300);
    });
}

// ========== SKILL BAR ANIMATION ==========
function animateSkillBars() {
    const bars = document.querySelectorAll('.skill-bar-fill');
    bars.forEach((bar, index) => {
        const width = bar.style.width || getComputedStyle(bar).width;
        bar.style.width = '0%';
        setTimeout(() => {
            bar.style.transition = 'width 1s ease';
            bar.style.width = width;
        }, 500 + (index * 200));
    });
}

// ========== STAT CARDS ENTRANCE ==========
function animateStatCards() {
    const cards = document.querySelectorAll('.stat-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 200 + (index * 100));
    });
}

// ========== DARK CARDS ENTRANCE ==========
function animateDarkCards() {
    const cards = document.querySelectorAll('.dark-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateX(-20px)';
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateX(0)';
        }, 400 + (index * 150));
    });
}

// ========== ACTIVITY ITEMS STAGGER ==========
function animateActivities() {
    const items = document.querySelectorAll('.activity-item');
    items.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-15px)';
        setTimeout(() => {
            item.style.transition = 'all 0.4s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, 600 + (index * 120));
    });
}

// ========== PERSON CARDS ENTRANCE ==========
function animatePersonCards() {
    const cards = document.querySelectorAll('.person-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.9)';
        setTimeout(() => {
            card.style.transition = 'all 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
        }, 800 + (index * 100));
    });
}

// ========== SIDE CARDS ENTRANCE ==========
function animateSideCards() {
    const cards = document.querySelectorAll('.time-wallet, .calendar-card, .session-card, .contributors-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 300 + (index * 150));
    });
}

// ========== CONNECT BUTTON INTERACTION ==========
function setupConnectButtons() {
    document.querySelectorAll('.btn-connect').forEach(btn => {
        btn.addEventListener('click', function() {
            const originalText = this.textContent;
            this.textContent = '✓ Connected';
            this.style.background = '#10B981';
            this.style.pointerEvents = 'none';

            setTimeout(() => {
                this.textContent = originalText;
                this.style.background = '';
                this.style.pointerEvents = '';
            }, 2000);
        });
    });
}

// ========== CALENDAR DAY CLICK ==========
function setupCalendar() {
    document.querySelectorAll('.calendar-day:not(.other)').forEach(day => {
        day.addEventListener('click', function() {
            document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// ========== NAV ITEM CLICK ==========
function setupNavItems() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// ========== PEOPLE CAROUSEL NAVIGATION ==========
function setupCarousel() {
    const prevBtn = document.querySelector('.people-nav.prev');
    const nextBtn = document.querySelector('.people-nav.next');
    const carousel = document.querySelector('.people-carousel');

    if (prevBtn && nextBtn && carousel) {
        prevBtn.addEventListener('click', () => {
            carousel.scrollBy({ left: -200, behavior: 'smooth' });
        });
        nextBtn.addEventListener('click', () => {
            carousel.scrollBy({ left: 200, behavior: 'smooth' });
        });
    }
}

// ========== SPARKLINE ANIMATION ==========
function animateSparklines() {
    const sparklines = document.querySelectorAll('.stat-sparkline path');
    sparklines.forEach((path, index) => {
        const length = path.getTotalLength ? path.getTotalLength() : 100;
        path.style.strokeDasharray = length;
        path.style.strokeDashoffset = length;
        setTimeout(() => {
            path.style.transition = 'stroke-dashoffset 1s ease';
            path.style.strokeDashoffset = '0';
        }, 500 + (index * 200));
    });
}

// ========== HERO BANNER ENTRANCE ==========
function animateHero() {
    const hero = document.querySelector('.hero-banner');
    const heroContent = document.querySelector('.hero-content');
    const heroIllustration = document.querySelector('.hero-illustration');

    if (hero) {
        hero.style.opacity = '0';
        hero.style.transform = 'translateY(20px)';
        setTimeout(() => {
            hero.style.transition = 'all 0.8s ease';
            hero.style.opacity = '1';
            hero.style.transform = 'translateY(0)';
        }, 100);
    }

    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateX(-30px)';
        setTimeout(() => {
            heroContent.style.transition = 'all 0.6s ease 0.3s';
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateX(0)';
        }, 300);
    }

    if (heroIllustration) {
        heroIllustration.style.opacity = '0';
        heroIllustration.style.transform = 'translateX(30px)';
        setTimeout(() => {
            heroIllustration.style.transition = 'all 0.6s ease 0.5s';
            heroIllustration.style.opacity = '1';
            heroIllustration.style.transform = 'translateX(0)';
        }, 500);
    }
}

// ========== WALLET CHART ANIMATION ==========
function animateWalletChart() {
    const chart = document.querySelector('.wallet-chart circle:last-child');
    if (chart) {
        const circumference = 2 * Math.PI * 40;
        chart.style.strokeDasharray = circumference;
        chart.style.strokeDashoffset = circumference;
        setTimeout(() => {
            chart.style.transition = 'stroke-dashoffset 1.5s ease';
            chart.style.strokeDashoffset = circumference * 0.25;
        }, 800);
    }
}

// ========== INIT ALL ==========
document.addEventListener('DOMContentLoaded', function() {
    // Entrance animations
    animateHero();
    animateStatCards();
    animateDarkCards();
    animateActivities();
    animatePersonCards();
    animateSideCards();

    // Progress animations
    setTimeout(() => {
        animateProgressCircles();
        animateSkillBars();
        animateSparklines();
        animateWalletChart();
    }, 500);

    // Counter animations
    setTimeout(() => {
        const statValues = document.querySelectorAll('.stat-value');
        const targets = [6, 8, 12, 4.8];
        statValues.forEach((el, i) => {
            animateCounter(el, targets[i]);
        });
    }, 300);

    // Setup interactions
    setupConnectButtons();
    setupCalendar();
    setupNavItems();
    setupCarousel();
});
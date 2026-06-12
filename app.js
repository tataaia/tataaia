// ==========================================================================
// TATA AIA INSURANCE WEBSITE ENGINE (Anjali Devi)
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    
    // Elements
    const preloader = document.getElementById('preloader');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const header = document.querySelector('.glass-header');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    
    // ----------------------------------------------------------------------
    // 0. DEVICE DETECTION & ADAPTATION SYSTEM
    // ----------------------------------------------------------------------
    const isMobileDevice = () => {
        const checkTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        const checkWidth = window.innerWidth <= 768;
        return checkTouch || checkWidth;
    };

    if (isMobileDevice()) {
        document.body.classList.add('is-mobile');
    } else {
        document.body.classList.add('is-desktop');
    }

    // Adapt layout dynamically when window is resized
    window.addEventListener('resize', () => {
        if (isMobileDevice()) {
            document.body.classList.add('is-mobile');
            document.body.classList.remove('is-desktop');
        } else {
            document.body.classList.add('is-desktop');
            document.body.classList.remove('is-mobile');
        }
    });
    
    
    // ----------------------------------------------------------------------
    // 0.5. HOLOGRAM BG WAVE SIMULATION
    // ----------------------------------------------------------------------
    const bgCanvas = document.getElementById('hologramBgCanvas');
    const bgCtx = bgCanvas ? bgCanvas.getContext('2d') : null;

    function resizeBgCanvas() {
        if (bgCanvas) {
            bgCanvas.width = window.innerWidth;
            bgCanvas.height = window.innerHeight;
        }
    }
    window.addEventListener('resize', resizeBgCanvas);
    resizeBgCanvas();

    let waveTheta = 0;
    function animateHologramBg() {
        if (!bgCtx || !bgCanvas) return;
        bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
        
        // 3D vector-smoke/wave rendering
        bgCtx.lineWidth = 1.2;
        const numLines = 7;
        const gap = 50;
        
        for (let i = 0; i < numLines; i++) {
            bgCtx.beginPath();
            const grad = bgCtx.createLinearGradient(0, 0, bgCanvas.width, 0);
            grad.addColorStop(0, 'rgba(0, 75, 135, 0.12)'); // TATA Blue
            grad.addColorStop(0.5, 'rgba(211, 17, 69, 0.08)'); // AIA Crimson Red
            grad.addColorStop(1, 'rgba(184, 134, 11, 0.08)'); // Gold Accent
            bgCtx.strokeStyle = grad;

            const offset = i * gap;
            for (let x = 0; x < bgCanvas.width; x += 15) {
                const y = (bgCanvas.height * 0.45) 
                        + Math.sin(x * 0.0015 + waveTheta + i * 0.6) * 110
                        + Math.cos(x * 0.003 - waveTheta * 0.6 + i * 0.35) * 50
                        + Math.sin(x * 0.008 + waveTheta * 1.2) * 15;
                if (x === 0) {
                    bgCtx.moveTo(x, y - 150 + offset);
                } else {
                    bgCtx.lineTo(x, y - 150 + offset);
                }
            }
            bgCtx.stroke();
        }
        
        waveTheta += 0.004;
        requestAnimationFrame(animateHologramBg);
    }
    animateHologramBg();

    // ----------------------------------------------------------------------
    // 1. MOBILE MENU TOGGLE
    // ----------------------------------------------------------------------
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });
        
        // Close menu on link click
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            });
        });
    }

    // ----------------------------------------------------------------------
    // 2. HEADER SCROLL EFFECT
    // ----------------------------------------------------------------------
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // ----------------------------------------------------------------------
    // 3. PRELOADER FINALIZE
    // ----------------------------------------------------------------------
    if (preloader) {
        let progress = 0;
        const interval = setInterval(() => {
            progress += 5;
            if (progressBar) progressBar.style.width = `${progress}%`;
            if (progressText) progressText.textContent = `${progress}%`;
            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    preloader.style.opacity = '0';
                    preloader.style.visibility = 'hidden';
                }, 300);
            }
        }, 20);
    }

    // ----------------------------------------------------------------------
    // 5. INTERACTIVE HLV CALCULATOR
    // ----------------------------------------------------------------------
    const inputIncome = document.getElementById('calc-income');
    const inputAge = document.getElementById('calc-age');
    const inputRetire = document.getElementById('calc-retire');
    const inputLiabilities = document.getElementById('calc-liabilities');

    const valIncome = document.getElementById('income-val');
    const valAge = document.getElementById('age-val');
    const valRetire = document.getElementById('retire-val');
    const valLiabilities = document.getElementById('liabilities-val');

    const resultHlv = document.getElementById('hlv-result');
    const breakdownIncome = document.getElementById('breakdown-income');
    const breakdownDebt = document.getElementById('breakdown-debt');

    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount).replace('INR', '₹');
    }

    function updateSliderBackground(slider) {
        const min = parseFloat(slider.min) || 0;
        const max = parseFloat(slider.max) || 100;
        const val = parseFloat(slider.value) || 0;
        const percentage = ((val - min) / (max - min)) * 100;
        slider.style.background = `linear-gradient(to right, var(--primary-aia) 0%, var(--primary-aia) ${percentage}%, rgba(0, 75, 135, 0.1) ${percentage}%, rgba(0, 75, 135, 0.1) 100%)`;
    }

    function calculateHLV() {
        const annualIncome = parseInt(inputIncome.value, 10);
        const age = parseInt(inputAge.value, 10);
        const retirement = parseInt(inputRetire.value, 10);
        const liabilities = parseInt(inputLiabilities.value, 10);

        // Update dynamic track fills
        updateSliderBackground(inputIncome);
        updateSliderBackground(inputAge);
        updateSliderBackground(inputRetire);
        updateSliderBackground(inputLiabilities);

        // Update value displays
        valIncome.textContent = formatCurrency(annualIncome);
        valAge.textContent = `${age} Years`;
        valRetire.textContent = `${retirement} Years`;
        valLiabilities.textContent = formatCurrency(liabilities);

        // Minimum age protection logic
        if (retirement <= age) {
            inputRetire.value = age + 1;
            valRetire.textContent = `${age + 1} Years`;
            updateSliderBackground(inputRetire);
        }

        const workingYearsRemaining = Math.max(1, retirement - age);
        
        // --- REAL ACTUARIAL HLV CALCULATION (Income Replacement Method) ---
        // Breadwinner personal expenses (standard 30%) are deducted; 70% goes to family security.
        const familySupportIncome = annualIncome * 0.70; 
        const incomeCover = familySupportIncome * workingYearsRemaining;
        const totalHLV = incomeCover + liabilities;

        // Render results
        resultHlv.textContent = formatCurrency(totalHLV);
        breakdownIncome.textContent = formatCurrency(incomeCover);
        breakdownDebt.textContent = formatCurrency(liabilities);
    }

    if (inputIncome) {
        inputIncome.addEventListener('input', calculateHLV);
        inputAge.addEventListener('input', calculateHLV);
        inputRetire.addEventListener('input', calculateHLV);
        inputLiabilities.addEventListener('input', calculateHLV);
        
        // Initial call
        calculateHLV();
    }

    // ----------------------------------------------------------------------
    // 6. BRAND LOGO REVEAL (INTERSECTION OBSERVER)
    // ----------------------------------------------------------------------
    const revealLogo = document.getElementById('revealLogo');
    const revealContent = document.getElementById('revealContent');
    const logoRevealSection = document.querySelector('.logo-reveal-section');

    if (revealLogo && revealContent && logoRevealSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    revealLogo.classList.add('in-view');
                    revealContent.classList.add('in-view');
                }
            });
        }, { threshold: 0.3 });

        observer.observe(logoRevealSection);
    }

    // ----------------------------------------------------------------------
    // 7. APPOINTMENT FORM ACTION
    // ----------------------------------------------------------------------
    const appointmentForm = document.getElementById('appointmentForm');
    const successMessage = document.getElementById('formSuccessMessage');
    const dateInput = document.getElementById('form-date');

    // Set minimum scheduling date to today
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }

    if (appointmentForm && successMessage) {
        appointmentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = document.getElementById('formSubmitBtn');
            const originalText = submitBtn.innerHTML;
            
            // Show loading state
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Booking...';
            submitBtn.disabled = true;

            // Simulate server network delay
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Show success view
                successMessage.classList.add('show');
                
                // Reset form values after success
                appointmentForm.reset();
            }, 1500);
        });
    }

    // ----------------------------------------------------------------------
    // 8. ACTIVE NAV MENU UPDATE ON SCROLL
    // ----------------------------------------------------------------------
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        sections.forEach(section => {
            if (section) {
                const sectionTop = section.offsetTop - 100;
                if (window.scrollY >= sectionTop) {
                    currentSectionId = section.getAttribute('id');
                }
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });
});


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

    function calculateHLV() {
        const annualIncome = parseInt(inputIncome.value, 10);
        const age = parseInt(inputAge.value, 10);
        const retirement = parseInt(inputRetire.value, 10);
        const liabilities = parseInt(inputLiabilities.value, 10);

        // Update value displays
        valIncome.textContent = formatCurrency(annualIncome);
        valAge.textContent = `${age} Years`;
        valRetire.textContent = `${retirement} Years`;
        valLiabilities.textContent = formatCurrency(liabilities);

        // Minimum age protection logic
        if (retirement <= age) {
            inputRetire.value = age + 1;
            valRetire.textContent = `${age + 1} Years`;
        }

        const workingYearsRemaining = Math.max(1, retirement - age);
        
        // Standard Human Life Value formula: 
        // HLV = (Annual Income * Working Years Remaining) + Liabilities
        // To make it more realistic, we adjust the income factor (usually cover is 15-20x annual income up to retirement)
        const incomeCover = annualIncome * Math.min(20, workingYearsRemaining);
        const totalHLV = incomeCover + liabilities;

        // Render result with counts animation/formatting
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

    // ----------------------------------------------------------------------
    // 9. 3D SPIRAL LADDER scroll ENGINE
    // ----------------------------------------------------------------------
    const track = document.getElementById('ladderScrollTrack');
    const cards = document.querySelectorAll('.ladder-card');
    const totalCards = cards.length;
    const isMobileVal = isMobileDevice();
    const radius = isMobileVal ? 210 : 390; // Increased radius to prevent cards overlapping
    const ySpacing = isMobileVal ? 85 : 135; // Increased vertical spacing for clear breathing room

    // Arrange cards in a helical staircase at start
    cards.forEach((card, i) => {
        const angle = i * (360 / totalCards);
        const yOffset = i * ySpacing;
        card.style.transform = `rotateY(${angle}deg) translateZ(${radius}px) translateY(${yOffset}px)`;
    });

    const ladderSection = document.getElementById('interactive-ladder');
    
    function getLadderScrollProgress() {
        if (!ladderSection) return 0;
        const scrollStart = ladderSection.offsetTop;
        const scrollRange = ladderSection.scrollHeight - window.innerHeight;
        const relativeScroll = window.scrollY - scrollStart;
        return Math.max(0, Math.min(1, relativeScroll / scrollRange));
    }

    let targetRotation = 0;
    let easedRotation = 0;
    let targetY = 0;
    let easedY = 0;
    const lerpFactor = 0.09; // Snappier LERP factor (0.09) for a stronger and faster scroll tracking response

    // Audio & Haptic System
    let audioCtx = null;
    let lastActiveIndex = -1;

    function initAudioContext() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }

    // Bind initialization to user interactions
    window.addEventListener('click', initAudioContext, { once: true });
    window.addEventListener('scroll', initAudioContext, { once: true });
    window.addEventListener('touchstart', initAudioContext, { once: true });

    function playTickHaptic() {
        if (!audioCtx) return;
        try {
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
            // Synthesize short premium physical click/pop sound
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(1400, audioCtx.currentTime); // high mechanical tick
            osc.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.04);
            
            gain.gain.setValueAtTime(0.05, audioCtx.currentTime); // quiet tick
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);
            
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            
            osc.start();
            osc.stop(audioCtx.currentTime + 0.045);
        } catch (err) {
            // ignore audio context failures
        }

        // Trigger phone hardware vibration haptic if supported
        if (navigator.vibrate) {
            navigator.vibrate(10); // short gentle tap
        }
    }

    function animateLadder() {
        const progress = getLadderScrollProgress();
        
        // Helix rotations and translations aligned to center the active card perfectly facing forward
        targetRotation = -progress * (totalCards - 1) * (360 / totalCards);
        targetY = -progress * (totalCards - 1) * ySpacing;

        easedRotation += (targetRotation - easedRotation) * lerpFactor;
        easedY += (targetY - easedY) * lerpFactor;

        if (track) {
            // translateZ pushes the track slightly back to create depth, rotateX gives an interactive perspective tilt (-14deg)
            track.style.transform = `translateZ(-150px) rotateX(-14deg) rotateY(${easedRotation}deg) translateY(${easedY}px)`;
        }

        // Adjust visibility card properties (opacity, blur) based on depth
        const activeIndex = Math.round(progress * (totalCards - 1));
        
        // Trigger haptics when index changes
        if (activeIndex !== lastActiveIndex) {
            if (lastActiveIndex !== -1) {
                playTickHaptic();
            }
            lastActiveIndex = activeIndex;
        }

        cards.forEach((card, i) => {
            if (i === activeIndex) {
                card.style.opacity = "1";
                card.style.filter = "none";
                card.classList.add('active');
            } else {
                const dist = Math.min(Math.abs(i - activeIndex), totalCards - Math.abs(i - activeIndex));
                card.style.opacity = `${Math.max(0.12, 1 - dist * 0.25)}`;
                card.style.filter = `blur(${Math.min(5, dist * 1.5)}px) grayscale(${Math.min(0.8, dist * 0.25)})`;
                card.classList.remove('active');
            }
        });

        requestAnimationFrame(animateLadder);
    }
    
    if (ladderSection) {
        animateLadder();
    }

    // ----------------------------------------------------------------------
    // 10. POLICY DETAIL DATASET & MODAL HANDLER
    // ----------------------------------------------------------------------
    const policyDetails = [
        {
            title: "Maha Raksha Supreme",
            tag: "Term Insurance Plan",
            img: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=800&auto=format&fit=crop",
            desc: "Maha Raksha Supreme is a top-tier term protection program designed to provide high sum assured values at very affordable premiums. It ensures complete security for family continuity.",
            entryAge: "18 to 65 Years",
            taxExemption: "Sec 80C & 10(10D)",
            sumAssured: "₹ 1 Crore Minimum",
            benefits: [
                { title: "Pure Risk Cover", desc: "Guaranteed cash payout to beneficiaries in case of critical eventuality." },
                { title: "Critical Illness Rider", desc: "Option to accelerate cash payout upon detection of pre-defined serious conditions." },
                { title: "Life Stage Add-ons", desc: "Increase coverage on milestone events like marriage or child education without medical checks." },
                { title: "Flexi-Pay Options", desc: "Pay premiums for limited years while enjoying protection for full policy term." }
            ]
        },
        {
            title: "Fortune Guarantee Plus",
            tag: "Savings & Investment Plan",
            img: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=800&auto=format&fit=crop",
            desc: "A guaranteed savings accumulation vehicle that generates predictable cash flows. Provides immediate liquidity using policy loan facilities up to 90%.",
            entryAge: "1 to 60 Years",
            taxExemption: "Sec 80C & Tax-Free Returns",
            sumAssured: "10x Annual Premium",
            benefits: [
                { title: "100% Guaranteed", desc: "Every single return payout amount is locked in contractually at the time of policy purchase." },
                { title: "90% Policy Loan", desc: "Borrow up to 90% of policy cash surrender value for business expansion or emergency events." },
                { title: "Regular Cash Back", desc: "Choose annual or monthly payouts to create a regular passive salary stream." },
                { title: "In-built Life Protection", desc: "Maintains absolute family protection while your investments grow safely." }
            ]
        },
        {
            title: "Saral Pension Plan",
            tag: "Retirement Annuity Plan",
            img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop",
            desc: "Secure your gold years with immediate or deferred lifetime guaranteed regular pension payouts. Fully protects against investment risks in retirement.",
            entryAge: "40 to 80 Years",
            taxExemption: "Annuity Purchases Benefits",
            sumAssured: "Annuity Purchase Price Basis",
            benefits: [
                { title: "Lifetime Guaranteed", desc: "Annuity payouts are paid for life, fully insulating you from inflation and market crashes." },
                { title: "Joint Spouse Life Cover", desc: "Pension continues to your spouse in case of eventuality without any deduction." },
                { title: "Purchase Price Refund", desc: "Complete return of purchase price to heirs upon policy termination." },
                { title: "Loan Option", desc: "Emergency cash loans available directly from the policy after six months." }
            ]
        },
        {
            title: "Insta Shield Rider",
            tag: "Accident & Disability Cover",
            img: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=80&w=800&auto=format&fit=crop",
            desc: "Add instant support layers to your core policy to safeguard your lifestyle and income if an unexpected accident or permanent disability occurs.",
            entryAge: "18 to 65 Years",
            taxExemption: "Sec 80D Medical Benefits",
            sumAssured: "Up to 100% Core Policy",
            benefits: [
                { title: "Accidental Payouts", desc: "Provides high supplementary cash payouts in case of death due to accidents." },
                { title: "Disability Support", desc: "Waives off future policy premiums while paying monthly cash income if permanent disability occurs." },
                { title: "Immediate Cash Flow", desc: "Instant digital processing for immediate relief expenses." },
                { title: "Comprehensive Coverage", desc: "Extends overseas to cover international travels." }
            ]
        },
        {
            title: "Critikhare Health Shield",
            tag: "Critical Illness Protection",
            img: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=800&auto=format&fit=crop",
            desc: "Beating medical inflation requires massive upfront payouts. Get instant cash payouts on detection of major illnesses like cancer or heart failure.",
            entryAge: "18 to 65 Years",
            taxExemption: "Sec 80D Health Benefits",
            sumAssured: "₹ 10 Lakhs to ₹ 50 Lakhs",
            benefits: [
                { title: "Lump Sum Payout", desc: "Entire sum assured is paid immediately upon diagnosis, regardless of actual medical bills." },
                { title: "40+ Major Illnesses", desc: "Extensive protection mapping out cardiac, neural, organ failure, and cancer treatments." },
                { title: "Second Opinion Cover", desc: "Free online doctor consults with global specialists included." },
                { title: "Premium Waiver", desc: "All remaining policy premiums are waived off if critical illness occurs." }
            ]
        },
        {
            title: "Smart Kid Planner",
            tag: "Child's Higher Education",
            img: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=800&auto=format&fit=crop",
            desc: "Protect and build child milestones like university admissions, business setup, or wedding expenses with locked-in guarantees.",
            entryAge: "0 to 18 Years (Child)",
            taxExemption: "Sec 80C & Tax-Free Payouts",
            sumAssured: "₹ 50 Lakhs Target Basis",
            benefits: [
                { title: "Milestone Payouts", desc: "Guaranteed cash payouts distributed during key collegiate years (ages 18, 20, 22)." },
                { title: "In-built Premium Waiver", desc: "If parent passes away, policy continues with all future premiums paid by the insurer." },
                { title: "Guaranteed Boosters", desc: "Loyalty addition boosts accumulated wealth at maturity." },
                { title: "Dynamic Customization", desc: "Select payout intervals that align with your child's educational track." }
            ]
        },
        {
            title: "Wealth Pro ULIP",
            tag: "Market-Linked Growth",
            img: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=800&auto=format&fit=crop",
            desc: "Unleash high performance with equity fund selections while protecting your capital with institutional life cover layers.",
            entryAge: "1 to 65 Years",
            taxExemption: "Sec 80C & 10(10D) (Under Cap)",
            sumAssured: "10x Annual Premium",
            benefits: [
                { title: "11 Fund Choices", desc: "Access high-performing TATA fund selectors spanning large-cap, mid-cap, and balanced options." },
                { title: "Free Fund Switches", desc: "Rebalance assets up to 12 times a year without incurring any transaction tax charges." },
                { title: "Loyalty Additions", desc: "Reward program inserts extra fund units into your portfolio at intervals." },
                { title: "Accidental Cover", desc: "Includes optional accidental death benefit shields." }
            ]
        },
        {
            title: "Sampoorna Raksha",
            tag: "Whole Life Protection",
            img: "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=800&auto=format&fit=crop",
            desc: "Build absolute generational inheritance plans. Provide financial security that spans your entire life, up to 100 years of age.",
            entryAge: "18 to 60 Years",
            taxExemption: "Sec 80C & 10(10D)",
            sumAssured: "₹ 2 Crore Minimum Target",
            benefits: [
                { title: "Cover to Age 100", desc: "Maintains financial security until the age of 100, ensuring estate legacy transfer." },
                { title: "Bonus Accumulation", desc: "Eligible for annual bonuses that augment final payout values." },
                { title: "Flexible Payouts", desc: "Beneficiaries can receive payouts as a lump sum, monthly regular income, or both." },
                { title: "Policy Loans", desc: "Access emergency credit lines directly against the policy asset value." }
            ]
        },
        {
            title: "Group Employee Cover",
            tag: "Corporate Protection",
            img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop",
            desc: "Attract and secure top talent with comprehensive term insurance, gratuity, and retirement plans under one enterprise policy.",
            entryAge: "18 to 60 Years",
            taxExemption: "Business Expense Deduction",
            sumAssured: "Custom Corporate Structure",
            benefits: [
                { title: "Custom Fit Plans", desc: "Select protection bands matching key ranks, salary multiples, or tenure periods." },
                { title: "Zero Medical Check-ups", desc: "Simplified employee intake below key thresholds with zero medical hassles." },
                { title: "Tax Efficiency", desc: "Premiums paid are fully deductible as business expenses for corporate taxation." },
                { title: "Global Payouts", desc: "Assists families globally with digital claims processing." }
            ]
        },
        {
            title: "Keyman Insurance Shield",
            tag: "Business Continuity Plan",
            img: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop",
            desc: "Protect your corporate structure from the massive financial loss that can result from the eventuality of a key leader or shareholder.",
            entryAge: "18 to 65 Years",
            taxExemption: "Corporate Tax Deductions",
            sumAssured: "Company Valuation Basis",
            benefits: [
                { title: "Business Protection", desc: "Provides high cash flows to cover loss of client contracts or key operations." },
                { title: "Partner Buy-outs", desc: "Supplies liquidity to purchase partner shares from their heirs, avoiding partner disputes." },
                { title: "Loan Collaterals", desc: "Keyman policy values can act as business loan security with banks." },
                { title: "Keyman Loyalty", desc: "Option to transfer policy to employee upon successful career completion as retirement award." }
            ]
        }
    ];

    const detailModal = document.getElementById('policy-detail-modal');
    const modalBodyContent = document.getElementById('modalBodyContent');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const modalOverlay = document.getElementById('modalOverlay');

    function openPolicyModal(index) {
        const data = policyDetails[index];
        if (!data) return;

        // Build benefits list HTML
        let benefitsHtml = '';
        data.benefits.forEach(b => {
            benefitsHtml += `
                <div class="benefit-item">
                    <i class="fas fa-check-circle"></i>
                    <div>
                        <h5>${b.title}</h5>
                        <p>${b.desc}</p>
                    </div>
                </div>
            `;
        });

        // Dynamic HTML injection
        modalBodyContent.innerHTML = `
            <div class="modal-hero">
                <div class="modal-title-box">
                    <span class="modal-subtitle">${data.tag}</span>
                    <h2>${data.title}</h2>
                    <p class="modal-desc">${data.desc}</p>
                </div>
                <img src="${data.img}" alt="${data.title}" class="modal-hero-img">
            </div>
            
            <div class="modal-grid-specs">
                <div class="modal-spec-card">
                    <i class="fas fa-calendar-alt"></i>
                    <h4>Eligible Age Limit</h4>
                    <p>${data.entryAge}</p>
                </div>
                <div class="modal-spec-card">
                    <i class="fas fa-piggy-bank"></i>
                    <h4>Tax Exemption Type</h4>
                    <p>${data.taxExemption}</p>
                </div>
                <div class="modal-spec-card">
                    <i class="fas fa-shield-heart"></i>
                    <h4>Coverage Sum Target</h4>
                    <p>${data.sumAssured}</p>
                </div>
            </div>

            <div class="modal-benefits-section">
                <h3>Key Policy Features & Payouts</h3>
                <div class="benefits-list">
                    ${benefitsHtml}
                </div>
            </div>

            <div class="modal-actions">
                <a href="#contact" class="btn btn-secondary" onclick="closePolicyModal()">Ask Advisor</a>
                <a href="#contact" class="btn btn-primary" onclick="closePolicyModal()">Enquire Plan</a>
            </div>
        `;

        if (detailModal) {
            detailModal.classList.add('show');
            document.body.style.overflow = 'hidden'; // freeze background scrolling
        }
    }

    window.closePolicyModal = function() {
        if (detailModal) {
            detailModal.classList.remove('show');
            document.body.style.overflow = ''; // restore background scrolling
        }
    };

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', window.closePolicyModal);
    }
    if (modalOverlay) {
        modalOverlay.addEventListener('click', window.closePolicyModal);
    }

    // Attach click listeners to cards
    cards.forEach((card, i) => {
        card.addEventListener('click', () => {
            openPolicyModal(i);
        });
    });
});


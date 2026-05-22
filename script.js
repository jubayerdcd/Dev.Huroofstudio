document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------
    // 1. Dynamic Cursor Ambient Glow
    // -------------------------------------------------------------
    const cursorGlow = document.createElement('div');
    cursorGlow.className = 'cursor-trail';
    document.body.appendChild(cursorGlow);

    document.addEventListener('mousemove', (e) => {
        cursorGlow.style.opacity = '1';
        cursorGlow.style.transform = `translate3d(${e.clientX - 125}px, ${e.clientY - 125}px, 0)`;
    });

    document.addEventListener('mouseleave', () => {
        cursorGlow.style.opacity = '0';
    });

    // -------------------------------------------------------------
    // 2. Interactive Card Hover Light (Radial Gradient Follower)
    // -------------------------------------------------------------
    const hoverGlowCards = document.querySelectorAll('.card-hover-glow');
    hoverGlowCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width;
            const y = e.clientY - rect.top - rect.height;
            card.style.setProperty('--x', `${x}px`);
            card.style.setProperty('--y', `${y}px`);
        });
    });

    // -------------------------------------------------------------
    // 3. 3D Tilt Effect on Floating Cards & Premium Widgets
    // -------------------------------------------------------------
    const tiltElements = document.querySelectorAll('[data-tilt]');
    tiltElements.forEach(element => {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const xc = rect.width / 2;
            const yc = rect.height / 2;
            
            const tiltX = (yc - y) / 10;
            const tiltY = (x - xc) / 10;
            
            element.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        element.addEventListener('mouseleave', () => {
            element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });
    });

    // -------------------------------------------------------------
    // 4. Scroll-driven Ambient Glow Shifting & Sections Reveal
    // -------------------------------------------------------------
    const sections = document.querySelectorAll('section, header, footer');
    const bgGlowTeal = document.getElementById('bg-glow-teal');
    const bgGlowIndigo = document.getElementById('bg-glow-indigo');
    const revealElements = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
        const triggerBottom = window.innerHeight * 0.85;

        // Reveal elements entry
        revealElements.forEach(el => {
            const elTop = el.getBoundingClientRect().top;
            if (elTop < triggerBottom) {
                el.classList.add('active');
            }
        });

        // Ambient glow shift depending on active section
        let currentSection = '';
        sections.forEach(sec => {
            const rect = sec.getBoundingClientRect();
            if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
                currentSection = sec.id || '';
            }
        });

        if (currentSection === 'hero' || currentSection === 'branding') {
            bgGlowTeal.style.top = '-10%';
            bgGlowTeal.style.left = '-10%';
            bgGlowIndigo.style.bottom = '10%';
            bgGlowIndigo.style.right = '10%';
        } else if (currentSection === 'automations' || currentSection === 'services') {
            bgGlowTeal.style.top = '40%';
            bgGlowTeal.style.left = '60%';
            bgGlowIndigo.style.top = '30%';
            bgGlowIndigo.style.left = '10%';
        } else if (currentSection === 'contact') {
            bgGlowTeal.style.top = '70%';
            bgGlowTeal.style.left = '20%';
            bgGlowIndigo.style.top = '75%';
            bgGlowIndigo.style.left = '50%';
        }
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Initial run on page load

    // -------------------------------------------------------------
    // 5. FAQ Accordion Toggle System
    // -------------------------------------------------------------
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const trigger = item.querySelector('.faq-trigger');
        const content = item.querySelector('.faq-content');
        const icon = item.querySelector('.faq-icon');

        trigger.addEventListener('click', () => {
            const isOpen = item.classList.contains('active');

            // Close all items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                otherItem.querySelector('.faq-content').style.maxHeight = '0px';
                otherItem.querySelector('.faq-icon').style.transform = 'rotate(0deg)';
            });

            // Open clicked item if it was closed
            if (!isOpen) {
                item.classList.add('active');
                content.style.maxHeight = content.scrollHeight + 'px';
                icon.style.transform = 'rotate(180deg)';
            }
        });
    });

    // -------------------------------------------------------------
    // 6. Interactive Multi-Step Project Builder (Contact Form)
    // -------------------------------------------------------------
    const progressBar = document.getElementById('progress-bar');
    const steps = [document.getElementById('step-1'), document.getElementById('step-2'), document.getElementById('step-3')];
    const projectForm = document.getElementById('project-form');

    // Global navigation function exposed to inline click events
    window.goToStep = (stepNumber) => {
        // Validation check for Step 1
        if (stepNumber === 2) {
            const selectedServices = document.querySelectorAll('input[name="service"]:checked');
            if (selectedServices.length === 0) {
                alert('Please select at least one service to continue.');
                return;
            }
        }

        // Validation check for Step 2
        if (stepNumber === 3) {
            const fullName = document.getElementById('client-name').value.trim();
            const email = document.getElementById('client-email').value.trim();
            const desc = document.getElementById('project-desc').value.trim();

            if (!fullName || !email || !desc) {
                alert('Please fill out all required fields (Name, Email, and Description) to continue.');
                return;
            }

            // Simple email syntax check
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address.');
                return;
            }
        }

        // Progress bar updates
        const percentage = (stepNumber / 3) * 100;
        progressBar.style.width = percentage + '%';

        // Swap step classes
        steps.forEach((step, idx) => {
            if (idx + 1 === stepNumber) {
                step.classList.remove('step-hidden');
                step.classList.add('step-active');
            } else {
                step.classList.add('step-hidden');
                step.classList.remove('step-active');
            }
        });

        // Smooth scroll to form header on mobile
        const formContainer = document.querySelector('.glass-panel');
        if (window.innerWidth < 768 && formContainer) {
            window.scrollTo({
                top: formContainer.offsetTop - 100,
                behavior: 'smooth'
            });
        }
    };

    if (projectForm) {
        projectForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Gather form details
            const selectedServices = Array.from(document.querySelectorAll('input[name="service"]:checked')).map(cb => cb.value);
            const clientName = document.getElementById('client-name').value;
            const clientEmail = document.getElementById('client-email').value;
            const companyName = document.getElementById('client-company').value || 'Not specified';
            const budget = document.getElementById('client-budget').value;
            const description = document.getElementById('project-desc').value;

            console.log('--- Project Brief Submitted ---');
            console.log('Services:', selectedServices);
            console.log('Name:', clientName);
            console.log('Email:', clientEmail);
            console.log('Company:', companyName);
            console.log('Budget:', budget);
            console.log('Description:', description);

            // Animated submission completion notice
            const formInner = document.getElementById('step-3');
            formInner.innerHTML = `
                <div class="text-center py-12 space-y-6 animate-fade-in">
                    <div class="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
                        <span class="material-symbols-outlined text-[40px]">check_circle</span>
                    </div>
                    <div>
                        <h3 class="text-font-jakarta text-headline-md text-white font-bold mb-2">Proposal Initiated</h3>
                        <p class="text-text-cyber text-body-md max-w-sm mx-auto">
                            Thank you, ${clientName}. We have received your project details. A customized blueprint and calendar invite will be dispatched to <strong>${clientEmail}</strong> within 24 hours.
                        </p>
                    </div>
                    <button type="button" onclick="location.reload()" class="mt-4 px-6 py-2 border border-white/10 hover:bg-white/5 rounded-full text-sm font-medium transition-all">
                        Build Another Brief
                    </button>
                </div>
            `;
        });
    }

    // -------------------------------------------------------------
    // 7. Interactive Custom Automations Demos Tabber
    // -------------------------------------------------------------
    const autoTabs = document.querySelectorAll('.auto-tab');
    const autoDetails = document.querySelectorAll('.auto-detail');

    autoTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-target');

            autoTabs.forEach(t => t.classList.remove('active', 'border-tertiary', 'text-tertiary', 'bg-tertiary/10'));
            autoTabs.forEach(t => t.classList.add('border-white/10', 'text-on-surface-variant'));
            
            tab.classList.add('active', 'border-tertiary', 'text-tertiary', 'bg-tertiary/10');
            tab.classList.remove('border-white/10', 'text-on-surface-variant');

            autoDetails.forEach(detail => {
                if (detail.id === target) {
                    detail.classList.remove('hidden');
                    detail.classList.add('flex');
                } else {
                    detail.classList.add('hidden');
                    detail.classList.remove('flex');
                }
            });
        });
    });

    // -------------------------------------------------------------
    // 8. Contact scroll button trigger
    // -------------------------------------------------------------
    const ctaButtons = document.querySelectorAll('.scroll-to-contact');
    ctaButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                window.scrollTo({
                    top: contactSection.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});

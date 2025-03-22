// Theme Toggle
document.addEventListener('DOMContentLoaded', () => {
    console.log('Portfolio website initialized - checking for errors...');
    
    // Add global error handler
    window.addEventListener('error', function(event) {
        console.error('JavaScript Error:', event.message, 'at', event.filename, 'line', event.lineno);
    });
    
    try {
        const themeToggle = document.getElementById('themeToggle');
        
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                document.body.classList.toggle('dark-mode');
                themeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
                
                // Save theme preference
                const isDarkMode = document.body.classList.contains('dark-mode');
                localStorage.setItem('darkMode', isDarkMode);
            });
            
            // Apply saved theme preference
            const savedDarkMode = localStorage.getItem('darkMode') === 'true';
            if (savedDarkMode) {
                document.body.classList.add('dark-mode');
                themeToggle.textContent = '☀️';
            } else {
                themeToggle.textContent = '🌙';
            }
        } else {
            console.error('Theme toggle element not found. Selector: #themeToggle');
        }
        
        // Setup neon grid effect
        setupNeonGrid();
        
        // Setup contact form effects
        setupContactForm();
        
        // Setup skill animations
        setupSkillsAnimation();
        
        // Add active class to current nav item based on scroll
        setupNavigation();
        
        // Setup section animations
        setupSectionAnimations();
        
        // Setup 3D tilt effect on project cards
        setupProjectCards();

        // Initialize floating background elements
        createFloatingElements();
        
        // Initialize typewriter effect
        initTypewriterEffect();
        
        // Apply text glow effect to section headings
        document.querySelectorAll('section h2').forEach(heading => {
            heading.classList.add('text-glow');
        });
        
        // Setup scroll indicator
        setupScrollIndicator();
        
        // Setup scroll to top button
        setupScrollToTop();
    } catch (error) {
        console.error('Error in initialization:', error.message);
    }
});

// Setup 3D tilt effect on project cards
function setupProjectCards() {
    try {
        const projectCards = document.querySelectorAll('.project-card');
        
        if (projectCards.length === 0) {
            console.warn('Project cards not found');
            return;
        }
        
        projectCards.forEach(card => {
            if (!card) return;
            
            card.addEventListener('mousemove', (e) => {
                const cardRect = card.getBoundingClientRect();
                const cardCenterX = cardRect.left + cardRect.width / 2;
                const cardCenterY = cardRect.top + cardRect.height / 2;
                
                // Calculate mouse position relative to card center
                const mouseX = e.clientX - cardCenterX;
                const mouseY = e.clientY - cardCenterY;
                
                // Calculate rotation (max 10 degrees)
                const rotateY = mouseX * 0.01;
                const rotateX = -mouseY * 0.01;
                
                // Apply rotation transform
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
            });
            
            card.addEventListener('mouseleave', () => {
                // Reset transform on mouse leave
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
            });
            
            // Add click event to view project button
            const viewBtn = card.querySelector('.view-project');
            if (viewBtn) {
                viewBtn.addEventListener('click', () => {
                    // Show confirmation
                    alert('Project details would open here!');
                });
            }
        });
    } catch (error) {
        console.error('Error in setupProjectCards:', error.message);
    }
}

// Setup active nav links
function setupNavigation() {
    try {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-links a');
        
        if (sections.length === 0) {
            console.warn('No sections found for navigation');
            return;
        }
        
        if (navLinks.length === 0) {
            console.warn('No navigation links found');
            return;
        }
        
        // Add active class to nav links on scroll
        window.addEventListener('scroll', () => {
            let current = '';
            let scrollPos = window.scrollY;
            
            sections.forEach(section => {
                if (!section || typeof section.offsetTop !== 'number') return;
                
                const sectionTop = section.offsetTop - 100;
                const sectionHeight = section.offsetHeight;
                
                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    const id = section.getAttribute('id');
                    if (id) current = id;
                }
            });
            
            navLinks.forEach(link => {
                if (!link) return;
                
                link.classList.remove('active');
                const href = link.getAttribute('href');
                if (href === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    } catch (error) {
        console.error('Error in setupNavigation:', error.message);
    }
}

// Setup section animations
function setupSectionAnimations() {
    try {
        const sections = document.querySelectorAll('section');
        
        if (sections.length === 0) {
            console.warn('No sections found for animations');
            return;
        }
        
        // Initial check for visible sections
        checkVisibleSections();
        
        // Check on scroll
        window.addEventListener('scroll', () => {
            checkVisibleSections();
        });
        
        function checkVisibleSections() {
            const triggerBottom = window.innerHeight * 0.8;
            
            sections.forEach(section => {
                if (!section || !section.getBoundingClientRect) return;
                
                const sectionTop = section.getBoundingClientRect().top;
                
                if (sectionTop < triggerBottom) {
                    section.classList.add('visible');
                }
            });
        }
    } catch (error) {
        console.error('Error in setupSectionAnimations:', error.message);
    }
}

// Setup skills animation
function setupSkillsAnimation() {
    try {
        const skillBars = document.querySelectorAll('.skill-progress-bar');
        const skillsSection = document.getElementById('skills');
        
        if (!skillsSection) {
            console.warn('Skills section not found');
            return;
        }
        
        if (skillBars.length === 0) {
            console.warn('Skill bars not found');
            return;
        }
        
        // Function to animate skill bars
        function animateSkills() {
            skillBars.forEach(bar => {
                if (!bar || !bar.parentNode) {
                    console.warn('Invalid skill bar element');
                    return;
                }
                
                const width = bar.parentNode.dataset.width || '0%';
                bar.style.width = "0%";
                
                setTimeout(() => {
                    bar.style.width = width;
                }, 200);
            });
        }
        
        // Set initial width from HTML data
        skillBars.forEach(bar => {
            if (!bar || !bar.parentNode) {
                console.warn('Invalid skill bar element');
                return;
            }
            
            const parentWidth = bar.parentNode.dataset.width || '0%';
            bar.parentNode.dataset.width = parentWidth;
            bar.style.width = "0%";
        });
        
        // Observe skills section
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateSkills();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(skillsSection);
    } catch (error) {
        console.error('Error in setupSkillsAnimation:', error.message);
    }
}

// Setup contact form effects
function setupContactForm() {
    try {
        const form = document.querySelector('.contact-form');
        if (!form) {
            console.warn('Contact form not found');
            return;
        }
        
        // Add glowing effect when focus on inputs
        const inputs = form.querySelectorAll('.neon-input');
        if (inputs.length === 0) {
            console.warn('No form inputs found');
            return;
        }
        
        inputs.forEach(input => {
            if (!input) return;
            
            // Create random colored glint effects as user types
            input.addEventListener('input', (e) => {
                if (input.value.length > 0 && Math.random() > 0.7) {
                    createGlint(input);
                }
            });
            
            // Add special glow effect on focus
            input.addEventListener('focus', () => {
                const formGroup = input.closest('.form-group');
                if (formGroup) {
                    formGroup.classList.add('form-group-focus');
                }
            });
            
            input.addEventListener('blur', () => {
                const formGroup = input.closest('.form-group');
                if (formGroup) {
                    formGroup.classList.remove('form-group-focus');
                }
            });
        });
        
        // Add form submission animation
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const button = form.querySelector('button');
            if (!button) return;
            
            button.innerHTML = 'Sending <span class="sending-dots">...</span>';
            button.disabled = true;
            
            // Simulate sending (would be replaced with actual form submission)
            setTimeout(() => {
                const allInputs = form.querySelectorAll('.neon-input');
                allInputs.forEach(input => {
                    if (input) input.value = '';
                });
                button.innerHTML = 'Message Sent!';
                
                // Add success flash
                form.classList.add('form-success');
                
                setTimeout(() => {
                    form.classList.remove('form-success');
                    button.innerHTML = 'Send Message';
                    button.disabled = false;
                }, 3000);
            }, 2000);
        });
    } catch (error) {
        console.error('Error in setupContactForm:', error.message);
    }
}

// Create glint effect on input
function createGlint(element) {
    try {
        if (!element) {
            console.warn('No element provided for glint effect');
            return;
        }
        
        const glint = document.createElement('span');
        glint.classList.add('input-glint');
        
        // Random position within the input
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        
        // Random color
        const colors = ['#ff00c8', '#00eeff', '#00ffbb'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        glint.style.left = `${posX}%`;
        glint.style.top = `${posY}%`;
        glint.style.backgroundColor = color;
        
        element.appendChild(glint);
        
        // Remove after animation completes
        setTimeout(() => {
            if (glint && glint.parentNode === element) {
                element.removeChild(glint);
            }
        }, 1000);
    } catch (error) {
        console.error('Error in createGlint:', error.message);
    }
}

// Setup neon grid effect
function setupNeonGrid() {
    try {
        const grid = document.querySelector('.neon-grid');
        if (!grid) {
            console.warn('Neon grid element not found');
            return;
        }
        
        const gridSize = 30;
        const gridWidth = Math.ceil(window.innerWidth / gridSize);
        const gridHeight = Math.ceil(window.innerHeight / gridSize);
        
        // Randomize grid cell glow every few seconds
        setInterval(() => {
            const glowCells = [];
            const numGlowCells = Math.floor(Math.random() * 5) + 3;
            
            for (let i = 0; i < numGlowCells; i++) {
                const x = Math.floor(Math.random() * gridWidth);
                const y = Math.floor(Math.random() * gridHeight);
                glowCells.push({ x, y });
            }
            
            // Remove old glow elements
            const oldGlowElements = grid.querySelectorAll('.grid-glow');
            oldGlowElements.forEach(el => {
                if (el && el.parentNode) {
                    el.remove();
                }
            });
            
            // Add new glow elements
            glowCells.forEach(cell => {
                const glowEl = document.createElement('div');
                glowEl.classList.add('grid-glow');
                glowEl.style.left = `${cell.x * gridSize}px`;
                glowEl.style.top = `${cell.y * gridSize}px`;
                glowEl.style.width = `${gridSize}px`;
                glowEl.style.height = `${gridSize}px`;
                glowEl.style.backgroundColor = Math.random() > 0.5 ? 'rgba(255, 0, 200, 0.3)' : 'rgba(0, 238, 255, 0.3)';
                grid.appendChild(glowEl);
            });
        }, 2000);
    } catch (error) {
        console.error('Error in setupNeonGrid:', error.message);
    }
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            // Add active class to clicked link
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.classList.remove('active');
            });
            this.classList.add('active');
            
            // Smooth scroll to target
            window.scrollTo({
                top: targetElement.offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Function to create floating background elements
function createFloatingElements() {
    try {
        const bg = document.getElementById('floating-background');
        if (!bg) {
            console.warn('Floating background element not found');
            return;
        }
        
        // Clear existing elements
        bg.innerHTML = '';
        
        // Create random number of elements (5-15)
        const numElements = Math.floor(Math.random() * 10) + 5;
        
        for (let i = 0; i < numElements; i++) {
            const element = document.createElement('div');
            element.classList.add('floating-element');
            
            // Random size between 50px and 300px
            const size = Math.floor(Math.random() * 250) + 50;
            element.style.width = `${size}px`;
            element.style.height = `${size}px`;
            
            // Random position
            const posX = Math.floor(Math.random() * 100);
            const posY = Math.floor(Math.random() * 100);
            element.style.left = `${posX}%`;
            element.style.top = `${posY}%`;
            
            // Random animation duration
            const duration = Math.floor(Math.random() * 30) + 15;
            element.style.animationDuration = `${duration}s`;
            
            // Random delay
            const delay = Math.floor(Math.random() * 10);
            element.style.animationDelay = `-${delay}s`;
            
            // Random color
            const hue = Math.floor(Math.random() * 360);
            element.style.background = `radial-gradient(circle, hsla(${hue}, 100%, 70%, 0.1), transparent 70%)`;
            
            bg.appendChild(element);
        }
    } catch (error) {
        console.error('Error in createFloatingElements:', error.message);
    }
}

// Function to initialize typewriter effect
function initTypewriterEffect() {
    try {
        // Apply to home section headline
        const homeHeading = document.querySelector('.home-content h1');
        if (homeHeading) {
            // Save the original text
            const originalText = homeHeading.textContent;
            
            // Clear the text to prepare for animation
            homeHeading.textContent = '';
            
            // Create a span with the typewriter class
            const typewriterSpan = document.createElement('span');
            typewriterSpan.classList.add('typewriter');
            typewriterSpan.textContent = originalText;
            
            // Add the span to the heading
            homeHeading.appendChild(typewriterSpan);
        } else {
            console.warn('Home heading element not found for typewriter effect');
        }
        
        // Apply to about section intro
        const aboutIntro = document.querySelector('.about-content p:first-of-type');
        if (aboutIntro) {
            aboutIntro.classList.add('typewriter');
            // Adjust animation duration based on text length
            const textLength = aboutIntro.textContent.length || 20;
            aboutIntro.style.animationDuration = `${textLength * 0.05}s, 0.75s`;
        } else {
            console.warn('About intro paragraph not found for typewriter effect');
        }
    } catch (error) {
        console.error('Error in initTypewriterEffect:', error.message);
    }
}

// Function to setup scroll indicator
function setupScrollIndicator() {
    try {
        const scrollIndicator = document.getElementById('scrollIndicator');
        if (!scrollIndicator) {
            console.warn('Scroll indicator element not found');
            return;
        }
        
        window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            if (height <= 0) return; // Prevent division by zero
            
            const scrolled = (winScroll / height) * 100;
            scrollIndicator.style.width = scrolled + '%';
        });
    } catch (error) {
        console.error('Error in setupScrollIndicator:', error.message);
    }
}

// Function to setup scroll to top button
function setupScrollToTop() {
    try {
        const scrollTopBtn = document.getElementById('scrollTop');
        if (!scrollTopBtn) {
            console.warn('Scroll to top button not found');
            return;
        }
        
        // Show button when user scrolls down 300px from the top
        window.addEventListener('scroll', () => {
            if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });
        
        // Scroll to top when button is clicked
        scrollTopBtn.addEventListener('click', () => {
            // For modern browsers
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            // For older browsers
            document.body.scrollTop = 0; // For Safari
            document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
        });
    } catch (error) {
        console.error('Error in setupScrollToTop:', error.message);
    }
}
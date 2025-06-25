// Performance optimization: Use requestAnimationFrame for animations
const raf = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Intersection Observer for lazy loading
const lazyLoadObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = entry.target;
            if (target.dataset.src) {
                target.src = target.dataset.src;
                target.removeAttribute('data-src');
            }
            if (target.classList.contains('lazy-load')) {
                target.classList.add('visible');
            }
            observer.unobserve(target);
        }
    });
}, {
    rootMargin: '50px 0px',
    threshold: 0.1
});

// Theme Toggle Functionality
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    } else if (savedTheme === 'light') {
        document.body.classList.remove('dark-mode');
    } else {
        // Use system preference
        if (prefersDarkScheme.matches) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }
    
    // Update theme toggle button icon to show the opposite of the current theme
    updateThemeIcon();
    
    // Add click event listener
    themeToggle.addEventListener('click', () => {
        const isDarkMode = document.body.classList.toggle('dark-mode');
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        updateThemeIcon();
    });
    
    // Listen for system theme changes
    prefersDarkScheme.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            if (e.matches) {
                document.body.classList.add('dark-mode');
            } else {
                document.body.classList.remove('dark-mode');
            }
            updateThemeIcon();
        }
    });
}

// Update theme toggle button icon to show the opposite of the current theme
function updateThemeIcon() {
    const themeToggle = document.getElementById('themeToggle');
    const isDarkMode = document.body.classList.contains('dark-mode');
    // Show moon icon if currently light, sun icon if currently dark
    themeToggle.innerHTML = isDarkMode 
        ? '<i class="fas fa-moon"></i>' 
        : '<i class="fas fa-sun"></i>';
    themeToggle.setAttribute('aria-label', 
        isDarkMode ? 'Switch to light mode' : 'Switch to dark mode');
}

// Setup 3D tilt effect on project cards - Optimized
function setupProjectCards(projectCards) {
    try {
        if (projectCards.length === 0) {
            console.warn('Project cards not found');
            return;
        }
        
        const tiltConfig = {
            perspectiveValue: 1000,
            maxRotation: 0.01
        };
        
        projectCards.forEach(card => {
            if (!card) return;
            
            // Use mouseenter/mouseleave for better performance than mousemove
            let rafId = null;
            
            card.addEventListener('mousemove', (e) => {
                // Cancel previous animation frame if exists
                if (rafId) cancelAnimationFrame(rafId);
                
                // Use requestAnimationFrame for smoother animation
                rafId = requestAnimationFrame(() => {
                    const cardRect = card.getBoundingClientRect();
                    const cardCenterX = cardRect.left + cardRect.width / 2;
                    const cardCenterY = cardRect.top + cardRect.height / 2;
                    
                    // Calculate mouse position relative to card center
                    const mouseX = e.clientX - cardCenterX;
                    const mouseY = e.clientY - cardCenterY;
                    
                    // Calculate rotation (max 10 degrees)
                    const rotateY = mouseX * tiltConfig.maxRotation;
                    const rotateX = -mouseY * tiltConfig.maxRotation;
                    
                    // Apply transform using translate3d and rotate3d for better performance
                    card.style.transform = `perspective(${tiltConfig.perspectiveValue}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
                    
                    rafId = null;
                });
            });
            
            card.addEventListener('mouseleave', () => {
                // Cancel any pending animation frame
                if (rafId) cancelAnimationFrame(rafId);
                
                // Reset transform with animation
                card.style.transition = 'transform 0.3s ease';
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
                
                // Remove transition after animation completes
                setTimeout(() => {
                    card.style.transition = '';
                }, 300);
            });
            
            // Add click event to view project button
            const viewBtn = card.querySelector('.view-project');
            if (viewBtn) {
                viewBtn.addEventListener('click', () => {
                    // Check if this is the portfolio project
                    const projectTitle = card.querySelector('h3').textContent;
                    if (projectTitle === 'Personal Portfolio') {
                        window.open('https://github.com/Mohammadkaleembasha/New-ai-portfolio-', '_blank');
                    } else if (projectTitle === 'PPE Detection') {
                        window.open('https://github.com/Mohammadkaleembasha/PPEDETECTION', '_blank');
                    } else if (projectTitle === 'Hyperglycemia Related Retinal Disorder Prediction') {
                        window.open('https://github.com/Mohammadkaleembasha/Hyperglycemia-Related-Retinal-Disorder-Prediction', '_blank');
                    } else {
                        // Show confirmation for other projects
                        alert('Project details would open here!');
                    }
                });
            }
        });
    } catch (error) {
        console.error('Error in setupProjectCards:', error.message);
    }
}

// Setup active nav links - Optimized with IntersectionObserver
function setupNavigation({sections, navLinks}) {
    try {
        if (sections.length === 0) {
            console.warn('No sections found for navigation');
            return;
        }
        
        if (navLinks.length === 0) {
            console.warn('No navigation links found');
            return;
        }
        
        // Use IntersectionObserver instead of scroll event
        const navObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    if (id) {
                        navLinks.forEach(link => {
                            link.classList.remove('active');
                            if (link.getAttribute('href') === `#${id}`) {
                                link.classList.add('active');
                            }
                        });
                    }
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '-100px 0px -100px 0px'
        });
        
        // Observe all sections
        sections.forEach(section => {
            if (section) navObserver.observe(section);
        });
    } catch (error) {
        console.error('Error in setupNavigation:', error.message);
    }
}

// Setup section animations - Enhanced
function setupSectionAnimations(sections) {
    try {
        if (sections.length === 0) {
            console.warn('No sections found for animations');
            return;
        }
        
        // Use IntersectionObserver for better performance
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Add staggered animation to section content
                    const elements = entry.target.querySelectorAll('h2, p, .about-item, .project-card');
                    elements.forEach((el, index) => {
                        el.style.opacity = '0';
                        el.style.transform = 'translateY(20px)';
                        el.style.transition = 'opacity 0.5s, transform 0.5s';
                        el.style.transitionDelay = `${0.1 + (index * 0.1)}s`;
                        
                        setTimeout(() => {
                            el.style.opacity = '1';
                            el.style.transform = 'translateY(0)';
                        }, 100 + (index * 100));
                    });
                    
                    // Unobserve after animation is applied
                    sectionObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '-50px 0px'
        });
        
        // Observe all sections
        sections.forEach(section => {
            if (section) sectionObserver.observe(section);
        });
    } catch (error) {
        console.error('Error in setupSectionAnimations:', error.message);
    }
}

// Setup skills animation - Enhanced
function setupSkillsAnimation({skillBars, skillsSection}) {
    try {
        if (!skillsSection) {
            console.warn('Skills section not found');
            return;
        }
        
        if (skillBars.length === 0) {
            console.warn('Skill bars not found');
            return;
        }
        
        // Cache skill data once to avoid reflow
        const skillData = [];
        skillBars.forEach(bar => {
            if (!bar || !bar.parentNode) {
                console.warn('Invalid skill bar element');
                return;
            }
            
            const width = bar.parentNode.dataset.width || '0%';
            const numericWidth = parseInt(width);
            
            skillData.push({
                bar: bar,
                width: width,
                numericWidth: numericWidth
            });
            
            // Initialize with zero width
            bar.style.width = "0%";
        });
        
        // Function to animate skill bars with sequential animation
        function animateSkills() {
            skillData.forEach((data, index) => {
                // Delay each skill bar animation slightly
                setTimeout(() => {
                    // Animate with counting effect
                    const duration = 1500; // 1.5 seconds
                    const steps = 30;
                    const increment = data.numericWidth / steps;
                    let currentWidth = 0;
                    let step = 0;
                    
                    const levelElement = data.bar.parentNode.previousElementSibling.querySelector('.skill-level');
                    if (levelElement) levelElement.textContent = '0%';
                    
                    const interval = setInterval(() => {
                        step++;
                        currentWidth = Math.min(increment * step, data.numericWidth);
                        data.bar.style.width = `${currentWidth}%`;
                        
                        if (levelElement) {
                            levelElement.textContent = `${Math.round(currentWidth)}%`;
                        }
                        
                        if (step >= steps) {
                            clearInterval(interval);
                            data.bar.style.width = data.width;
                            if (levelElement) levelElement.textContent = data.width;
                            
                            // Add pulse animation after completion
                            data.bar.style.animation = 'pulse 3s infinite';
                        }
                    }, duration / steps);
                }, index * 100); // Stagger start times
            });
        }
        
        // Observe skills section - improved with appropriate threshold
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Small delay for visual effect
                    setTimeout(animateSkills, 300);
                    observer.unobserve(entry.target);
                    
                    // Add floating animation to skill categories
                    const categories = skillsSection.querySelectorAll('.skill-category');
                    categories.forEach((category, index) => {
                        setTimeout(() => {
                            category.style.opacity = '0';
                            category.style.transform = 'translateY(20px)';
                            category.style.transition = 'opacity 0.5s, transform 0.5s';
                            
                            setTimeout(() => {
                                category.style.opacity = '1';
                                category.style.transform = 'translateY(0)';
                            }, 50);
                        }, index * 200);
                    });
                }
            });
        }, { threshold: 0.2 });
        
        observer.observe(skillsSection);
    } catch (error) {
        console.error('Error in setupSkillsAnimation:', error.message);
    }
}

// Setup contact form effects - Optimized
function setupContactForm(form) {
    try {
        if (!form) {
            console.warn('Contact form not found');
            return;
        }
        
        const inputs = form.querySelectorAll('input, textarea');
        const submitBtn = form.querySelector('button[type="submit"]');

        // Add input effects
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('input-focused');
            });

            input.addEventListener('blur', () => {
                if (!input.value) {
                    input.parentElement.classList.remove('input-focused');
                }
            });
        });

        // Handle form submission
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Disable submit button and show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="loading-spinner"></span> Sending...';

            try {
                // Get form data
                const formData = {
                    name: form.querySelector('input[name="name"]').value,
                    email: form.querySelector('input[name="email"]').value,
                    message: form.querySelector('textarea[name="message"]').value
                };

                // Send email using EmailJS
                await emailjs.send(
                    "YOUR_SERVICE_ID", // Replace with your EmailJS service ID
                    "YOUR_TEMPLATE_ID", // Replace with your EmailJS template ID
                    {
                        from_name: formData.name,
                        from_email: formData.email,
                        message: formData.message
                    }
                );

                // Show success state
                form.classList.add('success');
                submitBtn.innerHTML = 'Message Sent!';
                
                // Reset form after 3 seconds
                setTimeout(() => {
                    form.reset();
                    form.classList.remove('success');
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = 'Send Message';
                    inputs.forEach(input => {
                        input.parentElement.classList.remove('input-focused');
                    });
                }, 3000);

            } catch (error) {
                console.error('Error sending email:', error);
                submitBtn.innerHTML = 'Error! Try Again';
                submitBtn.disabled = false;
                
                // Reset button after 3 seconds
                setTimeout(() => {
                    submitBtn.innerHTML = 'Send Message';
                }, 3000);
            }
        });
    } catch (error) {
        console.error('Error in setupContactForm:', error.message);
    }
}

// Setup neon grid effect - Optimized
function setupNeonGrid(grid) {
    try {
        if (!grid) {
            console.warn('Neon grid element not found');
            return;
        }
        
        const gridSize = 30;
        const gridWidth = Math.ceil(window.innerWidth / gridSize);
        const gridHeight = Math.ceil(window.innerHeight / gridSize);
        
        // Create element pool for grid cells
        const gridCellPool = [];
        const GRID_POOL_SIZE = 10;  // Max number of glowing cells
        
        // Create pool of grid cells
        for (let i = 0; i < GRID_POOL_SIZE; i++) {
            const cell = document.createElement('div');
            cell.classList.add('grid-glow');
            cell.style.display = 'none';
            grid.appendChild(cell);
            gridCellPool.push({
                element: cell,
                inUse: false
            });
        }
        
        // Get cell from pool
        function getGridCell() {
            for (let i = 0; i < gridCellPool.length; i++) {
                if (!gridCellPool[i].inUse) {
                    gridCellPool[i].inUse = true;
                    gridCellPool[i].element.style.display = 'block';
                    return gridCellPool[i];
                }
            }
            return null;
        }
        
        // Return cell to pool
        function returnGridCell(cellObj) {
            cellObj.inUse = false;
            cellObj.element.style.display = 'none';
        }
        
        // Use a longer interval to reduce CPU usage
        const interval = setInterval(() => {
            // Reuse existing cells instead of creating new ones
            gridCellPool.forEach(cellObj => returnGridCell(cellObj));
            
            const numGlowCells = Math.floor(Math.random() * 3) + 2; // Reduced number
            
            for (let i = 0; i < numGlowCells; i++) {
                const x = Math.floor(Math.random() * gridWidth);
                const y = Math.floor(Math.random() * gridHeight);
                
                const cellObj = getGridCell();
                if (!cellObj) continue;
                
                const cell = cellObj.element;
                cell.style.left = `${x * gridSize}px`;
                cell.style.top = `${y * gridSize}px`;
                cell.style.width = `${gridSize}px`;
                cell.style.height = `${gridSize}px`;
                cell.style.backgroundColor = Math.random() > 0.5 ? 'rgba(255, 0, 200, 0.3)' : 'rgba(0, 238, 255, 0.3)';
                
                // Return to pool after animation
                setTimeout(() => {
                    returnGridCell(cellObj);
                }, 2000);
            }
        }, 3000); // Increased from 2000ms to 3000ms
        
        // Clear interval when page hidden
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                clearInterval(interval);
            } else {
                // Only restart if it was previously running
                if (!interval) {
                    setupNeonGrid(grid);
                }
            }
        });
    } catch (error) {
        console.error('Error in setupNeonGrid:', error.message);
    }
}

// Function to create floating background elements - Optimized
function createFloatingElements(bg) {
    try {
        if (!bg) {
            console.warn('Floating background element not found');
            return;
        }
        
        // Reduce number of elements for better performance
        const numElements = Math.floor(Math.random() * 5) + 3; // Reduced from 5-15 to 3-8
        
        // Use document fragment for better performance
        const fragment = document.createDocumentFragment();
        
        for (let i = 0; i < numElements; i++) {
            const element = document.createElement('div');
            element.classList.add('floating-element');
            
            // Random size between 50px and 300px
            const size = Math.floor(Math.random() * 200) + 50; // Slightly reduced size range
            element.style.width = `${size}px`;
            element.style.height = `${size}px`;
            
            // Random position
            const posX = Math.floor(Math.random() * 100);
            const posY = Math.floor(Math.random() * 100);
            element.style.left = `${posX}%`;
            element.style.top = `${posY}%`;
            
            // Random animation duration - longer for better performance
            const duration = Math.floor(Math.random() * 20) + 20; // Increased minimum
            element.style.animationDuration = `${duration}s`;
            
            // Random delay
            const delay = Math.floor(Math.random() * 10);
            element.style.animationDelay = `-${delay}s`;
            
            // Random color
            const hue = Math.floor(Math.random() * 360);
            element.style.background = `radial-gradient(circle, hsla(${hue}, 100%, 70%, 0.1), transparent 70%)`;
            
            fragment.appendChild(element);
        }
        
        // Clear existing elements
        bg.innerHTML = '';
        
        // Add all new elements at once
        bg.appendChild(fragment);
    } catch (error) {
        console.error('Error in createFloatingElements:', error.message);
    }
}

// Function to initialize typewriter effect - Enhanced
function initTypewriterEffect() {
    try {
        // Apply to home section headline
        const homeHeading = document.querySelector('.home-content h1');
        if (homeHeading) {
            // Only apply if not already done
            if (!homeHeading.querySelector('.typewriter')) {
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
            }
        }
        
        // Apply to about section intro - only if element exists
        const aboutIntro = document.querySelector('.about-content p:first-of-type');
        if (aboutIntro && !aboutIntro.classList.contains('typewriter')) {
            aboutIntro.classList.add('typewriter');
            // Adjust animation duration based on text length
            const textLength = aboutIntro.textContent.length;
            // Limit maximum duration for better performance
            const duration = Math.min(textLength * 0.03, 3);
            aboutIntro.style.animationDuration = `${duration}s, 0.75s`;
        }
        
        // Apply typing animation to skills section
        const skillTitles = document.querySelectorAll('.skill-category h3');
        skillTitles.forEach((title, index) => {
            title.style.opacity = '0';
            title.style.animation = `fadeInLeft ${0.3 + index * 0.1}s forwards ${0.5 + index * 0.1}s`;
        });
    } catch (error) {
        console.error('Error in initTypewriterEffect:', error.message);
    }
}

// Setup sticky header
function setupStickyHeader(header) {
    if (!header) return;
    
    let lastScrollTop = 0;
    
    // Handle scroll events with throttling
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide/show header based on scroll direction (for mobile)
        if (window.innerWidth < 768) {
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                // Scrolling down
                header.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up
                header.style.transform = 'translateY(0)';
            }
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
}

// Setup mobile menu
function setupMobileMenu({menuToggle, navMenu}) {
    if (!menuToggle || !navMenu) return;
    
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('show');
        const isExpanded = navMenu.classList.contains('show');
        menuToggle.setAttribute('aria-expanded', isExpanded);
        
        // Add animation to menu items
        if (isExpanded) {
            const menuItems = navMenu.querySelectorAll('li');
            menuItems.forEach((item, index) => {
                item.style.animation = `fadeInRight ${0.3 + index * 0.1}s forwards`;
            });
        }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('show') && 
            !navMenu.contains(e.target) && 
            !menuToggle.contains(e.target)) {
            navMenu.classList.remove('show');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });
}

// Add ripple effect to buttons
function addRippleEffect() {
    document.addEventListener('click', function(e) {
        const target = e.target;
        if (target.classList.contains('btn') || 
            target.classList.contains('view-project') || 
            target.tagName === 'BUTTON') {
            
            target.classList.add('ripple-effect');
            
            setTimeout(() => {
                target.classList.remove('ripple-effect');
            }, 600);
        }
    });
}

// Setup animated particles for project images
function setupProjectImageAnimations(projectCards) {
    try {
        if (projectCards.length === 0) {
            console.warn('Project cards not found for animation setup');
            return;
        }
        
        projectCards.forEach(card => {
            const imgContainer = card.querySelector('.project-img-container');
            if (!imgContainer) return;
            
            // Create particles container
            const particlesContainer = document.createElement('div');
            particlesContainer.classList.add('particles-container');
            imgContainer.appendChild(particlesContainer);
            
            // Create particles
            const numParticles = 10;
            for (let i = 0; i < numParticles; i++) {
                createParticle(particlesContainer);
            }
            
            // Add mousemove effect
            imgContainer.addEventListener('mousemove', (e) => {
                const rect = imgContainer.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                
                // Create a particle at mouse position
                if (Math.random() > 0.7) {
                    const particle = document.createElement('div');
                    particle.classList.add('particle');
                    particle.style.left = `${x}%`;
                    particle.style.top = `${y}%`;
                    particle.style.backgroundColor = getRandomColor();
                    particlesContainer.appendChild(particle);
                    
                    // Random animation
                    const size = Math.random() * 6 + 4;
                    const duration = Math.random() * 2 + 1;
                    const xMove = (Math.random() - 0.5) * 100;
                    const yMove = (Math.random() - 0.5) * 100;
                    
                    particle.style.width = `${size}px`;
                    particle.style.height = `${size}px`;
                    particle.style.animation = `none`;
                    
                    requestAnimationFrame(() => {
                        particle.style.transition = `all ${duration}s ease-out`;
                        particle.style.transform = `translate(${xMove}px, ${yMove}px)`;
                        particle.style.opacity = '0.8';
                        
                        setTimeout(() => {
                            particle.style.opacity = '0';
                            setTimeout(() => {
                                if (particlesContainer.contains(particle)) {
                                    particlesContainer.removeChild(particle);
                                }
                            }, duration * 1000);
                        }, duration * 500);
                    });
                }
            });
        });
        
        // Function to create a single particle
        function createParticle(container) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            // Random position
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            
            // Random color
            particle.style.backgroundColor = getRandomColor();
            
            // Add to container
            container.appendChild(particle);
            
            // Animate the particle
            animateParticle(particle);
        }
        
        // Function to animate a particle
        function animateParticle(particle) {
            // Random size
            const size = Math.random() * 6 + 4;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            // Random animation
            const duration = Math.random() * 3 + 2;
            const delay = Math.random() * 4;
            const xMove = (Math.random() - 0.5) * 80;
            const yMove = (Math.random() - 0.5) * 80;
            
            particle.style.transition = `all ${duration}s ease-in-out ${delay}s`;
            
            // Initial state
            particle.style.opacity = '0';
            particle.style.transform = 'translate(0, 0)';
            
            // Delayed animation
            setTimeout(() => {
                particle.style.opacity = '0.6';
                particle.style.transform = `translate(${xMove}px, ${yMove}px)`;
                
                // Fade out and reset
                setTimeout(() => {
                    particle.style.opacity = '0';
                    
                    // Reset and animate again
                    setTimeout(() => {
                        particle.style.transition = 'none';
                        particle.style.transform = 'translate(0, 0)';
                        setTimeout(() => {
                            animateParticle(particle);
                        }, 50);
                    }, duration * 1000);
                }, duration * 700);
            }, delay * 1000);
        }
        
        // Helper to get random neon color
        function getRandomColor() {
            const colors = [
                'rgba(0, 255, 136, 0.7)',  // Green
                'rgba(0, 238, 255, 0.7)',  // Blue
                'rgba(255, 0, 200, 0.7)',  // Pink
                'rgba(255, 255, 255, 0.7)' // White
            ];
            return colors[Math.floor(Math.random() * colors.length)];
        }
    } catch (error) {
        console.error('Error in setupProjectImageAnimations:', error.message);
    }
}

// Main initialization function
function init() {
    // Hide page loader and show content
    const pageLoader = document.getElementById('pageLoader');
    if (pageLoader) {
        setTimeout(() => {
            pageLoader.style.opacity = '0';
            document.body.style.opacity = '1';
            setTimeout(() => {
                pageLoader.style.display = 'none';
            }, 300);
        }, 500);
    } else {
        document.body.style.opacity = '1';
    }

    // Initialize theme toggle
    initThemeToggle();

    // Setup project cards
    const projectCards = document.querySelectorAll('.project-card');
    setupProjectCards(projectCards);

    // Setup navigation
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    setupNavigation({sections, navLinks});

    // Setup section animations
    setupSectionAnimations(sections);

    // Setup skills animation
    const skillBars = document.querySelectorAll('.skill-progress-bar');
    const skillsSection = document.getElementById('skills');
    setupSkillsAnimation({skillBars, skillsSection});

    // Setup contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        setupContactForm(contactForm);
    }

    // Setup neon grid
    const neonGrid = document.querySelector('.neon-grid');
    if (neonGrid) {
        setupNeonGrid(neonGrid);
    }

    // Setup floating background
    const floatingBg = document.getElementById('floating-background');
    if (floatingBg) {
        createFloatingElements(floatingBg);
    }

    // Setup typewriter effect
    initTypewriterEffect();

    // Setup sticky header
    const header = document.querySelector('header');
    if (header) {
        setupStickyHeader(header);
    }

    // Setup mobile menu
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.querySelector('.nav-links');
    if (menuToggle && navMenu) {
        setupMobileMenu({menuToggle, navMenu});
    }

    // Add ripple effect to buttons
    addRippleEffect();

    // Setup project image animations
    setupProjectImageAnimations(projectCards);

    // Setup scroll indicator
    const scrollIndicator = document.getElementById('scrollIndicator');
    if (scrollIndicator) {
        window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            scrollIndicator.style.width = scrolled + '%';
        });
    }

    // Setup scroll to top button
    const scrollTopBtn = document.getElementById('scrollTop');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);
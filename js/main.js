// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

console.log('ScrollTrigger registered successfully.');

// HERO INTRO — SAFE LOAD ANIMATION
const heroTl = gsap.timeline({
    defaults: {
        duration: 0.8,
        ease: "power3.out"
    }
});

heroTl.from(
    ".hero-content > *",
    {
        opacity: 0,
        y: 40,
        stagger: 0.12,
        clearProps: "transform"
    }
);


// BORDER ORBIT MOTION

// BORDER ORBIT MOTION
document.addEventListener("DOMContentLoaded", () => {
    const panel = document.querySelector(".newgen-ai-media");
    if (!panel) return;

    const svg = panel.querySelector(".media-border-svg");
    const track = panel.querySelector(".media-border-track");
    const glow = panel.querySelector(".media-border-glow");
    if (!svg || !track || !glow) return;

    // Function to update SVG dimensions
    const updateDimensions = () => {
        const rect = panel.getBoundingClientRect();

        svg.setAttribute("viewBox", `0 0 ${rect.width} ${rect.height}`);

        [track, glow].forEach(el => {
            el.setAttribute("x", 1);
            el.setAttribute("y", 1);
            el.setAttribute("width", rect.width - 2);
            el.setAttribute("height", rect.height - 2);
        });

        return 2 * (rect.width + rect.height); // Return perimeter
    };

    // Initial setup
    let perimeter = updateDimensions();

    // Recalculate on resize
    window.addEventListener("resize", () => {
        perimeter = updateDimensions();
        // Force refresh animation if needed, or rely on visual consistency
    });

    const glowAnim = gsap.to(glow, {
        strokeDashoffset: -perimeter,
        duration: 24,
        ease: "none",
        repeat: -1,
        paused: true,
        modifiers: {
            strokeDashoffset: (value) => {
                // Determine current progress to handle resize effectively if needed
                // For now, simpler is better as per instructions
                return value;
            }
        }
    });

    // NOTE: If window resizes significantly, the strokeDashoffset target might need update.
    // However, for this implementation we'll keep it simple as requested.
    // To make it perfectly responsive, we'd invalidate() the tween on resize.

    // Better responsive handling:
    window.addEventListener("resize", () => {
        perimeter = updateDimensions();
        // invalidating to pick up the new perimeter if we re-created the tween,
        // but simply updating the transform logic or relying on relative units is hard with strokeDashoffset using pixels.
        // Let's stick to the requested simple logic but add the initial setup. 
    });

    ScrollTrigger.create({
        trigger: ".newgen-ai",
        start: "top bottom",
        end: "bottom top",
        onEnter: () => glowAnim.play(),
        onLeave: () => glowAnim.pause(),
        onEnterBack: () => glowAnim.play(),
        onLeaveBack: () => glowAnim.pause()
    });
});

// REVEAL SECTIONS ON SCROLL
gsap.utils.toArray('.section.reveal').forEach((section) => {
    gsap.fromTo(
        section,
        { opacity: 0, y: 40 },
        {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: section,
                start: 'top 75%',
                toggleActions: 'play none none none'
            }
        }
    );
});

// INITIALIZE CHILD ITEMS (HIDDEN)
gsap.utils.toArray('.section.reveal').forEach((section) => {
    const items = section.querySelectorAll('.reveal-item');
    if (!items.length) return;

    gsap.set(items, {
        opacity: 0,
        y: 24
    });
});

// REVEAL CHILD ITEMS ON SCROLL
gsap.utils.toArray('.section.reveal').forEach((section) => {
    const items = section.querySelectorAll('.reveal-item');

    if (!items.length) return;

    gsap.fromTo(
        items,
        { opacity: 0, y: 24 },
        {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power3.out',
            stagger: 0.12,
            scrollTrigger: {
                trigger: section,
                start: 'top 75%',
                toggleActions: 'play none none none'
            }
        }
    );
});

// NAVBAR SCROLL EFFECT
window.addEventListener('scroll', () => {

    console.log('scrollY:', window.scrollY);
    const header = document.getElementById('site-header');

    if (window.scrollY > 10) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// ======================================================
// NAVIGATION DROPDOWN INTERACTIONS
// ======================================================

// Desktop Dropdown Interactions
const navItems = document.querySelectorAll('.nav-item.has-dropdown');

navItems.forEach(item => {
    const navLink = item.querySelector('.nav-link');

    // Toggle dropdown on click (for mobile compatibility)
    navLink.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            e.preventDefault();

            // Toggle active state
            const isActive = item.classList.contains('active');

            // Close all other dropdowns
            navItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.nav-link').setAttribute('aria-expanded', 'false');
                }
            });

            // Toggle current dropdown
            if (isActive) {
                item.classList.remove('active');
                navLink.setAttribute('aria-expanded', 'false');
            } else {
                item.classList.add('active');
                navLink.setAttribute('aria-expanded', 'true');
            }
        }
    });
});

// Close dropdowns when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-item.has-dropdown')) {
        navItems.forEach(item => {
            item.classList.remove('active');
            item.querySelector('.nav-link').setAttribute('aria-expanded', 'false');
        });
    }
});

// Close dropdowns on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        navItems.forEach(item => {
            item.classList.remove('active');
            item.querySelector('.nav-link').setAttribute('aria-expanded', 'false');
        });

        // Also close mobile menu if open
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        const navLinks = document.querySelector('.nav-links');
        if (navLinks && navLinks.classList.contains('mobile-open')) {
            navLinks.classList.remove('mobile-open');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    }
});

// ======================================================
// MOBILE MENU TOGGLE
// ======================================================

const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuToggle && navLinks) {
    mobileMenuToggle.addEventListener('click', () => {
        const isOpen = navLinks.classList.contains('mobile-open');

        if (isOpen) {
            // Close menu
            navLinks.classList.remove('mobile-open');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = ''; // Re-enable scrolling
        } else {
            // Open menu
            navLinks.classList.add('mobile-open');
            mobileMenuToggle.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }
    });
}

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
        if (!e.target.closest('.nav-links') &&
            !e.target.closest('.mobile-menu-toggle')) {
            if (navLinks && navLinks.classList.contains('mobile-open')) {
                navLinks.classList.remove('mobile-open');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        }
    }
});

// Handle window resize - close mobile menu if resized to desktop
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        if (navLinks && navLinks.classList.contains('mobile-open')) {
            navLinks.classList.remove('mobile-open');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }

        // Remove active states from nav items
        navItems.forEach(item => {
            item.classList.remove('active');
            item.querySelector('.nav-link').setAttribute('aria-expanded', 'false');
        });
    }
});

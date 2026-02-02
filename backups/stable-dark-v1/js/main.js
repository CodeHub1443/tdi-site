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


// BORDER ORBIT MOTION (Soft Additive Glow)
document.addEventListener("DOMContentLoaded", () => {
    const panel = document.querySelector(".newgen-ai-media");
    if (!panel) return;

    const svg = panel.querySelector(".media-border-soft-glow-svg");
    const track = panel.querySelector(".media-border-soft-track");
    const glow = panel.querySelector(".media-border-soft-glow");

    if (!svg || !track || !glow) return;

    const updateDimensions = () => {
        const rect = panel.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return 0;

        svg.setAttribute("viewBox", `0 0 ${rect.width} ${rect.height}`);

        [track, glow].forEach(el => {
            el.setAttribute("x", 1);
            el.setAttribute("y", 1);
            el.setAttribute("width", rect.width - 2);
            el.setAttribute("height", rect.height - 2);
        });

        const perimeter = 2 * ((rect.width - 2) + (rect.height - 2));

        // Minimalist Tune: Short single object
        const dashLength = 40;
        // Gap = perimeter ensures only one object is visible
        glow.style.strokeDasharray = `${dashLength} ${perimeter}`;

        return perimeter;
    };

    let perimeter = updateDimensions();

    let resizeTimeout;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            perimeter = updateDimensions();
        }, 100);
    });

    // Very slow, continuous orbit
    const glowAnim = gsap.to(glow, {
        strokeDashoffset: -perimeter,
        duration: 60, // Extremely slow (calm)
        ease: "none",
        repeat: -1,
        paused: true
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

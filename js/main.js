// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

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
        stagger: 0.12
    }
);

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

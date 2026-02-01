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
gsap.utils.toArray(".reveal-section").forEach(section => {
    gsap.from(section, {
        scrollTrigger: {
            trigger: section,
            start: "top 75%",
            toggleActions: "play none none none"
        },
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power3.out"
    });
});

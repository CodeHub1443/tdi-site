// ===============================
// HERO CANVAS — ISOMETRIC GRID
// ===============================

const canvas = document.getElementById('hero-canvas');
const hero = document.getElementById('hero');
const ctx = canvas.getContext('2d');

// -------------------------------
// CONFIG
// -------------------------------
let tileWidth = 84;
let tileHeight = 42;
const gridCols = 56;
const gridRows = 56;
const blockHeight = 12;

const influenceRadius = 160;
const maxLift = 8;
const liftEase = 0.12;

// -------------------------------
// STATE
// -------------------------------
let mouseX = null;
let mouseY = null;
let blocks = [];
let parallaxX = 0;
let parallaxY = 0;
let targetParallaxX = 0;
let targetParallaxY = 0;

// -------------------------------
// CANVAS RESIZE
// -------------------------------
function resizeCanvas() {
    canvas.width = hero.clientWidth;
    canvas.height = hero.clientHeight;
}

// -------------------------------
// INIT GRID
// -------------------------------
function initGrid() {
    blocks = [];
    for (let x = -gridCols / 2; x < gridCols / 2; x++) {
        for (let y = -gridRows / 2; y < gridRows / 2; y++) {
            blocks.push({
                gx: x,
                gy: y,
                currentLift: 0,
                targetLift: 0
            });
        }
    }

    // Sort by depth (farthest first) for painter's algorithm
    blocks.sort((a, b) => (a.gx + a.gy) - (b.gx + b.gy));
}

// -------------------------------
// ISOMETRIC HELPERS
// -------------------------------
function isoProject(x, y) {
    return {
        x: (x - y) * tileWidth / 2,
        y: (x + y) * tileHeight / 2
    };
}

// -------------------------------
// DRAW BLOCK (WITH UNDER-GLOW)
// -------------------------------
function drawBlock(x, y, lift, baseIsoY) {
    // Depth attenuation (Disabled for uniformity)
    ctx.globalAlpha = 1;

    // Under-glow
    if (lift > 0.5) {
        ctx.save();
        ctx.shadowColor = 'rgba(60, 110, 255, 0.4)';
        ctx.shadowBlur = lift * 3;
        ctx.fillStyle = 'rgba(60, 110, 255, 0.4)';

        const glowScale = 1.1;
        const gW = (tileWidth / 2) * glowScale;
        const gH = (tileHeight / 2) * glowScale;
        const gCenterY = baseIsoY + tileHeight / 2;

        ctx.beginPath();
        ctx.moveTo(x, gCenterY - gH);
        ctx.lineTo(x + gW, gCenterY);
        ctx.lineTo(x, gCenterY + gH);
        ctx.lineTo(x - gW, gCenterY);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    // Colors (subtle contrast)
    const colorTop = '#1E2C3E';
    const colorLeft = '#15202E';
    const colorRight = '#0F1823';

    // Top face
    ctx.fillStyle = colorTop;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + tileWidth / 2, y + tileHeight / 2);
    ctx.lineTo(x, y + tileHeight);
    ctx.lineTo(x - tileWidth / 2, y + tileHeight / 2);
    ctx.closePath();
    ctx.fill();

    // Left face
    ctx.fillStyle = colorLeft;
    ctx.beginPath();
    ctx.moveTo(x - tileWidth / 2, y + tileHeight / 2);
    ctx.lineTo(x, y + tileHeight);
    ctx.lineTo(x, y + tileHeight + blockHeight);
    ctx.lineTo(x - tileWidth / 2, y + tileHeight / 2 + blockHeight);
    ctx.closePath();
    ctx.fill();

    // Right face
    ctx.fillStyle = colorRight;
    ctx.beginPath();
    ctx.moveTo(x, y + tileHeight);
    ctx.lineTo(x + tileWidth / 2, y + tileHeight / 2);
    ctx.lineTo(x + tileWidth / 2, y + tileHeight / 2 + blockHeight);
    ctx.lineTo(x, y + tileHeight + blockHeight);
    ctx.closePath();
    ctx.fill();

    ctx.globalAlpha = 1;
}

// -------------------------------
// DRAW SCENE
// -------------------------------
function drawScene() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(parallaxX, parallaxY);

    const offsetX = canvas.width / 2;
    const offsetY = canvas.height / 2;

    blocks.forEach(block => {
        const iso = isoProject(block.gx, block.gy);
        const screenX = iso.x + offsetX;
        const screenYBase = iso.y + offsetY;

        // Proximity logic
        // Use relative mouse position to account for parallax shift
        if (mouseX !== null && mouseY !== null) {
            const relMouseX = mouseX - parallaxX;
            const relMouseY = mouseY - parallaxY;
            const dx = relMouseX - screenX;
            const dy = relMouseY - screenYBase;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < influenceRadius) {
                const t = Math.pow(1 - dist / influenceRadius, 3);
                block.targetLift = t * maxLift;
            } else {
                block.targetLift = 0;
            }
        } else {
            block.targetLift = 0;
        }

        // Smooth interpolation
        block.currentLift += (block.targetLift - block.currentLift) * liftEase;
        if (Math.abs(block.currentLift) < 0.01) block.currentLift = 0;

        const drawY = screenYBase - block.currentLift;

        drawBlock(screenX, drawY, block.currentLift, screenYBase);
    });

    ctx.restore();
}

// -------------------------------
// ANIMATION LOOP
// -------------------------------
function animate() {
    parallaxX += (targetParallaxX - parallaxX) * 0.08;
    parallaxY += (targetParallaxY - parallaxY) * 0.08;
    drawScene();
    requestAnimationFrame(animate);
}

// -------------------------------
// EVENTS
// -------------------------------
hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;

    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;

    targetParallaxX = nx * 80;
    targetParallaxY = ny * 80;
});

hero.addEventListener('mouseleave', () => {
    mouseX = null;
    mouseY = null;
});

window.addEventListener('resize', () => {
    resizeCanvas();
});

// -------------------------------
// INIT
// -------------------------------
resizeCanvas();
initGrid();
animate();

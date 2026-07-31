// Registra o plugin ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// 1. Inicialização do Lenis (Smooth Scroll)
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Easing elegante
    smooth: true,
    mouseMultiplier: 1,
});

// Integra o ScrollTrigger da GSAP ao requestAnimationFrame do Lenis
function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Atualiza o ScrollTrigger quando o Lenis processa o scroll
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time)=>{
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0, 0);

// 2. Animação inicial da Seção Hero
document.addEventListener("DOMContentLoaded", () => {
    
    const tl = gsap.timeline();
    
    tl.from(".hero h1", {
        y: 50,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        delay: 0.2
    })
    .from(".hero .subtitle", {
        y: 20,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    }, "-=0.8")
    .from(".scroll-indicator", {
        opacity: 0,
        duration: 1,
        ease: "power2.inOut"
    }, "-=0.5");
    
    // Efeito Parallax sutil no texto do Hero ao rolar a página para baixo
    gsap.to(".hero-content", {
        y: 150, // Move para baixo mais devagar que o scroll
        opacity: 0,
        ease: "none",
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: true // A animação acompanha exatamente a rolagem
        }
    });
});

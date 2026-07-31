// Registra o plugin ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// 1. Inicialização do Lenis (Smooth Scroll)
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
    mouseMultiplier: 1,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time)=>{
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0, 0);

// ==========================================
// NOVAS FUNÇÕES: FETCH E RENDERIZAÇÃO
// ==========================================

async function loadTimelineData() {
    try {
        // Busca o arquivo JSON. O caminho deve corresponder à sua pasta
        const response = await fetch('./data/filosofia.json');
        
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status}`);
        }
        
        const data = await response.json();
        renderTimeline(data.timeline);
        
    } catch (error) {
        console.error("Falha ao carregar os dados filosóficos:", error);
    }
}

function renderTimeline(timelineData) {
    const container = document.getElementById('timeline-container');
    container.innerHTML = ''; // Limpa qualquer conteúdo provisório

    timelineData.forEach(period => {
        const periodSection = document.createElement('section');
        periodSection.className = 'timeline-period';
        periodSection.id = period.id;

        const header = document.createElement('div');
        header.className = 'period-header';
        header.innerHTML = `
            <h2>${period.period_name}</h2>
            <p class="timeframe">${period.timeframe}</p>
        `;
        periodSection.appendChild(header);

        const grid = document.createElement('div');
        grid.className = 'philosophers-grid';

        period.philosophers.forEach(phil => {
            const card = document.createElement('article');
            card.className = `philosopher-card ${phil.is_eminent ? 'eminent' : ''}`;
            
            const conceptsHTML = phil.core_concepts.map(concept => `<li>${concept}</li>`).join('');

            card.innerHTML = `
                <div class="card-content">
                    <h3>${phil.name}</h3>
                    <span class="metadata">${phil.lifespan} &bull; ${phil.school}</span>
                    <p class="summary">${phil.summary}</p>
                    <ul class="concepts">
                        ${conceptsHTML}
                    </ul>
                </div>
            `;
            grid.appendChild(card);
        });

        periodSection.appendChild(grid);
        container.appendChild(periodSection);
    });

    // Chama o GSAP para animar os cartões recém-criados
    initScrollAnimations();
}

function initScrollAnimations() {
    const cards = gsap.utils.toArray('.philosopher-card');

    cards.forEach(card => {
        gsap.to(card, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
                trigger: card,
                start: "top 85%", 
                toggleActions: "play none none reverse" 
            }
        });
        
        const parallaxDepth = card.classList.contains('eminent') ? 30 : 15;
        
        gsap.to(card.querySelector('.card-content'), {
            y: -parallaxDepth,
            ease: "none",
            scrollTrigger: {
                trigger: card,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
    });
    
    ScrollTrigger.refresh();
}

// ==========================================
// EVENTO PRINCIPAL (Carregamento da página)
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Animação original da Seção Hero
    const tl = gsap.timeline();
    
    tl.from(".hero h1", { y: 50, opacity: 0, duration: 1.2, ease: "power3.out", delay: 0.2 })
      .from(".hero .subtitle", { y: 20, opacity: 0, duration: 1, ease: "power3.out" }, "-=0.8")
      .from(".scroll-indicator", { opacity: 0, duration: 1, ease: "power2.inOut" }, "-=0.5");
    
    gsap.to(".hero-content", {
        y: 150,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: true 
        }
    });

    // 2. NOVA CHAMADA: Inicia o carregamento dos dados dos filósofos
    loadTimelineData();
});

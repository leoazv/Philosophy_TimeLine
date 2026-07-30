document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Lógica da Barra de Progresso de Scroll
    const progressBar = document.querySelector('.scroll-progress');
    
    window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercentage = (scrollTop / scrollHeight) * 100;
        
        progressBar.style.width = scrollPercentage + '%';
    });

    // 2. Lógica do Dynamic Scroll (Intersection Observer)
    const timelineItems = document.querySelectorAll('.timeline-item');

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px', // Aciona um pouco antes do final da tela
        threshold: 0.2 // 20% do elemento deve estar visível
    };

    const timelineObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Adiciona a classe que inicia a animação CSS
                entry.target.classList.add('visible');
                
                // Para de observar após a animação acontecer uma vez (opcional)
                // Se quiser que anime toda vez que rolar para cima/baixo, remova a linha abaixo
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    timelineItems.forEach(item => {
        timelineObserver.observe(item);
    });
});

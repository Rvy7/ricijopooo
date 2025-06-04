// Script para animações de scroll
document.addEventListener('DOMContentLoaded', function() {
    // Função para verificar se um elemento está visível na viewport
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.85 &&
            rect.bottom >= 0
        );
    }

    // Função para animar elementos quando ficarem visíveis
    function animateElementsOnScroll() {
        const elements = document.querySelectorAll('.animate-on-scroll');
        
        elements.forEach(element => {
            if (isElementInViewport(element) && !element.classList.contains('active')) {
                element.classList.add('active');
            }
        });
    }

    // Executar a função quando a página carrega e durante o scroll
    animateElementsOnScroll();
    window.addEventListener('scroll', animateElementsOnScroll);
    window.addEventListener('resize', animateElementsOnScroll);
});

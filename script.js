document.addEventListener('DOMContentLoaded', () => {
    const card = document.querySelector('.glass-card');
    
    // Add subtle interactive tilt effect
    document.addEventListener('mousemove', (e) => {
        if (!card) return;
        
        const xAxis = (window.innerWidth / 2 - e.pageX) / 50;
        const yAxis = (window.innerHeight / 2 - e.pageY) / 50;
        
        card.style.transform = `perspective(1000px) rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    });
    
    // Reset on mouse leave
    document.addEventListener('mouseleave', () => {
        if (!card) return;
        card.style.transform = `perspective(1000px) rotateY(-5deg) rotateX(5deg)`;
    });
});

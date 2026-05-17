document.addEventListener("DOMContentLoaded", () => {
    
    const triggers = document.querySelectorAll('.modal-trigger');
    const modal = document.getElementById('master-modal');
    const btnCerrar = document.getElementById('close-modal');
    
    const imgElement = document.getElementById('carousel-img');
    const titleElement = document.getElementById('carousel-title');
    const descElement = document.getElementById('carousel-desc');
    const counterElement = document.getElementById('slide-counter');
    
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');

    let currentDataArray = [];
    let currentIndex = 0;

    // Función para actualizar la vista del modal
    function updateSlide() {
        if(!currentDataArray || currentDataArray.length === 0) return;
        const data = currentDataArray[currentIndex];
        
        imgElement.style.opacity = 0; 
        setTimeout(() => {
            imgElement.src = data.img;
            titleElement.textContent = data.title;
            descElement.textContent = data.desc;
            counterElement.textContent = `${currentIndex + 1} / ${currentDataArray.length}`;
            imgElement.style.opacity = 1;
        }, 150);
    }

    // Leer los datos del HTML al hacer clic en cualquier tarjeta
    triggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Buscar todos los elementos '.slide' dentro de la tarjeta clickeada
            const slides = trigger.querySelectorAll('.carousel-data .slide');
            
            // Construir el array de datos leyendo los atributos HTML
            currentDataArray = Array.from(slides).map(slide => ({
                img: slide.getAttribute('data-img'),
                title: slide.getAttribute('data-title'),
                desc: slide.getAttribute('data-desc')
            }));

            // Si hay datos, abrir el modal
            if(currentDataArray.length > 0) {
                currentIndex = 0; 
                updateSlide();
                modal.classList.add('active');
            } else {
                console.warn("No se encontraron slides en el HTML para este elemento.");
            }
        });
    });

    // Controles de cierre
    btnCerrar.addEventListener('click', () => modal.classList.remove('active'));
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
    });

    // Controles de navegación del carrusel
    btnNext.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % currentDataArray.length;
        updateSlide();
    });

    btnPrev.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + currentDataArray.length) % currentDataArray.length;
        updateSlide();
    });

});
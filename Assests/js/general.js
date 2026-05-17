/**
 * Script enfocado en la lógica del Carrusel Maestro.
 * Extrae datos del HTML y utiliza la Cache API para almacenamiento persistente.
 */

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

    // ✨ NUEVA FUNCIÓN: Guardar en la Caché persistente del navegador
    async function saveToCache(imagesArray) {
        // Verificamos si el navegador soporta la moderna API de Caché
        if ('caches' in window) {
            try {
                // Abrimos (o creamos) un "cajón" de memoria específico para el proyecto
                const cache = await caches.open('patrimonio-galeria-v1');
                
                for (const item of imagesArray) {
                    if (item.img) {
                        // Comprobamos si la imagen ya está guardada en este "cajón"
                        const isCached = await cache.match(item.img);
                        
                        if (!isCached) {
                            // Si no está, forzamos la descarga y la guardamos permanentemente
                            await cache.add(item.img);
                            console.log('🖼️ Guardada en caché estricta:', item.img);
                        } else {
                            // Si ya está, no hacemos peticiones de red
                            console.log('✅ Ya estaba en caché:', item.img);
                        }
                    }
                }
            } catch (error) {
                console.error('Error al intentar guardar en la caché:', error);
            }
        } else {
            // Plan B (Fallback) por si el usuario usa un navegador muy antiguo
            imagesArray.forEach(item => {
                if (item.img) new Image().src = item.img;
            });
        }
    }

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
            
            // Extraer info de los divs ocultos en el HTML
            const slides = trigger.querySelectorAll('.carousel-data .slide');
            
            currentDataArray = Array.from(slides).map(slide => ({
                img: slide.getAttribute('data-img'),
                title: slide.getAttribute('data-title'),
                desc: slide.getAttribute('data-desc')
            }));

            if(currentDataArray.length > 0) {
                currentIndex = 0; 
                
                // EJECUCIÓN DE LA CACHÉ: Se manda a guardar/verificar el array de imágenes
                saveToCache(currentDataArray);
                
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
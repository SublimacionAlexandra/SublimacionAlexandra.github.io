/*=========================================
  SUBLIMACIÓN ALEXANDRA
  script.js
==========================================*/


/*=============================
    CARRUSEL
==============================*/

const slides = document.querySelectorAll(".slide");

let indice = 0;

function mostrarSlide(numero){

    slides.forEach(slide=>{

        slide.classList.remove("active");

    });

    slides[numero].classList.add("active");

}

function siguienteSlide(){

    indice++;

    if(indice>=slides.length){

        indice=0;

    }

    mostrarSlide(indice);

}

if(slides.length>0){

setInterval(siguienteSlide,4000);

}


/*=============================
    ANIMACIONES
==============================*/

const elementos = document.querySelectorAll(".card,.categoria");

const observador = new IntersectionObserver((entradas)=>{

entradas.forEach((entrada)=>{

if(entrada.isIntersecting){

entrada.target.classList.add("mostrar");

}

});

},{
threshold:.20
});

elementos.forEach((el)=>{

observador.observe(el);

});


/*=============================
    HEADER SCROLL
==============================*/

const header = document.querySelector("header");

window.addEventListener("scroll",()=>{

if(window.scrollY>50){

header.classList.add("header-scroll");

}else{

header.classList.remove("header-scroll");

}

});


/*=============================
    BOTÓN VOLVER ARRIBA
==============================*/

const volver=document.createElement("button");

volver.innerHTML="↑";

volver.className="volver-arriba";

document.body.appendChild(volver);


window.addEventListener("scroll",()=>{

if(window.scrollY>400){

volver.classList.add("visible");

}else{

volver.classList.remove("visible");

}

});


volver.addEventListener("click",()=>{

window.scrollTo({

top:0,

behavior:"smooth"

});

});


/*=============================
    EFECTO TARJETAS
==============================*/

const tarjetas=document.querySelectorAll(".card");

tarjetas.forEach((card)=>{

card.addEventListener("mousemove",(e)=>{

const rect=card.getBoundingClientRect();

const x=e.clientX-rect.left;

const y=e.clientY-rect.top;

card.style.setProperty("--x",x+"px");

card.style.setProperty("--y",y+"px");

});

});

/*=============================
    LIGHTBOX GALERÍA
==============================*/

document.addEventListener("DOMContentLoaded", () => {

    const imagenes = document.querySelectorAll(".galeria img");
    const lightbox = document.querySelector(".lightbox");
    const imagenGrande = document.getElementById("imagenLightbox");
    const cerrar = document.querySelector(".cerrar");

    if (!imagenes.length || !lightbox || !imagenGrande || !cerrar) {
        console.log("No se encontró algún elemento del lightbox");
        return;
    }

    imagenes.forEach(img => {

        img.addEventListener("click", () => {

            imagenGrande.src = img.src;
            lightbox.classList.add("activo");

        });

    });

    cerrar.addEventListener("click", () => {

        lightbox.classList.remove("activo");

    });

    lightbox.addEventListener("click", (e) => {

        if (e.target === lightbox) {

            lightbox.classList.remove("activo");

        }

    });

});
/*=============================
MENU RESPONSIVE
==============================*/

const menu = document.querySelector(".menu-toggle");

const nav = document.querySelector("nav");

menu.addEventListener("click",()=>{

    nav.classList.toggle("activo");

});
/*=============================
CONTADORES
==============================*/

document.addEventListener("DOMContentLoaded", () => {

    const contadores = document.querySelectorAll(".contador");

    if (contadores.length === 0) return;

    const iniciarContador = (contador) => {

        const objetivo = parseInt(contador.dataset.target);
        let valor = 0;

        const intervalo = setInterval(() => {

            valor += Math.ceil(objetivo / 100);

            if (valor >= objetivo) {

                contador.textContent = objetivo.toLocaleString();
                clearInterval(intervalo);

            } else {

                contador.textContent = valor;

            }

        }, 20);

    };

    const observer = new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                iniciarContador(entry.target);
                observer.unobserve(entry.target);

            }

        });

    }, {
        threshold: 0.5
    });

    contadores.forEach(contador => {

        observer.observe(contador);

    });

});
/*=============================
ANIMACIONES SCROLL
==============================*/

const elementosScroll = document.querySelectorAll(
".card,.beneficio,.estadistica,.testimonio,.galeria img"
);

elementosScroll.forEach(e=>{

    e.classList.add("animar");

});

const observadorScroll = new IntersectionObserver((entradas)=>{

    entradas.forEach(entrada=>{

        if(entrada.isIntersecting){

            entrada.target.classList.add("visible");

        }

    });

},{
    threshold:0.2
});

elementosScroll.forEach(e=>{

    observadorScroll.observe(e);

});
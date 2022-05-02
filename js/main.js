const contenedorProductos = document.getElementById('contenedor-productos');
const listadoCompras = document.getElementById('listado-compras');
const btnComprar = document.getElementById('btn-comprar');
const totalPrecioCarrito = document.getElementById('total-precio-carrito');
const btnCarrito = document.getElementById('carrito-flotante');

let img = document.getElementById('imagen');
let precio = document.getElementById('precio-producto');
let titulo = document.getElementById('titulo-producto');
let descripcion = document.getElementById('descripcion-producto');

let html = "<div class='row'>";
let carrito = [];
let data = [];
let total = 0;

fetch("../productos.json")
.then(response => {
   return response.json();
})

.then(jsondata =>  {
    data = jsondata;
    if(window.location.pathname == "/index.html" || window.location.pathname == "/" || window.location.pathname == "/tienda.html" ) {
        if(window.location.pathname == "/index.html" || window.location.pathname == "/") {
            data = jsondata.filter(reg => reg.destacado == 1);
         }else if(window.location.pathname == "/tienda.html") { 
             data = jsondata;
         }
        
        data.forEach(function(registro, index) {
                html += `
                    <div class="col-md-3 mb-3">
                        <div class="card">                   
                            <img  src="${registro.imagen}" class="card-img-top " alt="Imagen Card">
                            <div class="card-block">
                                <h5 class="card-title">${registro.nombre}</h5>
                                <p class="card-title">$${registro.precio}</p>
                                <div class="card-img-overlay">
                                    <div class="card-text-overlay buttoms-position">
                                        <a href="producto.html?id=${index}" class="btn btn-secondary">Ver Detalles</a>
                                        <br>
                                        <button href="#" onclick="agregarAlCarrito(${index})" class="btn btn-success">Añadir al carrito <img class="cart-icon" src="img/icons/plus.png"></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                        `;
        });
        html += `</div>`;
        contenedorProductos.innerHTML = html;
    }

    if(window.location.pathname == "/producto.html") {
        let agregarCarrito = document.getElementById('agregar-carrito');
        agregarCarrito.setAttribute('id',getGET()['id']);
        data = jsondata[getGET()['id']];
        img.src = data.imagen
        titulo.innerText = data.nombre;
        precio.innerText = data.precio;
        descripcion.innerText = data.descripcion;
    }  
});

function agregarAlCarrito(index) {
    console.log(data);
    if(window.location.pathname == "/index.html" || window.location.pathname == "/" ||window.location.pathname == "/tienda.html") {
        carrito.push(data[index]);
    }else if(window.location.pathname == "/producto.html") {
        carrito.push(data);
    }
    
    localStorage.setItem('carrito', JSON.stringify(carrito));
    
    renderCarro();
}


function eliminarDeCarrito(registro) {
   let index = registro.parentNode.getAttribute('id');
    
    total = total - carrito[index].precio;
    carrito.splice(index,1);
   // console.log(carrito)
  
    localStorage.setItem('carrito', JSON.stringify(carrito));

    totalPrecioCarrito.innerText = total;
    renderCarro();
}

btnComprar.addEventListener('click', () => {
    carrito = JSON.parse(localStorage.getItem('carrito'));
    let text = "COMPRA:";
    let total=0;
    carrito.forEach(function(registro, index) {
        text += `%0A* ${registro.nombre} -- ${registro.precio}`
        total = total + registro.precio;
        
    });
    let totalwpp = `%0ATotal = ${total}`
    window.location.href = `https://api.whatsapp.com/send/?phone=59891933976&text=${text}%0A${totalwpp}`;
});

// apenas cargue la web, llenar carrito si hay elementos en localstorage
if(localStorage.getItem('carrito') !== undefined && localStorage.getItem('carrito')){
    carrito = JSON.parse(localStorage.getItem('carrito'));

    renderCarro();
}

function renderCarro() {
    total = 0;
    listadoCompras.innerHTML = "";
   
    carrito.forEach(function(registro, index) {
        let li = document.createElement('li');
        li.classList.add('li__carrito');
        li.setAttribute("id", index);
        li.innerHTML = `<img class ="img-carrito" 
        src=${registro.imagen} alt=""><div class="row text-center"><h1 class="titulo-carrito">${registro.nombre}</h1>
        <div class="precio-carrito">$${registro.precio}</div> </div>
        <button class="btn-deletecarrito" onclick="eliminarDeCarrito(this);">
        <img class="d-inline icon-delete-carro" src="img/icons/icons8-cancel.svg"></button>`;
        listadoCompras.appendChild(li);
        total = total + registro.precio;
    });
    totalPrecioCarrito.innerText = total;

    if(carrito.length > 0) {
        btnCarrito.style.display = 'block';
    }else {
        btnCarrito.style.display = 'none';
    }
}



/**
    * Funcion que captura las variables pasados por GET
    * Devuelve un array de clave=>valor
    */
 function getGET()
 {
     // capturamos la url
     var loc = document.location.href;
     // si existe el interrogante
     if(loc.indexOf('?')>0)
     {
         // cogemos la parte de la url que hay despues del interrogante
         var getString = loc.split('?')[1];
         // obtenemos un array con cada clave=valor
         var GET = getString.split('&');
         var get = {};
         // recorremos todo el array de valores
         for(var i = 0, l = GET.length; i < l; i++){
             var tmp = GET[i].split('=');
             get[tmp[0]] = unescape(decodeURI(tmp[1]));
         }
         return get;
     }
 }




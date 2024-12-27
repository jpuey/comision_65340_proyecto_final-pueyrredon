document.getElementById("icono-cart").addEventListener("click", ()=>{
    document.getElementById("cart-contenedor").classList.add("on")
})

document.getElementById("boton-cerrar").addEventListener("click", ()=>{
    document.getElementById("cart-contenedor").classList.remove("on")
})

let Cart = JSON.parse(localStorage.getItem("cart")) || []

const Juegos = document.getElementById("juegos")
const CartDOM = document.getElementById("cart")
const BotonComprar = document.getElementById("boton-comprar")
const Buscador = document.getElementById("buscador")

Buscador.addEventListener("submit", async (e)=>{
    e.preventDefault()

    console.log(e.target[0].value)

    const data = await llamadoraDeData()

    const dataFiltrada = data.filter(el => el.nombre.toLowerCase().includes(e.target[0].value.toLowerCase()))

    funcionQueCreaCards(dataFiltrada)
})

BotonComprar.addEventListener("click", ()=>{
    const total = Cart.reduce((acc, el)=>{
        return acc + (el.precio * el.cantidad)
    },0).toFixed(2)

    if(total == 0){
        return
    }

    Swal.fire({
        title: "Su total es de: " + total,
        text: "¿Usted quiere continuar con la compra?",
        showCancelButton: true
    }).then((results)=>{
        if(results.isConfirmed){
            Swal.fire({
                title: "Agregue su email",
                input: "email"
            }).then((results)=>{
                if(results.value){
                    Cart = []
                    actualizadoraDeCart()
                }
            })

        }else{
            Swal.fire({
                title: "¿Deseaa seguir comprando?",
                timer: 1500,
                timerProgressBar: true
            })
        }
    })
})

const actualizadoraDeCart = () => {
    CartDOM.innerHTML = ""

    localStorage.setItem("cart", JSON.stringify(Cart))

    Cart.forEach(el => {
        const container = document.createElement("div")
        container.classList.add("card-cart")

        const info = document.createElement("div")
        info.classList.add("info")

        const titulo = document.createElement("h3")
        const imagen = document.createElement("img")
        const precio = document.createElement("p")

        titulo.innerText = el.nombre
        imagen.src = el.imagen
        precio.innerText = el.precio

        info.append(titulo, imagen, precio)

        const cantidadContainer = document.createElement("div")

        const botonMas = document.createElement("button")
        const botonMenos = document.createElement("button")
        const cantidad = document.createElement("p")

        botonMas.innerText = "+"
        botonMenos.innerText = "-"
        cantidad.innerText = el.cantidad

        cantidadContainer.append(botonMenos, cantidad, botonMas)

        container.appendChild(info)
        container.appendChild(cantidadContainer)

        botonMas.addEventListener("click", () => {
            const index = Cart.findIndex(prod => prod.id == el.id)
            Cart[index].cantidad += 1
            actualizadoraDeCart()
        })

        botonMenos.addEventListener("click", () => {
            const index = Cart.findIndex(prod => prod.id == el.id)

            if(Cart[index].cantidad == 1){
                Cart.splice(index, 1)
            }else{
                Cart[index].cantidad -= 1
            }
            actualizadoraDeCart()
        })

        CartDOM.appendChild(container)
    })
}

const funcionQueCreaCards = (arrayDeJuegos) => {
    Juegos.innerHTML = ""
    arrayDeJuegos.forEach(el => {
        const container = document.createElement("div")

        container.classList.add("juego")

        const titulo = document.createElement("h3")
        const imagen = document.createElement("img")
        const containerDesc = document.createElement("div")
        const desc = document.createElement("p")
        const precio = document.createElement("p")
        const botonDeCompra = document.createElement("button")

        containerDesc.appendChild(desc)
        containerDesc.classList.add("descripcion")


        titulo.innerText = el.nombre
        imagen.src = el.imagen
        desc.innerText = el.desc
        precio.innerText = "$ " + el.precio

        botonDeCompra.innerText = "Comprar"

        container.append(titulo, imagen, containerDesc, precio, botonDeCompra)

        botonDeCompra.addEventListener("click", ()=>{
            const index = Cart.findIndex(prod => prod.id == el.id)

            if(index == -1){
                Cart.push({
                    nombre: el.nombre,
                    imagen: el.imagen,
                    precio: el.precio,
                    id: el.id,
                    cantidad: 1
                })
            }else{
                Cart[index].cantidad += 1
            }

            actualizadoraDeCart()

            Swal.fire({
                icon: "success",
                title: "Usted agrego " + el.nombre + " al carrito",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                toast: true,
                position: "top-start"
            })
        })

        Juegos.appendChild(container)
    })
}

const llamadoraDeData = async () => {
    const response = await fetch("./data.json")
    const arrayJuegos = await response.json()


    return arrayJuegos
}


document.addEventListener("DOMContentLoaded", async () => {
    const arrayData = await llamadoraDeData()
    funcionQueCreaCards(arrayData)
    actualizadoraDeCart()
})
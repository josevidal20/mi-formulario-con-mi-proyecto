// Vista previa imagen
document.getElementById("foto").addEventListener("change", function(event){

    let file = event.target.files[0];
    let preview = document.getElementById("previewImg");

    if(file){
        let reader = new FileReader();
        reader.onload = function(e){
            preview.src = e.target.result;
            preview.style.display = "block";
        }
        reader.readAsDataURL(file);
    } else {
        preview.src = "";
        preview.style.display = "none";
    }
});


// Registro + Ingreso al parqueadero
document.getElementById("registroForm").addEventListener("submit", function(event){

    event.preventDefault();

    let mensaje = document.getElementById("mensaje");
    let infoParqueo = document.getElementById("infoParqueo");
    let btnSalir = document.getElementById("btnSalir");

    mensaje.textContent = "";
    infoParqueo.textContent = "";

    let nombre = document.getElementById("nombre").value.trim();
    let documento = document.getElementById("documento").value.trim();
    let rol = document.getElementById("rol").value;
    let tipoVehiculo = document.getElementById("tipoVehiculo").value;
    let placa = document.getElementById("placa").value.trim().toUpperCase();
    let modelo = document.getElementById("modelo").value.trim();
    let fotoInput = document.getElementById("foto");
    let foto = document.getElementById("previewImg").src;

    let regexPlaca = /^[A-Z]{3}[0-9]{2}[A-Z0-9]$/;

    if(!regexPlaca.test(placa)){
        mensaje.style.color = "red";
        mensaje.textContent = "Formato de placa inválido. Ej: ABC123";
        return;
    }

    if(fotoInput.files.length === 0){
        mensaje.style.color = "red";
        mensaje.textContent = "Debe seleccionar una imagen";
        return;
    }

    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    let existe = usuarios.some(user => user.placa === placa && user.estado === "En parqueadero");

    if(existe){
        mensaje.style.color = "red";
        mensaje.textContent = "Este vehículo ya está dentro del parqueadero";
        return;
    }

    let idUsuario = Date.now();
    let fechaRegistro = new Date().toLocaleString();

    //  GENERAR CARRIEL Y HORA ENTRADA
    let carriel = Math.floor(Math.random() * 50) + 1;
    let horaEntrada = new Date().toLocaleTimeString();

    let nuevoUsuario = {
        id: idUsuario,
        nombre,
        documento,
        rol,
        tipoVehiculo,
        placa,
        modelo,
        foto,
        estado: "En parqueadero",
        carriel,
        horaEntrada,
        horaSalida: null,
        fechaRegistro
    };

    usuarios.push(nuevoUsuario);

    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    mensaje.style.color = "green";
    mensaje.textContent = "Ingreso exitoso al parqueadero ";

    infoParqueo.innerHTML = `
        Bahía asignada: <b>${carriel}</b><br>
        Hora de entrada: <b>${horaEntrada}</b>
    `;

    btnSalir.style.display = "block";

    // Guardamos ID actual para salida
    localStorage.setItem("usuarioActual", idUsuario);

});


// BOTÓN SALIR
document.getElementById("btnSalir").addEventListener("click", function(){

    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    let idActual = localStorage.getItem("usuarioActual");

    let usuario = usuarios.find(u => u.id == idActual);

    if(usuario){
        let horaSalida = new Date().toLocaleTimeString();

        usuario.estado = "Retirado";
        usuario.horaSalida = horaSalida;

        localStorage.setItem("usuarios", JSON.stringify(usuarios));

        document.getElementById("infoParqueo").innerHTML += `
            <br>Hora de salida: <b>${horaSalida}</b>
        `;

        document.getElementById("btnSalir").style.display = "none";

        document.getElementById("mensaje").style.color = "blue";
        document.getElementById("mensaje").textContent = "Vehículo retirado correctamente";
    }
});
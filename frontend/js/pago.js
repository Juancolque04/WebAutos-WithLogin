document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const autoId = urlParams.get('autoId');
    const modelo = urlParams.get('modelo');
    const metodoPago = urlParams.get('metodoPago');

    const token = localStorage.getItem('token');
    let username = '';
    if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        username = payload.username;
    }

    const formularioPago = document.getElementById('formularioPago');

    if (metodoPago === 'credit-card') {
        formularioPago.innerHTML = `
            <div id="formPago" class="formPago">
                <form class="formComprar">
                    <h1 class="titleCreditCard">Pagar con Tarjeta de credito</h1>
                    <div class="credit-card">
                        <div class="input_container">
                            <label for="titularCard" class="input_label">Nombre completo del titular de la tarjeta</label>
                            <input id="titularCard" class="input_field" type="text" placeholder="Ingrese su nombre completo">
                        </div>
                        <div class="input_container">
                            <label for="NumeroCard" class="input_label">Numero tarjeta</label>
                            <input id="NumeroCard" class="input_field" type="number" placeholder="0000 0000 0000 0000">
                        </div>
                        <div class="input_container">
                            <label for="password_field" class="input_label">Fecha de vencimiento / CVV</label>
                            <div class="split">
                                <input id="fechaVencimiento" class="input_field" type="text" placeholder="01/23">
                                <input id="codigo" class="input_field" type="number" placeholder="CVV">
                            </div>
                        </div>
                        <div class="btnModal">
                            <button class="btnSeleccionar" id="btnSeleccionarPago">Aceptar</button>
                        </div>
                    </div>
                </form>
            </div>
        `;
    } else if (metodoPago === 'mercado-pago') {
        formularioPago.innerHTML = `
            <div id="formPago" class="formPago">
                <form class="formComprar">
                    <h1 class="titleCreditCard">Pagar con Mercado pago</h1>
                    <div class="credit-card">
                        <div class="input_container">
                            <label for="titularMp" class="input_label">Nombre completo del titular de la cuenta</label>
                            <input id="titularMp" class="input_field" type="text" placeholder="Ingrese su nombre completo">
                        </div>
                        <div class="input_container">
                            <label for="cbu" class="input_label">Cvu</label>
                            <input id="cbu" class="input_field" type="number" placeholder="0000000000000000">
                        </div>
                    </div>
                    <div class="btnModal">
                        <button class="btnSeleccionar" id="btnSeleccionarPago">Aceptar</button>
                    </div>
                </form>
            </div>
        `;
    } else if (metodoPago === 'cash') {
        formularioPago.innerHTML = `
            <div id="pagoEfectivp" class="formPago">
                <form class="formComprar">
                    <h1 class="titleCreditCard">Pagar con efectivo</h1>
                    <div class="credit-card">
                        <div class="input_container">
                            <label for="titular" class="input_label">Nombre completo</label>
                            <input id="titular" class="input_field" type="text" placeholder="Ingrese su nombre completo">
                        </div>
                        <div class="input_container">
                            <label for="NumeroTelefono" class="input_label">Numero telefono</label>
                            <input id="NumeroTelefono" class="input_field" type="number" placeholder="381 2304504">
                        </div>
                    </div>
                    <div class="btnModal">
                        <button class="btnSeleccionar" id="btnSeleccionarPago">Aceptar</button>
                    </div>
                </form>
            </div>
        `;
    } else {
        formularioPago.innerHTML = '<p>Método de pago no soportado.</p>';
    }

    document.getElementById('formPago').addEventListener('submit', function (event) {
        event.preventDefault();

        let cardholderName, cardNumber, expiryDate, securityCode;
        if (metodoPago === 'credit-card') {
            cardholderName = document.getElementById('titularCard')?.value;
            cardNumber = document.getElementById('NumeroCard')?.value;
            expiryDate = document.getElementById('fechaVencimiento')?.value;
            securityCode = document.getElementById('codigo')?.value;
        } else if (metodoPago === 'mercado-pago') {
            cardholderName = document.getElementById('titularMp')?.value;
            cardNumber = document.getElementById('cbu')?.value;
        } else if (metodoPago === 'cash') {
            cardholderName = document.getElementById('titular')?.value;
            cardNumber = document.getElementById('NumeroTelefono')?.value;
        }

        if (cardholderName && cardNumber) {
            const compra = {
                usuario: username,
                vehiculo: modelo,
                metodoPago: metodoPago,
            };
            localStorage.setItem('compra', JSON.stringify(compra));
            alert('Pago procesado exitosamente');
             window.location.href = '/frontend/html/index.html';
        } else {
            alert('Por favor, complete todos los campos');
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const whatsappForm = document.getElementById('whatsappForm');
    const resultContainer = document.getElementById('resultContainer');
    const nombreInquilino = document.getElementById('nombreInquilino');
    const cuotasTable = document.getElementById('cuotasTable');
    const btnSalir = document.getElementById('btnSalir');

    whatsappForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(whatsappForm);
        const whatsapp = parseInt(formData.get('whatsapp')); // Convertir a número

        try {
            const response = await fetch('https://villan-system-api-propiedades.vercel.app/api/v1/contratos/get-contrato-whatsapp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ whatsapp })
            });

            if (response.ok) {
                const data = await response.json();
                nombreInquilino.textContent = `${data.Inquilino.nombre} ${data.Inquilino.apellido}`;
                cuotasTable.innerHTML = `
                    <thead>
                        <tr>
                            <th>Vencimiento</th>
                            <th>Estado</th>
                            <th>Importe ARS</th>
                            <th>Importe USD</th>
                            <th>Cuota Proporcional</th>
                            <th>Prórroga</th>
                            <th>Deuda pendiente</th>
                            <th>Fecha Cobro</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.cuotas.map(cuota => `
                            <tr>
                                <td>${formatDate(cuota.fecha_vto)}</td>
                                <td>${cuota.estado || '-'}</td>
                                <td>${cuota.valor_total_ars || '-'}</td>
                                <td>${cuota.valor_total_usd || '-'}</td>
                                <td>${cuota.cuota_proporcional || 'No'}</td>
                                <td>${cuota.prorroga || 'No'}</td>
                                <td>${cuota.valor_restante || '-'}</td>
                                <td>${formatDate(cuota.fecha_cobro)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                `;
                resultContainer.style.display = 'block';
            } else {
                alert('No se encontró un contrato con este número de WhatsApp');
            }
        } catch (error) {
            console.error('Error al procesar la solicitud:', error);
            alert('Error al procesar la solicitud. Por favor, inténtelo de nuevo.');
        }
    });

    btnSalir.addEventListener('click', () => {
        resultContainer.style.display = 'none';
    });
});

function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day < 10 ? '0' + day : day}-${month < 10 ? '0' + month : month}-${year}`;
}

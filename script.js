// --- 0. RENDEREAR MESES ---
function renderMonths() {
    const monthsGrid = document.getElementById('monthsGrid');
    if (!monthsGrid) return;

    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    monthsGrid.innerHTML = '';

    meses.forEach((mes, i) => {
        const monthCard = document.createElement('div');
        monthCard.className = 'month-card';
        monthCard.innerHTML = `
            <div class="month-name">${mes} <i class="fa-regular fa-heart"></i></div>
            <div class="month-field"><span>Libros:</span> <input type="number" id="m_lib_${i}" class="save-field"></div>
            <div class="month-field"><span>Páginas:</span> <input type="number" id="m_pag_${i}" class="save-field"></div>
        `;
        monthsGrid.appendChild(monthCard);
    });
}

// --- 1. MANEJO DE LISTA DE LIBROS (17 FILAS POR DEFECTO) ---
function createInitialBookList() {
    const initial = [];
    for (let i = 0; i < 17; i++) {
        initial.push({ chk: false, title: '', author: '' });
    }
    return initial;
}

let bookListData = JSON.parse(localStorage.getItem('journal_book_list_v3')) || createInitialBookList();

function renderBookList() {
    const container = document.getElementById('bookListContainer');
    if (!container) return;
    const header = container.querySelector('.book-list-header');
    container.innerHTML = '';
    if (header) container.appendChild(header);

    bookListData.forEach((item, index) => {
        const row = document.createElement('div');
        row.className = 'book-row';
        row.innerHTML = `
            <input type="checkbox" ${item.chk ? 'checked' : ''} onchange="updateBookItem(${index}, 'chk', this.checked)" class="checkbox-interactive">
            <input type="text" value="${escapeHtml(item.title)}" oninput="updateBookItem(${index}, 'title', this.value)">
            <input type="text" value="${escapeHtml(item.author)}" oninput="updateBookItem(${index}, 'author', this.value)">
            <button class="btn-delete-row" onclick="removeBookRow(${index})" title="Eliminar fila"><i class="fa-solid fa-xmark"></i></button>
        `;
        container.appendChild(row);
    });
}

function updateBookItem(index, key, value) {
    bookListData[index][key] = value;
    saveBookList();
}

function addNewBookRow() {
    bookListData.push({ chk: false, title: '', author: '' });
    saveBookList();
    renderBookList();
}

function removeBookRow(index) {
    bookListData.splice(index, 1);
    saveBookList();
    renderBookList();
}

function saveBookList() {
    localStorage.setItem('journal_book_list_v3', JSON.stringify(bookListData));
}

// --- 2. MANEJO DE FICHAS DE LECTURA DINÁMICAS ---
let fichasData = JSON.parse(localStorage.getItem('journal_fichas_v3')) || [
    createEmptyFichaObject()
];

function createEmptyFichaObject() {
    return {
        id: 'ficha_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        titulo: '',
        autor: '',
        paginas: '',
        inicio: '',
        fin: '',
        rating: 0,
        spice: 0,
        fmt_fisico: false,
        fmt_epub: false,
        fmt_kindle: false,
        fmt_pdf: false,
        notas: '',
        coverImg: ''
    };
}

function renderFichas() {
    const container = document.getElementById('fichasContainer');
    if (!container) return;
    container.innerHTML = '';

    fichasData.forEach((ficha, index) => {
        const page = document.createElement('div');
        page.className = 'journal-page';
        page.innerHTML = `
            <div class="page-header">
                <h1 class="page-title">Ficha de Lectura</h1>
                <p class="page-subtitle">Reseña & Registro</p>
                <div class="header-divider">
                    <div class="line"></div>
                    <i class="fa-solid fa-feather-pointed flower"></i>
                    <div class="line"></div>
                </div>
            </div>

            <div class="ficha-grid">
                <div class="cover-box-upload" onclick="triggerCoverUpload('${ficha.id}')">
                    <i class="fa-solid fa-cloud-arrow-up" style="font-size: 32px; color: var(--accent-pink);"></i>
                    <span style="font-size: 12px; font-weight: 500;">Subir portada</span>
                    <input type="file" id="input_cover_${ficha.id}" accept="image/*" style="display: none;" onchange="handleCoverUpload(event, ${index})">
                    <img id="img_cover_${ficha.id}" src="${ficha.coverImg || ''}" style="display: ${ficha.coverImg ? 'block' : 'none'};" alt="Portada">
                </div>

                <div class="details-box">
                    <div class="field-group">
                        <span class="field-label">Título:</span>
                        <input type="text" value="${escapeHtml(ficha.titulo)}" oninput="updateFichaField(${index}, 'titulo', this.value)">
                    </div>
                    <div class="field-group">
                        <span class="field-label">Autor:</span>
                        <input type="text" value="${escapeHtml(ficha.autor)}" oninput="updateFichaField(${index}, 'autor', this.value)">
                    </div>
                    <div class="field-group">
                        <span class="field-label">Páginas:</span>
                        <input type="number" value="${ficha.paginas}" oninput="updateFichaField(${index}, 'paginas', this.value)">
                    </div>

                    <div class="two-cols-field">
                        <div class="field-group">
                            <span class="field-label" style="min-width: 40px;">Inicio:</span>
                            <input type="text" value="${escapeHtml(ficha.inicio)}" oninput="updateFichaField(${index}, 'inicio', this.value)" placeholder="DD/MM/AA">
                        </div>
                        <div class="field-group">
                            <span class="field-label" style="min-width: 30px;">Fin:</span>
                            <input type="text" value="${escapeHtml(ficha.fin)}" oninput="updateFichaField(${index}, 'fin', this.value)" placeholder="DD/MM/AA">
                        </div>
                    </div>

                    <!-- Rating Toggle -->
                    <div class="rating-box">
                        <span class="field-label">Rating:</span>
                        <div class="rating-stars">
                            ${[1,2,3,4,5].map(v => `
                                <span class="material-symbols-outlined star-icon ${v <= ficha.rating ? 'active' : ''}" 
                                      onclick="toggleRating(${index}, 'rating', ${v})">star</span>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Spice Toggle -->
                    <div class="rating-box">
                        <span class="field-label">Spice:</span>
                        <div class="rating-chilis">
                            ${[1,2,3,4,5].map(v => `
                                <span class="material-symbols-outlined chili-icon ${v <= ficha.spice ? 'active' : ''}" 
                                      onclick="toggleRating(${index}, 'spice', ${v})">local_fire_department</span>
                            `).join('')}
                        </div>
                    </div>

                    <div class="format-section">
                        <div class="format-title">Formato de Lectura</div>
                        <div class="format-options">
                            <label class="format-option"><input type="checkbox" ${ficha.fmt_fisico ? 'checked' : ''} onchange="updateFichaField(${index}, 'fmt_fisico', this.checked)" class="checkbox-interactive"> Físico</label>
                            <label class="format-option"><input type="checkbox" ${ficha.fmt_epub ? 'checked' : ''} onchange="updateFichaField(${index}, 'fmt_epub', this.checked)" class="checkbox-interactive"> Epub</label>
                            <label class="format-option"><input type="checkbox" ${ficha.fmt_kindle ? 'checked' : ''} onchange="updateFichaField(${index}, 'fmt_kindle', this.checked)" class="checkbox-interactive"> Kindle</label>
                            <label class="format-option"><input type="checkbox" ${ficha.fmt_pdf ? 'checked' : ''} onchange="updateFichaField(${index}, 'fmt_pdf', this.checked)" class="checkbox-interactive"> PDF</label>
                        </div>
                    </div>
                </div>
            </div>

            <div class="notes-container">
                <div class="notes-header">Notas</div>
                <textarea class="digital-notes-textarea" oninput="updateFichaField(${index}, 'notas', this.value)" >${escapeHtml(ficha.notas)}</textarea>
            </div>

            <!-- Papelera protegida (Solo para fichas creadas adicionales) -->
            ${index > 0 ? `
                <button class="btn-delete-ficha-corner" onclick="deleteFicha(${index})" title="Eliminar Ficha">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            ` : ''}

            <!-- Botón de añadir ficha -->
            <button class="btn-add-ficha-corner" onclick="createNewFicha()" title="Añadir Nueva Ficha de Lectura">
                <i class="fa-solid fa-plus"></i>
            </button>
        `;
        container.appendChild(page);
    });
}

function createNewFicha() {
    fichasData.push(createEmptyFichaObject());
    saveFichas();
    renderFichas();
}

function deleteFicha(index) {
    if (index === 0) return; // Primera ficha 100% inalterable

    if (confirm("¿Quieres eliminar esta ficha de lectura?")) {
        fichasData.splice(index, 1);
        saveFichas();
        renderFichas();
    }
}

function updateFichaField(index, key, value) {
    fichasData[index][key] = value;
    saveFichas();
}

function toggleRating(index, key, value) {
    const current = fichasData[index][key];
    fichasData[index][key] = (current === value) ? 0 : value;
    saveFichas();
    renderFichas();
}

function triggerCoverUpload(id) {
    document.getElementById(`input_cover_${id}`).click();
}

function handleCoverUpload(event, index) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(evt) {
            fichasData[index].coverImg = evt.target.result;
            saveFichas();
            renderFichas();
        };
        reader.readAsDataURL(file);
    }
}

function saveFichas() {
    localStorage.setItem('journal_fichas_v3', JSON.stringify(fichasData));
}

// --- 3. AUTO-GUARDADO DE MESES Y TOTALES ---
function saveMonthData() {
    document.querySelectorAll('.save-field').forEach(el => {
        localStorage.setItem(el.id, el.value);
    });
}

function loadMonthData() {
    document.querySelectorAll('.save-field').forEach(el => {
        const val = localStorage.getItem(el.id);
        if (val !== null) el.value = val;
    });
}

document.addEventListener('input', (e) => {
    if (e.target.classList.contains('save-field')) {
        saveMonthData();
    }
});

function escapeHtml(text) {
    if (!text) return '';
    return text.replace(/"/g, "&quot;");
}

// Cargar todo al iniciar el DOM
window.addEventListener('DOMContentLoaded', () => {
    renderMonths();
    renderBookList();
    renderFichas();
    loadMonthData();
});
let pls = JSON.parse(localStorage.getItem('pls')) || [];

function openTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.style.display = 'none');
    document.getElementById(tabName).style.display = 'block';
    if(tabName === 'urna') renderUrna();
    if(tabName === 'livro') renderLivro();
}

function publishPL() {
    const title = document.getElementById('pl-title').value;
    const text = document.getElementById('pl-text').value;
    if(!title || !text) return alert("Preencha todos os campos!");

    const newPL = { id: Date.now(), title, text, votesUp: 0, votesDown: 0, status: 'voting' };
    pls.push(newPL);
    save();
    alert("Publicado na Urna!");
    openTab('urna');
}

function renderUrna() {
    const container = document.getElementById('urna-list');
    container.innerHTML = '';
    pls.filter(pl => pl.status === 'voting').forEach(pl => {
        container.innerHTML += `
            <div class="card">
                <h3>${pl.title}</h3>
                <p>${pl.text}</p>
                <button class="btn-vote btn-approve" onclick="vote(${pl.id}, 'up')">Aprovar (${pl.votesUp})</button>
                <button class="btn-vote btn-reject" onclick="vote(${pl.id}, 'down')">Recusar (${pl.votesDown})</button>
            </div>
        `;
    });
}

function vote(id, type) {
    const pl = pls.find(p => p.id === id);
    if(type === 'up') pl.votesUp++;
    else pl.votesDown++;
    
    // Lógica de aprovação: se tiver 3 votos positivos, vira Lei
    if(pl.votesUp >= 3) pl.status = 'approved';
    // Se tiver 3 negativos, "some" (é arquivado)
    if(pl.votesDown >= 3) pl.status = 'rejected';
    
    save();
    renderUrna();
}

function renderLivro() {
    const container = document.getElementById('livro-list');
    container.innerHTML = '';
    pls.filter(pl => pl.status === 'approved').forEach(pl => {
        container.innerHTML += `<div class="card"><h3>LEI: ${pl.title}</h3><p>${pl.text}</p></div>`;
    });
}

function save() { localStorage.setItem('pls', JSON.stringify(pls)); }

// Função simples de chat
function sendMessage() {
    const input = document.getElementById('chat-input');
    if(!input.value) return;
    const box = document.getElementById('chat-box');
    box.innerHTML += `<p><strong>Usuário:</strong> ${input.value}</p>`;
    input.value = '';
    box.scrollTop = box.scrollHeight;
}

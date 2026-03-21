// Banco de dados local
let pls = JSON.parse(localStorage.getItem('cyber_data')) || [];

// 1. FUNCIONAMENTO DAS ABAS
function openTab(evt, name) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    
    document.getElementById(name).classList.add('active');
    evt.currentTarget.classList.add('active');

    if(name === 'urna') renderUrna();
    if(name === 'livro') renderLivro();
}

// 2. FUNCIONAMENTO DO CHAT (Mandar Mensagem)
document.getElementById('btn-chat-send').addEventListener('click', sendMessage);

function sendMessage() {
    const input = document.getElementById('chat-input');
    const box = document.getElementById('chat-box');
    
    if (input.value.trim() !== "") {
        const msg = document.createElement('div');
        msg.className = 'msg';
        msg.innerHTML = `<strong>Legislador:</strong> ${input.value}`;
        box.appendChild(msg);
        input.value = "";
        box.scrollTop = box.scrollHeight; // Auto-scroll
    }
}

// 3. FUNCIONAMENTO DO EDITOR (Publicar PL)
function publishPL() {
    const title = document.getElementById('pl-title').value;
    const text = document.getElementById('pl-text').value;

    if (!title || !text) return alert("Preencha todos os campos!");

    const newPL = { id: Date.now(), title, text, up: 0, down: 0, status: 'voting' };
    pls.push(newPL);
    save();
    alert("Projeto enviado para a Urna!");
    document.getElementById('pl-title').value = "";
    document.getElementById('pl-text').value = "";
}

// 4. FUNCIONAMENTO DA URNA (Votar)
function renderUrna() {
    const container = document.getElementById('urna-list');
    container.innerHTML = '';
    
    pls.filter(p => p.status === 'voting').forEach(p => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <h3>${p.title}</h3>
            <p>${p.text}</p>
            <button class="btn-vote approve" onclick="vote(${p.id}, 'up')">Aprovar (${p.up})</button>
            <button class="btn-vote reject" onclick="vote(${p.id}, 'down')">Recusar (${p.down})</button>
        `;
        container.appendChild(card);
    });
}

function vote(id, type) {
    const p = pls.find(item => item.id === id);
    if (type === 'up') p.up++;
    else p.down++;

    // REGRA: Se tiver 3 votos de vantagem, vira Lei
    if (p.up >= 3) p.status = 'approved';
    
    save();
    renderUrna();
}

// 5. FUNCIONAMENTO DO LIVRO
function renderLivro() {
    const container = document.getElementById('livro-list');
    container.innerHTML = '';
    pls.filter(p => p.status === 'approved').forEach(p => {
        container.innerHTML += `<div class="card"><h3>📜 ${p.title}</h3><p>${p.text}</p></div>`;
    });
}

function save() { localStorage.setItem('cyber_data', JSON.stringify(pls)); }

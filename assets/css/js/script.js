// Dados iniciais com Leis Protocolares
let pls = JSON.parse(localStorage.getItem('cyber_v2_data')) || [
    { id: 1, title: "LP-01: Sistema P2P", text: "O Cybercracy é regido pela soberania digital dos usuários.", status: "approved" },
    { id: 2, title: "LP-02: Rito de Votação", text: "Projetos precisam de saldo positivo de 5 votos para virar lei.", status: "approved" }
];

function openTab(evt, name) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(name).classList.add('active');
    evt.currentTarget.classList.add('active');
    if(name === 'urna') renderUrna();
    if(name === 'livro') renderLivro();
}

// CHAT
function sendMessage() {
    const input = document.getElementById('chat-input');
    const box = document.getElementById('chat-box');
    if(!input.value) return;

    const msgDiv = document.createElement('div');
    msgDiv.className = 'msg';
    msgDiv.innerHTML = `<strong>Legislador:</strong> ${input.value}`;
    box.appendChild(msgDiv);
    
    input.value = '';
    box.scrollTop = box.scrollHeight;
}

// PUBLICAR PL
function publishPL() {
    const title = document.getElementById('pl-title').value;
    const text = document.getElementById('pl-text').value;

    if(!title || !text) {
        alert("Erro: Preencha o título e o texto da lei.");
        return;
    }

    const newPL = { id: Date.now(), title, text, up: 0, down: 0, status: 'voting' };
    pls.push(newPL);
    saveData();
    alert("PL enviada para a Urna!");
    openTab({currentTarget: document.querySelector('.tabs button:nth-child(3)')}, 'urna');
}

// URNA
function renderUrna() {
    const list = document.getElementById('urna-list');
    list.innerHTML = '';
    const voting = pls.filter(p => p.status === 'voting');

    if(voting.length === 0) list.innerHTML = "<p>Nenhum projeto em votação.</p>";

    voting.forEach(p => {
        list.innerHTML += `
            <div class="card">
                <h3>${p.title}</h3>
                <p>${p.text}</p>
                <div class="vote-actions">
                    <button class="btn-send btn-approve" onclick="vote(${p.id}, 'up')">Aprovar (${p.up})</button>
                    <button class="btn-send btn-reject" onclick="vote(${p.id}, 'down')">Recusar (${p.down})</button>
                    <button class="btn-send" style="background:#64748b" onclick="vote(${p.id}, 'drop')">Derrubar</button>
                </div>
            </div>`;
    });
}

function vote(id, type) {
    const p = pls.find(x => x.id === id);
    if(type === 'up') p.up++;
    if(type === 'down') p.down++;
    if(type === 'drop') {
        if(confirm("Deseja realmente derrubar este projeto? Ele sumirá da rede.")) {
            pls = pls.filter(x => x.id !== id);
        }
    }

    // Lógica de Aprovação
    if(p && p.up - p.down >= 5) {
        p.status = 'approved';
        alert("SUCESSO: Projeto aprovado e registrado no Livro!");
    }
    
    saveData();
    renderUrna();
}

// LIVRO
function renderLivro() {
    const list = document.getElementById('livro-list');
    list.innerHTML = '';
    pls.filter(p => p.status === 'approved').forEach(p => {
        list.innerHTML += `
            <div class="card" style="border-left-color: #fbbf24">
                <h3>📜 ${p.title}</h3>
                <p>${p.text}</p>
            </div>`;
    });
}

function saveData() { localStorage.setItem('cyber_v2_data', JSON.stringify(pls)); }

// Mensagem inicial no chat
window.onload = () => {
    const box = document.getElementById('chat-box');
    box.innerHTML = `<div class="msg system">Sistema: Rede Cybercracy P2P online. Aguardando legisladores...</div>`;
};

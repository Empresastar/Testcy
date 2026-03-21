let pls = JSON.parse(localStorage.getItem('cyber_data')) || [];

function openTab(evt, name) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(name).classList.add('active');
    evt.currentTarget.classList.add('active');
    if(name === 'urna') renderUrna();
    if(name === 'livro') renderLivro();
}

function publishPL() {
    const t = document.getElementById('pl-title').value;
    const c = document.getElementById('pl-text').value;
    if(!t || !c) return alert("Preencha tudo!");
    pls.push({ id: Date.now(), title: t, text: c, up: 0, down: 0, status: 'voting' });
    localStorage.setItem('cyber_data', JSON.stringify(pls));
    alert("Publicado!");
}

function renderUrna() {
    const div = document.getElementById('urna-list');
    div.innerHTML = '';
    pls.filter(p => p.status === 'voting').forEach(p => {
        div.innerHTML += `
            <div class="card">
                <h3>${p.title}</h3>
                <button onclick="vote(${p.id}, 'up')">Sim (${p.up})</button>
                <button onclick="vote(${p.id}, 'down')">Não (${p.down})</button>
            </div>`;
    });
}

function vote(id, type) {
    const p = pls.find(x => x.id === id);
    type === 'up' ? p.up++ : p.down++;
    if(p.up >= 3) p.status = 'approved'; 
    localStorage.setItem('cyber_data', JSON.stringify(pls));
    renderUrna();
}

function renderLivro() {
    const div = document.getElementById('livro-list');
    div.innerHTML = '';
    pls.filter(p => p.status === 'approved').forEach(p => {
        div.innerHTML += `<div class="card"><h3>📜 ${p.title}</h3><p>${p.text}</p></div>`;
    });
}

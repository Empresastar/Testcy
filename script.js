let pls = JSON.parse(localStorage.getItem('cyber_pls')) || [];

function openTab(evt, tabName) {
    let i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) tabcontent[i].classList.remove("active");
    
    tablinks = document.getElementsByClassName("tab-btn");
    for (i = 0; i < tablinks.length; i++) tablinks[i].classList.remove("active");
    
    document.getElementById(tabName).classList.add("active");
    evt.currentTarget.classList.add("active");

    if(tabName === 'urna') renderUrna();
    if(tabName === 'livro') renderLivro();
}

function publishPL() {
    const title = document.getElementById('pl-title').value;
    const text = document.getElementById('pl-text').value;

    if(!title || !text) return alert("Por favor, preencha o título e o corpo da lei.");

    const newPL = {
        id: Date.now(),
        title: title,
        text: text,
        votesUp: 0,
        votesDown: 0,
        status: 'voting' // voting, approved, rejected
    };

    pls.push(newPL);
    localStorage.setItem('cyber_pls', JSON.stringify(pls));
    alert("Projeto publicado na Urna com sucesso!");
    
    document.getElementById('pl-title').value = '';
    document.getElementById('pl-text').value = '';
}

function renderUrna() {
    const container = document.getElementById('urna-list');
    container.innerHTML = '';
    
    const votingPLs = pls.filter(p => p.status === 'voting');
    
    if(votingPLs.length === 0) {
        container.innerHTML = "<p>Nenhum projeto em votação no momento.</p>";
        return;
    }

    votingPLs.forEach(pl => {
        container.innerHTML += `
            <div class="card">
                <h3>${pl.title}</h3>
                <p>${pl.text.substring(0, 150)}...</p>
                <div class="vote-btns">
                    <button class="btn-v" style="background: #28a745" onclick="vote(${pl.id}, 'up')">Aprovar (${pl.votesUp})</button>
                    <button class="btn-v" style="background: #dc3545" onclick="vote(${pl.id}, 'down')">Recusar (${pl.votesDown})</button>
                </div>
            </div>
        `;
    });
}

function vote(id, type) {
    const pl = pls.find(p => p.id === id);
    if(type === 'up') pl.votesUp++;
    else pl.votesDown++;

    // REGRA: Se tiver 5 votos líquidos positivos, vira lei.
    if(pl.votesUp >= 5) {
        pl.status = 'approved';
        alert(`O projeto "${pl.title}" foi aprovado e agora é LEI!`);
    } else if (pl.votesDown >= 5) {
        pl.status = 'rejected';
        alert(`O projeto "${pl.title}" foi recusado pela comunidade.`);
    }

    localStorage.setItem('cyber_pls', JSON.stringify(pls));
    renderUrna();
}

function renderLivro() {
    const container = document.getElementById('livro-list');
    container.innerHTML = '';
    
    const approved = pls.filter(p => p.status === 'approved');
    
    approved.forEach(pl => {
        container.innerHTML += `
            <div class="card" style="border-left-color: #ffc107">
                <h3>📜 ${pl.title}</h3>
                <p>${pl.text}</p>
                <small>Aprovado por aclamação digital</small>
            </div>
        `;
    });
}

function sendMessage() {
    const input = document.getElementById('chat-input');
    if(!input.value) return;
    
    const box = document.getElementById('chat-box');
    const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    box.innerHTML += `
        <div class="msg">
            <span style="color: var(--primary); font-weight: bold;">[${time}] Legislador:</span>
            <span>${input.value}</span>
        </div>
    `;
    input.value = '';
    box.scrollTop = box.scrollHeight;
}

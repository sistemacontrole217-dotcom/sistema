let cardapio = {

    comidas: [
        {nome:"Baião", preco:15},
        {nome:"Baião 1/2", preco:9},
        {nome:"Arroz", preco:13},
        {nome:"Arroz 1/2", preco:7},
        {nome:"Arroz Agrega", preco:16},
        {nome:"Arroz Agrega 1/2", preco:10},
        {nome:"Combo Família", preco:55},
        {nome:"Jantinha", preco:18},
        {nome:"Camarão 1kg", preco:40},
        {nome:"Camarão 500g", preco:25}
    ],

    espetos: [
        {nome:"Fraldinha", preco:8},
        {nome:"Cupim", preco:8},
        {nome:"Porco", preco:8},
        {nome:"Tripa", preco:8},
        {nome:"Coração Frango", preco:8},
        {nome:"Coração Boi", preco:8},
        {nome:"Linguiça", preco:8}
    ],

    petiscos: [
        {nome:"Camarão Crocante", preco:23},
        {nome:"Batata", preco:14},
        {nome:"Batata 1/2", preco:9},
        {nome:"Batata Especial", preco:22},
        {nome:"Macaxeira", preco:15},
        {nome:"Macaxeira 1/2", preco:10},
        {nome:"Calabresa c/ Fritas", preco:21},
        {nome:"Bolinha Queijo", preco:16},
        {nome:"Bolinha Frango", preco:16},
        {nome:"Bolinha Peixe", preco:16},
        {nome:"Pastel Queijo", preco:15},
        {nome:"Pastel Frango", preco:15}
    ],

    bebidas: [
        {nome:"Skol", preco:5},
        {nome:"Bohemia", preco:5},
        {nome:"Brahma", preco:5},
        {nome:"Heineken", preco:10},
        {nome:"Budweiser", preco:10},
        {nome:"Ypióca Branca 1L", preco:20},
        {nome:"Ypióca Branca Terça", preco:6},
        {nome:"Ypióca Branca Dose", preco:2},
        {nome:"Ypióca Amarela 1L", preco:30},
        {nome:"Ypióca Amarela Terça", preco:7},
        {nome:"Ypióca Amarela Dose", preco:3},
        {nome:"Dreher 1L", preco:30},
        {nome:"Dreher Terça", preco:7},
        {nome:"Dreher Dose", preco:3}
    ],

    refrigerante: [
        {nome:"Coca 1L", preco:8},
        {nome:"Coca Lata", preco:5},
        {nome:"Guaraná 1L", preco:8},
        {nome:"São Geraldo 1L", preco:9},
        {nome:"Fanta Laranja", preco:5},
        {nome:"Fanta Uva", preco:5},
        {nome:"Sprite", preco:5},
        {nome:"Coca 600 Zero", preco:6}
    ],

    sucos: [
        {nome:"Manga", preco:7},
        {nome:"Acerola", preco:7},
        {nome:"Goiaba", preco:7},
        {nome:"Abacaxi", preco:7}
    ]
};

let mesas = JSON.parse(localStorage.getItem("mesas")) || [];
let contadorMesa = JSON.parse(localStorage.getItem("contadorMesa")) || 1;

let totalDia = JSON.parse(localStorage.getItem("totalDia")) || 0;
let mesasAtendidas = JSON.parse(localStorage.getItem("mesasAtendidas")) || 0;

function salvar(){
    localStorage.setItem("mesas", JSON.stringify(mesas));
    localStorage.setItem("contadorMesa", contadorMesa);
    localStorage.setItem("totalDia", totalDia);
    localStorage.setItem("mesasAtendidas", mesasAtendidas);
}

function abrirMesa(){
    if(mesas.length >= 20){
        alert("Limite de 20 mesas!");
        return;
    }

    if(contadorMesa > 20){
        contadorMesa = 1;
    }

    mesas.push({
        id: contadorMesa,
        nome: null,
        itens: [],
        total: 0
    });

    contadorMesa++;
    salvar();
    renderMesas();
}

function renderMesas(){
    let div = document.getElementById("mesas");

    div.innerHTML = `
    <h2>💰 R$ ${totalDia.toFixed(2)}</h2>
    <h3>📊 Mesas: ${mesasAtendidas}</h3>

    <button onclick="zerarCaixa()">🔄 Zerar</button>
    <button onclick="gerarQR()">📱 PIX</button>
    `;

    mesas.forEach((m,i)=>{
        div.innerHTML += `
        <button class="mesaBtn" onclick="abrirTela(${i})">
            ${m.nome || "Mesa " + m.id}
        </button>`;
    });
}

function abrirTela(i){
    let tela = document.getElementById("telaMesa");
    tela.classList.remove("oculto");

    let mesa = mesas[i];

    let html = `
    <h2>${mesa.nome || "Mesa " + mesa.id}</h2>
    <h3>Total: R$ ${mesa.total.toFixed(2)}</h3>

    <button onclick="editarMesa(${i})">✏️ Editar</button>
    <button onclick="gerarQR()">💰 PIX</button>
    `;

    html += "<ul>";
    mesa.itens.forEach((it,idx)=>{
        html += `
        <li>
            ${it.nome} x${it.qtd} - R$ ${(it.preco * it.qtd).toFixed(2)}
            <br>
            <button onclick="add(${i}, '${it.nome}', ${it.preco})">➕</button>
            <button onclick="diminuir(${i},${idx})">➖</button>
            <button onclick="removerTudo(${i},${idx})">❌</button>
        </li>
        `;
    });
    html += "</ul>";

    for(let cat in cardapio){
        html += `<h3>${cat}</h3>`;
        cardapio[cat].forEach(item=>{
            html += `
            <button class="produto" onclick="add(${i}, '${item.nome}', ${item.preco})">
                ${item.nome}<br>R$ ${item.preco}
            </button>`;
        });
    }

    html += `
    <br><button class="finalizar" onclick="fecharConta(${i})">FECHAR</button>
    <br><button onclick="voltar()">⬅ Voltar</button>
    `;

    tela.innerHTML = html;
}

function add(i,nome,preco){
    let mesa = mesas[i];

    let existente = mesa.itens.find(it => it.nome === nome);

    if(existente){
        existente.qtd++;
        mesa.total += preco;
    } else {
        mesa.itens.push({
            nome: nome,
            preco: preco,
            qtd: 1
        });
        mesa.total += preco;
    }

    salvar();
    abrirTela(i);
}

function diminuir(i,idx){
    let item = mesas[i].itens[idx];

    item.qtd--;
    mesas[i].total -= item.preco;

    if(item.qtd <= 0){
        mesas[i].itens.splice(idx,1);
    }

    salvar();
    abrirTela(i);
}

function removerTudo(i,idx){
    if(confirm("Remover todos desse item?")){
        let item = mesas[i].itens[idx];

        mesas[i].total -= item.preco * item.qtd;
        mesas[i].itens.splice(idx,1);

        salvar();
        abrirTela(i);
    }
}

function editarMesa(i){
    let nome = prompt("Nome da mesa:");
    if(nome){
        mesas[i].nome = nome;
        salvar();
        renderMesas();
        abrirTela(i);
    }
}

function fecharConta(i){
    let mesa = mesas[i];

    let pago = prompt("Total: R$ "+mesa.total+"\nValor:");
    if(!pago) return;

    let troco = pago - mesa.total;
    alert("Troco: R$ " + troco.toFixed(2));

    totalDia += mesa.total;
    mesasAtendidas++;

    mesas.splice(i,1);
    salvar();
    voltar();
    renderMesas();
}

function zerarCaixa(){
    if(confirm("Zerar dia?")){
        totalDia = 0;
        mesasAtendidas = 0;
        salvar();
        renderMesas();
    }
}

function gerarQR(){
    let qr = document.getElementById("qrArea");
    qr.classList.remove("oculto");

    qr.innerHTML = `
    <h2>💰 PIX</h2>

    <img src="pix.jpeg">

    <p><b>Terezinha Cruz</b></p>
    <p>Chave: 85997614327</p>

    <button onclick="fecharQR()">Fechar</button>
    `;
}

function fecharQR(){
    document.getElementById("qrArea").classList.add("oculto");
}

function voltar(){
    document.getElementById("telaMesa").classList.add("oculto");
}

renderMesas();

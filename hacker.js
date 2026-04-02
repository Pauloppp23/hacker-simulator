let map, marker, currentIP = "", totalSaldo = 0;
let isMining = false, isAttacking = false;

document.addEventListener("DOMContentLoaded", () => {
    // Inicializa Mapa
    map = L.map('map', { zoomControl: false }).setView([0, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    
    // Busca IP inicial
    fetchIP();

    // Eventos
    document.getElementById('search-btn').onclick = () => {
        const val = document.getElementById('ip-input').value.trim();
        if(val) fetchIP(val);
    };

    document.getElementById('clear-btn').onclick = () => {
        document.getElementById('ip-input').value = "";
        fetchIP();
    };

    // Monitor de Teclado (Hacker Actions)
    document.addEventListener('keydown', (e) => {
        const key = e.key.toUpperCase();
        
        // Mineração
        if(!isMining && ['B','E','S'].includes(key)) {
            const coins = { 'B': 'BITCOIN', 'E': 'ETHEREUM', 'S': 'SOLANA' };
            startMining(coins[key]);
        }

        // DDoS
        const ddosTargets = {
            'Y':'Youtube','D':'Discord','A':'Amazon','T':'Tiktok','F':'Facebook',
            'X':'X-Corp','I':'Instagram','R':'Rumble','L':'LS Hub','G':'Github',
            'S':'Studio','V':'DevianArt','N':'Reddit','P':'Replit'
        };
        if(!isAttacking && ddosTargets[key]) {
            startDDoS(ddosTargets[key]);
        }
    });
});

async function fetchIP(target = "") {
    try {
        const res = await fetch(`http://ip-api.com/json/${target}`);
        const data = await res.json();
        
        document.getElementById('display-ip').innerText = data.query;
        document.getElementById('city').innerText = data.city || "--";
        document.getElementById('region').innerText = data.regionName || "--";
        document.getElementById('isp').innerText = data.as || "--";
        document.getElementById('lat').innerText = data.lat;
        document.getElementById('lon').innerText = data.lon;

        const pos = [data.lat, data.lon];
        map.flyTo(pos, 12);
        if(marker) map.removeLayer(marker);
        marker = L.marker(pos).addTo(map).bindPopup(data.query).openPopup();

    } catch(e) { showNotify("ERRO_DE_CONEXÃO", true); }
}

function startMining(name) {
    isMining = true;
    document.getElementById('miner-options').classList.add('hidden');
    document.getElementById('miner-proc').classList.remove('hidden');
    document.getElementById('miner-name').innerText = "MINERANDO_" + name;
    
    let time = 240; // 4 min
    const loop = setInterval(() => {
        time--;
        let perc = ((240 - time) / 240) * 100;
        document.getElementById('bar-miner').style.width = perc + "%";
        document.getElementById('miner-perc').innerText = Math.floor(perc) + "%";
        document.getElementById('miner-time').innerText = `0${Math.floor(time/60)}:${(time%60).toString().padStart(2,'0')}`;

        if(time <= 0) {
            clearInterval(loop);
            document.getElementById('btn-resgatar').classList.remove('hidden');
        }
    }, 1000);
}

function resgatarCrypto() {
    totalSaldo += 1500;
    updateWallet();
    isMining = false;
    document.getElementById('miner-options').classList.remove('hidden');
    document.getElementById('miner-proc').classList.add('hidden');
    document.getElementById('btn-resgatar').classList.add('hidden');
    showNotify("BLOCK_MINED_+R$1500");
}

function startDDoS(target) {
    isAttacking = true;
    document.getElementById('ddos-list').classList.add('hidden');
    document.getElementById('ddos-proc').classList.remove('hidden');
    document.getElementById('target-name').innerText = "ALVO: " + target.toUpperCase();
    
    let time = 120; // 2 min
    const loop = setInterval(() => {
        time--;
        let perc = ((120 - time) / 120) * 100;
        document.getElementById('bar-ddos').style.width = perc + "%";
        document.getElementById('ddos-perc').innerText = Math.floor(perc) + "%";
        document.getElementById('ddos-time').innerText = `0${Math.floor(time/60)}:${(time%60).toString().padStart(2,'0')}`;

        if(time <= 0) {
            clearInterval(loop);
            totalSaldo += 900;
            updateWallet();
            showNotify(target.toUpperCase() + "_OFFLINE_+R$900");
            setTimeout(() => {
                isAttacking = false;
                document.getElementById('ddos-list').classList.remove('hidden');
                document.getElementById('ddos-proc').classList.add('hidden');
            }, 3000);
        }
    }, 1000);
}

function updateWallet() {
    document.getElementById('wallet-balance').innerText = `R$ ${totalSaldo.toLocaleString('pt-BR')},00`;
}

function showNotify(msg) {
    const n = document.getElementById('notification');
    n.innerText = ">> " + msg;
    n.classList.add('show');
    setTimeout(() => n.classList.remove('show'), 3000);
}
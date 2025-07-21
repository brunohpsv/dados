// Configuração do Firebase com suas credenciais
const firebaseConfig = {
    apiKey: "AIzaSyAfk7tS6Z39uYyHnbKlwY1O1zeOx74LlQg",
    projectId: "banco-de-dados-d253e",
    appId: "1:1005413315224:web:c87d1dd951785ed4f656ed"
};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Referência para a coleção no Firestore
const correlationsRef = db.collection('correlacoes'); // Substitua pelo nome da sua coleção

// Elemento onde a lista será renderizada
const listElement = document.getElementById('correlations-list');

// Função para renderizar os dados
function renderList(correlations) {
    if (correlations.length === 0) {
        listElement.innerHTML = '<p>Nenhuma correlação encontrada.</p>';
        return;
    }

    let html = '<ul>';
    correlations.forEach(doc => {
        const data = doc.data();
        html += `
            <li>
                <h3>${data.nome || 'Sem nome'}</h3>
                <p>${JSON.stringify(data)}</p>
                <small>ID: ${doc.id}</small>
            </li>
        `;
    });
    html += '</ul>';
    listElement.innerHTML = html;
}

// Ouvinte em tempo real para atualizações
correlationsRef.onSnapshot((snapshot) => {
    const correlations = [];
    snapshot.forEach(doc => {
        correlations.push(doc);
    });
    renderList(correlations);
}, (error) => {
    console.error("Erro ao buscar dados: ", error);
    listElement.innerHTML = '<p class="error">Erro ao carregar dados.</p>';
});

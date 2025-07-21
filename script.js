// Configuração do Firebase com suas credenciais
const firebaseConfig = {
    apiKey: "AIzaSyAfk7tS6Z39uYyHnbKlwY1O1zeOx74LlQg",
    projectId: "banco-de-dados-d253e",
    appId: "1:1005413315224:web:c87d1dd951785ed4f656ed"
};

// Inicializa o Firebase
try {
    firebase.initializeApp(firebaseConfig);
    console.log("Firebase inicializado com sucesso!");
} catch (error) {
    console.error("Erro ao inicializar Firebase:", error);
}

const db = firebase.firestore();

// Referência para a coleção de usuários
const usersRef = db.collection('usuarios'); // Agora usando 'usuarios'

// Elemento onde a lista será renderizada
const listElement = document.getElementById('correlations-list');

// Função para formatar os dados do usuário
function formatUserData(userData) {
    let formatted = '';
    for (const [key, value] of Object.entries(userData)) {
        formatted += `<p><strong>${key}:</strong> ${JSON.stringify(value)}</p>`;
    }
    return formatted;
}

// Função para renderizar os dados
function renderList(users) {
    if (users.length === 0) {
        listElement.innerHTML = `
            <div class="empty-message">
                <p>Nenhum usuário encontrado na coleção "usuarios".</p>
                <p>Verifique se:</p>
                <ul>
                    <li>A coleção "usuarios" existe no Firestore</li>
                    <li>Existem documentos na coleção</li>
                    <li>As regras de segurança permitem leitura</li>
                </ul>
            </div>
        `;
        return;
    }

    let html = '<div class="users-grid">';
    users.forEach(doc => {
        const userData = doc.data();
        html += `
            <div class="user-card">
                <h3>${userData.nome || 'Usuário sem nome'}</h3>
                <div class="user-details">
                    ${formatUserData(userData)}
                </div>
                <small>ID: ${doc.id}</small>
            </div>
        `;
    });
    html += '</div>';
    listElement.innerHTML = html;
}

// Ouvinte em tempo real para atualizações
usersRef.onSnapshot((snapshot) => {
    console.log("Recebida atualização do Firestore");
    const users = [];
    snapshot.forEach(doc => {
        console.log("Documento encontrado:", doc.id, doc.data());
        users.push(doc);
    });
    renderList(users);
}, (error) => {
    console.error("Erro ao buscar usuários:", error);
    listElement.innerHTML = `
        <div class="error-message">
            <p>Erro ao carregar usuários:</p>
            <p>${error.message}</p>
            <p>Verifique o console para mais detalhes.</p>
        </div>
    `;
});

// Função de teste adicional
async function testFirestoreConnection() {
    try {
        const snapshot = await db.collection('usuarios').get();
        console.log(`Teste de conexão: ${snapshot.size} documentos encontrados em 'usuarios'`);
    } catch (error) {
        console.error("Erro no teste de conexão:", error);
    }
}

// Executa o teste ao carregar
testFirestoreConnection();

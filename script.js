<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lista de Usuários - Firestore</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            background-color: #f0f2f5;
            color: #333;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            padding: 25px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        h1 {
            color: #2c3e50;
            text-align: center;
            margin-bottom: 30px;
        }
        
        #connection-status {
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .connected {
            background-color: #e8f5e9;
            border-left: 5px solid #4caf50;
        }
        
        .disconnected {
            background-color: #ffebee;
            border-left: 5px solid #f44336;
        }
        
        .users-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
        }
        
        .user-card {
            padding: 20px;
            background: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
            border-left: 4px solid #4285f4;
            transition: transform 0.2s;
        }
        
        .user-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        
        .user-card h3 {
            margin-top: 0;
            color: #4285f4;
            border-bottom: 1px solid #eee;
            padding-bottom: 10px;
        }
        
        .user-details {
            margin: 15px 0;
        }
        
        .user-details p {
            margin: 8px 0;
        }
        
        .empty-message, .error-message {
            padding: 20px;
            background: #fff8e1;
            border-left: 4px solid #ffc107;
            border-radius: 4px;
        }
        
        .error-message {
            background: #ffebee;
            border-left-color: #f44336;
        }
        
        small {
            display: block;
            color: #666;
            font-size: 0.8em;
            margin-top: 10px;
        }
        
        pre {
            white-space: pre-wrap;
            background: #f5f5f5;
            padding: 10px;
            border-radius: 4px;
            font-family: monospace;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1><i class="fas fa-users"></i> Lista de Usuários</h1>
        <div id="connection-status" class="disconnected">
            <i class="fas fa-spinner fa-spin"></i>
            <span>Conectando ao Firebase...</span>
        </div>
        <div id="correlations-list"></div>
    </div>

    <!-- Firebase SDK - IMPORTANTE: Use a versão mais recente -->
    <script src="https://www.gstatic.com/firebasejs/9.6.0/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore-compat.js"></script>
    
    <script>
        // Configuração do Firebase
        const firebaseConfig = {
            apiKey: "AIzaSyAfk7tS6Z39uYyHnbKlwY1O1zeOx74LlQg",
            projectId: "banco-de-dados-d253e",
            appId: "1:1005413315224:web:c87d1dd951785ed4f656ed"
        };

        // Elementos da UI
        const connectionStatus = document.getElementById('connection-status');
        const listElement = document.getElementById('correlations-list');
        
        // Status da conexão
        let firebaseInitialized = false;
        let db;
        let usersRef;

        // Função para atualizar o status da conexão
        function updateConnectionStatus(connected, message) {
            const icon = connectionStatus.querySelector('i');
            const text = connectionStatus.querySelector('span');
            
            if (connected) {
                connectionStatus.className = 'connected';
                icon.className = 'fas fa-check-circle';
                text.textContent = message || 'Conectado ao Firebase com sucesso!';
            } else {
                connectionStatus.className = 'disconnected';
                icon.className = 'fas fa-exclamation-circle';
                text.textContent = message || 'Erro na conexão com o Firebase';
            }
        }

        // Inicialização do Firebase
        function initializeFirebase() {
            try {
                const app = firebase.initializeApp(firebaseConfig);
                db = firebase.firestore();
                usersRef = db.collection('usuarios');
                
                firebaseInitialized = true;
                updateConnectionStatus(true, 'Conectado ao Firebase. Carregando dados...');
                
                console.log('Firebase inicializado com sucesso!');
                setupRealTimeListener();
                testFirestoreConnection();
                
            } catch (error) {
                console.error('Erro ao inicializar Firebase:', error);
                updateConnectionStatus(false, `Erro ao conectar: ${error.message}`);
                showError(`Falha na inicialização do Firebase: ${error.message}`);
            }
        }

        // Configura o listener em tempo real
        function setupRealTimeListener() {
            if (!firebaseInitialized) return;
            
            usersRef.onSnapshot(
                (snapshot) => {
                    console.log("Atualização recebida:", snapshot);
                    const users = [];
                    snapshot.forEach(doc => {
                        console.log("Documento:", doc.id, doc.data());
                        users.push(doc);
                    });
                    renderList(users);
                    updateConnectionStatus(true, `Conectado - ${users.length} usuários encontrados`);
                },
                (error) => {
                    console.error("Erro no listener:", error);
                    updateConnectionStatus(false, `Erro na conexão: ${error.message}`);
                    showError(`Erro ao carregar dados: ${error.message}`);
                }
            );
        }

        // Função para renderizar a lista
        function renderList(users) {
            if (!users || users.length === 0) {
                listElement.innerHTML = `
                    <div class="empty-message">
                        <p><i class="fas fa-info-circle"></i> Nenhum usuário encontrado na coleção "usuarios".</p>
                        <p>Isso pode ocorrer porque:</p>
                        <ul>
                            <li>A coleção está vazia</li>
                            <li>Você não tem permissão para visualizar</li>
                            <li>O nome da coleção está incorreto</li>
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
                        <h3><i class="fas fa-user"></i> ${userData.nome || 'Usuário sem nome'}</h3>
                        <div class="user-details">
                            ${formatUserData(userData)}
                        </div>
                        <small><i class="fas fa-id-card"></i> ID: ${doc.id}</small>
                    </div>
                `;
            });
            html += '</div>';
            listElement.innerHTML = html;
        }

        // Função para formatar dados do usuário
        function formatUserData(userData) {
            let formatted = '';
            for (const [key, value] of Object.entries(userData)) {
                formatted += `<p><strong>${key}:</strong> ${formatValue(value)}</p>`;
            }
            return formatted;
        }

        // Função para formatar valores
        function formatValue(value) {
            if (value === null) return 'null';
            if (typeof value === 'object') return JSON.stringify(value, null, 2);
            return value;
        }

        // Função para mostrar erros
        function showError(message) {
            listElement.innerHTML = `
                <div class="error-message">
                    <p><i class="fas fa-exclamation-triangle"></i> ${message}</p>
                    <p>Verifique o console para detalhes.</p>
                </div>
            `;
        }

        // Teste de conexão com Firestore
        async function testFirestoreConnection() {
            try {
                const snapshot = await usersRef.get();
                console.log(`Teste de conexão: ${snapshot.size} documentos encontrados`);
                
                if (snapshot.empty) {
                    console.warn('A coleção existe mas está vazia');
                }
            } catch (error) {
                console.error('Erro no teste de conexão:', error);
                if (error.code === 'permission-denied') {
                    showError('Permissão negada. Verifique as regras de segurança do Firestore.');
                } else {
                    showError(`Erro na conexão: ${error.message}`);
                }
            }
        }

        // Inicializa quando a página carrega
        document.addEventListener('DOMContentLoaded', () => {
            initializeFirebase();
        });
    </script>
</body>
</html>

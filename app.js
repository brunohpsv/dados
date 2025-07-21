// Inicializa o Firebase com a configuração do arquivo firebase-config.js
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Referência para sua coleção de dados (substitua 'dados' pelo nome da sua coleção)
const dataRef = database.ref('dados');

// Carrega os dados
dataRef.on('value', (snapshot) => {
    const data = snapshot.val();
    const dataList = document.getElementById('data-list');
    const loading = document.getElementById('loading');
    
    loading.style.display = 'none';
    dataList.innerHTML = '';
    
    if (data) {
        Object.keys(data).forEach(key => {
            const item = data[key];
            const li = document.createElement('li');
            li.className = 'list-group-item';
            
            // Adapte conforme a estrutura dos seus dados
            li.textContent = `ID: ${key} - Nome: ${item.nome || 'Sem nome'}`;
            
            dataList.appendChild(li);
        });
    } else {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.textContent = 'Nenhum dado encontrado.';
        dataList.appendChild(li);
    }
}, (error) => {
    console.error('Erro ao carregar dados:', error);
    document.getElementById('loading').style.display = 'none';
    document.getElementById('data-list').innerHTML = 
        '<li class="list-group-item text-danger">Erro ao carregar dados.</li>';
});

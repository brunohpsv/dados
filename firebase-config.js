// Este arquivo será ignorado no GitHub usando .gitignore
// Você deve criar um arquivo firebase-config.example.js com valores fictícios
// E instruir no README como configurar

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "SUA_API_KEY_AQUI",
    authDomain: "SEU_AUTH_DOMAIN_AQUI",
    databaseURL: "SUA_DATABASE_URL_AQUI",
    projectId: "SEU_PROJECT_ID_AQUI",
    storageBucket: "SEU_STORAGE_BUCKET_AQUI",
    messagingSenderId: "SEU_SENDER_ID_AQUI",
    appId: "SEU_APP_ID_AQUI"
};

// Verifica se a configuração está completa
const configIsValid = Object.values(firebaseConfig).every(value => value && !value.includes('AQUI'));

if (!configIsValid) {
    document.getElementById('config-alert').classList.remove('d-none');
    document.getElementById('loading').style.display = 'none';
    throw new Error('Configuração do Firebase incompleta');
}

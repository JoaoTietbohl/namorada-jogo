document.getElementById('loginForm').addEventListener('submit', function(event) {
    // Impede o envio padrão do formulário
    event.preventDefault(); 

    const usernameInput = document.getElementById('username').value;
    const passwordInput = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');

    // Credenciais Corretas
    const USER_CORRETO = "panelinha";
    const SENHA_CORRETA = "02112006";

    if (usernameInput === USER_CORRETO && passwordInput === SENHA_CORRETA) {
        // Credenciais corretas: Redireciona para a página principal
        window.location.href = "index2.html"; 
    } else {
        // Credenciais incorretas: Exibe mensagem de erro
        errorMessage.textContent = "Usuário ou senha incorretos! 😿";
        errorMessage.style.opacity = '1';

        // Opcional: Limpa os campos de input após o erro
        document.getElementById('password').value = '';
    }
});
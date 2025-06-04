document.addEventListener('DOMContentLoaded', function() {
    // Verificar se o usuário está logado
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (!usuarioLogado) {
        window.location.href = 'login.html';
        return;
    }

    // Preencher informações do usuário no sidebar
    document.getElementById('sidebar-username').textContent = `${usuarioLogado.nome} ${usuarioLogado.sobrenome || ''}`;
    document.getElementById('sidebar-email').textContent = usuarioLogado.email;

    // Navegação entre as seções do dashboard
    const navLinks = document.querySelectorAll('.dashboard-nav a[data-section]');
    const sections = document.querySelectorAll('.dashboard-section');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetSection = this.getAttribute('data-section');
            
            // Remover classe ativa de todos os links
            navLinks.forEach(item => {
                item.classList.remove('active');
                item.setAttribute('aria-selected', 'false');
            });
            
            // Adicionar classe ativa ao link clicado
            this.classList.add('active');
            this.setAttribute('aria-selected', 'true');
            
            // Ocultar todas as seções
            sections.forEach(section => section.classList.remove('active'));
            
            // Mostrar a seção correspondente
            document.getElementById(targetSection).classList.add('active');
            
            // Se for a seção de produtos, carregar os produtos do usuário
            if (targetSection === 'products') {
                carregarProdutosUsuario();
            }
            
            // Rolar para o topo da seção
            window.scrollTo({
                top: document.querySelector('.dashboard-header').offsetTop - 80,
                behavior: 'smooth'
            });
        });
    });

    // Botão de logout
    document.getElementById('logout-btn').addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('usuarioLogado');
        window.location.href = 'index.html';
    });

    // Preencher formulário de perfil com dados do usuário
    const profileNome = document.getElementById('profile-nome');
    const profileSobrenome = document.getElementById('profile-sobrenome');
    const profileEmail = document.getElementById('profile-email');
    const profileDiscord = document.getElementById('profile-discord');

    if (profileNome) profileNome.value = usuarioLogado.nome || '';
    if (profileSobrenome) profileSobrenome.value = usuarioLogado.sobrenome || '';
    if (profileEmail) profileEmail.value = usuarioLogado.email || '';
    if (profileDiscord) profileDiscord.value = usuarioLogado.discord || '';

    // Validação de senha em tempo real
    const novaSenhaInput = document.getElementById('profile-nova-senha');
    if (novaSenhaInput) {
        novaSenhaInput.addEventListener('input', validarSenha);
    }

    function validarSenha() {
        const senha = novaSenhaInput.value;
        
        // Verificar requisitos
        const temOitoCaracteres = senha.length >= 8;
        const temMaiuscula = /[A-Z]/.test(senha);
        const temNumero = /[0-9]/.test(senha);
        const temEspecial = /[!@#$%^&*(),.?":{}|<>]/.test(senha);
        
        // Atualizar estilos dos requisitos
        document.getElementById('req-length').style.color = temOitoCaracteres ? '#4CAF50' : '';
        document.getElementById('req-uppercase').style.color = temMaiuscula ? '#4CAF50' : '';
        document.getElementById('req-number').style.color = temNumero ? '#4CAF50' : '';
        document.getElementById('req-special').style.color = temEspecial ? '#4CAF50' : '';
    }

    // Salvar alterações de perfil
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validar senha atual
            const senhaAtual = document.getElementById('profile-senha-atual').value;
            if (senhaAtual && senhaAtual !== usuarioLogado.senha) {
                mostrarMensagemPerfil('Senha atual incorreta', 'error');
                return;
            }
            
            // Validar nova senha
            const novaSenha = document.getElementById('profile-nova-senha').value;
            const confirmarSenha = document.getElementById('profile-confirmar-senha').value;
            
            if (novaSenha || confirmarSenha) {
                if (novaSenha !== confirmarSenha) {
                    mostrarMensagemPerfil('As senhas não coincidem', 'error');
                    return;
                }
                
                // Verificar requisitos de senha
                if (novaSenha.length < 8 || !/[A-Z]/.test(novaSenha) || !/[0-9]/.test(novaSenha) || !/[!@#$%^&*(),.?":{}|<>]/.test(novaSenha)) {
                    mostrarMensagemPerfil('A senha não atende aos requisitos mínimos', 'error');
                    return;
                }
            }
            
            // Atualizar dados do usuário
            usuarioLogado.nome = profileNome.value;
            usuarioLogado.sobrenome = profileSobrenome.value;
            usuarioLogado.discord = profileDiscord.value;
            
            if (novaSenha) {
                usuarioLogado.senha = novaSenha;
            }
            
            // Salvar no localStorage
            localStorage.setItem('usuarioLogado', JSON.stringify(usuarioLogado));
            
            // Atualizar usuário na lista de usuários
            const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
            const index = usuarios.findIndex(u => u.email === usuarioLogado.email);
            if (index !== -1) {
                usuarios[index] = usuarioLogado;
                localStorage.setItem('usuarios', JSON.stringify(usuarios));
            }
            
            // Mostrar mensagem de sucesso
            mostrarMensagemPerfil('Perfil atualizado com sucesso', 'success');
            
            // Limpar campos de senha
            document.getElementById('profile-senha-atual').value = '';
            document.getElementById('profile-nova-senha').value = '';
            document.getElementById('profile-confirmar-senha').value = '';
            
            // Resetar estilos dos requisitos de senha
            document.getElementById('req-length').style.color = '';
            document.getElementById('req-uppercase').style.color = '';
            document.getElementById('req-number').style.color = '';
            document.getElementById('req-special').style.color = '';
        });
    }

    function mostrarMensagemPerfil(mensagem, tipo) {
        const messageElement = document.getElementById('profile-message');
        if (messageElement) {
            messageElement.textContent = mensagem;
            messageElement.className = 'form-message ' + tipo;
            
            // Esconder a mensagem após 5 segundos
            setTimeout(() => {
                messageElement.textContent = '';
                messageElement.className = 'form-message';
            }, 5000);
        }
    }

    // Inicializar a visão geral do dashboard
    inicializarVisaoGeral();
    
    // Carregar produtos do usuário se estiver na seção de produtos
    if (window.location.hash === '#products') {
        document.getElementById('tab-products').click();
    }

    // Salvar configurações
    const saveSettingsBtn = document.getElementById('save-settings');
    if (saveSettingsBtn) {
        saveSettingsBtn.addEventListener('click', function() {
            const emailUpdates = document.getElementById('email-updates').checked;
            const expiryAlerts = document.getElementById('expiry-alerts').checked;
            const promotions = document.getElementById('promotions').checked;
            const messageElement = document.getElementById('settings-message');
            
            // Buscar usuário no localStorage
            const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
            const usuarioIndex = usuarios.findIndex(u => u.email === usuarioLogado.email);
            
            if (usuarioIndex === -1) {
                showMessage(messageElement, 'Erro ao salvar configurações. Usuário não encontrado.', 'error');
                return;
            }
            
            // Atualizar configurações
            const usuarioAtualizado = {
                ...usuarios[usuarioIndex],
                configuracoes: {
                    emailUpdates,
                    expiryAlerts,
                    promotions
                }
            };
            
            // Atualizar usuário no localStorage
            usuarios[usuarioIndex] = usuarioAtualizado;
            localStorage.setItem('usuarios', JSON.stringify(usuarios));
            
            // Atualizar usuário logado
            const { senha: _, ...usuarioSemSenha } = usuarioAtualizado;
            localStorage.setItem('usuarioLogado', JSON.stringify(usuarioSemSenha));
            
            showMessage(messageElement, 'Configurações salvas com sucesso!', 'success');
        });
    }

    // Excluir conta
    const deleteAccountBtn = document.getElementById('delete-account');
    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener('click', function() {
            const confirmar = confirm('Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.');
            
            if (confirmar) {
                // Buscar usuário no localStorage
                const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
                const usuarioIndex = usuarios.findIndex(u => u.email === usuarioLogado.email);
                
                if (usuarioIndex === -1) {
                    alert('Erro ao excluir conta. Usuário não encontrado.');
                    return;
                }
                
                // Remover usuário
                usuarios.splice(usuarioIndex, 1);
                localStorage.setItem('usuarios', JSON.stringify(usuarios));
                
                // Remover usuário logado
                localStorage.removeItem('usuarioLogado');
                
                alert('Sua conta foi excluída com sucesso.');
                window.location.href = 'index.html';
            }
        });
    }

    // Filtrar produtos
    const productFilter = document.getElementById('product-filter');
    const productSearch = document.getElementById('product-search');
    const productCards = document.querySelectorAll('.product-card');
    
    if (productFilter && productSearch) {
        // Função para filtrar produtos
        function filterProducts() {
            const filterValue = productFilter.value;
            const searchValue = productSearch.value.toLowerCase();
            let hasVisibleProducts = false;
            
            productCards.forEach(card => {
                const productName = card.querySelector('h4').textContent.toLowerCase();
                const isActive = card.classList.contains('active');
                const isExpired = card.classList.contains('expired');
                
                // Filtrar por status (ativo/expirado)
                let showByFilter = 
                    filterValue === 'all' || 
                    (filterValue === 'active' && isActive) || 
                    (filterValue === 'expired' && isExpired);
                
                // Filtrar por busca
                let showBySearch = productName.includes(searchValue);
                
                // Mostrar ou ocultar o card
                if (showByFilter && showBySearch) {
                    card.style.display = 'block';
                    hasVisibleProducts = true;
                } else {
                    card.style.display = 'none';
                }
            });
            
            // Mostrar mensagem se não houver produtos
            const emptyState = document.querySelector('.products-list .empty-state');
            if (emptyState) {
                emptyState.style.display = hasVisibleProducts ? 'none' : 'block';
            }
        }
        
        productFilter.addEventListener('change', filterProducts);
        productSearch.addEventListener('input', filterProducts);
    }

    // Função auxiliar para mostrar mensagens
    function showMessage(element, message, type) {
        element.textContent = message;
        element.className = 'form-message';
        element.classList.add(type);
        
        // Ocultar a mensagem após 5 segundos
        setTimeout(() => {
            element.style.display = 'none';
        }, 5000);
    }
});

// Função para inicializar a visão geral do dashboard
function inicializarVisaoGeral() {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    
    // Carregar produtos do usuário
    const produtosUsuario = JSON.parse(localStorage.getItem('produtos_' + usuarioLogado.email)) || [];
    
    // Contar produtos ativos
    const produtosAtivos = produtosUsuario.filter(produto => {
        const dataExpiracao = new Date(produto.dataExpiracao);
        return dataExpiracao > new Date() && produto.status === 'ativo';
    }).length;
    
    // Calcular dias restantes (média dos produtos ativos)
    let diasRestantes = 0;
    if (produtosAtivos > 0) {
        const hoje = new Date();
        const diasPorProduto = produtosUsuario
            .filter(produto => {
                const dataExpiracao = new Date(produto.dataExpiracao);
                return dataExpiracao > hoje && produto.status === 'ativo';
            })
            .map(produto => {
                const dataExpiracao = new Date(produto.dataExpiracao);
                const diffTime = Math.abs(dataExpiracao - hoje);
                return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            });
        
        // Se for vitalício, mostrar "∞" em vez de um número
        if (diasPorProduto.includes(36500)) { // ~100 anos
            diasRestantes = "∞";
        } else {
            // Calcular média de dias restantes
            diasRestantes = Math.round(diasPorProduto.reduce((a, b) => a + b, 0) / diasPorProduto.length);
        }
    }
    
    // Contar downloads (simulado)
    const downloads = produtosUsuario.length;
    
    // Atualizar os cards da visão geral
    const cardsValores = document.querySelectorAll('.card-value');
    if (cardsValores.length >= 3) {
        cardsValores[0].textContent = produtosAtivos;
        cardsValores[1].textContent = diasRestantes;
        cardsValores[2].textContent = downloads;
    }
    
    // Adicionar atividades recentes (simulado)
    const atividadesList = document.querySelector('.activity-list');
    if (atividadesList) {
        if (produtosUsuario.length > 0) {
            atividadesList.innerHTML = '';
            
            // Mostrar as 5 atividades mais recentes (compras de produtos)
            const atividades = produtosUsuario
                .sort((a, b) => new Date(b.dataCompra) - new Date(a.dataCompra))
                .slice(0, 5);
            
            atividades.forEach(produto => {
                const dataCompra = new Date(produto.dataCompra);
                const dataFormatada = dataCompra.toLocaleDateString('pt-BR') + ' ' + 
                                     dataCompra.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                
                const atividadeHTML = `
                    <div class="activity-item">
                        <div class="activity-icon">
                            <i class="fas fa-shopping-cart"></i>
                        </div>
                        <div class="activity-details">
                            <div class="activity-title">Compra realizada: ${produto.nome}</div>
                            <div class="activity-time">${dataFormatada}</div>
                        </div>
                    </div>
                `;
                
                atividadesList.innerHTML += atividadeHTML;
            });
        }
    }
}

// Função para carregar os produtos do usuário
function carregarProdutosUsuario() {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    const produtosUsuario = JSON.parse(localStorage.getItem('produtos_' + usuarioLogado.email)) || [];
    const produtosList = document.querySelector('.products-list');
    const emptyState = produtosList.querySelector('.empty-state');
    
    // Se não houver produtos, mostrar mensagem vazia
    if (produtosUsuario.length === 0) {
        produtosList.innerHTML = '<p class="empty-state">Você não possui nenhum produto.</p>';
        return;
    }
    
    // Esconder mensagem vazia se existir
    if (emptyState) {
        emptyState.style.display = 'none';
    }
    
    // Limpar lista de produtos
    produtosList.innerHTML = '';
    
    // Filtrar produtos conforme seleção
    const filtroSelecionado = document.getElementById('product-filter').value;
    const termoBusca = document.getElementById('product-search').value.toLowerCase();
    
    let produtosFiltrados = produtosUsuario;
    
    // Aplicar filtro de status
    if (filtroSelecionado === 'active') {
        produtosFiltrados = produtosFiltrados.filter(produto => {
            const dataExpiracao = new Date(produto.dataExpiracao);
            return dataExpiracao > new Date() && produto.status === 'ativo';
        });
    } else if (filtroSelecionado === 'expired') {
        produtosFiltrados = produtosFiltrados.filter(produto => {
            const dataExpiracao = new Date(produto.dataExpiracao);
            return dataExpiracao <= new Date() || produto.status !== 'ativo';
        });
    }
    
    // Aplicar filtro de busca
    if (termoBusca) {
        produtosFiltrados = produtosFiltrados.filter(produto => 
            produto.nome.toLowerCase().includes(termoBusca)
        );
    }
    
    // Adicionar cada produto à lista
    produtosFiltrados.forEach(produto => {
        const dataExpiracao = new Date(produto.dataExpiracao);
        const hoje = new Date();
        const isActive = dataExpiracao > hoje && produto.status === 'ativo';
        
        // Calcular tempo restante ou expirado
        let tempoRestante;
        if (dataExpiracao.getFullYear() > hoje.getFullYear() + 50) {
            // Se a data de expiração for muito distante, considerar como vitalício
            tempoRestante = 'Vitalício';
        } else if (isActive) {
            const diffTime = Math.abs(dataExpiracao - hoje);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            tempoRestante = `Expira em: ${diffDays} dias`;
        } else {
            tempoRestante = `Expirou em: ${dataExpiracao.toLocaleDateString('pt-BR')}`;
        }
        
        const produtoHTML = `
            <div class="product-card ${isActive ? 'active' : 'expired'}">
                <div class="product-image">
                    <img src="${produto.imgSrc}" alt="${produto.nome}">
                    <span class="product-status">${isActive ? 'Ativo' : 'Expirado'}</span>
                </div>
                <div class="product-details">
                    <h4>${produto.nome}</h4>
                    <p class="product-type">${produto.periodo}</p>
                    <div class="product-expiry">
                        <i class="fas fa-clock"></i> ${tempoRestante}
                    </div>
                </div>
                <div class="product-actions">
                    ${isActive ? 
                        `<a href="#" class="btn-download" data-id="${produto.id}"><i class="fas fa-download"></i> Download</a>` : 
                        `<a href="#" class="btn-renew" data-id="${produto.id}"><i class="fas fa-sync"></i> Renovar</a>`
                    }
                    <a href="#" class="btn-details" data-id="${produto.id}">Detalhes</a>
                </div>
            </div>
        `;
        
        produtosList.innerHTML += produtoHTML;
    });
    
    // Se não houver produtos após a filtragem
    if (produtosFiltrados.length === 0) {
        produtosList.innerHTML = '<p class="empty-state">Nenhum produto encontrado com os filtros selecionados.</p>';
    }
    
    // Adicionar eventos aos botões
    adicionarEventosBotoes();
}

// Função para adicionar eventos aos botões dos produtos
function adicionarEventosBotoes() {
    // Botões de download
    document.querySelectorAll('.btn-download').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const produtoId = this.getAttribute('data-id');
            alert(`O download do produto ${produtoId} será iniciado em breve.`);
        });
    });
    
    // Botões de renovação
    document.querySelectorAll('.btn-renew').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const produtoId = this.getAttribute('data-id');
            alert(`Redirecionando para a página de renovação do produto ${produtoId}.`);
        });
    });
    
    // Botões de detalhes
    document.querySelectorAll('.btn-details').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const produtoId = this.getAttribute('data-id');
            alert(`Detalhes do produto ${produtoId}.`);
        });
    });
}

// Adicionar eventos aos filtros de produtos
document.addEventListener('DOMContentLoaded', function() {
    const filtroSelect = document.getElementById('product-filter');
    const buscaInput = document.getElementById('product-search');
    
    if (filtroSelect) {
        filtroSelect.addEventListener('change', carregarProdutosUsuario);
    }
    
    if (buscaInput) {
        buscaInput.addEventListener('input', carregarProdutosUsuario);
    }
}); 
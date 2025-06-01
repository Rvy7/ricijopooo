// Definir função carregarItensCheckout globalmente para evitar erros em páginas que não têm o checkout.js
if (typeof carregarItensCheckout !== 'function') {
    window.carregarItensCheckout = function() {
        // Esta é uma implementação vazia que evita erros quando a função é chamada em páginas que não são de checkout
        console.log('Função carregarItensCheckout chamada em uma página que não é de checkout');
        return;
    };
}

document.addEventListener('DOMContentLoaded', function() {
    // Animação de rolagem suave para links de âncora
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Efeito de destaque nos botões
    const botoes = document.querySelectorAll('.btn-primary, .btn-login, .btn-discord, .btn-ver-mais, .btn-ver-todos');
    botoes.forEach(botao => {
        botao.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
            if (this.classList.contains('btn-primary') || this.classList.contains('btn-discord')) {
                this.style.boxShadow = '0 8px 24px rgba(230, 57, 70, 0.4)';
            }
        });
        
        botao.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });

    // Inicializar o contador do carrinho
    atualizarContadorCarrinho();

    // Adicionar efeito de brilho nos cards de produtos ao passar o mouse
    const produtos = document.querySelectorAll('.produto');
    produtos.forEach(produto => {
        produto.addEventListener('mouseenter', function() {
            // Adicionar efeito de brilho
            if (!this.querySelector('.produto-brilho')) {
                const brilho = document.createElement('div');
                brilho.classList.add('produto-brilho');
                brilho.style.position = 'absolute';
                brilho.style.top = '0';
                brilho.style.left = '0';
                brilho.style.width = '100%';
                brilho.style.height = '100%';
                brilho.style.background = 'radial-gradient(circle at 50% 50%, rgba(230, 57, 70, 0.15), transparent 70%)';
                brilho.style.pointerEvents = 'none';
                brilho.style.zIndex = '1';
                brilho.style.opacity = '0';
                brilho.style.transition = 'opacity 0.3s ease';
                this.appendChild(brilho);
                
                // Permitir que a transição ocorra
                setTimeout(() => {
                    brilho.style.opacity = '1';
                }, 10);
            }
        });
        
        produto.addEventListener('mouseleave', function() {
            // Remover efeito de brilho com fade out
            const brilho = this.querySelector('.produto-brilho');
            if (brilho) {
                brilho.style.opacity = '0';
                setTimeout(() => {
                    brilho.remove();
                }, 300);
            }
        });
    });

    // Animação para perguntas frequentes
    const perguntas = document.querySelectorAll('.pergunta');
    perguntas.forEach(pergunta => {
        pergunta.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.3)';
            this.style.borderColor = 'rgba(230, 57, 70, 0.3)';
        });
        
        pergunta.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
            this.style.borderColor = '';
        });
    });

    // Animação para os passos do "Como Funciona"
    const steps = document.querySelectorAll('.step');
    steps.forEach(step => {
        step.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.25)';
            this.style.borderColor = 'rgba(230, 57, 70, 0.3)';
            
            const stepNumber = this.querySelector('.step-number');
            if (stepNumber) {
                stepNumber.style.transform = 'scale(1.1)';
                stepNumber.style.boxShadow = '0 0 15px rgba(230, 57, 70, 0.5)';
            }
        });
        
        step.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
            this.style.borderColor = '';
            
            const stepNumber = this.querySelector('.step-number');
            if (stepNumber) {
                stepNumber.style.transform = '';
                stepNumber.style.boxShadow = '';
            }
        });
    });

    // Animação para os benefícios
    const beneficios = document.querySelectorAll('.beneficio');
    beneficios.forEach(beneficio => {
        beneficio.addEventListener('mouseenter', function() {
            const icone = this.querySelector('.icone i');
            if (icone) {
                icone.style.transform = 'scale(1.2)';
                icone.style.color = '#f25c69';
            }
        });
        
        beneficio.addEventListener('mouseleave', function() {
            const icone = this.querySelector('.icone i');
            if (icone) {
                icone.style.transform = '';
                icone.style.color = '';
            }
        });
    });

    // Simulação de contador para estatísticas
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        function updateCounter() {
            start += increment;
            if (start < target) {
                element.textContent = '+' + Math.floor(start);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = '+' + target;
                
                // Adicionar efeito de pulsação ao finalizar
                element.style.animation = 'pulse 1s ease';
                
                // Criar e adicionar a animação de pulsação se não existir
                if (!document.querySelector('#pulseAnimation')) {
                    const style = document.createElement('style');
                    style.id = 'pulseAnimation';
                    style.textContent = `
                        @keyframes pulse {
                            0% { transform: scale(1); }
                            50% { transform: scale(1.1); color: #f25c69; }
                            100% { transform: scale(1); }
                        }
                    `;
                    document.head.appendChild(style);
                }
            }
        }
        
        updateCounter();
    }

    // Iniciar animação de contadores quando o elemento estiver visível
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const estatisticas = entry.target.querySelectorAll('.stat-number');
                estatisticas.forEach(stat => {
                    const valor = parseInt(stat.textContent.replace('+', ''));
                    animateCounter(stat, valor);
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const estatisticasSection = document.querySelector('.hero-stats');
    if (estatisticasSection) {
        observer.observe(estatisticasSection);
    }

    // Efeito de parallax sutil para o fundo
    window.addEventListener('scroll', function() {
        const scrollPosition = window.pageYOffset;
        
        // Parallax para o hero
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.backgroundPositionY = scrollPosition * 0.05 + 'px';
        }
    });

    // Adicionar classe ativa ao link do menu com base na seção visível
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a');
    
    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPosition = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            } else if (current === '' && link.getAttribute('href') === '#') {
                link.classList.add('active');
            }
        });
    });

    // Menu mobile (para responsividade)
    const criarMenuMobile = () => {
        const header = document.querySelector('header');
        const nav = document.querySelector('nav');
        
        if (!header || !nav) return;
        
        // Criar botão de menu mobile
        const menuButton = document.createElement('button');
        menuButton.classList.add('menu-mobile');
        menuButton.innerHTML = '<i class="fas fa-bars"></i>';
        
        // Inserir botão no header
        header.querySelector('.container').insertBefore(menuButton, nav);
        
        // Adicionar classe para estilização no mobile
        nav.classList.add('nav-mobile');
        
        // Adicionar evento de clique
        menuButton.addEventListener('click', () => {
            nav.classList.toggle('active');
            menuButton.classList.toggle('active');
            
            if (menuButton.classList.contains('active')) {
                menuButton.innerHTML = '<i class="fas fa-times"></i>';
            } else {
                menuButton.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
        
        // Fechar menu ao clicar em um link
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                menuButton.classList.remove('active');
                menuButton.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
    };
    
    // Verificar se a tela é mobile
    if (window.innerWidth <= 768) {
        criarMenuMobile();
    }
    
    // Recriar menu mobile ao redimensionar a janela
    window.addEventListener('resize', () => {
        const existeMenuMobile = document.querySelector('.menu-mobile');
        
        if (window.innerWidth <= 768 && !existeMenuMobile) {
            criarMenuMobile();
        } else if (window.innerWidth > 768 && existeMenuMobile) {
            existeMenuMobile.remove();
            document.querySelector('nav').classList.remove('nav-mobile', 'active');
        }
    });

    // Adicionar efeito de revelação para elementos ao rolar a página
    const revealElements = document.querySelectorAll('.section-header, .produtos-grid, .steps, .beneficios, .perguntas');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    revealElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        revealObserver.observe(element);
    });
    
    // Adicionar estilo para elementos revelados
    const style = document.createElement('style');
    style.textContent = `
        .revealed {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // Verifica se o usuário está logado
    verificarLogin();

    // Função para inicializar o modal de produtos
    initProdutoModal();
});

// Sistema de autenticação com LocalStorage
function verificarLogin() {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    
    if (usuarioLogado) {
        // Atualiza o botão de login para mostrar o nome do usuário
        const btnLogin = document.querySelector('.btn-login');
        
        if (btnLogin) {
            btnLogin.innerHTML = `<i class="fas fa-user"></i> ${usuarioLogado.nome}`;
            btnLogin.href = "#";
            btnLogin.classList.add('logado');
            
            // Cria o container para o dropdown
            let dropdownContainer = document.querySelector('.dropdown-container');
            if (!dropdownContainer) {
                dropdownContainer = document.createElement('div');
                dropdownContainer.className = 'dropdown-container';
                dropdownContainer.style.position = 'relative';
                
                // Substitui o botão original pelo container
                btnLogin.parentNode.insertBefore(dropdownContainer, btnLogin);
                dropdownContainer.appendChild(btnLogin);
            }
            
            // Adiciona menu dropdown para o usuário logado
            btnLogin.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Verifica se o dropdown já existe
                let dropdown = document.querySelector('.user-dropdown');
                
                if (dropdown) {
                    dropdown.classList.toggle('active');
                    btnLogin.classList.toggle('active');
                } else {
                    // Cria o dropdown
                    dropdown = document.createElement('div');
                    dropdown.className = 'user-dropdown';
                    
                    // Adiciona os itens do dropdown
                    dropdown.innerHTML = `
                        <div class="user-info">
                            <span class="user-name">${usuarioLogado.nome} ${usuarioLogado.sobrenome || ''}</span>
                            <span class="user-email">${usuarioLogado.email}</span>
                        </div>
                        <a href="dashboard.html"><i class="fas fa-tachometer-alt"></i> Dashboard</a>
                        <a href="dashboard.html#profile"><i class="fas fa-user-circle"></i> Meu Perfil</a>
                        <a href="dashboard.html#products"><i class="fas fa-shopping-cart"></i> Meus Produtos</a>
                        <a href="#" id="btn-logout"><i class="fas fa-sign-out-alt"></i> Sair</a>
                    `;
                    
                    // Adiciona o dropdown ao container
                    dropdownContainer.appendChild(dropdown);
                    
                    // Adiciona evento para o botão de logout
                    document.getElementById('btn-logout').addEventListener('click', function(e) {
                        e.preventDefault();
                        logout();
                    });
                    
                    // Mostra o dropdown após adicioná-lo
                    setTimeout(() => {
                        dropdown.classList.add('active');
                        btnLogin.classList.add('active');
                    }, 10);
                }
            });
            
            // Fecha o dropdown ao clicar fora
            document.addEventListener('click', function(e) {
                if (!e.target.closest('.btn-login') && !e.target.closest('.user-dropdown')) {
                    const dropdown = document.querySelector('.user-dropdown');
                    const btnLoginActive = document.querySelector('.btn-login.active');
                    if (dropdown) {
                        dropdown.classList.remove('active');
                    }
                    if (btnLoginActive) {
                        btnLoginActive.classList.remove('active');
                    }
                }
            });
        }
    }
}

function logout() {
    localStorage.removeItem('usuarioLogado');
    window.location.href = 'index.html';
}

// Variável para armazenar os event listeners e evitar duplicação
let modalInitialized = false;

// Função para inicializar o modal de produtos
function initProdutoModal() {
    console.log('Inicializando modal de produtos...');
    
    // Se já foi inicializado, não faz nada
    if (modalInitialized) {
        console.log('Modal já foi inicializado anteriormente');
        return;
    }
    
    // Selecionar elementos do modal
    const modal = document.getElementById('produto-modal');
    if (!modal) {
        console.error('Modal não encontrado no DOM');
        return; // Se o modal não existir, não continua
    }
    
    const modalNome = document.getElementById('modal-produto-nome');
    const modalImg = document.getElementById('modal-produto-img');
    const modalDescricao = document.getElementById('modal-produto-descricao');
    const precoSemanal = document.getElementById('preco-semanal');
    const precoMensal = document.getElementById('preco-mensal');
    const precoVitalicio = document.getElementById('preco-vitalicio');
    const btnFechar = document.querySelector('.close-modal');
    
    console.log('Elementos do modal selecionados:', {
        modal: !!modal,
        modalNome: !!modalNome,
        modalImg: !!modalImg,
        modalDescricao: !!modalDescricao,
        precoSemanal: !!precoSemanal,
        precoMensal: !!precoMensal,
        precoVitalicio: !!precoVitalicio,
        btnFechar: !!btnFechar
    });
    
    // Função para abrir o modal
    function abrirModal(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Obter o elemento pai (div.produto)
        const produto = this.closest('.produto');
        
        // Obter dados do produto
        const id = produto.getAttribute('data-id');
        const nome = produto.getAttribute('data-nome');
        const descricao = produto.getAttribute('data-descricao');
        const precoSem = parseFloat(produto.getAttribute('data-preco-semanal') || '0').toFixed(2);
        const precoMes = parseFloat(produto.getAttribute('data-preco-mensal') || '0').toFixed(2);
        const precoVit = parseFloat(produto.getAttribute('data-preco-vitalicio') || '0').toFixed(2);
        
        // Obter a URL da imagem
        const imgElement = produto.querySelector('img');
        const imgSrc = imgElement ? imgElement.getAttribute('src') : '';
        
        // Preencher o modal com os dados do produto
        modalNome.textContent = nome;
        modalImg.setAttribute('src', imgSrc);
        modalImg.setAttribute('alt', nome);
        modalDescricao.textContent = descricao;
        precoSemanal.textContent = precoSem.replace('.', ',');
        precoMensal.textContent = precoMes.replace('.', ',');
        precoVitalicio.textContent = precoVit.replace('.', ',');
        
        // Armazenar dados do produto atual no modal para uso posterior
        modal.setAttribute('data-produto-id', id);
        modal.setAttribute('data-produto-nome', nome);
        modal.setAttribute('data-produto-img', imgSrc);
        modal.setAttribute('data-preco-semanal', precoSem);
        modal.setAttribute('data-preco-mensal', precoMes);
        modal.setAttribute('data-preco-vitalicio', precoVit);
        
        // Exibir o modal
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Impedir rolagem do body
    }
    
    // Adicionar evento de clique aos botões "Ver detalhes"
    const botoesDetalhes = document.querySelectorAll('.btn-ver-mais');
    botoesDetalhes.forEach(botao => {
        // Remover event listeners existentes para evitar duplicação
        botao.removeEventListener('click', abrirModal);
        // Adicionar novo event listener
        botao.addEventListener('click', abrirModal);
    });
    
    // Função para fechar o modal
    function fecharModalHandler() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    // Fechar o modal ao clicar no X
    btnFechar.removeEventListener('click', fecharModalHandler);
    btnFechar.addEventListener('click', fecharModalHandler);
    
    // Fechar o modal ao clicar fora dele
    function clickForaModal(e) {
        if (e.target === modal) {
            fecharModalHandler();
        }
    }
    window.removeEventListener('click', clickForaModal);
    window.addEventListener('click', clickForaModal);
    
    // Fechar o modal com a tecla ESC
    function keydownHandler(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            fecharModalHandler();
        }
    }
    document.removeEventListener('keydown', keydownHandler);
    document.addEventListener('keydown', keydownHandler);
    
    // Função para lidar com o clique no botão de compra
    function comprarHandler() {
        const plano = this.closest('.plano').getAttribute('data-plano');
        const produto = modalNome.textContent;
        
        // Obter dados do produto do modal
        const id = modal.getAttribute('data-produto-id');
        const nome = modal.getAttribute('data-produto-nome');
        const imgSrc = modal.getAttribute('data-produto-img');
        
        // Obter o preço com base no plano selecionado
        let preco;
        let periodo;
        
        switch(plano) {
            case 'semanal':
                preco = modal.getAttribute('data-preco-semanal');
                periodo = '1 dia';
                break;
            case 'mensal':
                preco = modal.getAttribute('data-preco-mensal');
                periodo = '1 semana';
                break;
            case 'vitalicio':
                preco = modal.getAttribute('data-preco-vitalicio');
                periodo = '1 mês';
                break;
            default:
                preco = modal.getAttribute('data-preco-semanal');
                periodo = '1 dia';
        }
        
        // Adicionar ao carrinho
        adicionarAoCarrinho(id, nome, imgSrc, preco, periodo, plano);
        
        // Fechar o modal
        fecharModalHandler();
        
        // Mostrar mensagem de sucesso
        alert(`Produto "${nome}" adicionado ao carrinho na versão "${periodo}".`);
    }
    
    // Adicionar evento aos botões de compra
    const botoesComprar = document.querySelectorAll('.btn-comprar');
    botoesComprar.forEach(botao => {
        // Remover event listeners existentes para evitar duplicação
        botao.removeEventListener('click', comprarHandler);
        // Adicionar novo event listener
        botao.addEventListener('click', comprarHandler);
    });
    
    // Marcar como inicializado
    modalInitialized = true;
}

// Função para adicionar produto ao carrinho
function adicionarAoCarrinho(id, nome, imgSrc, preco, periodo, plano) {
    console.log('Adicionando ao carrinho:', { id, nome, preco, periodo, plano });
    
    // Obter carrinho atual do localStorage ou criar um novo
    let carrinho = [];
    try {
        const carrinhoSalvo = localStorage.getItem('carrinho');
        carrinho = carrinhoSalvo ? JSON.parse(carrinhoSalvo) : [];
        console.log('Carrinho atual:', carrinho);
    } catch (error) {
        console.error('Erro ao recuperar carrinho do localStorage:', error);
        carrinho = [];
    }
    
    // Verificar se o produto já está no carrinho com o mesmo plano
    const produtoExistente = carrinho.findIndex(item => 
        item.id === id && item.plano === plano
    );
    
    if (produtoExistente !== -1) {
        // Se o produto já existe, incrementa a quantidade
        carrinho[produtoExistente].quantidade += 1;
        console.log('Produto existente, quantidade incrementada:', carrinho[produtoExistente]);
    } else {
        // Adicionar novo item ao carrinho
        const novoItem = {
            id,
            nome,
            imgSrc,
            preco,
            periodo,
            plano,
            quantidade: 1
        };
        carrinho.push(novoItem);
        console.log('Novo item adicionado ao carrinho:', novoItem);
    }
    
    try {
        // Salvar carrinho atualizado no localStorage
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        console.log('Carrinho salvo no localStorage com sucesso');
    } catch (error) {
        console.error('Erro ao salvar carrinho no localStorage:', error);
    }
    
    // Atualizar contador do carrinho
    atualizarContadorCarrinho();
    
    // Retornar true para indicar sucesso
    return true;
}

// Função para atualizar o contador do carrinho
function atualizarContadorCarrinho() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const contador = document.querySelector('.carrinho-contador');
    
    if (contador) {
        // Calcular o número total de itens no carrinho
        const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);
        contador.textContent = totalItens;
        
        // Destacar o contador se houver itens no carrinho
        if (totalItens > 0) {
            contador.style.transform = 'scale(1.2)';
            setTimeout(() => {
                contador.style.transform = 'scale(1)';
            }, 300);
        }
    }
}

function finalizarCompra() {
  const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

  if (carrinho.length === 0) {
    alert('Seu carrinho está vazio!');
    return;
  }
  if (!usuarioLogado) {
    alert('Você precisa estar logado para finalizar a compra.');
    window.location.href = 'login.html?redirect=carrinho';
    return;
  }

  // Gerar uma referência externa única para este pedido
  const externalReference = `RICIJO-${Date.now()}`;
  
  // Salvar informações do pedido no localStorage para referência futura
  const pedidoPendente = {
    id: externalReference,
    data: new Date().toISOString(),
    usuario: usuarioLogado.email,
    total: carrinho.reduce((total, item) => total + (item.preco * item.quantidade), 0),
    carrinho: carrinho
  };
  localStorage.setItem('pedido_pendente', JSON.stringify(pedidoPendente));

  // Montar payload dos itens
  const items = carrinho.map(item => ({
    title: item.nome + " - " + item.periodo,
    quantity: item.quantidade,
    currency_id: 'BRL',
    unit_price: parseFloat(item.preco)
  }));

  // Info básica do comprador (opcional)
  const payer = {
    name: usuarioLogado.nome,
    email: usuarioLogado.email
  };

  // Obter a URL base atual
  const baseUrl = window.location.origin;
  const apiUrl = `${baseUrl}/api/create_stripe_checkout`;
  
  console.log('Enviando requisição para:', apiUrl);
  
  // Chama backend Express do Stripe
  fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      items, 
      payer, 
      external_reference: externalReference 
    })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    if (data.init_point) {
      console.log('Redirecionando para o Stripe:', data);
      window.location.href = data.init_point; // Redireciona para o Stripe
    } else {
      alert('Erro ao iniciar pagamento. Tente novamente.');
    }
  })
  .catch((error) => {
    console.error('Erro de comunicação com servidor:', error);
    alert(`Erro de comunicação com servidor: ${error.message}. Tente novamente mais tarde.`);
  });
}

// Função para fechar o modal
function fecharModal() {
    const modal = document.getElementById('produto-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = ''; // Restaurar rolagem do body
    }
} 
// Função para inicializar os filtros
function initFiltros() {
    console.log('Inicializando filtros...');
    
    // Elementos do DOM para filtros
    const filtroCategoriaSelect = document.getElementById('filtro-categoria');
    const filtroPrecoSelect = document.getElementById('filtro-preco');
    const buscaInput = document.getElementById('busca');
    const btnBuscar = document.getElementById('btn-buscar');
    const todosProdutos = document.querySelectorAll('.produto');
    
    // Função para filtrar produtos
    function filtrarProdutos() {
        const categoriaFiltro = filtroCategoriaSelect ? filtroCategoriaSelect.value : 'todos';
        const precoFiltro = filtroPrecoSelect ? filtroPrecoSelect.value : 'todos';
        const termoBusca = buscaInput ? buscaInput.value.toLowerCase().trim() : '';
        
        todosProdutos.forEach(produto => {
            // Filtro por categoria
            const categoriaProduto = produto.dataset.categoria || '';
            const passaCategoria = categoriaFiltro === 'todos' || categoriaProduto === categoriaFiltro;
            
            // Filtro por preço
            const precoSemanal = parseFloat(produto.dataset.precoSemanal || 0);
            let passaPreco = true;
            
            switch (precoFiltro) {
                case 'gratuito':
                    passaPreco = precoSemanal === 0;
                    break;
                case 'ate-50':
                    passaPreco = precoSemanal > 0 && precoSemanal <= 50;
                    break;
                case '50-100':
                    passaPreco = precoSemanal > 50 && precoSemanal <= 100;
                    break;
                case '100-mais':
                    passaPreco = precoSemanal > 100;
                    break;
                default:
                    passaPreco = true;
            }
            
            // Filtro por termo de busca
            const nomeProduto = (produto.dataset.nome || '').toLowerCase();
            const descricaoProduto = (produto.dataset.descricao || '').toLowerCase();
            const passaBusca = termoBusca === '' || 
                               nomeProduto.includes(termoBusca) || 
                               descricaoProduto.includes(termoBusca);
            
            // Aplicar visibilidade
            if (passaCategoria && passaPreco && passaBusca) {
                produto.style.display = 'flex';
            } else {
                produto.style.display = 'none';
            }
        });
        
        // Verificar categorias vazias
        const categoriaHeaders = document.querySelectorAll('.categoria-header');
        categoriaHeaders.forEach(header => {
            const produtosGrid = header.nextElementSibling;
            if (!produtosGrid) return;
            
            // Verificar se há produtos visíveis nesta categoria
            const produtosVisiveis = Array.from(produtosGrid.querySelectorAll('.produto'))
                                        .some(p => p.style.display !== 'none');
            
            // Esconder categoria se não houver produtos visíveis
            if (!produtosVisiveis) {
                header.style.display = 'none';
                produtosGrid.style.display = 'none';
            } else {
                header.style.display = 'flex';
                produtosGrid.style.display = 'grid';
            }
        });
    }
    
    // Inicializar filtros se os elementos existirem
    if (filtroCategoriaSelect && filtroPrecoSelect && btnBuscar) {
        // Event Listeners para filtros
        filtroCategoriaSelect.addEventListener('change', filtrarProdutos);
        filtroPrecoSelect.addEventListener('change', filtrarProdutos);
        btnBuscar.addEventListener('click', filtrarProdutos);
        
        // Filtrar também ao pressionar Enter no campo de busca
        if (buscaInput) {
            buscaInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    filtrarProdutos();
                }
            });
        }
    }
    
    // Aplicar filtros iniciais
    if (filtroCategoriaSelect || filtroPrecoSelect || (buscaInput && buscaInput.value)) {
        filtrarProdutos();
    }
    
    console.log('Filtros inicializados com sucesso');
}

// Aguardar o carregamento completo da página e do script.js
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM completamente carregado');
    
    // Verificar se o script.js já foi carregado
    function checkScriptLoaded() {
        if (typeof initProdutoModal === 'function' && typeof adicionarAoCarrinho === 'function') {
            console.log('Script.js carregado, inicializando modal...');
            initProdutoModal();
            initFiltros();
            console.log('Modal e filtros inicializados com sucesso');
            return true;
        }
        return false;
    }
    
    // Tentar inicializar imediatamente
    if (!checkScriptLoaded()) {
        // Se não estiver pronto, tentar novamente após um curto atraso
        const maxTentativas = 5;
        let tentativas = 0;
        
        const interval = setInterval(function() {
            tentativas++;
            console.log(`Tentativa ${tentativas} de inicialização...`);
            
            if (checkScriptLoaded() || tentativas >= maxTentativas) {
                clearInterval(interval);
                if (tentativas >= maxTentativas) {
                    console.error('Não foi possível carregar as funções necessárias do script.js');
                }
            }
        }, 300);
    }
    
    // Elementos do DOM para filtros
    const filtroCategoriaSelect = document.getElementById('filtro-categoria');
    const filtroPrecoSelect = document.getElementById('filtro-preco');
    const buscaInput = document.getElementById('busca');
    const btnBuscar = document.getElementById('btn-buscar');
    const todosProdutos = document.querySelectorAll('.produto');
    
    // Função para filtrar produtos
    function filtrarProdutos() {
        const categoriaFiltro = filtroCategoriaSelect ? filtroCategoriaSelect.value : 'todos';
        const precoFiltro = filtroPrecoSelect ? filtroPrecoSelect.value : 'todos';
        const termoBusca = buscaInput ? buscaInput.value.toLowerCase().trim() : '';
        
        todosProdutos.forEach(produto => {
            // Filtro por categoria
            const categoriaProduto = produto.dataset.categoria || '';
            const passaCategoria = categoriaFiltro === 'todos' || categoriaProduto === categoriaFiltro;
            
            // Filtro por preço
            const precoSemanal = parseFloat(produto.dataset.precoSemanal || 0);
            let passaPreco = true;
            
            switch (precoFiltro) {
                case 'gratuito':
                    passaPreco = precoSemanal === 0;
                    break;
                case 'ate-50':
                    passaPreco = precoSemanal > 0 && precoSemanal <= 50;
                    break;
                case '50-100':
                    passaPreco = precoSemanal > 50 && precoSemanal <= 100;
                    break;
                case '100-mais':
                    passaPreco = precoSemanal > 100;
                    break;
                default:
                    passaPreco = true;
            }
            
            // Filtro por termo de busca
            const nomeProduto = (produto.dataset.nome || '').toLowerCase();
            const descricaoProduto = (produto.dataset.descricao || '').toLowerCase();
            const passaBusca = termoBusca === '' || 
                               nomeProduto.includes(termoBusca) || 
                               descricaoProduto.includes(termoBusca);
            
            // Aplicar visibilidade
            if (passaCategoria && passaPreco && passaBusca) {
                produto.style.display = 'flex';
            } else {
                produto.style.display = 'none';
            }
        });
        
        // Verificar categorias vazias
        const categoriaHeaders = document.querySelectorAll('.categoria-header');
        categoriaHeaders.forEach(header => {
            const produtosGrid = header.nextElementSibling;
            if (!produtosGrid) return;
            
            // Verificar se há produtos visíveis nesta categoria
            const produtosVisiveis = Array.from(produtosGrid.querySelectorAll('.produto'))
                                        .some(p => p.style.display !== 'none');
            
            // Esconder categoria se não houver produtos visíveis
            if (!produtosVisiveis) {
                header.style.display = 'none';
                produtosGrid.style.display = 'none';
            } else {
                header.style.display = 'flex';
                produtosGrid.style.display = 'grid';
            }
        });
    }
    
    // Inicializar filtros se os elementos existirem
    if (filtroCategoriaSelect && filtroPrecoSelect && btnBuscar) {
        // Event Listeners para filtros
        filtroCategoriaSelect.addEventListener('change', filtrarProdutos);
        filtroPrecoSelect.addEventListener('change', filtrarProdutos);
        btnBuscar.addEventListener('click', filtrarProdutos);
        
        // Filtrar também ao pressionar Enter no campo de busca
        if (buscaInput) {
            buscaInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    filtrarProdutos();
                }
            });
        }
    }
    
    // Aplicar filtros iniciais
    if (filtroCategoriaSelect || filtroPrecoSelect || (buscaInput && buscaInput.value)) {
        filtrarProdutos();
    }
});
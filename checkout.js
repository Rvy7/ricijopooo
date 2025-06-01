document.addEventListener('DOMContentLoaded', function() {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (!usuarioLogado) {
        alert('Você precisa estar logado para finalizar a compra.');
        window.location.href = 'login.html?redirect=checkout';
        return;
    }

    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    if (carrinho.length === 0) {
        alert('Seu carrinho está vazio. Adicione produtos antes de finalizar a compra.');
        window.location.href = 'carrinho.html';
        return;
    }

    carregarItensCheckout();

    const botaoPagar = document.getElementById('btn-pagar');
    if (botaoPagar) {
        botaoPagar.addEventListener('click', iniciarPagamento);
    }
});

function carregarItensCheckout() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const cupomAplicado = JSON.parse(localStorage.getItem('cupomAplicado'));
    const checkoutItems = document.getElementById('checkout-items');
    const checkoutTotal = document.getElementById('checkout-total');
    
    // Verificar se os elementos necessários existem
    if (!checkoutItems || !checkoutTotal) {
        console.log('Elementos de checkout não encontrados na página');
        return;
    }
    
    checkoutItems.innerHTML = '';
    let subtotal = 0;
    
    // Calcular subtotal
    carrinho.forEach(item => {
        const itemSubtotal = parseFloat(item.preco) * item.quantidade;
        subtotal += itemSubtotal;
        checkoutItems.innerHTML += `
            <div class="resumo-item">
                <span>${item.nome} (${item.periodo}) x${item.quantidade}</span>
                <span>R$ ${itemSubtotal.toFixed(2).replace('.', ',')}</span>
            </div>
        `;
    });
    
    // Aplicar desconto se houver cupom
    let valorDesconto = 0;
    let total = subtotal;
    
    if (cupomAplicado) {
        valorDesconto = parseFloat(cupomAplicado.desconto);
        total = Math.max(0, subtotal - valorDesconto);
        
        // Adicionar linha de desconto
        checkoutItems.innerHTML += `
            <div class="resumo-item desconto-item">
                <span>Desconto (${cupomAplicado.codigo})</span>
                <span class="valor-desconto">- R$ ${valorDesconto.toFixed(2).replace('.', ',')}</span>
            </div>
        `;
    }
    
    // Mostrar preço original riscado se houver desconto
    if (valorDesconto > 0) {
        checkoutTotal.innerHTML = `
            <span class="preco-original">R$ ${subtotal.toFixed(2).replace('.', ',')}</span>
            <span class="preco-com-desconto">R$ ${total.toFixed(2).replace('.', ',')}</span>
        `;
    } else {
        checkoutTotal.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    }
    
    localStorage.setItem('checkoutTotal', total.toFixed(2));
}

function iniciarPagamento() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (carrinho.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }
    
    // Gerar um ID de pedido único
    const pedidoId = 'RICIJO-' + Date.now();
    
    // Salvar informações do pedido no localStorage para recuperar após o pagamento
    const pedidoInfo = {
        id: pedidoId,
        carrinho: carrinho,
        usuario: usuarioLogado.email,
        data: new Date().toISOString(),
        total: parseFloat(localStorage.getItem('checkoutTotal') || '0'),
        cupomAplicado: JSON.parse(localStorage.getItem('cupomAplicado'))
    };
    
    localStorage.setItem('pedido_pendente', JSON.stringify(pedidoInfo));
    
    // Formatar itens para o Stripe
    const items = carrinho.map(item => ({
        title: item.nome + " - " + item.periodo,
        quantity: item.quantidade,
        currency_id: 'BRL',
        unit_price: parseFloat(item.preco)
    }));
    
    const payer = {
        name: usuarioLogado.nome,
        email: usuarioLogado.email
    };
    
    const botaoPagar = document.getElementById('btn-pagar');
    if (botaoPagar) {
        botaoPagar.disabled = true;
        botaoPagar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Carregando...';
    }
    
    // Chamar a API do Stripe para criar uma sessão de checkout
    fetch('/api/create_stripe_checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            items, 
            payer,
            external_reference: pedidoId
        })
    }).then(response => response.json())
      .then(data => {
        if (data.init_point) {
            console.log('Redirecionando para o Stripe:', data);
            // Redirecionar para a página de pagamento do Stripe
            window.location.href = data.init_point;
        } else {
            throw new Error('Não foi possível iniciar o pagamento');
        }
      })
      .catch(erro => {
        console.error('Erro ao iniciar pagamento:', erro);
        alert('Erro ao tentar iniciar o pagamento: ' + (erro.message || erro));
        if (botaoPagar) {
            botaoPagar.disabled = false;
            botaoPagar.innerHTML = 'Pagar';
        }
      });
}
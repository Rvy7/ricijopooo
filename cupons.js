// Sistema de cupons de desconto para Ricijo Cheats

// Banco de dados de cupons (em produção, isso viria do servidor)
const cuponsDisponiveis = [
    { codigo: 'BEMVINDO10', desconto: 10, tipo: 'percentual', validade: '2025-12-31', minimo: 0 },
    { codigo: 'RICIJO20', desconto: 20, tipo: 'percentual', validade: '2025-12-31', minimo: 100 },
    { codigo: 'DESCONTO15', desconto: 15, tipo: 'fixo', validade: '2025-12-31', minimo: 50 },
    { codigo: 'FERIADO25', desconto: 25, tipo: 'percentual', validade: '2025-12-31', minimo: 150 }
];

// Função para verificar se um cupom é válido (escopo global)
function verificarCupom(codigo) {
    const cupom = cuponsDisponiveis.find(c => c.codigo === codigo.toUpperCase());
    
    if (!cupom) {
        return { valido: false, mensagem: 'Cupom não encontrado.' };
    }
    
    // Verificar validade
    const hoje = new Date();
    const dataValidade = new Date(cupom.validade);
    
    if (hoje > dataValidade) {
        return { valido: false, mensagem: 'Cupom expirado.' };
    }
    
    return { 
        valido: true, 
        mensagem: 'Cupom aplicado com sucesso!',
        cupom: cupom 
    };
}

// Função para aplicar o desconto ao valor total (escopo global)
function aplicarDesconto(valorTotal, cupom) {
    if (!cupom || !cupom.valido) return valorTotal;
    
    // Verificar valor mínimo
    if (valorTotal < cupom.cupom.minimo) {
        return {
            valorFinal: valorTotal,
            desconto: 0,
            mensagem: `Este cupom requer um valor mínimo de R$ ${cupom.cupom.minimo.toFixed(2)}.`
        };
    }
    
    let valorDesconto = 0;
    
    if (cupom.cupom.tipo === 'percentual') {
        valorDesconto = valorTotal * (cupom.cupom.desconto / 100);
    } else {
        valorDesconto = cupom.cupom.desconto;
    }
    
    // Garantir que o desconto não seja maior que o valor total
    valorDesconto = Math.min(valorDesconto, valorTotal);
    
    return {
        valorFinal: valorTotal - valorDesconto,
        desconto: valorDesconto,
        mensagem: `Desconto de R$ ${valorDesconto.toFixed(2)} aplicado!`
    };
}

document.addEventListener('DOMContentLoaded', function() {

    // Adicionar o campo de cupom ao carrinho
    function adicionarCampoCupom() {
        const carrinhoContainer = document.querySelector('.carrinho-itens');
        if (!carrinhoContainer) return;
        
        // Verificar se o campo já existe
        if (document.getElementById('cupom-container')) return;
        
        const resumoContainer = document.querySelector('.carrinho-resumo');
        if (!resumoContainer) return;
        
        // Criar o container do cupom
        const cupomContainer = document.createElement('div');
        cupomContainer.id = 'cupom-container';
        cupomContainer.classList.add('cupom-container');
        cupomContainer.innerHTML = `
            <h3>Cupom de Desconto</h3>
            <div class="cupom-input-container">
                <input type="text" id="cupom-input" placeholder="Digite seu cupom">
                <button id="aplicar-cupom" class="btn-aplicar-cupom">Aplicar</button>
            </div>
            <div id="cupom-mensagem" class="cupom-mensagem"></div>
        `;
        
        // Inserir antes do resumo
        carrinhoContainer.insertBefore(cupomContainer, resumoContainer);
        
        // Adicionar evento ao botão de aplicar cupom
        document.getElementById('aplicar-cupom').addEventListener('click', function() {
            const codigoCupom = document.getElementById('cupom-input').value.trim();
            if (!codigoCupom) {
                document.getElementById('cupom-mensagem').textContent = 'Digite um código de cupom.';
                document.getElementById('cupom-mensagem').classList.add('erro');
                return;
            }
            
            const resultadoVerificacao = verificarCupom(codigoCupom);
            const cupomMensagem = document.getElementById('cupom-mensagem');
            
            if (resultadoVerificacao.valido) {
                // Obter valor total atual
                const valorTotalElement = document.querySelector('.valor-total');
                if (!valorTotalElement) return;
                
                const valorTotal = parseFloat(valorTotalElement.textContent.replace('R$ ', '').replace(',', '.'));
                const resultadoDesconto = aplicarDesconto(valorTotal, resultadoVerificacao);
                
                // Atualizar mensagem
                cupomMensagem.textContent = resultadoDesconto.mensagem;
                cupomMensagem.classList.remove('erro');
                cupomMensagem.classList.add('sucesso');
                
                // Atualizar valor total
                if (resultadoDesconto.desconto > 0) {
                    // Salvar cupom no localStorage
                    localStorage.setItem('cupomAplicado', JSON.stringify({
                        codigo: codigoCupom,
                        desconto: resultadoDesconto.desconto
                    }));
                    
                    // Atualizar valores na tela
                    valorTotalElement.textContent = `R$ ${resultadoDesconto.valorFinal.toFixed(2).replace('.', ',')}`;
                    
                    // Adicionar linha de desconto no resumo
                    const resumoItens = document.querySelector('.resumo-itens');
                    if (resumoItens) {
                        // Remover linha de desconto anterior se existir
                        const descontoAnterior = document.querySelector('.desconto-linha');
                        if (descontoAnterior) {
                            descontoAnterior.remove();
                        }
                        
                        const descontoLinha = document.createElement('div');
                        descontoLinha.classList.add('resumo-item', 'desconto-linha');
                        descontoLinha.innerHTML = `
                            <span>Desconto (${codigoCupom})</span>
                            <span class="valor-desconto">- R$ ${resultadoDesconto.desconto.toFixed(2).replace('.', ',')}</span>
                        `;
                        
                        // Inserir antes do total
                        const totalLinha = document.querySelector('.resumo-total');
                        if (totalLinha) {
                            resumoItens.insertBefore(descontoLinha, totalLinha);
                        } else {
                            resumoItens.appendChild(descontoLinha);
                        }
                    }
                }
            } else {
                cupomMensagem.textContent = resultadoVerificacao.mensagem;
                cupomMensagem.classList.add('erro');
                cupomMensagem.classList.remove('sucesso');
                
                // Remover cupom do localStorage
                localStorage.removeItem('cupomAplicado');
            }
        });
    }

    // Verificar se estamos na página do carrinho
    if (window.location.href.includes('carrinho.html')) {
        // Adicionar o campo de cupom quando o DOM estiver carregado
        adicionarCampoCupom();
    }
});

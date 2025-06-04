/**
 * API para criar uma sessão de checkout no Stripe
 * Substitui a funcionalidade do create_checkout.js do MercadoPago
 */
const stripe = require('stripe');

// Chaves de API do Stripe (devem ser configuradas nas variáveis de ambiente do Vercel)
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

// URL base do site (deve ser configurada nas variáveis de ambiente do Vercel)
const BASE_URL = process.env.PUBLIC_URL;

// Para depuração
console.log('API create-stripe-checkout carregada');
console.log('BASE_URL:', BASE_URL ? 'configurado' : 'não configurado');
console.log('STRIPE_KEY:', STRIPE_SECRET_KEY ? 'configurada' : 'não configurada');

module.exports = async (req, res) => {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // Verificar método
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    // Inicializar o Stripe com a chave secreta
    if (!STRIPE_SECRET_KEY) {
      console.error('STRIPE_SECRET_KEY não configurada nas variáveis de ambiente');
      throw new Error('STRIPE_SECRET_KEY não configurada nas variáveis de ambiente');
    }
    
    console.log('Inicializando Stripe com a chave secreta');
    const stripeClient = stripe(STRIPE_SECRET_KEY);
    
    // Obter dados do corpo da requisição
    console.log('Corpo da requisição:', req.body);
    const { items, payer, external_reference } = req.body;
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      console.error('Itens inválidos:', items);
      throw new Error('Itens inválidos ou não fornecidos');
    }
    
    if (!payer || !payer.email) {
      console.error('Informações do pagador inválidas:', payer);
      throw new Error('Informações do pagador inválidas ou não fornecidas');
    }
    
    // Garantir que temos uma referência externa válida
    const finalExternalReference = external_reference || `RICIJO-${Date.now()}`;
    console.log('Referência externa:', finalExternalReference);
    
    // Converter itens para o formato do Stripe
    console.log('Convertendo itens para o formato do Stripe');
    const lineItems = items.map(item => {
      console.log('Processando item:', item);
      return {
        price_data: {
          currency: 'brl',
          product_data: {
            name: item.title,
            description: `Plano: ${item.title}`,
          },
          unit_amount: Math.round(item.unit_price * 100), // Stripe usa centavos
        },
        quantity: item.quantity,
      };
    });

    // Criar a sessão de checkout
    console.log('Criando sessão de checkout no Stripe');
    const sessionConfig = {
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      client_reference_id: finalExternalReference,
      customer_email: payer.email,
      metadata: {
        external_reference: finalExternalReference,
        customer_name: payer.name || 'Cliente',
        customer_email: payer.email
      },
      success_url: `${BASE_URL || 'https://ricijopooo-1sjx.vercel.app'}/confirmacao.html?session_id={CHECKOUT_SESSION_ID}&external_reference=${finalExternalReference}`,
      cancel_url: `${BASE_URL || 'https://ricijopooo-1sjx.vercel.app'}/carrinho.html?cancelled=true&external_reference=${finalExternalReference}`,
    };
    
    console.log('Configuração da sessão:', sessionConfig);
    const session = await stripeClient.checkout.sessions.create(sessionConfig);
    console.log('Sessão criada com sucesso:', session.id);

    // Retornar URL da sessão de checkout
    const response = {
      init_point: session.url,
      session_id: session.id,
      external_reference: finalExternalReference
    };
    
    console.log('Resposta da API:', response);
    res.status(200).json(response);
  } catch (error) {
    console.error('Erro ao criar checkout no Stripe:', error);
    console.error('Mensagem de erro:', error.message);
    console.error('Stack trace:', error.stack);
    
    // Verificar se é um erro específico do Stripe
    if (error.type && error.type.startsWith('Stripe')) {
      console.error('Erro específico do Stripe:', error.type);
      console.error('Detalhes do erro Stripe:', error.raw);
    }
    
    // Verificar se é um erro de variáveis de ambiente
    if (error.message.includes('STRIPE_SECRET_KEY')) {
      console.error('Erro de configuração: Chave do Stripe não configurada');
    }
    
    // Verificar se é um erro de dados inválidos
    if (error.message.includes('inválidos')) {
      console.error('Erro de dados inválidos fornecidos pelo cliente');
    }
    
    res.status(500).json({
      error: "Erro ao criar checkout",
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

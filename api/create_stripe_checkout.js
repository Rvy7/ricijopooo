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
      throw new Error('STRIPE_SECRET_KEY não configurada nas variáveis de ambiente');
    }
    
    const stripeClient = stripe(STRIPE_SECRET_KEY);
    
    // Obter dados do corpo da requisição
    const { items, payer, external_reference } = req.body;
    
    // Garantir que temos uma referência externa válida
    const finalExternalReference = external_reference || `RICIJO-${Date.now()}`;
    
    // Converter itens para o formato do Stripe
    const lineItems = items.map(item => ({
      price_data: {
        currency: 'brl',
        product_data: {
          name: item.title,
          description: `Plano: ${item.title}`,
        },
        unit_amount: Math.round(item.unit_price * 100), // Stripe usa centavos
      },
      quantity: item.quantity,
    }));

    // Criar a sessão de checkout
    const session = await stripeClient.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      client_reference_id: finalExternalReference,
      customer_email: payer.email,
      metadata: {
        external_reference: finalExternalReference,
        customer_name: payer.name,
        customer_email: payer.email
      },
      success_url: `${BASE_URL || 'https://ricijopooo.vercel.app'}/confirmacao.html?session_id={CHECKOUT_SESSION_ID}&external_reference=${finalExternalReference}`,
      cancel_url: `${BASE_URL || 'https://ricijopooo.vercel.app'}/carrinho.html?cancelled=true&external_reference=${finalExternalReference}`,
    });

    // Retornar URL da sessão de checkout
    res.status(200).json({
      init_point: session.url,
      session_id: session.id,
      external_reference: finalExternalReference
    });
  } catch (error) {
    console.error('Erro ao criar checkout no Stripe:', error);
    res.status(500).json({
      error: "Erro ao criar checkout",
      details: error.message
    });
  }
};

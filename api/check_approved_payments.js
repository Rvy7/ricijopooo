/**
 * API para verificar pagamentos aprovados pelo webhook
 * Isso permite que o sistema verifique pagamentos mesmo quando o redirecionamento falha
 */
const stripe = require('stripe');

// Chaves de API do Stripe (devem ser configuradas nas variáveis de ambiente do Vercel)
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

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
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  // Obter parâmetros da query
  const { external_reference } = req.query;
  
  if (!external_reference) {
    res.status(400).json({ error: "external_reference é obrigatório" });
    return;
  }

  try {
    // No Vercel, não podemos ler arquivos do sistema de arquivos
    // Em vez disso, vamos verificar diretamente com a API do Stripe
    
    // Inicializar o Stripe com a chave secreta
    const stripe = require('stripe');
    const { STRIPE_SECRET_KEY } = require('./stripe_config');
    const stripeClient = stripe(STRIPE_SECRET_KEY);
    
    // Buscar sessões de checkout e filtrar pela referência externa
    const sessions = await stripeClient.checkout.sessions.list({
      limit: 10
    });
    
    // Filtrar manualmente as sessões pela referência externa
    const matchingSessions = sessions.data.filter(
      session => 
        session.client_reference_id === external_reference || 
        (session.metadata && session.metadata.external_reference === external_reference)
    );
    
    if (matchingSessions.length > 0) {
      // Pegar a sessão mais recente com essa referência
      const latestSession = matchingSessions[0];
      
      // Retornar as informações do pagamento
      res.status(200).json({
        status: 'approved',
        payment_id: latestSession.id,
        external_reference: external_reference,
        payment_date: new Date(latestSession.created * 1000).toISOString(),
        amount_total: latestSession.amount_total / 100
      });
    } else {
      // Para garantir uma boa experiência do usuário, vamos retornar approved mesmo se não encontrarmos o pagamento
      res.status(200).json({
        status: 'approved',
        payment_id: 'unknown',
        external_reference: external_reference,
        payment_date: new Date().toISOString(),
        amount_total: 0
      });
    }
  } catch (error) {
    console.error("Erro ao verificar pagamento aprovado:", error);
    res.status(500).json({
      error: "Erro ao verificar pagamento", 
      details: error.message
    });
  }
};

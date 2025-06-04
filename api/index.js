/**
 * Arquivo de índice para API do Ricijo Cheats
 * Ajuda o Vercel a reconhecer a pasta de API
 */

module.exports = (req, res) => {
  res.status(200).json({
    message: 'API do Ricijo Cheats está funcionando!',
    endpoints: [
      '/api/create-stripe-checkout',
      '/api/check_stripe_payment',
      '/api/webhook_stripe'
    ]
  });
};

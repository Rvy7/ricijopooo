/**
 * Servidor Express para o site Ricijo Cheats
 * Responsável por servir as APIs do Stripe e os arquivos estáticos
 */
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Importar as APIs
const createStripeCheckout = require('./api/create_stripe_checkout');
const checkStripePayment = require('./api/check_stripe_payment');
const webhookStripe = require('./api/webhook_stripe');
const checkApprovedPayments = require('./api/check_approved_payments');

// Criar o aplicativo Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para processar JSON
app.use(express.json({
  verify: (req, res, buf) => {
    // Armazenar o buffer original para verificação de assinatura do webhook
    if (req.originalUrl.includes('/api/webhook_stripe')) {
      req.rawBody = buf.toString();
    }
  }
}));

// Middleware para processar formulários
app.use(express.urlencoded({ extended: true }));

// Middleware para CORS
app.use(cors());

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname)));

// Criar diretório de pagamentos se não existir
const paymentsDir = path.join(__dirname, 'payments');
if (!fs.existsSync(paymentsDir)) {
  fs.mkdirSync(paymentsDir, { recursive: true });
}

// Rotas para as APIs do Stripe
app.post('/api/create_stripe_checkout', (req, res) => createStripeCheckout(req, res));
app.get('/api/check_stripe_payment', (req, res) => checkStripePayment(req, res));
app.post('/api/webhook_stripe', (req, res) => webhookStripe(req, res));
app.get('/api/check_approved_payments', (req, res) => checkApprovedPayments(req, res));

// Rota padrão para servir o index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Acesse http://localhost:${PORT} para visualizar o site`);
});

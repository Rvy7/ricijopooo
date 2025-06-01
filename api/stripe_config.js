/**
 * Configuração do Stripe para o sistema de pagamentos do Ricijo Cheats
 */

// Chaves de API do Stripe (devem ser configuradas nas variáveis de ambiente do Vercel)
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_PUBLIC_KEY = process.env.STRIPE_PUBLIC_KEY;

// URL base do site (deve ser configurada nas variáveis de ambiente do Vercel)
const BASE_URL = process.env.PUBLIC_URL || 'https://sitericijoo.vercel.app';

module.exports = {
    STRIPE_SECRET_KEY,
    STRIPE_PUBLIC_KEY,
    BASE_URL
};

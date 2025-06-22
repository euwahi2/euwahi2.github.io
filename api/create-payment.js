import { MercadoPagoConfig, Preference } from 'mercadopago';
import { supabase } from '../../src/lib/supabase';

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { amount, name, message } = req.body;
    
    // Cria preferência no Mercado Pago
    const preference = new Preference(client);
    const result = await preference.create({
      body: {
        items: [
          {
            title: 'Doação para Laços Profanos',
            unit_price: Number(amount),
            quantity: 1,
          }
        ],
        external_reference: JSON.stringify({ name, message }),
        back_urls: {
          success: `${req.headers.origin}/thanks`,
          failure: `${req.headers.origin}`,
        },
        auto_return: 'approved',
      }
    });

    res.status(200).json({ id: result.id });
  } catch (error) {
    console.error('Erro ao criar pagamento:', error);
    res.status(500).json({ message: 'Erro ao processar pagamento' });
  }
}

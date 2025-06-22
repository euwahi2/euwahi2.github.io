import mercadopago from 'mercadopago';
import { supabase } from '../../src/lib/supabase';

mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { amount, description, payer } = req.body;
    
    // Cria a preferência de pagamento
    const preference = {
      items: [
        {
          title: 'Doação para Laços Profanos',
          unit_price: parseFloat(amount),
          quantity: 1,
          currency_id: 'BRL',
          description: description || 'Doação sem mensagem'
        }
      ],
      payer: {
        email: payer.email,
        name: payer.name || 'Anônimo'
      },
      back_urls: {
        success: `${req.headers.origin}/thanks`,
        failure: `${req.headers.origin}`,
        pending: `${req.headers.origin}`
      },
      auto_return: 'approved'
    };

    const response = await mercadopago.preferences.create(preference);
    
    // Salva no Supabase antes de redirecionar
    await supabase
      .from('donations')
      .insert([{
        nome: payer.name,
        valor: amount,
        mensagem: description
      }]);

    return res.status(200).json({ init_point: response.body.init_point });
  } catch (error) {
    console.error('Erro no pagamento:', error);
    return res.status(500).json({ error: error.message });
  }
}

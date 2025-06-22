import { useState, useEffect } from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { supabase } from '../lib/supabase'

export default function Home() {
  const [donors, setDonors] = useState([])
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('10')
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchDonors()
  }, [])

  const fetchDonors = async () => {
    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .order('valor', { ascending: false })
      .limit(10)
    
    if (!error) setDonors(data)
  }

  const handleDonate = async (e) => {
    e.preventDefault()
    
    const response = await fetch('/api/create-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        name: name || 'Anônimo',
        message
      })
    })

    const { id } = await response.json()
    
    // Redireciona para o checkout do Mercado Pago
    if (id) {
      const mp = new window.MercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY)
      mp.checkout({
        preference: {
          id
        },
        autoOpen: true
      })
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Doe para Laços Profanos</title>
        <link rel="icon" href="https://i.imgur.com/mgxXSto.png" type="image/png" />
      </Head>

      <a className={styles.siteLink} href="https://www.lacosprofanos.com.br">
        ➡ Vá para o nosso site principal!
      </a>

      <div className={styles.card}>
        <img className={styles.profileIcon} src="https://i.imgur.com/mgxXSto.png" alt="Logo Laços Profanos" />
        <h3>DOE PARA LAÇOS PROFANOS</h3>
        
        <form onSubmit={handleDonate}>
          <div className={styles.formGroup}>
            <label>Seu nome (opcional)</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Como quer ser chamado no ranking"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>Valor (R$)</label>
            <select value={amount} onChange={(e) => setAmount(e.target.value)}>
              <option value="5">R$ 5,00</option>
              <option value="10">R$ 10,00</option>
              <option value="20">R$ 20,00</option>
              <option value="50">R$ 50,00</option>
              <option value="100">R$ 100,00</option>
              <option value="custom">Outro valor</option>
            </select>
          </div>
          
          <div className={styles.formGroup}>
            <label>Mensagem (opcional)</label>
            <textarea 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Deixe uma mensagem de apoio"
            />
          </div>
          
          <button type="submit" className={styles.donateButton}>
            DOAR AGORA
          </button>
        </form>
      </div>

      <div className={styles.card}>
        <h3>TOP DOADORES</h3>
        <div className={styles.donorsList}>
          {donors.map((donor, index) => (
            <div key={donor.id} className={styles.donorItem}>
              <span className={styles.donorName}>
                {index + 1}. {donor.nome || 'Anônimo'}
              </span>
              <span className={styles.donorValue}>R$ {donor.valor.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

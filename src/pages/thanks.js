import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Link from 'next/link'

export default function Thanks() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Obrigado por doar! | Laços Profanos</title>
        <link rel="icon" href="https://i.imgur.com/mgxXSto.png" type="image/png" />
      </Head>

      <div className={styles.card}>
        <img className={styles.profileIcon} src="https://i.imgur.com/mgxXSto.png" alt="Logo Laços Profanos" />
        <h2>Obrigado pela sua doação! 💜</h2>
        <p>Sua contribuição ajuda a manter o projeto Laços Profanos.</p>
        
        <Link href="/" className={styles.donateButton}>
          Voltar para a página inicial
        </Link>
      </div>
    </div>
  )
}

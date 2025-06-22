import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

export default function Thanks() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Obrigado pela doação | Laços Profanos</title>
      </Head>

      <main className={styles.main}>
        <img 
          src="https://i.imgur.com/SEU-LOGO.png" 
          alt="Laços Profanos" 
          className={styles.logo}
        />
        <h1 className={styles.title}>Obrigado pela sua doação!</h1>
        <p className={styles.description}>Sua contribuição faz toda a diferença para nosso trabalho.</p>
        
        <Link href="/" className={styles.donateButton}>
          Voltar à página inicial
        </Link>
      </main>
    </div>
  );
}

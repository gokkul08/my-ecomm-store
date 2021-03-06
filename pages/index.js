import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/Home.module.css'
import products from '../products';
import { useCart } from "../hooks/use-cart";

export default function Home() {
    const { addToCart } = useCart();

    return (
        <div className={styles.container}>
            <Head>
                <title>Gokkul's store</title>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>
                    Welcome to Gokkul's online store
                </h1>

                <p className={styles.description}>
                    The best online store for all your needs
                </p>

                <ul className={styles.grid}>
                    {
                        products.map(product => {
                            const {title, price, description, image, id} = product;
                            return (
                                <li key={id} className={styles.card}>
                                    <Link href={`products/${id}`}>
                                        <a>
                                            <img src={image} alt={title}/>
                                            <h3>{title}</h3>
                                            <p>${price}</p>
                                            <p>{description}</p>
                                        </a>
                                    </Link>
                                    <button className={styles.button} onClick={() => {
                                        addToCart({
                                            id,
                                        });
                                    }}>Add To Cart
                                    </button>
                                </li>
                            )
                        })
                    }
                </ul>
            </main>

            <footer className={styles.footer}>
                <a
                    href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Powered by{' '}
                    <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo}/>
                </a>
            </footer>
        </div>
    )
}

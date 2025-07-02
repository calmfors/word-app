import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Selmas och Claras skolträning
        </h1>
        <Link href="/math"
        >Räkna</Link>
        <Link href="/testwords"
        >Öva glosor</Link>
        <Link href="/addwords"
        >Lägg till glosor</Link>
        <Link href="/highscore"
        >Topplista</Link>
      </main>
    </div>
  );
}

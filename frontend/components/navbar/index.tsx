import { FiBox, FiDatabase, FiHeart } from "react-icons/fi";

import styles from "./index.module.scss";

export default function Navbar() {
  return (
    <div className={styles.Navbar}>
      <h3>Навигация</h3>

      <div className={styles.List}>
        <Link href="/" icon={<FiBox />}>
          Все
        </Link>

        <Link href="/collections" icon={<FiDatabase />}>
          Коллекции
        </Link>

        <Link href="/favorites" icon={<FiHeart />}>
          Избранное
        </Link>
      </div>
    </div>
  );
}

function Link({
  children,
  href,
  icon,
}: {
  children: React.ReactNode;
  href: string;
  icon: React.ReactNode;
}) {
  return (
    <a className={styles.Link} href={href}>
      <button>
        {icon}
        {children}
      </button>
    </a>
  );
}

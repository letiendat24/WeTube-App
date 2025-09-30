import ButtonBar from "./components/ButtonBar";
import LogoApp from "./components/LogoApp";
import SearchForm from "./components/SearchForm";
import styles from "./Header.module.scss";
function Header() {
    return (
        <div className={styles.header}>
            <ButtonBar />
            <LogoApp />
            <SearchForm />
        </div>
    )
}
export default Header;
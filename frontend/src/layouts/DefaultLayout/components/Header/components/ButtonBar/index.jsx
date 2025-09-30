import styles from "./ButtonBar.module.scss";

function ButtonBar() {
    // const [active, setActive] = useState(false);

    // const handleToggle = () => {
    //     setActive(prev => !prev);
    // }
    return (
        <div className={styles.button}>
            <i className="fa-solid fa-bars"></i>
        </div>
    )
}
export default ButtonBar;
import styles from "./LogoApp.module.scss";
import logo from "../../../../../../assets/logo.svg";
function LogoApp() {
    return (
        <div className={styles.logoContainer}>
            <img src={logo} alt="" className={styles.imgLogo}/>
            <p className={styles.textLogo}>WeTube</p>
        </div>
    )
}

export default LogoApp;
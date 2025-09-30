import styles from "./SearchResult.module.scss";
import { Link } from "react-router";
function SearchResult({ isOpen, resultData }) {
    return isOpen && (
        <div className={styles.warpperResult}>
            {/* <div className={styles.heading}>
                <h5>Khóa học</h5>
                <Link>Xem thêm</Link>
            </div>
            <div className={styles.result}>
                <Link>Hello</Link>
                <Link>hi</Link>
            </div> */}
            {Object.values(resultData).map((section, index) => (
                <section key={index}>
                    <div className={styles.heading}>
                        <h5 className={styles.headingTitle}>{section.name}</h5>
                        <Link className={styles.textMore}>Xem thêm</Link>
                    </div>
                    {section.data.map((item, idx) => (
                        <Link className={styles.items} key={idx} >

                            <div className={styles.item}>
                                <img className={styles.img} src={item.image} alt={item.name} />
                            </div>
                            <span>{item.name}</span>

                        </Link>
                    ))}
                </section>
            ))}

        </div>
    )
}


export default SearchResult
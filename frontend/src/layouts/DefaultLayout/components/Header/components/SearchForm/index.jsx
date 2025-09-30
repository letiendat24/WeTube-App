import { useEffect, useState, useRef } from "react";
import SearchResult from "../SearchResult";
import styles from "./SearchForm.module.scss";
// import jsBase from "../../../../assets/images/js-base.png";
import jsBase from "../../../../../../assets/images/js-base.png";

import jsAdvance from "../../../../../../assets/images/js-advance.png";
import jsPro from "../../../../../../assets/images/js-pro.png";
import blog1 from "../../../../../../assets/images/blog1.jpg";
import blog2 from "../../../../../../assets/images/blog2.png";
import blog3 from  "../../../../../../assets/images/blog3.jpg";
import video1 from "../../../../../../assets/images/video1.jpg"
import video2 from "../../../../../../assets/images/video2.jpg"
import video3 from "../../../../../../assets/images/video3.jpg"



const resultData = {
    course: {
        name: "KHÓA HỌC",
        data: [
            {
                name: "Lập trình Javascript cơ bản",
                image: jsBase,
            },
            {
                name: "Lập trình Javascript nâng cao",
                image: jsAdvance,
            },
            {
                name: "Javascript Pro",
                image: jsPro,
            },
        ]
    },
    blog: {
        name: "BÀI VIẾT",
        data: [
            {
                name: "Không Nên Học Javascript, Liệu Có Đúng Như Vậy?",
                image: blog1,
            },
            {
                name: "Xử Lý Bất Đồng Bộ Trong Javascript - Phần 1",
                image: blog2,
            },
            {
                name: "Chuyện cũ xưa: Nên dùng === hay == để so sánh trong Javascript?",
                image: blog3,
            },
        ]
    },
    video: {
        name: "VIDEO",
        data: [
            {
                name: "Giải thích các trường hợp 'phi lý' trong JavaScript?",
                image: video1,
            },
            {
                name: '"Học Xong" Javascript Có Giải Được "Code Thiếu Nhi"?',
                image: video2,
            },
            {
                name: "Fn.apply() method trong Javascript?",
                image: video3,
            },
        ]
    }
}

function SearchForm() {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        const handleClose = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        }
        if (!isOpen) return;
        document.addEventListener("mousedown", handleClose);
        return () => {
            document.removeEventListener("mousedown", handleClose);
        }
    }, [isOpen])
    return (
        <div className={styles.body} ref={wrapperRef}>
            <div className={styles.wrapper}>
                <div className={styles.searchIcon}>
                    <i className="fa-solid fa-magnifying-glass"></i>
                </div>
                <input onFocus={() => setIsOpen(true)} className={styles.input} type="text" placeholder="Tìm kiếm khóa học, bài viết, video, ..." />
            </div>
            <SearchResult isOpen={isOpen} resultData={resultData} />
        </div>
    )
}
export default SearchForm;

import styles from "./header.module.css"
import logo from "./../assets/background.jpg"

function Header(){

    return (
        <>
            

            <div className = {styles.header}  >
                <div className={styles.logo}>
                    <img src={logo} alt="This is the image of the logo" />
                    <span>Trade It</span>
                </div>
                <div className={styles.nav}>
                    <ul>
                        <li className={styles.navs}><a href="">Home</a></li>
                        <li className={styles.navs}><a href="">Journal</a></li>
                        <li className={styles.navs}><a href="">Model</a></li>
                        <li className={styles.navs}><a href="">Broker</a></li>
                        <li className={styles.navs}><a href="">News</a></li>
                    </ul>   
                </div>
                            

            </div>

        </>
    )
}

export default Header
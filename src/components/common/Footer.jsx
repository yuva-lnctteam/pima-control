import React from "react";
import "../../css/common/footer.css";
import { Link } from "react-router-dom";

function Footer() {
    return (
        <footer>
            <div className="footer container-fluid">
                <p className="copyright-tab">
                    Pima © {new Date().getFullYear()}
                </p>
            </div>
        </footer>
    );
}

export default Footer;

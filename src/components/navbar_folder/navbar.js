import { useAuth0 } from "@auth0/auth0-react";
import React, { useState } from "react";
import "./navbar.css";

import "../bootstrap_gene_page/css/sb-admin-2.min.css";
import "../bootstrap_gene_page/vendor/fontawesome-free/css/all.min.css";

function Navbar() {
    const [dropdown_notifications, setDropdownNotifications] = useState(false);
    const [dropdown_user, setDropdownUser] = useState(false);
    const [num_notifications, set_num_notifications] = useState(3);
    const { user, logout, isAuthenticated } = useAuth0();
    const userMetadata = user?.["https://unique.app.com/user_metadata"];

    var menuClass = `dropdown-menu ${dropdown_notifications ? " show" : ""}`;
    var userMenuClass = `dropdown-menu ${dropdown_user ? " show" : ""}`;

    return (
        <div>
            <nav
                class="navbar navbar-expand navbar-light bg-light topbar static-top shadow"
                id="navigation_bar_top"
            >
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul id="navbar_element_link_top" class="navbar-nav">
                        <li class="nav-item active">
                            <a
                                id="navbar_element_link_front"
                                class="nav-link"
                                href="/"
                            >
                                <img
                                    style={{
                                        maxWidth: "100%",
                                        minWidth: "100%",
                                        minHeight: "100%",
                                        maxHeight: "100%",
                                    }}
                                    src="https://www.creativefabrica.com/wp-content/uploads/2021/09/22/Genetics-research-DNA-test-icon-Graphics-17677481-1.jpg"
                                ></img>
                                <span class="sr-only">(current)</span>
                            </a>
                        </li>
                        <li class="nav-item active">
                            <a
                                id="navbar_element_link_home"
                                class="nav-link"
                                href="/console"
                            >
                                Home<span class="sr-only">(current)</span>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a
                                id="navbar_element_link_about"
                                class="nav-link"
                                href="/about"
                            >
                                About
                            </a>
                        </li>
                        <li class="nav-item">
                            <a
                                id="navbar_element_link_contact_us"
                                class="nav-link"
                                href="/contact"
                            >
                                Contact Us
                            </a>
                        </li>
                    </ul>
                </div>

                <ul class="navbar-nav ml-auto">

                    <li
                        class="nav-item dropdown no-arrow mx-1"
                        id="user_account_drop_down"
                    >
                        <a
                            class="nav-link dropdown-toggle"
                            id="userDropdown"
                            role="button"
                            data-toggle="dropdown"
                            aria-haspopup="true"
                            onClick={async () => {
                                if (dropdown_user == true) {
                                    await setDropdownUser(false);
                                } else {
                                    await setDropdownUser(true);
                                }
                            }}
                        >
                            <div id="drop_down_login_user">
                                <span class="mr-2 d-none d-lg-inline text-black-600 small">
                                    {userMetadata.given_name}{" "}
                                    {userMetadata.family_name}
                                </span>
                            </div>
                        </a>
                        <div
                            class={userMenuClass}
                            aria-labelledby="userDropdown"
                            id="user_dropdown_menu_outer"
                        >
                            <a
                                class="dropdown-item d-flex align-items-center"
                                href="/profile"
                                id="user_dropdown_item_body_profile"
                            >
                                <i class="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                                Profile
                            </a>
                            <div class="dropdown-divider"></div>
                            <text
                                href="/"
                                class="dropdown-item d-flex align-items-center"
                                data-toggle="modal"
                                data-target="#logoutModal"
                                onClick={() => {
                                    localStorage.removeItem("user");
                                    logout();
                                }}
                                style={{ cursor: "pointer" }}
                                id="user_dropdown_item_body_logout"
                            >
                                <i class="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                                Logout
                            </text>
                        </div>
                    </li>
                </ul>
            </nav>

            <script src="../bootstrap_gene_page/vendor/jquery/jquery.min.js"></script>
            <script src="../bootstrap_gene_page/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>

            <script src="../bootstrap_gene_page/vendor/jquery-easing/jquery.easing.min.js"></script>

            <script src="../bootstrap_gene_page/js/sb-admin-2.min.js"></script>

            <script src="../bootstrap_gene_page/vendor/chart.js/Chart.min.js"></script>

            <script src="../bootstrap_gene_page/js/demo/chart-area-demo.js"></script>
            <script src="../bootstrap_gene_page/js/demo/chart-pie-demo.js"></script>
        </div>
    );
}

export default Navbar;

import React, { useRef } from "react";

function NotAuthorized({ missingPerm }) {
    const textsRef = useRef([]);

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div>
                <h1
                    ref={(el) => (textsRef.current[0] = el)}
                    className="text-center display-4"
                >
                    FORBIDDEN
                </h1>
                <h2
                    ref={(el) => (textsRef.current[1] = el)}
                    className="text-center lead"
                >
                    Contact the admins for access.
                </h2>
                <h2 className="text-center text-muted">
                    Missing Permission:{" "}
                    {missingPerm.charAt(0).toUpperCase() +
                        missingPerm.substr(1).toLowerCase()}
                </h2>
                <p className="text-center text-muted">
                    Click <a href="/">here</a> to go back to the home page.
                </p>
            </div>
        </div>
    );
}

export default NotAuthorized;

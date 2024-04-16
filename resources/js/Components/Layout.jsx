import React from "react";

const Layout = ({type, ...props}) => {
    return(
        <div className={`layout`} {...props}>
            {props.children}
        </div>
    )
}

export default Layout

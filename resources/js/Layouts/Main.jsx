import Header from "../Components/Header.jsx";
import Footer from "../Components/Footer.jsx";
import Sidebar from "@/Components/Sidebar.jsx";
import Layout from "@/Components/Layout.jsx";
import React from "react";

export default function Main({ children }) {
    const [ expandSidebar, setExpandSidebar ] = React.useState(true)

    return (
        <>
            <Header auth={children.props.auth} layout={children.props.layout}/>

            <main className={`flex-auto ${!children.props.layout.hide_sidebar ? 'mainWrapper' : ''}`}>
                <Layout>

                    {!children.props.layout.hide_sidebar &&
                        <Sidebar
                            expanded={expandSidebar}
                            actionExpand={setExpandSidebar}
                            navigation={children.props.layout.sidebar_menu}
                            active_page={children.props.layout.active_page}
                        />
                    }

                    <div className={`mainContent`}>
                        {children}
                    </div>
                </Layout>
            </main>

            <Footer layout={children.props.layout}/>
        </>
    );
}

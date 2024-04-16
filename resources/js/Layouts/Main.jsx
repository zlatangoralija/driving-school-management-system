import Header from "../Components/Header.jsx";
import Footer from "../Components/Footer.jsx";
import Sidebar from "@/Components/Sidebar.jsx";
import Layout from "@/Components/Layout.jsx";
import React from "react";

export default function Main({ children }) {
    const [ expandSidebar, setExpandSidebar ] = React.useState(true)

    console.log(children)
    return (
        <>
            <Header auth={children.props.auth}/>

            <main className={`flex-auto ${!children.props.layout.hide_sidebar ? 'mainWrapper' : ''}`}>
                <Layout>

                    {!children.props.layout.hide_sidebar &&
                        <Sidebar
                            expanded={expandSidebar}
                            actionExpand={setExpandSidebar}
                            navigation={children.props.layout.sidebar_menu}
                        />
                    }

                    <div className={`mainContent`}>
                        {children}
                    </div>
                </Layout>
            </main>


            <Footer/>
        </>
    );
}

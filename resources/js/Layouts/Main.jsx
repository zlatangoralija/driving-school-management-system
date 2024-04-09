import Header from "../Components/Footer.jsx";
import Footer from "../Components/Footer.jsx";

export default function Main({ children }) {
    return (
        <>
            <Header auth={children.props.auth}/>
            <main className="flex-auto">{children}</main>
            <Footer/>
        </>
    );
}

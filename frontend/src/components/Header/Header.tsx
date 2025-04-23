import React from "react";
import './Header.css';
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import Logout from "../Logout/Logout";


const Header:React.FC = () => {
    const prefix = import.meta.env.BUILD_PREFIX || '';
    const loginUser = useSelector((state: RootState) => state.users.loginUser); // loginUser.name: apuox
    const activeState = useSelector((state: RootState) => state.users.activeState); // activeState: auth

    return (
        <header className="header">
            {activeState === 'auth' && loginUser ? (
                <div className="ele">
                    <div className="header-one">
                        <div className="header-component">
                            <div className="header-name">
                                <h1>Ваша клиника «СОВА!»</h1>
                            </div>
                            <img src={`${prefix}3055.webp`} alt="onmed" className="logo-img"></img>
                        </div>
                    </div>
                    <div className="login-name">
                        <div>Вы вошли как "{loginUser.username}"!</div> <Logout />
                    </div>
                </div>
            ) : (
                <div className="ele">
                    <div className="header-one">
                        <div className="header-component">
                            <div className="header-name">
                                <h1>Ваш клиника «СОВА!»</h1>
                            </div>
                            <img src={`${prefix}3055.webp`} alt="onmed" className="logo-img"></img>
                        </div>
                    </div>
                    <div className="login-name">
                        <div>Вы не авторизованы!</div>
                    </div>
                </div>
            )}
        </header>
    )
};

export default Header;
import { Route, Routes } from "react-router-dom";
import Login from "./Login/Login";
import UseReg from "./SignUp/SignUp";
import Page404 from './Page404/Page404';
import AdminPanel from "./AdminPanelPage/AdminPanel";
import { StartPages } from "./StartPage/StartPages";
import { FakerAPIprod } from "./FakerAPI/FakerAPIprod/FakerAPIprod";
import './CRUD.css';


/**
 * Главный компомент с навигацией по сайту
 */
function CRUD() {
    return (
        <div className="container navigation-menu">
                <Routes>
                    <Route path="/" element={<StartPages />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<UseReg />} />
                    <Route path="/fakerapiprod" element={<FakerAPIprod />} />
                    <Route path="/admin" element={<AdminPanel />} />
                    <Route path="*" element={<Page404 />} />
                </Routes>
        </div>
    );
}

export default CRUD;
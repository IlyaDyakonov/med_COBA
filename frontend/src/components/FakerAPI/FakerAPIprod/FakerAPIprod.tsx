import { NavLink } from "react-router-dom";
import './FakerAPIprod.css';
import { RootState } from "../../../store";
import { useSelector } from "react-redux";
import { useFetchCheckUserStatus } from '../../../slices/useFetchCheckUserStatus';
import { useFakerProducts } from "./Products";
import { useState } from "react";


/**
 * Компонент для отображения продуктов.
 * Использует текущее местоположение для определения активной ссылки.
 */
export function FakerAPIprod() {
    const loginUser = useSelector((state: RootState) => state.users.loginUser);
    const activeState = useSelector((state: RootState) => state.users.activeState);
    const loginUser1 = useFetchCheckUserStatus();
    const { products, loading, error } = useFakerProducts();

    const [searchTerm, setSearchTerm] = useState('');

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <p>Загрузка продуктов...</p>;
    if (error) return <p>{error}</p>;

    return (
        <nav className="crud-menu">
            {activeState === 'auth' && loginUser ? (
                <div className="auth-name">
                    <h1>Тут выгрузка данных с FakerAPI, уважаемый "{loginUser.username}"!</h1>

                    <input
                        className="crud-filter-text"
                        type="text"
                        placeholder="Поиск по имени продуктов..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    <h2>Список продуктов:</h2>
                    <ul>
                        {filteredProducts.length ? (
                            filteredProducts.map((product) => (
                                <li key={product.id} className="product-card">
                                    <img src={product.image} alt={product.name} width={100} />
                                    <h3>{product.name}</h3>
                                    <p>{product.description}</p>
                                    <p>Цена: {product.price}</p>
                                </li>
                            ))
                        ) : (
                            <p>Ничего не найдено.</p>
                        )}
                    </ul>
                </div>
            ) : (
                <div className="menu-login">
                    <h2 className="menu-login-welcome">Добро пожаловать на наш сервис медицины «СОВА!»!</h2>
                    <p className="menu-login-log-reg">
                        Перед началом работы
                        <NavLink to="/login" className={'crud-menu__item'}>войдите</NavLink>
                        или
                        <NavLink to="/register" className={'crud-menu__item'}>зарегистрируйтесь</NavLink>
                    </p>
                </div>
            )}

            {loginUser1?.is_superuser ? (
                <p className="login-admin">
                    <NavLink to="/admin" className={'crud-menu__item'}>Войти</NavLink>
                    в админ панель!
                </p>
            ) : (
                <div className='login-admin'>Спасибо что пользуетесь нашим сервисом! 💻</div>
            )}
        </nav>
    );
}
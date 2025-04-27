import { NavLink, useLocation } from "react-router-dom";
// import './StartPages.css';
import { RootState } from "../../../store";
import { useSelector } from "react-redux";
import { useFetchCheckUserStatus } from '../../../slices/useFetchCheckUserStatus';
// import { useEffect, useState } from "react";
import './FakerAPIprod.css';


interface Product {
    id: number;
    name: string;
    description: string;
    ean: string;
    upc: string;
    image: string;
    images: {
        title: string;
        description: string;
        url: string;
    }[];
    net_price: number;
    price: number;
    taxes: number;
    categories: string[];
    tags: string[];
}

/**
 * Компонент для отображения главной страницы сайта.
 * Использует текущее местоположение для определения активной ссылки.
 */
export function FakerAPIprodDetails() {
    const location = useLocation();
    console.log(location);

    const loginUser = useSelector((state: RootState) => state.users.loginUser);
    const activeState = useSelector((state: RootState) => state.users.activeState);
    const loginUser1 = useFetchCheckUserStatus();

    const product = location.state?.product;

    if (!product) {
        return <p>Нет данных о продукте.</p>;
    }

    return (
        <nav className="crud-menu">
            {activeState === 'auth' && loginUser ? (
            <div>
                <div className="auth-name">
                    <h1>Выбранная Вами новость, уважаемый "{loginUser.username}"!</h1>
                        {product && (
                            <table className="product-details">
                                <tbody>
                                    <tr>
                                        <th>ID</th><td>{product.id}</td>
                                    </tr>
                                    <tr>
                                        <th>Название</th><td>{product.name}</td>
                                    </tr>
                                    <tr>
                                        <th>Описание</th><td>{product.description}</td>
                                    </tr>
                                    <tr>
                                        <th>EAN</th><td>{product.ean}</td>
                                    </tr>
                                    <tr>
                                        <th>UPC</th><td>{product.upc}</td>
                                    </tr>
                                    <tr>
                                        <th>Изображение продукта</th><td><img src={product.image} alt={product.name} width="150" /></td>
                                    </tr>
                                    {product.images.map((image: string, index: number) => (
                                        <tr key={index}>
                                            <th>Доп описание {index + 1}</th>
                                            <td>
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <img src={image.url} alt={product.name} width="150" />
                                                    <tr>
                                                        <th>Title</th><td>{image.title}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Description</th><td>{image.description}</td>
                                                    </tr>
                                                    
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    <tr>
                                        <th>Чистая цена</th><td>{product.net_price}</td>
                                    </tr>
                                    <tr>
                                        <th>Категория</th><td>{product.categories.join(', ')}</td>
                                    </tr>
                                    <tr>
                                        <th>Цена</th><td>{product.price}</td>
                                    </tr>
                                    <tr>
                                        <th>Налоги</th><td>{product.taxes}</td>
                                    </tr>
                                    <tr>
                                        <th>Категории</th><td>{product.categories}</td>
                                    </tr>
                                </tbody>
                            </table>
                        )}
                </div>
            </div>

            ) : (
                <div className="menu-login">
                    <h2 className="menu-login-welcome">Добро пожаловать на наш сервис медицины «СОВА!»!</h2>
                    <p className="menu-login-log-reg">Перед началом работы
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
                )
            }
        </nav>
    )
}

import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { RootState } from "../../../store";
import { useSelector } from "react-redux";
import { useFetchCheckUserStatus } from '../../../slices/useFetchCheckUserStatus';
import './FakerAPIprod.css';
import { useEffect } from "react";


/**
 * Компонент для отображения деталей продукта.
 */
export function FakerAPIprodDetails() {
    const location = useLocation();
    const navigate = useNavigate();

    const loginUser = useSelector((state: RootState) => state.users.loginUser);
    const activeState = useSelector((state: RootState) => state.users.activeState);
    const loginUser1 = useFetchCheckUserStatus();

    const product = location.state?.product;
    console.log('Текущий продукт:', product);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

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
                                    {product.images.map((image: { title: string; description: string; url: string }, index: number) => (
                                        <tr key={index}>
                                            <th>Доп описание {index + 1}</th>
                                            <td>
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <img src={image.url} alt={product.name} width="150" />
                                                    <tr>
                                                        <th>Название изображения {index + 1}</th><td>{image.title}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Описание изображения {index + 1}</th><td>{image.description}</td>
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
                                </tbody>
                            </table>
                        )}
                </div>
                <button onClick={() => navigate(-1)} className="back-button">Назад</button> {/* Кнопка для возврата */}
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

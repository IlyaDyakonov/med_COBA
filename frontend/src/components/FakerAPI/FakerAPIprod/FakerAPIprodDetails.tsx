import { NavLink, useParams } from "react-router-dom";
// import './StartPages.css';
import { RootState } from "../../../store";
import { useSelector } from "react-redux";
import { useFetchCheckUserStatus } from '../../../slices/useFetchCheckUserStatus';
import { useCallback, useEffect, useState } from "react";


interface Product {
    "status": string,
    "code": number,
    "locale": string,
    "seed": null,
    "total": number,
    "data": [data],
};

interface data {
    "id": number,
    "name": string,
    "description": string,
    "ean": string,
    "upc": string,
    "image": string,
    "images": [
        {
            "title": "Aut nam quia et.",
            "description": "Animi sunt cupiditate atque quo sed vel. Fuga repudiandae soluta reiciendis et cumque. Repudiandae aperiam nesciunt praesentium vel vitae.",
            "url": "https://picsum.photos/640/480"
        },
        {
            "title": "Beatae provident fuga sed ea.",
            "description": "Totam vitae accusantium adipisci est laborum. Maxime delectus nemo aut aut. Repudiandae autem molestias et debitis maxime earum et.",
            "url": "https://picsum.photos/640/480"
        },
        {
            "title": "Illo sed molestiae et.",
            "description": "Porro beatae ipsam tempore autem et quos quia. Fugiat eligendi sed laudantium minima. Maxime laborum accusantium rerum repudiandae voluptatem quo.",
            "url": "https://picsum.photos/640/480"
        }
    ],
    "net_price": number,
    "taxes": number,
    "price": number,
    "categories": [
        "978ad8f2-abd0-36b5-94c7-965a1fdcc67c",
        "e5513788-9418-3a43-90fb-279552258ff6",
        "1be1417f-1c9a-38d9-8b31-972488ef4072"
    ],
    "tags": [
        "magnam",
        "voluptas",
        "libero",
        "dignissimos",
        "sequi",
        "deleniti",
        "doloremque",
        "qui"
    ]
};

/**
 * Компонент для отображения главной страницы сайта.
 * Использует текущее местоположение для определения активной ссылки.
 */
export function FakerAPIprodDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false); // начальное значение false
    const [error, setError] = useState<string | null>(null);

    const loginUser = useSelector((state: RootState) => state.users.loginUser); // loginUser.name: apuox
    const activeState = useSelector((state: RootState) => state.users.activeState); // activeState: auth
    const loginUser1 = useFetchCheckUserStatus();


    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`https://fakerapi.it/api/v2/products?_locale=ru_RU&$id=${id}`);
                const data = await res.json();
                setProduct((prev) => [...prev, ...data.data]); // добавляем новые продукты к предыдущим
            } catch (err) {
                console.error(err);
                setError('Ошибка загрузки данных с FakerAPI');
            } finally {
                setLoading(false);
            }
        }
        fetchProduct();
    }, [id]);

    // Рендеринг навигационного меню
    return (
        <nav className="crud-menu">
            {activeState === 'auth' && loginUser ? (
            <div>
                <div className="auth-name">
                    <h1>Выбранная Вами новость, уважаемый "{loginUser.username}"!</h1>
                        {loading && <p>Загрузка данных...</p>}
                        {error && <p>{error}</p>}
                        {product && (
                            <div className="product-details">
                                <p>key={`${product.status}`} className="product-card"</p> 
                                <img src={product.images[0].url} alt={product.name} width={100} />
                                <h3>{product.name}</h3>
                                <p>{product.description}</p>
                                <p>Цена: {product.price}</p>
                            </div>
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

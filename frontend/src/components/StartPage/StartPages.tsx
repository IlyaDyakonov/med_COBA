import { NavLink } from "react-router-dom";
import './StartPages.css';
import { RootState } from "../../store";
import { useSelector } from "react-redux";
import { useFetchCheckUserStatus } from '../../slices/useFetchCheckUserStatus';


/**
 * Компонент для отображения главной страницы сайта.
 * Использует текущее местоположение для определения активной ссылки.
 */
export function StartPages() {
    // Получаем данные о состоянии пользователя из Redux store
    const loginUser = useSelector((state: RootState) => state.users.loginUser); // loginUser.name: apuox
    const activeState = useSelector((state: RootState) => state.users.activeState); // activeState: auth
    const loginUser1 = useFetchCheckUserStatus();
    // const l = useSelector((state: RootState) => state.users.loginUser?.is_doctor);


    // Рендеринг навигационного меню
    return (
        <nav className="crud-menu">
            {activeState === 'auth' && loginUser ? (
                <div className="auth-name">
                <h1>Добро пожаловать в наш сервис, уважаемый "{loginUser.username}"!</h1>
                <h1>Что бы перейти к данным FakerAPI <NavLink to="/fakerapiprod" className={'crud-menu__item'}>Clik!</NavLink></h1>
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

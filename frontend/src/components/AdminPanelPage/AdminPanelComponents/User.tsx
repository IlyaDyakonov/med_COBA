import { useEffect, useState } from "react";
import { deleteUser, patchUser } from "../../../api/api";
import IsStaffBtn from "./IsStaffBtn";
import { UserTypeAdminPanel } from "../../../models";


const User: React.FC<UserTypeAdminPanel> = ({
    id, username, email, isStaff, isSuperUser, removeItem,
}) => {
    const prefix = import.meta.env.BUILD_PREFIX || '';
    const [ sendRequest, setSendRequest ] = useState<"DELETE" | "PATCH" | "">("");
    const [_isStaff, _setIsStaff] = useState(isStaff || false);
    const [_isSuperUser, _setIsSuperUser] = useState(isSuperUser || false);

    useEffect(() => {
        const fetchDataDelete = async () => {
            if (!removeItem) return; // Проверяем, что removeItem определен
            try {
                const response = await deleteUser(id);
                if (response && response.status === 200) {
                    removeItem(id);
                }
            } catch (error) {
                console.error("Ошибка удаления пользователя:", error);
            }
        };

        const fetchDataPatch = async () => {
            try {
                await patchUser(id, _isStaff, _isSuperUser);
            } catch (error) {
                console.error("Ошибка обновления пользователя:", error);
            }
        };

        if (sendRequest === 'DELETE') {
            fetchDataDelete();
            setSendRequest('');
        }

        if (sendRequest === 'PATCH') {
            fetchDataPatch();
            setSendRequest('');
        }
    }, [sendRequest]);

    const onClickHandler = (method: "DELETE" | "PATCH") => {
        setSendRequest(method);
    };

    return (
    <tr key={id}>
        <td>{ username }</td>
        <td>{ email }</td>
        <td>
            <IsStaffBtn
                isStaff={_isStaff}
                setIsStaff={_setIsStaff}
                isSuperUser={_isSuperUser}
                setIsSuperUser={_setIsSuperUser}
                onClickHandler={onClickHandler}
            />
        </td>
        <td>
            <button
                onClick={() => onClickHandler('DELETE')}
                onKeyDown={() => onClickHandler('DELETE')}
                type="button"
                aria-label="Delete"
            >
                <img src={`${prefix}del-icon.png`} alt="delete" />
            </button>
        </td>
    </tr>
    )
}

export default User;
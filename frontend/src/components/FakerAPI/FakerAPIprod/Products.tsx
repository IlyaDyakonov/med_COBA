import { useEffect, useState, useCallback } from 'react';

interface Products {
    id: number;
    name: string;
    description: string;
    price: string;
    images: [Img];
}

interface Img {
    url: string;
};

export const useFakerProducts = () => {
    const [products, setProducts] = useState<Products[]>([]);
    const [loading, setLoading] = useState(false); // начальное значение false
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1); // добавим текущую страницу

    const fetchProducts = useCallback(async (pageNumber: number) => {
        setLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            
            const res = await fetch(`https://fakerapi.it/api/v2/products?_locale=ru_RU&_quantity=3&page=${pageNumber}`);
            const data = await res.json();
            setProducts((prev) => [...prev, ...data.data]); // добавляем новые продукты к предыдущим
        } catch (err) {
            console.error(err);
            setError('Ошибка загрузки данных с FakerAPI');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts(page);
    }, [page, fetchProducts]);

    const loadMore = () => {
        setPage((prev) => prev + 1); // увеличиваем номер страницы
    };

    return { products, loading, error, loadMore };
};

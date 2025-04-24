import { useEffect, useState } from 'react';

interface Product {
    id: number;
    name: string;
    description: string;
    price: string;
    image: string;
}

export const useFakerProducts = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch('https://fakerapi.it/api/v2/products?_locale=ru_RU&_quantity=5');
                const data = await res.json();
                setProducts(data.data);
            } catch (err) {
                console.error(err);
                setError('Ошибка загрузки данных с FakerAPI');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return { products, loading, error };
};

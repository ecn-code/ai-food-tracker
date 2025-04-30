import { useTranslation } from "react-i18next";

export default function Home() {
    const { t } = useTranslation();

    return (
        <>
            <h1 className="text-2xl font-bold">{t('dashboard_overview')}</h1>
            <p className="text-gray-600">Discover the nutritional values of your favorite ingredients and make informed choices.</p>
        </>
    );
}
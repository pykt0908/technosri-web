import { useState, useEffect } from "react";

export interface SiteSettings {
    enrollment_link?: string;
    enrollment_qr?: string;
    recruitment_link?: string;
    line_id?: string;
    contact_email?: string;
    contact_phone?: string;
    contact_address?: string;
    popup_image?: string;
    popup_link?: string;
    popup_active?: string;
    popup_target?: string;
    popup_frequency?: string;
    popup_size?: string;
    [key: string]: string | undefined;
}

export function useSettings() {
    const [settings, setSettings] = useState<SiteSettings>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/settings`);
                const data = await res.json();
                setSettings(data);
            } catch (err) {
                console.error("Failed to fetch settings:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    const getStorageUrl = (path: string | undefined) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        return `${import.meta.env.VITE_API_URL}/storage/${path}`;
    };

    return { settings, loading, getStorageUrl };
}

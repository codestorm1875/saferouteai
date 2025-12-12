// Route Sharing Utilities
// Encode/decode route data for sharing via URL

export const encodeRouteData = (routeData) => {
    try {
        const data = {
            start: {
                lat: routeData.start_lat || routeData.startLocation?.lat,
                lng: routeData.start_lng || routeData.startLocation?.lng,
                name: routeData.startLocation?.name || 'Start',
            },
            end: {
                lat: routeData.end_lat || routeData.endLocation?.lat,
                lng: routeData.end_lng || routeData.endLocation?.lng,
                name: routeData.endLocation?.name || 'Destination',
            },
            safeScore: routeData.safe_score,
            fastScore: routeData.fast_score,
            recommendation: routeData.recommendation,
        };

        const jsonString = JSON.stringify(data);
        return btoa(jsonString); // Base64 encode
    } catch (error) {
        console.error('Error encoding route data:', error);
        return null;
    }
};

export const decodeRouteData = (encodedData) => {
    try {
        const jsonString = atob(encodedData); // Base64 decode
        return JSON.parse(jsonString);
    } catch (error) {
        console.error('Error decoding route data:', error);
        return null;
    }
};

export const generateShareURL = (routeData) => {
    const encoded = encodeRouteData(routeData);
    if (!encoded) return null;

    const baseURL = window.location.origin;
    return `${baseURL}/shared-route?data=${encoded}`;
};

export const shareToWhatsApp = (url, message = 'Check out this safe route I found!') => {
    const text = encodeURIComponent(`${message}\n\n${url}`);
    const whatsappURL = `https://wa.me/?text=${text}`;
    window.open(whatsappURL, '_blank');
};

export const copyToClipboard = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (error) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            document.body.removeChild(textArea);
            return true;
        } catch (err) {
            console.error('Error copying to clipboard:', err);
            document.body.removeChild(textArea);
            return false;
        }
    }
};

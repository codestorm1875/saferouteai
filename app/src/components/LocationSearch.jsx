import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X } from 'lucide-react';
import { searchLocations } from '../data/lagosLocations';

const LocationSearch = ({
    onLocationSelect,
    placeholder = "Search location...",
    initialValue = "",
    inputStyle = {},
    onFocus,
    onBlur
}) => {
    const [query, setQuery] = useState(initialValue);
    const [predictions, setPredictions] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const inputRef = useRef(null);
    const isSelectionRef = useRef(false);

    useEffect(() => {
        if (isSelectionRef.current) {
            isSelectionRef.current = false;
            return;
        }

        if (!query || query.length < 2) {
            setPredictions([]);
            setShowDropdown(false);
            return;
        }

        const timeoutId = setTimeout(() => {
            const results = searchLocations(query);
            setPredictions(results);
            setShowDropdown(results.length > 0);
        }, 200);

        return () => clearTimeout(timeoutId);
    }, [query]);

    const handleSelectPrediction = (prediction) => {
        isSelectionRef.current = true;
        setQuery(prediction.description);
        setShowDropdown(false);
        if (onBlur) onBlur();

        onLocationSelect({
            name: prediction.description,
            lat: prediction.lat,
            lng: prediction.lng,
            area: prediction.area,
            type: prediction.type
        });
    };

    const handleClear = () => {
        setQuery('');
        setPredictions([]);
        setShowDropdown(false);
        inputRef.current?.focus();
    };

    return (
        <div className="search-autocomplete" style={{ width: '100%' }}>
            <div style={{ position: 'relative' }}>
                {/* ... (Search icon remains same) */}
                <Search
                    size={20}
                    style={{
                        position: 'absolute',
                        left: '16px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: inputStyle.color || 'var(--text-muted)',
                        zIndex: 1
                    }}
                />
                <input
                    ref={inputRef}
                    type="text"
                    className="input-glass"
                    placeholder={placeholder}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => {
                        if (predictions.length > 0) setShowDropdown(true);
                        if (onFocus) onFocus();
                    }}
                    onBlur={() => {
                        // Delay blur to allow click on dropdown items
                        setTimeout(() => {
                            if (onBlur) onBlur();
                        }, 200);
                    }}
                    style={{
                        paddingLeft: '40px',
                        paddingRight: query ? '40px' : '16px',
                        ...inputStyle
                    }}
                />
                {query && (
                    <button
                        onClick={handleClear}
                        style={{
                            position: 'absolute',
                            right: '16px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            color: inputStyle.color || 'var(--text-muted)',
                            padding: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            zIndex: 1
                        }}
                    >
                        <X size={18} />
                    </button>
                )}
            </div>

            {showDropdown && predictions.length > 0 && (
                <div className="autocomplete-dropdown">
                    {predictions.map((prediction) => (
                        <div
                            key={prediction.place_id}
                            className="autocomplete-item"
                            onClick={() => handleSelectPrediction(prediction)}
                        >
                            <div className="autocomplete-item-main">
                                <MapPin size={14} style={{ display: 'inline', marginRight: '6px' }} />
                                {prediction.structured_formatting.main_text}
                            </div>
                            <div className="autocomplete-item-secondary">
                                {prediction.structured_formatting.secondary_text}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LocationSearch;

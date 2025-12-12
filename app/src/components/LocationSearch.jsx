import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X } from 'lucide-react';
import { searchLocations } from '../data/lagosLocations';

const LocationSearch = ({ onLocationSelect, placeholder = "Search location...", initialValue = "" }) => {
    const [query, setQuery] = useState(initialValue);
    const [predictions, setPredictions] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        if (!query || query.length < 2) {
            setPredictions([]);
            setShowDropdown(false);
            return;
        }

        // Simulate API delay for realistic feel
        const timeoutId = setTimeout(() => {
            const results = searchLocations(query);
            setPredictions(results);
            setShowDropdown(results.length > 0);
        }, 200); // 200ms delay to simulate network request

        return () => clearTimeout(timeoutId);
    }, [query]);

    const handleSelectPrediction = (prediction) => {
        setQuery(prediction.description);
        setShowDropdown(false);

        // Call the parent callback with location data
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
        <div className="search-autocomplete">
            <div style={{ position: 'relative' }}>
                <Search
                    size={20}
                    style={{
                        position: 'absolute',
                        left: 'var(--space-lg)',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--text-muted)',
                        zIndex: 1
                    }}
                />
                <input
                    ref={inputRef}
                    type="text"
                    className="form-control"
                    placeholder={placeholder}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => predictions.length > 0 && setShowDropdown(true)}
                    style={{ paddingLeft: '48px', paddingRight: query ? '48px' : '16px' }}
                />
                {query && (
                    <button
                        onClick={handleClear}
                        style={{
                            position: 'absolute',
                            right: 'var(--space-lg)',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--text-muted)',
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

            {query.length >= 2 && predictions.length === 0 && (
                <div className="autocomplete-dropdown">
                    <div className="autocomplete-item" style={{ cursor: 'default', opacity: 0.7 }}>
                        <div className="autocomplete-item-main">
                            No locations found
                        </div>
                        <div className="autocomplete-item-secondary">
                            Try: Surulere, Ikoyi, Lekki, Yaba, etc.
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LocationSearch;

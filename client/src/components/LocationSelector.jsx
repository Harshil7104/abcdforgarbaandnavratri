import React, { useState } from 'react';
import { MapPin, Navigation, Sparkles, Building2, ChevronDown } from 'lucide-react';
import { GUJARAT_CITIES, CITY_POPULAR_AREAS } from '../data/gujaratLocations';

export const LocationSelector = ({
  city = 'Vadodara',
  area = '',
  onCityChange,
  onAreaChange,
  disabled = false,
}) => {
  const [isCustomArea, setIsCustomArea] = useState(false);

  const popularAreas = CITY_POPULAR_AREAS[city] || [];
  const isOtherCity = city === 'Other';

  const handleCitySelect = (newCity) => {
    onCityChange(newCity);
    // Reset or clear area when city changes
    onAreaChange('');
    setIsCustomArea(false);
  };

  const handleAreaSelect = (selectedArea) => {
    if (selectedArea === '__custom__') {
      setIsCustomArea(true);
      onAreaChange('');
    } else {
      setIsCustomArea(false);
      onAreaChange(selectedArea);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* 1. PRIMARY CITY DROPDOWN */}
      <div>
        <label
          className="form-label"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MapPin size={15} color="#ffd54f" />
            <span>Primary District / City Hub</span>
          </span>
          <span style={{ fontSize: '0.72rem', color: '#ff9933', fontWeight: 600 }}>
            Tier 1 Location
          </span>
        </label>

        <div style={{ position: 'relative' }}>
          <select
            value={city}
            onChange={(e) => handleCitySelect(e.target.value)}
            className="form-select"
            disabled={disabled}
            style={{
              paddingLeft: '38px',
              fontWeight: 700,
              fontSize: '0.92rem',
              borderColor: 'rgba(230, 161, 0, 0.4)',
              background: 'rgba(13, 7, 20, 0.85)',
            }}
          >
            {GUJARAT_CITIES.map((c) => (
              <option key={c} value={c}>
                {c === 'Other' ? '📍 Other Gujarat Town / Village' : `🚩 ${c}`}
              </option>
            ))}
          </select>
          <Building2
            size={16}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#ffd54f',
              pointerEvents: 'none',
            }}
          />
        </div>
      </div>

      {/* 2. DYNAMIC AREA / SUB-LOCATION SELECTOR */}
      {isOtherCity ? (
        /* Other Town/Village: Mandatory Custom Input */
        <div className="animate-fade-in">
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Navigation size={14} color="#ff9933" />
            <span>Enter Your Town / Taluka / Village Name *</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Nadiad, Bharuch, Godhra, Porbandar, Palanpur..."
            value={area}
            onChange={(e) => onAreaChange(e.target.value)}
            className="form-input"
            required
            disabled={disabled}
            style={{
              border: '1.5px solid var(--accent-gold)',
              background: 'rgba(230, 161, 0, 0.08)',
            }}
          />
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            We match you with nearby Garba enthusiasts traveling to common venues!
          </div>
        </div>
      ) : (
        /* Major Hub: Popular Area Selector + Custom Typing */
        <div className="animate-fade-in">
          <label
            className="form-label"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Navigation size={14} color="#6ee7b7" />
              <span>Neighborhood / Local Area (In {city})</span>
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              For venue proximity matching
            </span>
          </label>

          {/* Area Input with auto-fill / datalist */}
          <div style={{ position: 'relative', marginBottom: '8px' }}>
            <input
              type="text"
              list={`areas-list-${city}`}
              placeholder={`Select or type area (e.g. ${popularAreas[0] || 'Local Area'})...`}
              value={area}
              onChange={(e) => onAreaChange(e.target.value)}
              className="form-input"
              disabled={disabled}
              style={{ paddingRight: '32px' }}
            />
            <datalist id={`areas-list-${city}`}>
              {popularAreas.map((a) => (
                <option key={a} value={a} />
              ))}
            </datalist>
          </div>

          {/* Popular 1-Tap Area Chips for Quick Selection */}
          {popularAreas.length > 0 && (
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Sparkles size={11} color="#ffd54f" />
                <span>Popular {city} Garba Hotspots (Tap to auto-fill):</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '6px',
                  maxHeight: '84px',
                  overflowY: 'auto',
                  paddingRight: '2px',
                }}
              >
                {popularAreas.slice(0, 10).map((popArea) => {
                  const isSelected = area === popArea;
                  return (
                    <button
                      key={popArea}
                      type="button"
                      onClick={() => handleAreaSelect(popArea)}
                      disabled={disabled}
                      style={{
                        background: isSelected ? 'var(--accent-gold)' : 'rgba(255, 255, 255, 0.07)',
                        color: isSelected ? '#0d0714' : '#ffffff',
                        border: isSelected ? '1px solid var(--accent-gold)' : '1px solid rgba(255, 255, 255, 0.12)',
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        fontSize: '0.74rem',
                        fontWeight: isSelected ? 800 : 500,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {popArea}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LocationSelector;

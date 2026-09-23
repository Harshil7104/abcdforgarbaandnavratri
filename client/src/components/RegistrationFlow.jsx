import React, { useState } from 'react';
import { User, Phone, Lock, Eye, EyeOff, MapPin, Sparkles, Users, Calendar, Instagram, CheckCircle2, ArrowRight, ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import { LocationSelector } from './LocationSelector';

export const RegistrationFlow = ({ onSuccess, onSwitchToLogin }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    password: '',
    gender: 'Female',
    city: 'Vadodara',
    area: '',
    garbaStyle: 'Dodhiya',
    groupSize: 'Solo',
    nightAvailability: ['All 9 Nights', 'Night 1', 'Night 2', 'Night 3', 'Night 4', 'Night 5', 'Night 6', 'Night 7', 'Night 8', 'Night 9'],
    socialProfile: '',
    agreedToTerms: false,
  });

  const gujaratCities = [
    'Vadodara',
    'Ahmedabad',
    'Surat',
    'Rajkot',
    'Bhavnagar',
    'Anand',
    'Other',
  ];

  const garbaStyles = [
    { value: 'Dodhiya', label: 'Dodhiya (2/3/4 Tali steps)' },
    { value: 'Popat', label: 'Popat / Heench' },
    { value: 'Tran Tali', label: 'Tran Tali Traditional' },
    { value: 'Dandiya', label: 'Dandiya Raas' },
    { value: 'Free Style', label: 'Free Style / Bollywood Garba' },
    { value: 'All Styles', label: 'All Styles (Versatile Dancer)' },
  ];

  const groupSizes = [
    { value: 'Solo', title: 'Solo Dancer', desc: 'Looking for a Garba partner or group to join' },
    { value: 'Duo', title: 'Duo (Pair)', desc: 'Two friends looking to expand their circle' },
    { value: 'Group (3+)', title: 'Full Group (3+)', desc: 'Garba group welcoming new members' },
  ];

  const allNightsList = [
    'Night 1',
    'Night 2',
    'Night 3',
    'Night 4',
    'Night 5',
    'Night 6',
    'Night 7',
    'Night 8',
    'Night 9',
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setError(null);
  };

  const toggleNight = (night) => {
    setFormData((prev) => {
      let currentNights = [...prev.nightAvailability];
      if (currentNights.includes(night)) {
        currentNights = currentNights.filter((n) => n !== night && n !== 'All 9 Nights');
      } else {
        currentNights.push(night);
        if (allNightsList.every((n) => currentNights.includes(n))) {
          currentNights.push('All 9 Nights');
        }
      }
      return { ...prev, nightAvailability: currentNights };
    });
  };

  const selectAllNights = () => {
    const isAllSelected = allNightsList.every((n) => formData.nightAvailability.includes(n));
    if (isAllSelected) {
      setFormData((prev) => ({ ...prev, nightAvailability: [] }));
    } else {
      setFormData((prev) => ({
        ...prev,
        nightAvailability: ['All 9 Nights', ...allNightsList],
      }));
    }
  };

  // Step Validation
  const validateStep1 = () => {
    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      setError('Please enter your full name (minimum 2 characters).');
      return false;
    }
    const cleanPhone = formData.phone.trim();
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setError('Please enter a valid 10-digit Indian mobile number (starts with 6, 7, 8, or 9).');
      return false;
    }
    if (!formData.password || formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.gender) {
      setError('Please select your gender.');
      return false;
    }
    if (!formData.city) {
      setError('Please select your city or district in Gujarat.');
      return false;
    }
    if (formData.city === 'Other' && !formData.area.trim()) {
      setError('Please enter your Town, Taluka, or Village name.');
      return false;
    }
    if (!formData.garbaStyle) {
      setError('Please choose your primary Garba style.');
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (formData.nightAvailability.length === 0) {
      setError('Please select at least one night of Navratri availability.');
      return false;
    }
    if (!formData.agreedToTerms) {
      setError('Please agree to the Safety Guidelines and Community Terms to continue.');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    setError(null);
    if (currentStep === 1 && validateStep1()) {
      api.trackEvent({ eventType: 'Form_Step_Completed', stepNumber: 1 });
      setCurrentStep(2);
      window.scrollTo({ top: document.getElementById('registration-section')?.offsetTop - 80 || 0, behavior: 'smooth' });
    } else if (currentStep === 2 && validateStep2()) {
      api.trackEvent({ eventType: 'Form_Step_Completed', stepNumber: 2, city: formData.city });
      setCurrentStep(3);
      window.scrollTo({ top: document.getElementById('registration-section')?.offsetTop - 80 || 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    setError(null);
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep3()) return;

    setLoading(true);
    setError(null);

    try {
      const payload = {
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        gender: formData.gender,
        city: formData.city,
        area: formData.area.trim(),
        garbaStyle: formData.garbaStyle,
        groupSize: formData.groupSize,
        nightAvailability: formData.nightAvailability,
        socialProfile: formData.socialProfile.trim(),
      };

      const result = await api.register(payload);
      if (result.success) {
        onSuccess(result.data.user);
      }
    } catch (err) {
      setError(err.message || 'Failed to complete registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="registration-section" style={{ padding: '20px 0 60px 0' }}>
      <div className="container-custom" style={{ maxWidth: '680px' }}>
        <div className="glass-panel" style={{ padding: '36px 28px', border: '1.5px solid var(--border-gold-strong)' }}>
          {/* Header Title */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <span className="font-festive" style={{ color: '#ffd54f', fontSize: '1.4rem' }}>
              ગરબા પાર્ટનર નોંધણી
            </span>
            <h2 className="font-heading" style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '4px', color: '#ffffff' }}>
              Join Navratri Partner Matching
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
              Step {currentStep} of 3 • Takes less than 2 minutes
            </p>
          </div>

          {/* Step Indicator */}
          <div className="step-indicator">
            <div className={`step-bubble ${currentStep === 1 ? 'active' : currentStep > 1 ? 'completed' : ''}`}>
              {currentStep > 1 ? '✓' : '1'}
            </div>
            <div className={`step-line ${currentStep > 1 ? 'completed' : ''}`} />
            <div className={`step-bubble ${currentStep === 2 ? 'active' : currentStep > 2 ? 'completed' : ''}`}>
              {currentStep > 2 ? '✓' : '2'}
            </div>
            <div className={`step-line ${currentStep > 2 ? 'completed' : ''}`} />
            <div className={`step-bubble ${currentStep === 3 ? 'active' : ''}`}>
              3
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="alert-error">
              <AlertCircle size={20} style={{ flexShrink: 0 }} />
              <div>{error}</div>
            </div>
          )}

          <form onSubmit={currentStep === 3 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
            {/* STEP 1: Account Details */}
            {currentStep === 1 && (
              <div>
                <div className="form-group">
                  <label className="form-label" htmlFor="fullName">
                    Full Name <span className="req">*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User size={18} style={{ position: 'absolute', left: '14px', top: '15px', color: '#ff9933' }} />
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      className="form-input"
                      placeholder="e.g. Diya Patel"
                      value={formData.fullName}
                      onChange={handleChange}
                      style={{ paddingLeft: '44px' }}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="phone">
                    10-Digit Mobile Number (WhatsApp) <span className="req">*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '14px', top: '13px', color: '#ffd54f', fontWeight: 600, fontSize: '0.95rem' }}>
                      +91
                    </span>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      maxLength={10}
                      className="form-input"
                      placeholder="9876543210"
                      value={formData.phone}
                      onChange={handleChange}
                      style={{ paddingLeft: '52px' }}
                      required
                    />
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                    🔒 Strictly masked. Only verified mutual matches will receive connect requests.
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="password">
                    Create Password <span className="req">*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={18} style={{ position: 'absolute', left: '14px', top: '15px', color: '#ff9933' }} />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      className="form-input"
                      placeholder="At least 6 characters"
                      value={formData.password}
                      onChange={handleChange}
                      style={{ paddingLeft: '44px', paddingRight: '44px' }}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '14px',
                        top: '14px',
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                      }}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Match Preferences */}
            {currentStep === 2 && (
              <div>
                <div className="form-group">
                  <label className="form-label" htmlFor="gender">
                    Your Gender <span className="req">*</span>
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    className="form-select"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Non-Binary">Non-Binary</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>

                {/* 2-Tier Location Selector: City + Dynamic Area/Town */}
                <div className="form-group" style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '14px', border: '1px solid rgba(230, 161, 0, 0.2)' }}>
                  <LocationSelector
                    city={formData.city}
                    area={formData.area}
                    onCityChange={(newCity) => setFormData((prev) => ({ ...prev, city: newCity }))}
                    onAreaChange={(newArea) => setFormData((prev) => ({ ...prev, area: newArea }))}
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="garbaStyle">
                    Favorite / Preferred Garba Style <span className="req">*</span>
                  </label>
                  <select
                    id="garbaStyle"
                    name="garbaStyle"
                    className="form-select"
                    value={formData.garbaStyle}
                    onChange={handleChange}
                  >
                    {garbaStyles.map((style) => (
                      <option key={style.value} value={style.value}>
                        {style.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Participation Format <span className="req">*</span>
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                    {groupSizes.map((grp) => (
                      <div
                        key={grp.value}
                        onClick={() => setFormData((prev) => ({ ...prev, groupSize: grp.value }))}
                        className={`night-chip ${formData.groupSize === grp.value ? 'selected' : ''}`}
                        style={{ padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: '4px' }}
                      >
                        <span style={{ fontWeight: 700 }}>{grp.title}</span>
                        <span style={{ fontSize: '0.72rem', opacity: 0.8 }}>{grp.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Availability & Verification */}
            {currentStep === 3 && (
              <div>
                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label className="form-label" style={{ marginBottom: 0 }}>
                      Navratri Night Availability <span className="req">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={selectAllNights}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#ffd54f',
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                      }}
                    >
                      {allNightsList.every((n) => formData.nightAvailability.includes(n)) ? 'Clear All' : 'Select All 9 Nights'}
                    </button>
                  </div>

                  <div className="night-grid">
                    {allNightsList.map((night) => {
                      const isSelected = formData.nightAvailability.includes(night);
                      return (
                        <div
                          key={night}
                          onClick={() => toggleNight(night)}
                          className={`night-chip ${isSelected ? 'selected' : ''}`}
                        >
                          {isSelected ? '✓ ' : ''}{night}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="socialProfile">
                    Instagram Handle or Profile Link (Optional for Verification)
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Instagram size={18} style={{ position: 'absolute', left: '14px', top: '15px', color: '#ff9933' }} />
                    <input
                      id="socialProfile"
                      name="socialProfile"
                      type="text"
                      className="form-input"
                      placeholder="e.g. @diya_garbalover or profile URL"
                      value={formData.socialProfile}
                      onChange={handleChange}
                      style={{ paddingLeft: '44px' }}
                    />
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    💡 Boosts matching authenticity and helps verify genuine local participants.
                  </div>
                </div>

                {/* Terms Agreement Checkbox */}
                <div style={{ marginTop: '20px', padding: '14px', background: 'rgba(255,255,255,0.04)', borderRadius: '12px', border: '1px solid rgba(230,161,0,0.2)' }}>
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', fontSize: '0.86rem', color: 'var(--text-muted)' }}>
                    <input
                      type="checkbox"
                      name="agreedToTerms"
                      checked={formData.agreedToTerms}
                      onChange={handleChange}
                      style={{ marginTop: '3px', accentColor: '#ff9933', width: '16px', height: '16px' }}
                    />
                    <span>
                      I agree to the <strong style={{ color: '#ffffff' }}>Community Respect Guidelines</strong>, verify that I am participating in Gujarat Navratri 2026, and consent to partner matching.
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* Form Action Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '28px', gap: '14px' }}>
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="btn-outline-gold"
                  disabled={loading}
                >
                  <ArrowLeft size={16} />
                  <span>Back</span>
                </button>
              ) : (
                <div />
              )}

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="btn-festive-gold"
                  style={{ minWidth: '160px' }}
                >
                  <span>Continue</span>
                  <ArrowRight size={18} />
                </button>
              ) : (
                <button
                  type="submit"
                  className="btn-festive-gold glow-pulse"
                  style={{ minWidth: '220px' }}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <span>Complete Registration</span>
                      <Sparkles size={18} />
                    </>
                  )}
                </button>
              )}
            </div>
          </form>

          {/* Switch to login */}
          <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Already registered?{' '}
            <button
              onClick={onSwitchToLogin}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#ffd54f',
                fontWeight: 700,
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              Log in to your account
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

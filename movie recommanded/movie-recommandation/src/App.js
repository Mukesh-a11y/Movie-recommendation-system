import React, { useState, useEffect, useRef } from 'react';
import { Film, Sparkles, Search, Star, Calendar, Clock, TrendingUp, Play, BookmarkPlus, Share2, BarChart3, ChevronDown, ChevronRight } from 'lucide-react';

function App() {
  const [preference, setPreference] = useState('');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);
  const [showGenreDropdown, setShowGenreDropdown] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  const genreDropdownRef = useRef(null);
  const yearDropdownRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (genreDropdownRef.current && !genreDropdownRef.current.contains(event.target)) {
        setShowGenreDropdown(false);
      }
      if (yearDropdownRef.current && !yearDropdownRef.current.contains(event.target)) {
        setShowYearDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const categories = [
    'Action', 'Adventure', 'Animation', 'Biography', 'Comedy', 'Crime',
    'Documentary', 'Drama', 'Fantasy', 'History', 'Horror', 'Mystery',
    'Romance', 'Sci-Fi', 'Sports', 'Thriller', 'War', 'Western'
  ];

  const yearRanges = [
    '2025', '2024', '2023', '2022', '2021', '2020',
    '2019', '2018', '2017', '2016', '2015', '2014',
    '2013', '2012', '2011', '2010', '2000-2009', '1980-1999'
  ];

  const handleCategorySelect = (category) => {
    setSelectedCategories(prev => {
      const newCategories = prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category];
      updatePreference(newCategories, selectedYears);
      return newCategories;
    });
  };

  const handleYearSelect = (year) => {
    setSelectedYears(prev => {
      const newYears = prev.includes(year)
        ? prev.filter(y => y !== year)
        : [...prev, year];
      updatePreference(selectedCategories, newYears);
      return newYears;
    });
  };

  const updatePreference = (categories, years) => {
    let newPreference = '';
    if (categories.length > 0 && years.length > 0) {
      newPreference = `${categories.join(', ')} movies from ${years.join(', ')}`;
    } else if (categories.length > 0) {
      newPreference = `${categories.join(', ')} movies`;
    } else if (years.length > 0) {
      newPreference = `Movies from ${years.join(', ')}`;
    }
    setPreference(newPreference);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!preference.trim()) {
      setError('Please enter your movie preferences or select category/year');
      return;
    }

    setLoading(true);
    setError('');
    setSearched(true);
    setMovies([]);

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [
            {
              role: 'user',
              content: `Based on this preference: "${preference}", recommend exactly 5 movies. For each movie, provide the title, year, genre, a brief description (2-3 sentences), and a rating out of 10.

Format your response as JSON only, with no preamble or markdown:
[
  {
    "title": "Movie Title",
    "year": 2020,
    "genre": "Action, Thriller",
    "description": "Brief description here.",
    "rating": 8.5
  }
]`
            }
          ]
        })
      });

      const data = await response.json();
      const content = data.content.find(item => item.type === 'text')?.text || '';
      
      const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const movieList = JSON.parse(cleanContent);
      
      setMovies(movieList);
    } catch (err) {
      setError('Failed to get recommendations. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #020617 0%, #1e3a8a 50%, #0f172a 100%)',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    bgGlow1: {
      position: 'fixed',
      top: '25%',
      left: '25%',
      width: '384px',
      height: '384px',
      background: 'rgba(59, 130, 246, 0.2)',
      borderRadius: '50%',
      filter: 'blur(80px)',
      pointerEvents: 'none',
    },
    bgGlow2: {
      position: 'fixed',
      bottom: '25%',
      right: '25%',
      width: '384px',
      height: '384px',
      background: 'rgba(99, 102, 241, 0.2)',
      borderRadius: '50%',
      filter: 'blur(80px)',
      pointerEvents: 'none',
    },
    mainContent: {
      position: 'relative',
      zIndex: 10,
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '48px 16px',
    },
    header: {
      textAlign: 'center',
      marginBottom: '64px',
      paddingTop: '32px',
    },
    iconWrapper: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '96px',
      height: '96px',
      background: 'linear-gradient(135deg, #60a5fa, #6366f1)',
      borderRadius: '24px',
      marginBottom: '32px',
      boxShadow: '0 20px 50px rgba(59, 130, 246, 0.5)',
      position: 'relative',
    },
    title: {
      fontSize: '64px',
      fontWeight: 'bold',
      background: 'linear-gradient(90deg, #bfdbfe, #a5b4fc, #bfdbfe)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      marginBottom: '16px',
      letterSpacing: '-0.025em',
    },
    subtitle: {
      fontSize: '20px',
      color: 'rgba(191, 219, 254, 0.8)',
      maxWidth: '768px',
      margin: '0 auto',
      fontWeight: '300',
    },
    subtext: {
      fontSize: '16px',
      color: 'rgba(147, 197, 253, 0.6)',
      maxWidth: '672px',
      margin: '8px auto 0',
    },
    searchContainer: {
      maxWidth: '896px',
      margin: '0 auto 64px',
    },
    searchCard: {
      background: 'rgba(15, 23, 42, 0.8)',
      backdropFilter: 'blur(20px)',
      borderRadius: '24px',
      padding: '32px',
      border: '1px solid rgba(59, 130, 246, 0.2)',
      boxShadow: '0 0 40px rgba(59, 130, 246, 0.15)',
    },
    dropdownContainer: {
      display: 'flex',
      gap: '16px',
      marginBottom: '24px',
      flexWrap: 'wrap',
    },
    dropdownWrapper: {
      position: 'relative',
      flex: 1,
      minWidth: '200px',
    },
    dropdownButton: {
      width: '100%',
      padding: '14px 20px',
      background: 'rgba(30, 41, 59, 0.8)',
      border: '1px solid rgba(59, 130, 246, 0.3)',
      borderRadius: '12px',
      color: '#bfdbfe',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '12px',
      transition: 'all 0.3s',
    },
    dropdownButtonActive: {
      background: 'rgba(51, 65, 85, 0.8)',
      borderColor: 'rgba(96, 165, 250, 0.5)',
    },
    dropdownMenu: {
      position: 'absolute',
      top: '100%',
      left: 0,
      right: 0,
      marginTop: '8px',
      background: 'rgba(15, 23, 42, 0.95)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(59, 130, 246, 0.3)',
      borderRadius: '16px',
      padding: '8px',
      maxHeight: '320px',
      overflowY: 'auto',
      zIndex: 1000,
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
    },
    dropdownGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '6px',
    },
    dropdownItem: {
      padding: '12px 16px',
      background: 'rgba(30, 41, 59, 0.5)',
      border: '1px solid rgba(59, 130, 246, 0.2)',
      borderRadius: '8px',
      color: '#bfdbfe',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      textAlign: 'left',
    },
    dropdownItemActive: {
      background: 'linear-gradient(90deg, rgba(59, 130, 246, 0.3), rgba(99, 102, 241, 0.3))',
      borderColor: 'rgba(96, 165, 250, 0.6)',
      color: '#dbeafe',
    },
    textarea: {
      width: '100%',
      padding: '16px 24px',
      background: 'rgba(30, 41, 59, 0.5)',
      border: '1px solid rgba(59, 130, 246, 0.3)',
      borderRadius: '16px',
      color: '#eff6ff',
      fontSize: '16px',
      fontFamily: 'inherit',
      resize: 'none',
      outline: 'none',
      transition: 'all 0.3s',
    },
    buttonContainer: {
      marginTop: '24px',
      display: 'flex',
      flexWrap: 'wrap',
      gap: '12px',
      justifyContent: 'center',
    },
    primaryButton: {
      padding: '16px 32px',
      background: 'linear-gradient(90deg, #3b82f6, #6366f1)',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      fontWeight: '600',
      fontSize: '16px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      transition: 'all 0.3s',
      boxShadow: '0 8px 24px rgba(59, 130, 246, 0.3)',
    },
    secondaryButton: {
      padding: '16px 24px',
      background: 'rgba(30, 41, 59, 0.5)',
      color: '#bfdbfe',
      border: '1px solid rgba(59, 130, 246, 0.2)',
      borderRadius: '12px',
      fontWeight: '600',
      fontSize: '16px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'all 0.3s',
    },
    errorBox: {
      marginTop: '16px',
      padding: '16px',
      background: 'rgba(239, 68, 68, 0.1)',
      border: '1px solid rgba(239, 68, 68, 0.3)',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    loadingContainer: {
      textAlign: 'center',
      padding: '64px 0',
    },
    spinner: {
      width: '64px',
      height: '64px',
      border: '4px solid rgba(59, 130, 246, 0.2)',
      borderTop: '4px solid #3b82f6',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      margin: '0 auto 16px',
    },
    movieCard: {
      background: 'rgba(15, 23, 42, 0.6)',
      backdropFilter: 'blur(20px)',
      borderRadius: '24px',
      padding: '32px',
      border: '1px solid rgba(59, 130, 246, 0.2)',
      marginBottom: '24px',
      transition: 'all 0.5s',
    },
    movieContent: {
      display: 'flex',
      gap: '32px',
      flexDirection: 'row',
    },
    posterBox: {
      width: '192px',
      height: '288px',
      background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.2), rgba(99, 102, 241, 0.2))',
      borderRadius: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '1px solid rgba(59, 130, 246, 0.3)',
      flexShrink: 0,
    },
    movieInfo: {
      flex: 1,
    },
    movieTitle: {
      fontSize: '32px',
      fontWeight: 'bold',
      background: 'linear-gradient(90deg, #dbeafe, #c7d2fe)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      marginBottom: '16px',
    },
    badge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '6px 12px',
      background: 'rgba(59, 130, 246, 0.1)',
      border: '1px solid rgba(59, 130, 246, 0.3)',
      borderRadius: '8px',
      color: '#93c5fd',
      fontSize: '14px',
      marginRight: '16px',
    },
    ratingBox: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      background: 'linear-gradient(90deg, rgba(234, 179, 8, 0.2), rgba(249, 115, 22, 0.2))',
      padding: '12px 20px',
      borderRadius: '12px',
      border: '1px solid rgba(234, 179, 8, 0.4)',
    },
    description: {
      color: 'rgba(239, 246, 255, 0.8)',
      lineHeight: '1.6',
      fontSize: '16px',
      marginTop: '16px',
    },
    featureCard: {
      background: 'rgba(15, 23, 42, 0.4)',
      backdropFilter: 'blur(20px)',
      borderRadius: '16px',
      padding: '32px',
      border: '1px solid rgba(59, 130, 246, 0.2)',
      textAlign: 'center',
    },
    featureIcon: {
      width: '56px',
      height: '56px',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '12px',
      marginBottom: '20px',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.bgGlow1}></div>
      <div style={styles.bgGlow2}></div>

      <div style={styles.mainContent}>
        <div style={styles.header}>
          <div style={styles.iconWrapper}>
            <Film size={48} color="white" />
          </div>
          <h1 style={styles.title}>CineAI</h1>
          <p style={styles.subtitle}>
            Transform your movie discovery with AI-powered intelligence.
          </p>
          <p style={styles.subtext}>
            Discover, analyze, and curate your perfect watchlist effortlessly.
          </p>
        </div>

        <div style={styles.searchContainer}>
          <div style={styles.searchCard}>
            {/* Dropdown Selectors */}
            <div style={styles.dropdownContainer}>
              {/* Genre Dropdown */}
              <div style={styles.dropdownWrapper}>
                <button
                  onClick={() => setShowGenreDropdown(!showGenreDropdown)}
                  style={{
                    ...styles.dropdownButton,
                    ...(showGenreDropdown ? styles.dropdownButtonActive : {})
                  }}
                  onMouseEnter={(e) => {
                    if (!showGenreDropdown) {
                      e.currentTarget.style.background = 'rgba(51, 65, 85, 0.8)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!showGenreDropdown) {
                      e.currentTarget.style.background = 'rgba(30, 41, 59, 0.8)';
                    }
                  }}
                >
                  <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                    <Film size={18} />
                    <span>
                      {selectedCategories.length > 0 
                        ? selectedCategories.length === 1 
                          ? selectedCategories[0]
                          : `${selectedCategories.length} Genres`
                        : 'Genre'}
                    </span>
                  </div>
                  <ChevronDown 
                    size={18} 
                    style={{
                      transform: showGenreDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s'
                    }}
                  />
                </button>

                {showGenreDropdown && (
                  <div style={styles.dropdownMenu}>
                    <div style={styles.dropdownGrid}>
                      {categories.map((category) => (
                        <button
                          key={category}
                          onClick={() => handleCategorySelect(category)}
                          style={{
                            ...styles.dropdownItem,
                            ...(selectedCategories.includes(category) ? styles.dropdownItemActive : {})
                          }}
                          onMouseEnter={(e) => {
                            if (!selectedCategories.includes(category)) {
                              e.target.style.background = 'rgba(51, 65, 85, 0.5)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!selectedCategories.includes(category)) {
                              e.target.style.background = 'rgba(30, 41, 59, 0.5)';
                            }
                          }}
                        >
                          <span>{category}</span>
                          {selectedCategories.includes(category) && <ChevronRight size={14} />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Year Dropdown */}
              <div style={styles.dropdownWrapper}>
                <button
                  onClick={() => setShowYearDropdown(!showYearDropdown)}
                  style={{
                    ...styles.dropdownButton,
                    ...(showYearDropdown ? styles.dropdownButtonActive : {})
                  }}
                  onMouseEnter={(e) => {
                    if (!showYearDropdown) {
                      e.currentTarget.style.background = 'rgba(51, 65, 85, 0.8)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!showYearDropdown) {
                      e.currentTarget.style.background = 'rgba(30, 41, 59, 0.8)';
                    }
                  }}
                >
                  <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                    <Calendar size={18} />
                    <span>
                      {selectedYears.length > 0 
                        ? selectedYears.length === 1 
                          ? selectedYears[0]
                          : `${selectedYears.length} Years`
                        : 'By Year'}
                    </span>
                  </div>
                  <ChevronDown 
                    size={18} 
                    style={{
                      transform: showYearDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s'
                    }}
                  />
                </button>

                {showYearDropdown && (
                  <div style={styles.dropdownMenu}>
                    <div style={styles.dropdownGrid}>
                      {yearRanges.map((year) => (
                        <button
                          key={year}
                          onClick={() => handleYearSelect(year)}
                          style={{
                            ...styles.dropdownItem,
                            ...(selectedYears.includes(year) ? styles.dropdownItemActive : {})
                          }}
                          onMouseEnter={(e) => {
                            if (!selectedYears.includes(year)) {
                              e.target.style.background = 'rgba(51, 65, 85, 0.5)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!selectedYears.includes(year)) {
                              e.target.style.background = 'rgba(30, 41, 59, 0.5)';
                            }
                          }}
                        >
                          <span>{year}</span>
                          {selectedYears.includes(year) && <ChevronRight size={14} />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Text Input */}
            <textarea
              value={preference}
              onChange={(e) => setPreference(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                  handleSubmit(e);
                }
              }}
              placeholder="Your selection will appear here, or type custom preferences... (e.g., 'mind-bending sci-fi with stellar visuals')"
              style={styles.textarea}
              rows="3"
              disabled={loading}
              onFocus={(e) => e.target.style.borderColor = 'rgba(96, 165, 250, 0.6)'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(59, 130, 246, 0.3)'}
            />
            
            <div style={styles.buttonContainer}>
              <button
                onClick={handleSubmit}
                disabled={loading}
                style={{...styles.primaryButton, opacity: loading ? 0.6 : 1}}
                onMouseEnter={(e) => !loading && (e.target.style.transform = 'translateY(-2px)')}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
              >
                {loading ? (
                  <>
                    <div style={{width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 1s linear infinite'}}></div>
                    <span>Discovering Movies...</span>
                  </>
                ) : (
                  <>
                    <Search size={20} />
                    <span>Get Recommendations</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  setPreference('');
                  setMovies([]);
                  setSearched(false);
                  setError('');
                  setSelectedCategories([]);
                  setSelectedYears([]);
                  setShowGenreDropdown(false);
                  setShowYearDropdown(false);
                }}
                style={styles.secondaryButton}
                onMouseEnter={(e) => e.target.style.background = 'rgba(51, 65, 85, 0.5)'}
                onMouseLeave={(e) => e.target.style.background = 'rgba(30, 41, 59, 0.5)'}
              >
                <Sparkles size={20} />
                <span>Clear</span>
              </button>

              <button
                onClick={() => setShowAnalytics(!showAnalytics)}
                style={{
                  ...styles.secondaryButton,
                  ...(showAnalytics ? {background: 'rgba(51, 65, 85, 0.5)', borderColor: 'rgba(96, 165, 250, 0.5)'} : {})
                }}
                onMouseEnter={(e) => e.target.style.background = 'rgba(51, 65, 85, 0.5)'}
                onMouseLeave={(e) => {
                  if (!showAnalytics) {
                    e.target.style.background = 'rgba(30, 41, 59, 0.5)';
                  }
                }}
              >
                <BarChart3 size={20} />
                <span>Analytics</span>
              </button>
            </div>

            {error && (
              <div style={styles.errorBox}>
                <div style={{width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%', animation: 'pulse 2s infinite'}}></div>
                <p style={{color: '#fca5a5', fontSize: '14px', margin: 0}}>{error}</p>
              </div>
            )}
          </div>
        </div>

        {loading && (
          <div style={styles.loadingContainer}>
            <div style={styles.spinner}></div>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#93c5fd'}}>
              <Sparkles size={20} />
              <span style={{fontSize: '18px', fontWeight: '500'}}>Curating your perfect watchlist...</span>
            </div>
          </div>
        )}

        {showAnalytics && movies.length > 0 && (
          <div style={{marginBottom: '48px'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px'}}>
              <BarChart3 size={28} color="#60a5fa" />
              <h2 style={{fontSize: '36px', fontWeight: 'bold', background: 'linear-gradient(90deg, #bfdbfe, #a5b4fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0}}>
                Analytics Dashboard
              </h2>
            </div>

            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '32px'}}>
              {/* Average Rating Card */}
              <div style={{
                background: 'rgba(15, 23, 42, 0.6)',
                backdropFilter: 'blur(20px)',
                borderRadius: '20px',
                padding: '28px',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  background: 'linear-gradient(135deg, #facc15, #f59e0b)',
                  borderRadius: '16px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px'
                }}>
                  <Star size={32} color="white" fill="white" />
                </div>
                <h3 style={{color: '#dbeafe', fontSize: '16px', fontWeight: '600', marginBottom: '8px'}}>Average Rating</h3>
                <p style={{color: '#facc15', fontSize: '40px', fontWeight: 'bold', margin: 0}}>
                  {(movies.reduce((acc, m) => acc + m.rating, 0) / movies.length).toFixed(1)}
                </p>
                <p style={{color: 'rgba(147, 197, 253, 0.6)', fontSize: '14px', marginTop: '8px'}}>out of 10</p>
              </div>

              {/* Total Movies Card */}
              <div style={{
                background: 'rgba(15, 23, 42, 0.6)',
                backdropFilter: 'blur(20px)',
                borderRadius: '20px',
                padding: '28px',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                  borderRadius: '16px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px'
                }}>
                  <Film size={32} color="white" />
                </div>
                <h3 style={{color: '#dbeafe', fontSize: '16px', fontWeight: '600', marginBottom: '8px'}}>Total Movies</h3>
                <p style={{color: '#60a5fa', fontSize: '40px', fontWeight: 'bold', margin: 0}}>
                  {movies.length}
                </p>
                <p style={{color: 'rgba(147, 197, 253, 0.6)', fontSize: '14px', marginTop: '8px'}}>recommended</p>
              </div>

              {/* Top Rated Card */}
              <div style={{
                background: 'rgba(15, 23, 42, 0.6)',
                backdropFilter: 'blur(20px)',
                borderRadius: '20px',
                padding: '28px',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  background: 'linear-gradient(135deg, #a855f7, #ec4899)',
                  borderRadius: '16px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px'
                }}>
                  <TrendingUp size={32} color="white" />
                </div>
                <h3 style={{color: '#dbeafe', fontSize: '16px', fontWeight: '600', marginBottom: '8px'}}>Top Rated</h3>
                <p style={{color: '#c084fc', fontSize: '40px', fontWeight: 'bold', margin: 0}}>
                  {Math.max(...movies.map(m => m.rating)).toFixed(1)}
                </p>
                <p style={{color: 'rgba(147, 197, 253, 0.6)', fontSize: '14px', marginTop: '8px'}}>highest score</p>
              </div>
            </div>

            {/* Genre Distribution */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.6)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '32px',
              border: '1px solid rgba(59, 130, 246, 0.2)'
            }}>
              <h3 style={{color: '#dbeafe', fontSize: '20px', fontWeight: '600', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px'}}>
                <Clock size={24} color="#60a5fa" />
                Genre Distribution
              </h3>
              <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                {(() => {
                  const genreCounts = {};
                  movies.forEach(movie => {
                    const genres = movie.genre.split(',').map(g => g.trim());
                    genres.forEach(genre => {
                      genreCounts[genre] = (genreCounts[genre] || 0) + 1;
                    });
                  });
                  return Object.entries(genreCounts).map(([genre, count]) => (
                    <div key={genre} style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
                      <span style={{color: '#93c5fd', fontSize: '14px', fontWeight: '500', minWidth: '120px'}}>{genre}</span>
                      <div style={{flex: 1, height: '12px', background: 'rgba(30, 41, 59, 0.5)', borderRadius: '6px', overflow: 'hidden'}}>
                        <div style={{
                          width: `${(count / movies.length) * 100}%`,
                          height: '100%',
                          background: 'linear-gradient(90deg, #3b82f6, #6366f1)',
                          borderRadius: '6px',
                          transition: 'width 0.6s ease'
                        }}></div>
                      </div>
                      <span style={{color: '#60a5fa', fontSize: '14px', fontWeight: '600', minWidth: '40px', textAlign: 'right'}}>{count}</span>
                    </div>
                  ));
                })()}
              </div>
            </div>

            {/* Year Distribution */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.6)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '32px',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              marginTop: '24px'
            }}>
              <h3 style={{color: '#dbeafe', fontSize: '20px', fontWeight: '600', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px'}}>
                <Calendar size={24} color="#60a5fa" />
                Release Years
              </h3>
              <div style={{display: 'flex', gap: '16px', flexWrap: 'wrap'}}>
                {movies.map((movie, idx) => (
                  <div key={idx} style={{
                    padding: '12px 20px',
                    background: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <Calendar size={16} color="#93c5fd" />
                    <span style={{color: '#93c5fd', fontSize: '14px', fontWeight: '500'}}>{movie.year}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {movies.length > 0 && (
          <div>
            <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px'}}>
              <TrendingUp size={28} color="#60a5fa" />
              <h2 style={{fontSize: '36px', fontWeight: 'bold', background: 'linear-gradient(90deg, #bfdbfe, #a5b4fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0}}>
                Curated For You
              </h2>
            </div>
            
            {movies.map((movie, index) => (
              <div
                key={index}
                style={{...styles.movieCard, animation: `fadeInUp 0.6s ease-out ${index * 0.15}s both`}}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.4)'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.2)'}
              >
                <div style={styles.movieContent}>
                  <div style={styles.posterBox}>
                    <Film size={64} color="rgba(96, 165, 250, 0.6)" />
                  </div>

                  <div style={styles.movieInfo}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px'}}>
                      <div style={{flex: 1}}>
                        <h3 style={styles.movieTitle}>{movie.title}</h3>
                        <div>
                          <span style={styles.badge}>
                            <Calendar size={16} />
                            {movie.year}
                          </span>
                          <span style={{...styles.badge, background: 'rgba(99, 102, 241, 0.1)', borderColor: 'rgba(99, 102, 241, 0.3)', color: '#c7d2fe'}}>
                            <Clock size={16} />
                            {movie.genre}
                          </span>
                        </div>
                      </div>
                      <div style={styles.ratingBox}>
                        <Star size={20} color="#facc15" fill="#facc15" />
                        <span style={{fontSize: '24px', fontWeight: 'bold', color: '#facc15'}}>{movie.rating}</span>
                      </div>
                    </div>
                    
                    <p style={styles.description}>{movie.description}</p>

                    <div style={{display: 'flex', gap: '12px', marginTop: '16px', flexWrap: 'wrap'}}>
                      <button style={{padding: '10px 20px', background: 'rgba(59, 130, 246, 0.2)', border: '1px solid rgba(59, 130, 246, 0.4)', color: '#93c5fd', borderRadius: '12px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'}}>
                        <Play size={16} />
                        Watch Trailer
                      </button>
                      <button style={{padding: '10px 20px', background: 'rgba(30, 41, 59, 0.4)', border: '1px solid rgba(59, 130, 246, 0.2)', color: '#60a5fa', borderRadius: '12px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'}}>
                        <BookmarkPlus size={16} />
                        Add to List
                      </button>
                      <button style={{padding: '10px 20px', background: 'rgba(30, 41, 59, 0.4)', border: '1px solid rgba(59, 130, 246, 0.2)', color: '#60a5fa', borderRadius: '12px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'}}>
                        <Share2 size={16} />
                        Share
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !searched && (
          <div style={{maxWidth: '1200px', margin: '0 auto'}}>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px'}}>
              {[
                { icon: Sparkles, title: 'AI-Powered Intelligence', desc: 'Advanced algorithms understand your taste', gradient: 'linear-gradient(135deg, #3b82f6, #06b6d4)' },
                { icon: Star, title: 'Personalized Curation', desc: 'Tailored recommendations just for you', gradient: 'linear-gradient(135deg, #6366f1, #a855f7)' },
                { icon: Film, title: 'Vast Movie Library', desc: 'Discover gems across all genres', gradient: 'linear-gradient(135deg, #a855f7, #ec4899)' }
              ].map((feature, i) => (
                <div key={i} style={{...styles.featureCard, animation: `fadeInUp 0.6s ease-out ${i * 0.1}s both`}}>
                  <div style={{...styles.featureIcon, background: feature.gradient}}>
                    <feature.icon size={28} color="white" />
                  </div>
                  <h3 style={{color: '#dbeafe', fontWeight: 'bold', fontSize: '18px', marginBottom: '8px'}}>{feature.title}</h3>
                  <p style={{color: 'rgba(147, 197, 253, 0.6)', fontSize: '14px', lineHeight: '1.5', margin: 0}}>{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        * {
          box-sizing: border-box;
        }
        
        body {
          margin: 0;
          padding: 0;
        }
        
        @media (max-width: 1024px) {
          .movieContent {
            flex-direction: column !important;
          }
        }

        /* Custom Scrollbar */
        *::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        *::-webkit-scrollbar-track {
          background: rgba(30, 41, 59, 0.3);
          border-radius: 4px;
        }
        
        *::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.5);
          border-radius: 4px;
        }
        
        *::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.7);
        }
      `}</style>
    </div>
  );
}

export default App;
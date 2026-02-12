import React, { useState } from 'react';
import './MetalWeightCalculator.css';

const MetalWeightCalculator = () => {
    // Comprehensive metal densities in kg/m³ with grades
    const metalDensities = {
        // Carbon & Alloy Steels
        'mild-steel': { name: 'Mild Steel (Low Carbon)', density: 7850, color: '#94a3b8', category: 'Steel' },
        'carbon-steel': { name: 'Carbon Steel (Medium)', density: 7850, color: '#8b9bb8', category: 'Steel' },
        'high-carbon-steel': { name: 'High Carbon Steel', density: 7840, color: '#7a8aa8', category: 'Steel' },
        'tool-steel': { name: 'Tool Steel', density: 7715, color: '#6a7a98', category: 'Steel' },

        // Stainless Steels
        'ss-304': { name: 'Stainless Steel 304', density: 8000, color: '#e2e8f0', category: 'Stainless' },
        'ss-316': { name: 'Stainless Steel 316', density: 8000, color: '#d2d8e0', category: 'Stainless' },
        'ss-410': { name: 'Stainless Steel 410', density: 7750, color: '#c2c8d0', category: 'Stainless' },
        'ss-430': { name: 'Stainless Steel 430', density: 7700, color: '#b2b8c0', category: 'Stainless' },

        // Aluminum Alloys
        'al-1100': { name: 'Aluminum 1100', density: 2710, color: '#e8eef5', category: 'Aluminum' },
        'al-2024': { name: 'Aluminum 2024', density: 2780, color: '#d8dee5', category: 'Aluminum' },
        'al-6061': { name: 'Aluminum 6061', density: 2700, color: '#c8ced5', category: 'Aluminum' },
        'al-7075': { name: 'Aluminum 7075', density: 2810, color: '#b8bec5', category: 'Aluminum' },

        // Copper Alloys
        'copper': { name: 'Pure Copper', density: 8960, color: '#f59e0b', category: 'Copper' },
        'brass-360': { name: 'Brass 360 (Free-cutting)', density: 8500, color: '#fbbf24', category: 'Brass' },
        'brass-464': { name: 'Brass 464 (Naval)', density: 8410, color: '#f5af14', category: 'Brass' },
        'bronze-932': { name: 'Bronze 932 (Bearing)', density: 8860, color: '#d97706', category: 'Bronze' },
        'phosphor-bronze': { name: 'Phosphor Bronze', density: 8800, color: '#c96706', category: 'Bronze' },

        // Other Metals
        'cast-iron': { name: 'Cast Iron (Gray)', density: 7200, color: '#64748b', category: 'Iron' },
        'ductile-iron': { name: 'Ductile Iron', density: 7100, color: '#54647b', category: 'Iron' },
        'nickel': { name: 'Nickel 200', density: 8890, color: '#94a3b8', category: 'Nickel' },
        'titanium-grade2': { name: 'Titanium Grade 2', density: 4510, color: '#9ca3af', category: 'Titanium' },
        'titanium-grade5': { name: 'Titanium Grade 5 (Ti-6Al-4V)', density: 4430, color: '#8c93a0', category: 'Titanium' },
        'zinc': { name: 'Zinc', density: 7140, color: '#a1a1aa', category: 'Zinc' },
        'lead': { name: 'Lead', density: 11340, color: '#71717a', category: 'Lead' },
        'magnesium': { name: 'Magnesium AZ31B', density: 1770, color: '#d1d5db', category: 'Magnesium' },
        'tungsten': { name: 'Tungsten', density: 19250, color: '#6b7280', category: 'Tungsten' }
    };

    const shapes = {
        round: { name: 'Round Bar', icon: '⬤', fields: ['diameter', 'length'] },
        square: { name: 'Square Bar', icon: '■', fields: ['side', 'length'] },
        rectangle: { name: 'Rectangle Bar', icon: '▬', fields: ['width', 'height', 'length'] },
        hexagon: { name: 'Hexagon Bar', icon: '⬡', fields: ['side', 'length'] },
        flat: { name: 'Flat Bar', icon: '▬', fields: ['width', 'thickness', 'length'] },
        sheet: { name: 'Sheet/Plate', icon: '▭', fields: ['length', 'width', 'thickness'] },
        tube: { name: 'Round Tube/Pipe', icon: '○', fields: ['diameter', 'thickness', 'length'] },
        squareTube: { name: 'Square Tube', icon: '□', fields: ['outerSide', 'thickness', 'length'] },
        rectangleTube: { name: 'Rectangular Tube', icon: '▭', fields: ['outerWidth', 'outerHeight', 'thickness', 'length'] },
        angle: { name: 'Angle/L-Section', icon: '⌊', fields: ['legWidth', 'legHeight', 'thickness', 'length'] },
        channel: { name: 'Channel/C-Section', icon: '⊐', fields: ['width', 'height', 'thickness', 'length'] },
        tbar: { name: 'T-Bar/T-Section', icon: '⊤', fields: ['flangeWidth', 'webHeight', 'thickness', 'length'] },
        ibeam: { name: 'I-Beam/H-Section', icon: '⫴', fields: ['flangeWidth', 'webHeight', 'thickness', 'length'] }
    };

    const [selectedMetal, setSelectedMetal] = useState('mild-steel');
    const [selectedShape, setSelectedShape] = useState('round');
    const [calculationMode, setCalculationMode] = useState('weight'); // 'weight' or 'length'
    const [metalCategory, setMetalCategory] = useState('all'); // Filter for metal categories
    const [dimensions, setDimensions] = useState({
        diameter: '',
        length: '',
        width: '',
        height: '',
        thickness: '',
        side: '',
        legWidth: '',
        legHeight: '',
        flangeWidth: '',
        webHeight: '',
        outerSide: '',
        outerWidth: '',
        outerHeight: ''
    });
    const [weight, setWeight] = useState('');
    const [result, setResult] = useState(null);
    const [unit, setUnit] = useState('mm'); // mm or cm or m
    const [tolerance, setTolerance] = useState(0); // Manufacturing tolerance percentage
    const [surfaceFinish, setSurfaceFinish] = useState('none'); // none, painted, galvanized, plated
    const [quantity, setQuantity] = useState(1); // Number of pieces
    const [pricePerKg, setPricePerKg] = useState(''); // Price per kg for cost calculation

    // Unit conversion factors to meters
    const unitFactors = {
        mm: 0.001,
        cm: 0.01,
        m: 1
    };

    // Surface finish thickness in mm
    const surfaceFinishThickness = {
        none: 0,
        painted: 0.05,      // ~50 microns
        galvanized: 0.08,   // ~80 microns
        plated: 0.025       // ~25 microns
    };

    // Get unique categories
    const categories = ['all', ...new Set(Object.values(metalDensities).map(m => m.category))];

    // Filter metals by category
    const filteredMetals = metalCategory === 'all'
        ? Object.entries(metalDensities)
        : Object.entries(metalDensities).filter(([_, metal]) => metal.category === metalCategory);

    // Calculate volume based on shape
    const calculateVolume = () => {
        const factor = unitFactors[unit];
        const dims = {};

        // Convert all dimensions to meters
        Object.keys(dimensions).forEach(key => {
            dims[key] = parseFloat(dimensions[key]) * factor || 0;
        });

        let volume = 0;

        switch (selectedShape) {
            case 'round':
                // V = π * r² * L
                volume = Math.PI * Math.pow(dims.diameter / 2, 2) * dims.length;
                break;
            case 'square':
                // V = s² * L
                volume = Math.pow(dims.side, 2) * dims.length;
                break;
            case 'rectangle':
                // V = W * H * L
                volume = dims.width * dims.height * dims.length;
                break;
            case 'hexagon':
                // V = (3√3 / 2) * s² * L
                volume = (3 * Math.sqrt(3) / 2) * Math.pow(dims.side, 2) * dims.length;
                break;
            case 'flat':
                // V = W * T * L (Flat bar)
                volume = dims.width * dims.thickness * dims.length;
                break;
            case 'sheet':
                // V = L * W * T
                volume = dims.length * dims.width * dims.thickness;
                break;
            case 'tube':
                // V = π × (R² - r²) × L (Round tube/pipe)
                // Inner diameter = Outer diameter - 2 × wall thickness
                const tubeOuterRadius = dims.diameter / 2;
                const tubeInnerDiameter = dims.diameter - (2 * dims.thickness);
                const tubeInnerRadius = tubeInnerDiameter / 2;
                volume = Math.PI * (Math.pow(tubeOuterRadius, 2) - Math.pow(tubeInnerRadius, 2)) * dims.length;
                break;
            case 'squareTube':
                // V = (outerSide² - innerSide²) * L
                const innerSide = dims.outerSide - (2 * dims.thickness);
                volume = (Math.pow(dims.outerSide, 2) - Math.pow(innerSide, 2)) * dims.length;
                break;
            case 'rectangleTube':
                // V = (outerWidth * outerHeight - innerWidth * innerHeight) * L
                const innerWidth = dims.outerWidth - (2 * dims.thickness);
                const innerHeight = dims.outerHeight - (2 * dims.thickness);
                volume = (dims.outerWidth * dims.outerHeight - innerWidth * innerHeight) * dims.length;
                break;
            case 'angle':
                // V = (legWidth * thickness + (legHeight - thickness) * thickness) * length
                // Industry standard L-section formula
                volume = (dims.legWidth * dims.thickness + (dims.legHeight - dims.thickness) * dims.thickness) * dims.length;
                break;
            case 'channel':
                // V = (width * thickness * 2 + (height - 2*thickness) * thickness) * length
                // C-shaped cross section
                volume = (dims.width * dims.thickness * 2 + (dims.height - 2 * dims.thickness) * dims.thickness) * dims.length;
                break;
            case 'tbar':
                // V = (flangeWidth * thickness + (webHeight - thickness) * thickness) * length
                // T-shaped cross section
                volume = (dims.flangeWidth * dims.thickness + (dims.webHeight - dims.thickness) * dims.thickness) * dims.length;
                break;
            case 'ibeam':
                // V = (flangeWidth * thickness * 2 + (webHeight - 2*thickness) * thickness) * length
                // I-shaped cross section (simplified)
                volume = (dims.flangeWidth * dims.thickness * 2 + (dims.webHeight - 2 * dims.thickness) * dims.thickness) * dims.length;
                break;
            default:
                volume = 0;
        }

        return volume; // in cubic meters
    };

    const calculateWeight = () => {
        const volume = calculateVolume();
        const density = metalDensities[selectedMetal].density;
        let calculatedWeight = volume * density; // in kg

        // Apply tolerance factor (positive tolerance increases weight)
        const toleranceFactor = 1 + (tolerance / 100);
        calculatedWeight = calculatedWeight * toleranceFactor;

        // Calculate surface finish weight if applicable
        let surfaceWeight = 0;
        if (surfaceFinish !== 'none') {
            const surfaceArea = calculateSurfaceArea();
            const finishThickness = surfaceFinishThickness[surfaceFinish] / 1000; // Convert mm to m
            // Approximate coating density (varies by type, using average)
            const coatingDensity = surfaceFinish === 'galvanized' ? 7140 : 1500; // Zinc or paint/plating
            surfaceWeight = surfaceArea * finishThickness * coatingDensity;
        }

        const totalWeight = calculatedWeight + surfaceWeight;
        const qty = parseInt(quantity) || 1;
        const totalWeightAllPieces = totalWeight * qty;

        // Calculate cost if price per kg is provided
        const price = parseFloat(pricePerKg) || 0;
        const totalCost = price > 0 ? totalWeightAllPieces * price : 0;

        setResult({
            weight: totalWeight.toFixed(3),
            baseWeight: calculatedWeight.toFixed(3),
            surfaceWeight: surfaceWeight.toFixed(3),
            volume: (volume * 1000000).toFixed(2), // Convert to cm³
            density: density,
            tolerance: tolerance,
            surfaceFinish: surfaceFinish,
            quantity: qty,
            totalWeight: totalWeightAllPieces.toFixed(3),
            pricePerKg: price,
            totalCost: totalCost > 0 ? totalCost.toFixed(2) : null
        });
    };

    // Calculate surface area for coating calculations
    const calculateSurfaceArea = () => {
        const factor = unitFactors[unit];
        const dims = {};

        Object.keys(dimensions).forEach(key => {
            dims[key] = parseFloat(dimensions[key]) * factor || 0;
        });

        let surfaceArea = 0;

        switch (selectedShape) {
            case 'round':
                // SA = 2πr² + 2πrL (cylinder)
                const r = dims.diameter / 2;
                surfaceArea = 2 * Math.PI * r * r + 2 * Math.PI * r * dims.length;
                break;
            case 'sheet':
                // SA = 2(LW + LT + WT)
                surfaceArea = 2 * (dims.length * dims.width + dims.length * dims.thickness + dims.width * dims.thickness);
                break;
            case 'tube':
                // SA = 2π(R+r)L + 2π(R²-r²)
                const tubeR = dims.diameter / 2;
                const tubeInnerD = dims.diameter - (2 * dims.thickness);
                const tuberi = tubeInnerD / 2;
                surfaceArea = 2 * Math.PI * (tubeR + tuberi) * dims.length + 2 * Math.PI * (tubeR * tubeR - tuberi * tuberi);
                break;
            case 'rectangle':
                // SA = 2(WH + WL + HL)
                surfaceArea = 2 * (dims.width * dims.height + dims.width * dims.length + dims.height * dims.length);
                break;
            case 'square':
                // SA = 2s² + 4sL
                surfaceArea = 2 * dims.side * dims.side + 4 * dims.side * dims.length;
                break;
            case 'hexagon':
                // SA = 2 * (3√3/2 * s²) + 6 * s * L
                surfaceArea = 2 * (3 * Math.sqrt(3) / 2 * dims.side * dims.side) + 6 * dims.side * dims.length;
                break;
            case 'angle':
            case 'channel':
            case 'ibeam':
                // Approximate surface area for complex shapes (perimeter * length + end areas)
                const perimeter = 2 * (dims.width || dims.legWidth || dims.flangeWidth) + 2 * (dims.height || dims.legHeight || dims.webHeight);
                const endArea = calculateVolume() / dims.length;
                surfaceArea = perimeter * dims.length + 2 * endArea;
                break;
            default:
                surfaceArea = 0;
        }

        return surfaceArea; // in square meters
    };

    const calculateLength = () => {
        const inputWeight = parseFloat(weight);
        if (!inputWeight || inputWeight <= 0) {
            alert('Please enter a valid weight');
            return;
        }

        const density = metalDensities[selectedMetal].density;
        const factor = unitFactors[unit];
        const dims = {};

        Object.keys(dimensions).forEach(key => {
            dims[key] = parseFloat(dimensions[key]) * factor || 0;
        });

        let calculatedLength = 0;
        let crossSectionalArea = 0;

        switch (selectedShape) {
            case 'round':
                crossSectionalArea = Math.PI * Math.pow(dims.diameter / 2, 2);
                break;
            case 'tube':
                const tubeOR = dims.diameter / 2;
                const tubeID = dims.diameter - (2 * dims.thickness);
                const tubeIR = tubeID / 2;
                crossSectionalArea = Math.PI * (Math.pow(tubeOR, 2) - Math.pow(tubeIR, 2));
                break;
            case 'rectangle':
                crossSectionalArea = dims.width * dims.height;
                break;
            case 'hexagon':
                crossSectionalArea = (3 * Math.sqrt(3) / 2) * Math.pow(dims.side, 2);
                break;
            case 'square':
                crossSectionalArea = Math.pow(dims.side, 2);
                break;
            default:
                alert('Length calculation not available for this shape');
                return;
        }

        if (crossSectionalArea > 0) {
            // Weight = Volume * Density = Area * Length * Density
            // Length = Weight / (Area * Density)
            calculatedLength = inputWeight / (crossSectionalArea * density);

            const qty = parseInt(quantity) || 1;
            const totalLength = calculatedLength * qty;

            // Calculate cost if price per kg is provided
            const price = parseFloat(pricePerKg) || 0;
            const totalCost = price > 0 ? inputWeight * qty * price : 0;

            setResult({
                length: (calculatedLength / factor).toFixed(3), // Convert back to selected unit
                crossSectionalArea: (crossSectionalArea * 1000000).toFixed(2), // Convert to cm²
                density: density,
                quantity: qty,
                totalLength: (totalLength / factor).toFixed(3),
                weightPerPiece: inputWeight.toFixed(3),
                totalWeight: (inputWeight * qty).toFixed(3),
                pricePerKg: price,
                totalCost: totalCost > 0 ? totalCost.toFixed(2) : null
            });
        }
    };

    const handleCalculate = () => {
        if (calculationMode === 'weight') {
            calculateWeight();
        } else {
            calculateLength();
        }
    };

    const handleReset = () => {
        setDimensions({
            diameter: '',
            length: '',
            width: '',
            height: '',
            thickness: '',
            side: '',
            legWidth: '',
            legHeight: '',
            flangeWidth: '',
            webHeight: '',
            outerSide: '',
            outerWidth: '',
            outerHeight: ''
        });
        setWeight('');
        setResult(null);
        setTolerance(0);
        setSurfaceFinish('none');
        setQuantity(1);
        setPricePerKg('');
    };

    const handleDimensionChange = (field, value) => {
        // Only allow positive numbers and decimals
        if (value === '' || /^\d*\.?\d*$/.test(value)) {
            setDimensions(prev => ({ ...prev, [field]: value }));
        }
    };

    const handleWeightChange = (value) => {
        if (value === '' || /^\d*\.?\d*$/.test(value)) {
            setWeight(value);
        }
    };

    return (
        <div className="metal-calculator-container">
            <div className="metal-calculator-card">
                <div className="calculator-header">
                    <div className="header-icon-wrapper">
                        <span className="header-icon">⚙️</span>
                    </div>
                    <div>
                        <h1 className="calculator-title">Metal Weight Calculator</h1>
                        <p className="calculator-subtitle">Calculate metal weight and dimensions with precision</p>
                    </div>
                </div>

                {/* Calculation Mode Toggle */}
                <div className="mode-toggle">
                    <button
                        className={`mode-btn ${calculationMode === 'weight' ? 'active' : ''}`}
                        onClick={() => {
                            setCalculationMode('weight');
                            setResult(null);
                        }}
                    >
                        <span className="mode-icon">⚖️</span>
                        Calculate Weight
                    </button>
                    <button
                        className={`mode-btn ${calculationMode === 'length' ? 'active' : ''}`}
                        onClick={() => {
                            setCalculationMode('length');
                            setResult(null);
                        }}
                    >
                        <span className="mode-icon">📏</span>
                        Calculate Length
                    </button>
                </div>


                {/* Shape Selection */}
                <div className="section">
                    <label className="section-label">Select Shape</label>
                    <div className="shape-grid">
                        {Object.entries(shapes).map(([key, shape]) => (
                            <button
                                key={key}
                                className={`shape-btn ${selectedShape === key ? 'active' : ''}`}
                                onClick={() => {
                                    setSelectedShape(key);
                                    setResult(null);
                                }}
                            >
                                <span className="shape-icon">{shape.icon}</span>
                                <span className="shape-name">{shape.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Metal Selection */}
                <div className="section">
                    <label className="section-label">Select Metal Type</label>

                    {/* Category Filter */}
                    <div className="category-filter">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                className={`category-btn ${metalCategory === cat ? 'active' : ''}`}
                                onClick={() => setMetalCategory(cat)}
                            >
                                {cat === 'all' ? 'All Metals' : cat}
                            </button>
                        ))}
                    </div>

                    <div className="metal-grid">
                        {filteredMetals.map(([key, metal]) => (
                            <button
                                key={key}
                                className={`metal-btn ${selectedMetal === key ? 'active' : ''}`}
                                onClick={() => setSelectedMetal(key)}
                                style={{
                                    '--metal-color': metal.color
                                }}
                            >
                                <span className="metal-name">{metal.name}</span>
                                <span className="metal-density">{(metal.density / 1000).toFixed(2)} g/cm³</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Unit Selection */}
                <div className="section">
                    <label className="section-label">Unit of Measurement</label>
                    <div className="unit-selector">
                        {['mm', 'cm', 'm'].map(u => (
                            <button
                                key={u}
                                className={`unit-btn ${unit === u ? 'active' : ''}`}
                                onClick={() => setUnit(u)}
                            >
                                {u}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Dimension Inputs */}
                <div className="section">
                    <label className="section-label">
                        {calculationMode === 'weight' ? 'Enter Dimensions' : 'Enter Dimensions (except length)'}
                    </label>
                    <div className="dimensions-grid">
                        {shapes[selectedShape].fields.map(field => {
                            // Skip length field in length calculation mode
                            if (calculationMode === 'length' && field === 'length') return null;

                            return (
                                <div key={field} className="input-group">
                                    <label className="input-label">
                                        {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} ({unit})
                                    </label>
                                    <input
                                        type="text"
                                        className="dimension-input"
                                        value={dimensions[field]}
                                        onChange={(e) => handleDimensionChange(field, e.target.value)}
                                        placeholder="0.00"
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Quantity & Pricing Section */}
                <div className="section">
                    <label className="section-label">
                        <span>📦 Quantity & Pricing</span>
                        <span className="section-subtitle">(Optional)</span>
                    </label>
                    <div className="dimensions-grid">
                        <div className="input-group">
                            <label className="input-label">Number of Pieces</label>
                            <input
                                type="number"
                                className="dimension-input"
                                value={quantity}
                                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                min="1"
                                step="1"
                            />
                        </div>
                        {calculationMode === 'weight' && (
                            <div className="input-group">
                                <label className="input-label">
                                    Price per Kg (₹)
                                </label>
                                <input
                                    type="text"
                                    className="dimension-input"
                                    value={pricePerKg}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (value === '' || /^\d*\.?\d*$/.test(value)) {
                                            setPricePerKg(value);
                                        }
                                    }}
                                    placeholder="0.00"
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Advanced Options - Tolerance & Surface Finish */}
                {calculationMode === 'weight' && (
                    <div className="section advanced-section">
                        <label className="section-label">
                            <span>⚙️ Advanced Options</span>
                            <span className="section-subtitle">(Optional - for more accurate results)</span>
                        </label>

                        <div className="advanced-grid">
                            {/* Tolerance */}
                            <div className="input-group">
                                <label className="input-label">
                                    Manufacturing Tolerance (%)
                                    <span className="input-hint">Typical: ±2-5%</span>
                                </label>
                                <div className="tolerance-input-wrapper">
                                    <input
                                        type="range"
                                        min="-5"
                                        max="5"
                                        step="0.5"
                                        value={tolerance}
                                        onChange={(e) => setTolerance(parseFloat(e.target.value))}
                                        className="tolerance-slider"
                                    />
                                    <input
                                        type="number"
                                        value={tolerance}
                                        onChange={(e) => setTolerance(parseFloat(e.target.value) || 0)}
                                        className="tolerance-number"
                                        step="0.5"
                                        min="-5"
                                        max="5"
                                    />
                                    <span className="tolerance-display">{tolerance > 0 ? '+' : ''}{tolerance}%</span>
                                </div>
                            </div>

                            {/* Surface Finish */}
                            <div className="input-group">
                                <label className="input-label">
                                    Surface Finish/Coating
                                    <span className="input-hint">Adds coating weight</span>
                                </label>
                                <div className="surface-finish-selector">
                                    {[
                                        { value: 'none', label: 'None', icon: '○' },
                                        { value: 'painted', label: 'Painted', icon: '🎨' },
                                        { value: 'galvanized', label: 'Galvanized', icon: '⚡' },
                                        { value: 'plated', label: 'Plated', icon: '✨' }
                                    ].map(finish => (
                                        <button
                                            key={finish.value}
                                            className={`finish-btn ${surfaceFinish === finish.value ? 'active' : ''}`}
                                            onClick={() => setSurfaceFinish(finish.value)}
                                        >
                                            <span className="finish-icon">{finish.icon}</span>
                                            <span className="finish-label">{finish.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Weight Input (for length calculation) */}
                {calculationMode === 'length' && (
                    <div className="section">
                        <label className="section-label">Enter Weight & Price</label>
                        <div className="dimensions-grid">
                            <div className="input-group">
                                <label className="input-label">Weight per Piece (kg)</label>
                                <input
                                    type="text"
                                    className="dimension-input"
                                    value={weight}
                                    onChange={(e) => handleWeightChange(e.target.value)}
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="input-group">
                                <label className="input-label">
                                    Price per Kg (₹)
                                </label>
                                <input
                                    type="text"
                                    className="dimension-input"
                                    value={pricePerKg}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (value === '' || /^\d*\.?\d*$/.test(value)) {
                                            setPricePerKg(value);
                                        }
                                    }}
                                    placeholder="0.00"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="action-buttons">
                    <button className="btn-calculate" onClick={handleCalculate}>
                        <span className="btn-icon">⚡</span>
                        Calculate
                    </button>
                    <button className="btn-reset" onClick={handleReset}>
                        <span className="btn-icon">🔄</span>
                        Reset
                    </button>
                </div>

                {/* Results */}
                {result && (
                    <div className="metal-results-section">
                        <h3 className="metal-results-title">📊 Calculation Results</h3>
                        <div className="metal-results-grid">
                            {calculationMode === 'weight' ? (
                                <>
                                    <div className="metal-result-card primary">
                                        <span className="metal-result-label">Total Weight</span>
                                        <span className="metal-result-value">{result.weight} kg</span>
                                        {parseFloat(result.surfaceWeight) > 0 && (
                                            <span className="metal-result-detail">
                                                Base: {result.baseWeight} kg + Coating: {result.surfaceWeight} kg
                                            </span>
                                        )}
                                    </div>
                                    <div className="metal-result-card">
                                        <span className="metal-result-label">Volume</span>
                                        <span className="metal-result-value">{result.volume} cm³</span>
                                        <span className="metal-result-detail">{(parseFloat(result.volume) / 1000000).toFixed(6)} m³</span>
                                    </div>
                                    <div className="metal-result-card">
                                        <span className="metal-result-label">Material Density</span>
                                        <span className="metal-result-value">{(result.density / 1000).toFixed(2)} g/cm³</span>
                                        <span className="metal-result-detail">{metalDensities[selectedMetal].name}</span>
                                    </div>
                                    {result.tolerance !== 0 && (
                                        <div className="metal-result-card info">
                                            <span className="metal-result-label">Tolerance Applied</span>
                                            <span className="metal-result-value">{result.tolerance > 0 ? '+' : ''}{result.tolerance}%</span>
                                            <span className="metal-result-detail">Manufacturing variance</span>
                                        </div>
                                    )}
                                    {result.surfaceFinish !== 'none' && (
                                        <div className="metal-result-card info">
                                            <span className="metal-result-label">Surface Finish</span>
                                            <span className="metal-result-value">
                                                {result.surfaceFinish.charAt(0).toUpperCase() + result.surfaceFinish.slice(1)}
                                            </span>
                                            <span className="metal-result-detail">+{result.surfaceWeight} kg coating</span>
                                        </div>
                                    )}
                                    <div className="metal-result-card">
                                        <span className="metal-result-label">Weight per Meter</span>
                                        <span className="metal-result-value">
                                            {(parseFloat(result.weight) / (parseFloat(dimensions.length) || 1)).toFixed(3)} kg/m
                                        </span>
                                        <span className="metal-result-detail">Linear weight</span>
                                    </div>
                                    {result.quantity > 1 && (
                                        <div className="metal-result-card success">
                                            <span className="metal-result-label">Total Weight ({result.quantity} pieces)</span>
                                            <span className="metal-result-value">{result.totalWeight} kg</span>
                                            <span className="metal-result-detail">{result.weight} kg × {result.quantity}</span>
                                        </div>
                                    )}
                                    {result.totalCost && (
                                        <div className="metal-result-card cost">
                                            <span className="metal-result-label">💰 Total Cost</span>
                                            <span className="metal-result-value">₹{result.totalCost}</span>
                                            <span className="metal-result-detail">
                                                {result.totalWeight} kg × ₹{result.pricePerKg}/kg
                                            </span>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <>
                                    <div className="metal-result-card primary">
                                        <span className="metal-result-label">Length per Piece</span>
                                        <span className="metal-result-value">{result.length} {unit}</span>
                                    </div>
                                    <div className="metal-result-card">
                                        <span className="metal-result-label">Cross-Sectional Area</span>
                                        <span className="metal-result-value">{result.crossSectionalArea} cm²</span>
                                    </div>
                                    <div className="metal-result-card">
                                        <span className="metal-result-label">Material Density</span>
                                        <span className="metal-result-value">{(result.density / 1000).toFixed(2)} g/cm³</span>
                                        <span className="metal-result-detail">{metalDensities[selectedMetal].name}</span>
                                    </div>
                                    {result.quantity > 1 && (
                                        <>
                                            <div className="metal-result-card success">
                                                <span className="metal-result-label">Total Length ({result.quantity} pieces)</span>
                                                <span className="metal-result-value">{result.totalLength} {unit}</span>
                                                <span className="metal-result-detail">{result.length} {unit} × {result.quantity}</span>
                                            </div>
                                            <div className="metal-result-card">
                                                <span className="metal-result-label">Total Weight</span>
                                                <span className="metal-result-value">{result.totalWeight} kg</span>
                                                <span className="metal-result-detail">{result.weightPerPiece} kg × {result.quantity}</span>
                                            </div>
                                        </>
                                    )}
                                    {result.totalCost && (
                                        <div className="metal-result-card cost">
                                            <span className="metal-result-label">💰 Total Cost</span>
                                            <span className="metal-result-value">₹{result.totalCost}</span>
                                            <span className="metal-result-detail">
                                                {result.totalWeight} kg × ₹{result.pricePerKg}/kg
                                            </span>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                        <div className="disclaimer">
                            <span className="disclaimer-icon">⚠️</span>
                            <span className="disclaimer-text">
                                <strong>Disclaimer:</strong> This calculator provides theoretical estimates based on standard material densities and geometric formulas.
                                Actual weights may vary by ±2-5% due to manufacturing tolerances, material composition variations, surface treatments,
                                and measurement precision. For critical applications, always verify with actual measurements or consult material specifications.
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MetalWeightCalculator;

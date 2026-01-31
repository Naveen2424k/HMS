import React from 'react';
import { Link } from 'react-router-dom';

// Big, Easy-to-read Card
export const SimpleCard = ({ children, className = '', title, icon: Icon }) => {
    return (
        <div className={`simple-card ${className}`}>
            {title && (
                <div className="flex items-center gap-3 mb-4 border-b-2 border-blue-50 pb-3">
                    {Icon && <div className="p-3 bg-blue-100 rounded-lg text-blue-700"><Icon size={32} /></div>}
                    <h3 className="text-2xl text-blue-900 m-0">{title}</h3>
                </div>
            )}
            <div>{children}</div>
        </div>
    );
};

// Big, Touch-friendly Button
export const SimpleButton = ({ children, onClick, variant = 'primary', className = '', to, disabled, icon: Icon }) => {
    const baseClasses = "simple-btn";
    const variantClasses = {
        primary: "btn-primary",
        secondary: "btn-secondary",
        danger: "btn-danger"
    };

    const content = (
        <>
            {Icon && <Icon size={24} />}
            <span>{children}</span>
        </>
    );

    if (to) {
        return (
            <Link to={to} className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
                {content}
            </Link>
        );
    }

    return (
        <button onClick={onClick} disabled={disabled} className={`${baseClasses} ${variantClasses[variant]} ${className} disabled:opacity-50 disabled:cursor-not-allowed`}>
            {content}
        </button>
    );
};

// Clear, Large Input Field
export const SimpleInput = ({ label, type = "text", placeholder, value, onChange, name, textarea }) => {
    return (
        <div className="mb-6">
            {label && <label className="block text-blue-900 font-bold mb-2 text-lg uppercase tracking-wide">{label}</label>}
            {textarea ? (
                <textarea
                    className="simple-input h-40 resize-none"
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    name={name}
                />
            ) : (
                <input
                    type={type}
                    className="simple-input"
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    name={name}
                />
            )}
        </div>
    );
};

// Standard Page Layout
export const SimplePage = ({ children, title, subtitle }) => {
    return (
        <div className="min-h-screen bg-blue-50 pb-20">
            <header className="bg-white shadow-md border-b-4 border-blue-600 py-6 mb-8">
                <div className="container mx-auto px-6 flex justify-between items-center">
                    <div>
                        <Link to="/" className="text-3xl font-black text-blue-900 hover:text-blue-700 flex items-center gap-2">
                            🏥 MediCare <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">Simple Mode</span>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-6">
                {(title || subtitle) && (
                    <div className="mb-10 text-center max-w-4xl mx-auto">
                        {title && <h1 className="text-5xl font-bold text-blue-900 mb-4">{title}</h1>}
                        {subtitle && <p className="text-2xl text-gray-600">{subtitle}</p>}
                    </div>
                )}
                {children}
            </main>
        </div>
    );
};

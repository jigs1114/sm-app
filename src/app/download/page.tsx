'use client';

import React, { useEffect, useState } from 'react'

const DownloadPage = () => {
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [errorMessage, setErrorMessage] = useState<string>('');

    useEffect(() => {
        const downloadScript = async () => {
            try {
                const response = await fetch('/api/download');
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`HTTP ${response.status}: ${errorText}`);
                }
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'meter.zip';
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
                setStatus('success');
            } catch (error) {
                console.error('Failed to download meter script:', error);
                const message = error instanceof Error ? error.message : String(error);
                setErrorMessage(message);
                setStatus('error');
            }
        };

        downloadScript();
    }, []);
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
                {status === 'loading' && (
                    <>
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">Downloading Meter Package...</h1>
                        <p className="text-gray-600">Your download should start automatically.</p>
                    </>
                )}
                
                {status === 'success' && (
                    <>
                        <div className="text-green-500 text-6xl mb-4">✓</div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">Download Complete!</h1>
                        <p className="text-gray-600">The meter package has been downloaded successfully.</p>
                        <p className="text-sm text-gray-500 mt-2">Extract the ZIP file to get the complete meter folder.</p>
                    </>
                )}
                
                {status === 'error' && (
                    <>
                        <div className="text-red-500 text-6xl mb-4">✕</div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">Download Failed</h1>
                        <p className="text-gray-600 mb-2">There was an error downloading the meter package:</p>
                        <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{errorMessage}</p>
                        <button 
                            onClick={() => window.location.reload()} 
                            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Try Again
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}

export default DownloadPage
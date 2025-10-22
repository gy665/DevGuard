import React, { useState } from 'react';
import { Github, Upload, Package, Play } from 'lucide-react';

// Import the API functions that will talk to your backend
import { scanRepositoryApi, scanFileApi, scanContainerApi } from '../api';

type ScanTab = 'repository' | 'upload' | 'container';

// --- Define the props our component will accept ---
interface ScanInputProps {
    onScanComplete: () => void;
}

const ScanInput: React.FC<ScanInputProps> = ({ onScanComplete }) => { // <-- Accept the prop
    const [activeTab, setActiveTab] = useState<ScanTab>('repository');

    // --- STATE TO HOLD VALUES FROM ALL INPUTS ---
    const [repoUrl, setRepoUrl] = useState('');
    const [containerImage, setContainerImage] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // --- STATE FOR UI FEEDBACK (LOADING, ERRORS, RESULTS) ---
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [results, setResults] = useState<any | null>(null);

    // --- HANDLER FOR THE FILE INPUT ---
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    // --- THE MAIN FUNCTION THAT RUNS WHEN THE BUTTON IS CLICKED ---
    const handleScan = async () => {
        console.log(`[ScanInput] 1. Scan initiated for tab: ${activeTab}`);
    setLoading(true);
    setError(null);
    setResults(null);

    try {
        let response;
        switch (activeTab) {
            case 'repository':
                if (!repoUrl) throw new Error('Repository URL cannot be empty.');
                response = await scanRepositoryApi(repoUrl);
                break;
            case 'upload':
                if (!selectedFile) throw new Error('You must select a package.json file to upload.');
                response = await scanFileApi(selectedFile);
                break;
            case 'container':
                if (!containerImage) throw new Error('Container image name cannot be empty.');
                response = await scanContainerApi(containerImage);
                break;
        }

        // --- THIS IS THE CORRECTED SUCCESS LOGIC ---
        // This block now runs for ALL successful scans.
        console.log(`✅ ${activeTab} scan successful! Calling onScanComplete.`);
        
        // 1. Set the results state to show the success message.
        setResults(response.data); 
        
        // 2. Call the function passed down from HomePage to trigger the refresh.
        onScanComplete(); 
        // ----------------------------------------------

    } catch (err: any) {
        console.error(`❌ ${activeTab} scan failed:`, err);
         // LOG 3: This will run if the API call fails FOR ANY REASON
        console.error("[ScanInput] 3. ❌ API call failed! Full error object:", err);
        const errorMessage = err.response?.data?.details || err.response?.data?.error || 'An unknown error occurred during the scan.';
        setError(errorMessage);
    } finally {
        setLoading(false);
    }
};
    return (
        <div>
            {/* Your tab buttons are preserved exactly as they were */}
            <div className="flex gap-2 mb-4 border-b border-slate-700">
                <button
                    onClick={() => setActiveTab('repository')}
                    className={`flex items-center gap-2 px-4 py-3 font-medium transition-all ${activeTab === 'repository' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-400 hover:text-slate-300'}`}
                >
                    <Github className="w-4 h-4" />
                    Repository
                </button>
                <button
                    onClick={() => setActiveTab('upload')}
                    className={`flex items-center gap-2 px-4 py-3 font-medium transition-all ${activeTab === 'upload' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-400 hover:text-slate-300'}`}
                >
                    <Upload className="w-4 h-4" />
                    File Upload
                </button>
                <button
                    onClick={() => setActiveTab('container')}
                    className={`flex items-center gap-2 px-4 py-3 font-medium transition-all ${activeTab === 'container' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-400 hover:text-slate-300'}`}
                >
                    <Package className="w-4 h-4" />
                    Container Image
                </button>
            </div>

            <div className="flex gap-3">
                {activeTab === 'repository' && (
                    <input
                        type="text"
                        value={repoUrl}
                        onChange={(e) => setRepoUrl(e.target.value)}
                        placeholder="Enter public repository URL (e.g., https://github.com/user/repo.git)"
                        className="flex-1 px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        disabled={loading}
                    />
                )}
                {activeTab === 'upload' && (
                    <div className="flex-1 relative">
                        {/* Hidden file input */}
                        <input type="file" id="file-upload" className="hidden" onChange={handleFileChange} accept=".json" disabled={loading} />
                        {/* Styled label that triggers the file input */}
                        <label
                            htmlFor="file-upload"
                            className="flex-1 px-4 py-3 bg-slate-900 border-2 border-dashed border-slate-600 rounded-lg text-slate-400 flex items-center justify-center hover:border-blue-500 transition-all cursor-pointer"
                        >
                            <Upload className="w-5 h-5 mr-2" />
                            <span>{selectedFile ? selectedFile.name : 'Click to upload package.json'}</span>
                        </label>
                    </div>
                )}
                {activeTab === 'container' && (
                    <input
                        type="text"
                        value={containerImage}
                        onChange={(e) => setContainerImage(e.target.value)}
                        placeholder="Enter container image (e.g., nginx:latest)"
                        className="flex-1 px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        disabled={loading}
                    />
                )}
                {/* The button is now connected to the handleScan function and shows loading state */}
                <button
                    onClick={handleScan}
                    disabled={loading}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center gap-2 transition-all hover:shadow-lg hover:shadow-blue-500/50 disabled:bg-slate-500 disabled:cursor-not-allowed disabled:shadow-none"
                >
                    <Play className="w-4 h-4" />
                    {loading ? 'Scanning...' : 'Start Scan'}
                </button>
            </div>

            {/* --- NEW SECTION FOR DISPLAYING RESULTS AND ERRORS --- */}
            <div className="mt-4">
                {error && (
                    <div className="p-3 bg-red-900/50 text-red-300 border border-red-500/50 rounded-lg">
                        <strong>Scan Failed:</strong> {error}
                    </div>
                )}
                {results && (
                    <div className="p-3 bg-green-900/50 text-green-300 border border-green-500/50 rounded-lg">
                        <strong>Scan Complete:</strong> Found {results.vulnerabilities.length} vulnerabilities. Results are ready to be processed.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ScanInput;
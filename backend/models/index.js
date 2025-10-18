// backend/models/index.js - Temporary models for MVP
const ScanResult = {
    create: (data) => {
        console.log('Mock ScanResult.create called with:', data);
        // Return a mock promise that resolves with the data
        return Promise.resolve({
            id: Math.random().toString(36).substr(2, 9),
            ...data,
            createdAt: new Date().toISOString()
        });
    }
};

module.exports = {
    ScanResult
};
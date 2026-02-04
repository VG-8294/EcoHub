const API_GATEWAY_URL = import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:3000';

export const walletService = {
    /**
     * Get wallet balance for a user.
     * If wallet doesn't exist, it creates one.
     * @param {string|number} userId
     * @returns {Promise<{balance: number}>}
     */
    async getBalance(userId) {
        try {
            const response = await fetch(`${API_GATEWAY_URL}/wallet/${userId}`);

            if (response.status === 404) {
                // Wallet not found, create it
                console.log(`Wallet for user ${userId} not found, creating new wallet...`);
                return this.createWallet(userId);
            }

            if (!response.ok) {
                throw new Error('Failed to fetch wallet balance');
            }

            return await response.json();
        } catch (error) {
            console.error('Wallet service error:', error);
            throw error;
        }
    },

    /**
     * Create a new wallet for a user
     * @param {string|number} userId
     * @returns {Promise<{balance: number}>}
     */
    async createWallet(userId) {
        try {
            // The controller (after my edit) maps create to /create/{userId} 
            // But gateway routes /wallet -> root of service. So /wallet/create/{userId} matches /create/{userId} on service.
            const response = await fetch(`${API_GATEWAY_URL}/wallet/create/${userId}`, {
                method: 'POST'
            });

            if (!response.ok) {
                throw new Error('Failed to create wallet');
            }

            return await response.json();
        } catch (error) {
            console.error('Create wallet error:', error);
            throw error;
        }
    },

    async credit(userId, amount) {
        const response = await fetch(`${API_GATEWAY_URL}/wallet/${userId}/credit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount })
        });
        if (!response.ok) throw new Error('Credit failed');
        return response.json();
    },

    async debit(userId, amount) {
        const response = await fetch(`${API_GATEWAY_URL}/wallet/${userId}/debit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount })
        });
        if (!response.ok) throw new Error('Debit failed');
        return response.json();
    }
};

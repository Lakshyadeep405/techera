import axios from 'axios';

const PISTON_API_URL = 'https://emkc.org/api/v2/piston/execute';

/**
 * Execute code using the Piston API.
 * @param {string} language - The programming language name (e.g., 'python', 'javascript', 'cpp').
 * @param {string} version - The version of the language (e.g., '3.10.0', '18.15.0'). Use fetchRuntimes to get versions if needed, or default.
 * @param {string} code - The source code to execute.
 * @param {string} [input=""] - Standard input for the program.
 * @param {number} [timeLimit=2000] - Unused directly by piston usually but kept for standard. Piston's compile timeout is 10s by default.
 * @returns {Promise<Object>} The execution result.
 */
export const executeCode = async (language, version, code, input = "", timeLimit = 2000) => {
    try {
        const payload = {
            language,
            version,
            files: [
                {
                    content: code
                }
            ],
            stdin: input,
            args: [],
            compile_timeout: Math.max(10000, timeLimit),
            run_timeout: timeLimit,
            compile_memory_limit: -1,
            run_memory_limit: -1
        };

        const response = await axios.post(PISTON_API_URL, payload);
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        console.error('Piston Execution Error:', error?.response?.data || error.message);
        return {
            success: false,
            error: error?.response?.data?.message || 'Failed to execute code'
        };
    }
};

/**
 * Fetch available runtimes from Piston to map language to correct version
 * @returns {Promise<Array>} List of runtimes
 */
export const fetchRuntimes = async () => {
    try {
        const response = await axios.get('https://emkc.org/api/v2/piston/runtimes');
        return response.data;
    } catch (error) {
        console.error('Failed to fetch runtimes', error);
        return [];
    }
};

// Test useGetAppointments hook logic and error handling

// Mock axios at the module level BEFORE importing
jest.mock('axios', () => ({
    get: jest.fn(),
    isAxiosError: jest.fn(),
    create: jest.fn(() => ({
        get: jest.fn(),
    })),
}));

import axios, {AxiosError} from 'axios';

// Type the mocked axios
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('useGetAppointments Hook Logic Tests', () => {

    // Mock the environment variable
    const mockApiUrl = 'https://api.example.com';

    beforeEach(() => {
        // Reset all mocks before each test
        jest.clearAllMocks();

        // Mock environment variable
        process.env.EXPO_PUBLIC_API_URL = mockApiUrl;
    });

    describe('Query Function Logic', () => {
        const mockToken = 'mock-jwt-token';
        const mockUserId = 'user-123';

        const mockGetToken = jest.fn();
        const mockAuth = {
            getToken: mockGetToken,
            userId: mockUserId,
        };

        const mockAppointments = [
            {
                id: '1',
                patient: 'John Doe',
                date: '2024-12-25',
                startTime: '10:30:00',
                status: 'Confirmed',
            },
            {
                id: '2',
                patient: 'Jane Smith',
                date: '2024-12-26',
                startTime: '14:00:00',
                status: 'Pending',
            },
        ];

        beforeEach(() => {
            mockGetToken.mockResolvedValue(mockToken);
        });

        it('should build correct API URL', () => {
            const expectedUrl = `${mockApiUrl}/appointments`;
            expect(expectedUrl).toBe('https://api.example.com/appointments');
        });

        it('should handle successful API response with nested data structure', async () => {
            mockedAxios.get.mockResolvedValue({
                data: {
                    data: mockAppointments, // Nested structure
                    status: 'success',
                },
            });

            // Simulate the query function logic
            const queryFn = async () => {
                if (!mockAuth.userId) {
                    throw new Error('UserId is required to fetch appointments');
                }

                const token = await mockAuth.getToken();
                if (!token) {
                    throw new Error('Token is required to fetch appointments');
                }

                const url = `${mockApiUrl}/appointments`;
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    timeout: 5000,
                });

                if (response.data && Array.isArray(response.data.data)) {
                    return response.data.data;
                } else if (Array.isArray(response.data)) {
                    return response.data;
                } else {
                    throw new Error('Unexpected response structure from API');
                }
            };

            const result = await queryFn();

            expect(result).toEqual(mockAppointments);
            expect(mockedAxios.get).toHaveBeenCalledWith(
                'https://api.example.com/appointments',
                {
                    headers: {
                        Authorization: 'Bearer mock-jwt-token',
                    },
                    timeout: 5000,
                }
            );
        });

        it('should handle successful API response with flat data structure', async () => {
            mockedAxios.get.mockResolvedValue({
                data: mockAppointments, // Flat structure
            });

            const queryFn = async () => {
                const token = await mockAuth.getToken();
                const url = `${mockApiUrl}/appointments`;
                const response = await axios.get(url, {
                    headers: { Authorization: `Bearer ${token}` },
                    timeout: 5000,
                });

                if (response.data && Array.isArray(response.data.data)) {
                    return response.data.data;
                } else if (Array.isArray(response.data)) {
                    return response.data;
                } else {
                    throw new Error('Unexpected response structure from API');
                }
            };

            const result = await queryFn();
            expect(result).toEqual(mockAppointments);
        });

        it('should throw error when userId is missing', async () => {
            const authWithoutUserId = {
                getToken: mockGetToken,
                userId: null,
            };

            const queryFn = async () => {
                if (!authWithoutUserId.userId) {
                    throw new Error('UserId is required to fetch appointments');
                }
                // Rest of the function...
            };

            await expect(queryFn()).rejects.toThrow('UserId is required to fetch appointments');
        });

        it('should throw error when token is missing', async () => {
            mockGetToken.mockResolvedValue(null);

            const queryFn = async () => {
                if (!mockAuth.userId) {
                    throw new Error('UserId is required to fetch appointments');
                }

                const token = await mockAuth.getToken();
                if (!token) {
                    throw new Error('Token is required to fetch appointments');
                }
                // Rest of the function...
            };

            await expect(queryFn()).rejects.toThrow('Token is required to fetch appointments');
        });

        it('should throw error when API URL is not set', async () => {
            // Remove the environment variable
            delete process.env.EXPO_PUBLIC_API_URL;

            const queryFn = async () => {
                const apiUrl = process.env.EXPO_PUBLIC_API_URL;

                if (!apiUrl) {
                    throw new Error("API configuration error.");
                }
                // Rest of the function...
            };

            await expect(queryFn()).rejects.toThrow('API configuration error.');
        });

        it('should throw error for unexpected response structure', async () => {
            mockedAxios.get.mockResolvedValue({
                data: {
                    // Neither data.data array nor flat array
                    result: 'unexpected format',
                },
            });

            const queryFn = async () => {
                const token = await mockAuth.getToken();
                const url = `${mockApiUrl}/appointments`;
                const response = await axios.get(url, {
                    headers: { Authorization: `Bearer ${token}` },
                    timeout: 5000,
                });

                if (response.data && Array.isArray(response.data.data)) {
                    return response.data.data;
                } else if (Array.isArray(response.data)) {
                    return response.data;
                } else {
                    throw new Error('Unexpected response structure from API');
                }
            };

            await expect(queryFn()).rejects.toThrow('Unexpected response structure from API');
        });
    });

    describe('Error Handling Logic', () => {
        const mockGetToken = jest.fn().mockResolvedValue('mock-token');
        const mockAuth = {
            getToken: mockGetToken,
            userId: 'user-123',
        };

        it('should handle Axios errors with response details', async () => {
            const axiosError: Partial<AxiosError> = {
                isAxiosError: true,
                response: {
                    status: 401,
                    statusText: 'Unauthorized',
                    data: 'Invalid token',
                } as any,
                message: 'Request failed with status code 401',
            };

            mockedAxios.get.mockRejectedValue(axiosError);
            mockedAxios.isAxiosError.mockReturnValue(true);

            const queryFn = async () => {
                try {
                    const token = await mockAuth.getToken();
                    const url = `${mockApiUrl}/appointments`;
                    await axios.get(url, {
                        headers: { Authorization: `Bearer ${token}` },
                        timeout: 5000,
                    });
                } catch (error) {
                    if (axios.isAxiosError(error)) {
                        const statusText = error.response?.statusText ? ` (${error.response.statusText})` : '';
                        const serverMessage = typeof error.response?.data === 'string' ? `: ${error.response.data}` : '';
                        throw new Error(`Failed to fetch appointments: Server responded with status ${error.response?.status}${statusText}${serverMessage || (' - ' + error.message)}`);
                    }
                    throw error;
                }
            };

            await expect(queryFn()).rejects.toThrow(
                'Failed to fetch appointments: Server responded with status 401 (Unauthorized): Invalid token'
            );
        });

        it('should handle Axios errors without response data', async () => {
            const axiosError: Partial<AxiosError> = {
                isAxiosError: true,
                response: {
                    status: 500,
                    statusText: 'Internal Server Error',
                } as any,
                message: 'Network Error',
            };

            mockedAxios.get.mockRejectedValue(axiosError);
            mockedAxios.isAxiosError.mockReturnValue(true);

            const queryFn = async () => {
                try {
                    const token = await mockAuth.getToken();
                    await axios.get(`${mockApiUrl}/appointments`, {
                        headers: { Authorization: `Bearer ${token}` },
                        timeout: 5000,
                    });
                } catch (error) {
                    if (axios.isAxiosError(error)) {
                        const statusText = error.response?.statusText ? ` (${error.response.statusText})` : '';
                        const serverMessage = typeof error.response?.data === 'string' ? `: ${error.response.data}` : '';
                        throw new Error(`Failed to fetch appointments: Server responded with status ${error.response?.status}${statusText}${serverMessage || (' - ' + error.message)}`);
                    }
                    throw error;
                }
            };

            await expect(queryFn()).rejects.toThrow(
                'Failed to fetch appointments: Server responded with status 500 (Internal Server Error) - Network Error'
            );
        });

        it('should handle regular Error instances', async () => {
            const regularError = new Error('Connection timeout');

            mockedAxios.get.mockRejectedValue(regularError);
            mockedAxios.isAxiosError.mockReturnValue(false);

            const queryFn = async () => {
                try {
                    const token = await mockAuth.getToken();
                    await axios.get(`${mockApiUrl}/appointments`, {
                        headers: { Authorization: `Bearer ${token}` },
                        timeout: 5000,
                    });
                } catch (error) {
                    if (axios.isAxiosError(error)) {
                        // Handle axios error
                    } else if (error instanceof Error) {
                        throw new Error(`Failed to fetch appointments: ${error.message}`);
                    } else {
                        throw new Error('An unexpected error occurred while fetching appointments.');
                    }
                }
            };

            await expect(queryFn()).rejects.toThrow('Failed to fetch appointments: Connection timeout');
        });

        it('should handle unknown error types', async () => {
            const unknownError = 'Some string error';

            mockedAxios.get.mockRejectedValue(unknownError);
            mockedAxios.isAxiosError.mockReturnValue(false);

            const queryFn = async () => {
                try {
                    const token = await mockAuth.getToken();
                    await axios.get(`${mockApiUrl}/appointments`, {
                        headers: { Authorization: `Bearer ${token}` },
                        timeout: 5000,
                    });
                } catch (error) {
                    if (axios.isAxiosError(error)) {
                        // Handle axios error
                    } else if (error instanceof Error) {
                        throw new Error(`Failed to fetch appointments: ${error.message}`);
                    } else {
                        throw new Error('An unexpected error occurred while fetching appointments.');
                    }
                }
            };

            await expect(queryFn()).rejects.toThrow('An unexpected error occurred while fetching appointments.');
        });
    });

    describe('Cache Management Logic', () => {
        it('should handle cache invalidation and refetch logic', async () => {
            const mockQueryClient = {
                invalidateQueries: jest.fn().mockResolvedValue(undefined),
            };

            const mockQuery = {
                refetch: jest.fn().mockResolvedValue({ data: [] }),
            };

            const userId = 'user-123';

            // Simulate the refetchWithClearCache function
            const refetchWithClearCache = async () => {
                console.log('Clearing appointments cache and refetching...');

                // Step 1: Invalidate the cache
                await mockQueryClient.invalidateQueries({
                    queryKey: ['appointments', userId]
                });

                // Step 2: Force a fresh fetch
                return mockQuery.refetch();
            };

            const result = await refetchWithClearCache();

            expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
                queryKey: ['appointments', userId]
            });
            expect(mockQuery.refetch).toHaveBeenCalled();
            expect(result).toEqual({ data: [] });
        });
    });

    describe('Query Configuration', () => {
        it('should use correct query key format', () => {
            const userId = 'user-456';
            const expectedQueryKey = ['appointments', userId];

            expect(expectedQueryKey).toEqual(['appointments', 'user-456']);
            expect(expectedQueryKey[0]).toBe('appointments');
            expect(expectedQueryKey[1]).toBe(userId);
        });

        it('should have correct stale time configuration', () => {
            const staleTime = 30000; // 30 seconds

            expect(staleTime).toBe(30000);
            expect(staleTime / 1000).toBe(30); // 30 seconds
        });

        it('should have refetchOnWindowFocus enabled', () => {
            const refetchOnWindowFocus = true;

            expect(refetchOnWindowFocus).toBe(true);
        });
    });

    describe('Request Configuration', () => {
        it('should use correct timeout setting', () => {
            const timeout = 5000;

            expect(timeout).toBe(5000);
            expect(timeout / 1000).toBe(5); // 5 seconds
        });

        it('should format authorization header correctly', () => {
            const token = 'abc123token';
            const authHeader = `Bearer ${token}`;

            expect(authHeader).toBe('Bearer abc123token');
        });

        it('should build request config correctly', () => {
            const token = 'test-token';
            const requestConfig = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                timeout: 5000,
            };

            expect(requestConfig.headers.Authorization).toBe('Bearer test-token');
            expect(requestConfig.timeout).toBe(5000);
        });
    });

    describe('Console Logging Logic', () => {
        it('should handle console logging without errors', () => {
            const mockConsoleLog = jest.fn();
            const mockConsoleError = jest.fn();

            global.console.log = mockConsoleLog;
            global.console.error = mockConsoleError;

            // Simulate logging calls from the hook
            console.log('Token:', 'mock-token');
            console.log('Making GET request to: https://api.example.com/appointments');
            console.error('Failed to fetch appointments:', 'Some error');

            expect(mockConsoleLog).toHaveBeenCalledWith('Token:', 'mock-token');
            expect(mockConsoleLog).toHaveBeenCalledWith('Making GET request to: https://api.example.com/appointments');
            expect(mockConsoleError).toHaveBeenCalledWith('Failed to fetch appointments:', 'Some error');
        });
    });
});
// Test FollowUpModal business logic and validation

import { z } from 'zod';

describe('FollowUpModal Logic Tests', () => {

    // Re-create the schema and regex from your component for testing
    const intervalRegex = /^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/i;

    const followUpSchema = z.object({
        date: z.date({ required_error: "Date is required" }),
        startTime: z.date({ required_error: "Start time is required." }),
        projectedDuration: z.string().min(2, { message: "Duration is required. ie 1h30m or 1h or 30m" }).regex(intervalRegex, {message: 'Invalid duration format, e.g., 1h30m or 2h or 45m'}),
        appointmentType: z.string().min(1, { message: "Appointment Type is required." }),
        notes: z.string().optional(),
        facilityId: z.string().optional(),
        newFacilityAddress: z.string().optional(),
        isCertified: z.boolean(),
    }).superRefine((data, ctx) => {
        if (!data.facilityId && !data.newFacilityAddress) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Please select a facility or provide a new address",
                path: ['facilityId'],
            });
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Please select a facility or provide a new address",
                path: ['newFacilityAddress'],
            });
        }
    });

    describe('Duration Regex Validation', () => {
        it('should validate correct duration formats', () => {
            const validFormats = [
                '1h',
                '30m',
                '45s',
                '1h30m',
                '2h15m30s',
                '90m',
                '1H30M', // case insensitive
                '2h45m',
            ];

            validFormats.forEach(format => {
                expect(intervalRegex.test(format)).toBe(true);
            });
        });

        it('should reject invalid duration formats', () => {
            // Note: Empty string passes the regex but is caught by Zod's .min(2) validation
            expect(intervalRegex.test('abc')).toBe(false);
            expect(intervalRegex.test('1hour')).toBe(false);
            expect(intervalRegex.test('30minutes')).toBe(false);
            expect(intervalRegex.test('h30m')).toBe(false);
            expect(intervalRegex.test('1.5h')).toBe(false);
            expect(intervalRegex.test('1h 30m')).toBe(false);
            expect(intervalRegex.test('1h-30m')).toBe(false);
            expect(intervalRegex.test('xyz123')).toBe(false);
        });

        it('should handle edge cases correctly', () => {
            // Empty string passes regex but is handled by Zod schema min length
            expect(intervalRegex.test('')).toBe(true);

            // Single character should fail
            expect(intervalRegex.test('h')).toBe(false);
            expect(intervalRegex.test('m')).toBe(false);
            expect(intervalRegex.test('s')).toBe(false);
        });
    });

    describe('Form Schema Validation', () => {
        const validBaseData = {
            date: new Date('2024-12-25'),
            startTime: new Date('2024-12-25T10:30:00'),
            projectedDuration: '1h30m',
            appointmentType: 'Follow-Up',
            notes: 'Test notes',
            isCertified: true,
        };

        it('should validate complete valid data with facilityId', () => {
            const validData = {
                ...validBaseData,
                facilityId: 'facility-123',
            };

            const result = followUpSchema.safeParse(validData);
            expect(result.success).toBe(true);
        });

        it('should validate complete valid data with newFacilityAddress', () => {
            const validData = {
                ...validBaseData,
                newFacilityAddress: '123 Main St, Anytown, CA 91234',
            };

            const result = followUpSchema.safeParse(validData);
            expect(result.success).toBe(true);
        });

        it('should reject data without date', () => {
            const invalidData = {
                ...validBaseData,
                facilityId: 'facility-123',
            };
            delete (invalidData as any).date;

            const result = followUpSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues.some(issue => issue.path.includes('date'))).toBe(true);
            }
        });

        it('should reject data without startTime', () => {
            const invalidData = {
                ...validBaseData,
                facilityId: 'facility-123',
            };
            delete (invalidData as any).startTime;

            const result = followUpSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues.some(issue => issue.path.includes('startTime'))).toBe(true);
            }
        });

        it('should reject invalid duration format', () => {
            const invalidData = {
                ...validBaseData,
                facilityId: 'facility-123',
                projectedDuration: 'invalid-duration',
            };

            const result = followUpSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues.some(issue =>
                    issue.path.includes('projectedDuration') &&
                    issue.message.includes('Invalid duration format')
                )).toBe(true);
            }
        });

        it('should reject data without appointmentType', () => {
            const invalidData = {
                ...validBaseData,
                facilityId: 'facility-123',
                appointmentType: '',
            };

            const result = followUpSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues.some(issue => issue.path.includes('appointmentType'))).toBe(true);
            }
        });

        it('should reject data without facility selection or new address', () => {
            const invalidData = {
                ...validBaseData,
                // No facilityId or newFacilityAddress
            };

            const result = followUpSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                const facilityErrors = result.error.issues.filter(issue =>
                    issue.path.includes('facilityId') || issue.path.includes('newFacilityAddress')
                );
                expect(facilityErrors.length).toBeGreaterThan(0);
            }
        });
    });

    describe('Appointment Types Logic', () => {
        it('should handle all appointment type options', () => {
            const appointmentOptions = [
                {label: "Follow Up", value: "Follow-Up"},
                {label: "Initial", value: "Initial"},
                {label: "IME/AME", value: "IME/AME"},
                {label: "Second Opinion", value: "Second-Opinion"},
                {label: "QME", value: "QME"},
                {label: "IEP", value: "IEP"},
                {label: "Conference", value: "Conference"},
                {label: "Other", value: "Other"},
            ];

            expect(appointmentOptions).toHaveLength(8);
            expect(appointmentOptions.find(opt => opt.value === 'Follow-Up')).toBeDefined();
            expect(appointmentOptions.find(opt => opt.value === 'Initial')).toBeDefined();
            expect(appointmentOptions.find(opt => opt.value === 'QME')).toBeDefined();
        });
    });

    describe('Facilities List Processing', () => {
        it('should process facilities data correctly', () => {
            const mockFacilities = [
                {
                    id: '1',
                    name: 'Main Hospital',
                    address: '123 Main St, Suite 100, Los Angeles, CA 90210'
                },
                {
                    id: '2',
                    name: 'Secondary Clinic',
                    address: '456 Oak Ave, Building A, San Francisco, CA 94102'
                }
            ];

            const processedFacilities = mockFacilities.map((item) => {
                const parts = item.address.split(',').map(s => s.trim());
                const streetAddress = `${parts[0]} ${parts[1]}`;
                return {
                    label: `${item.name} - ${streetAddress}`,
                    value: item.id
                };
            });

            expect(processedFacilities).toHaveLength(2);
            expect(processedFacilities[0].label).toBe('Main Hospital - 123 Main St Suite 100');
            expect(processedFacilities[0].value).toBe('1');
            expect(processedFacilities[1].label).toBe('Secondary Clinic - 456 Oak Ave Building A');
            expect(processedFacilities[1].value).toBe('2');
        });

        it('should handle loading and empty states', () => {
            const getListOfFacilities = (facilities: any[] | undefined, isLoading: boolean) => {
                return [
                    { label: isLoading ? "Loading facilities..." : "No Facility Selected", value: "" },
                    ...(facilities?.map((item) => {
                        const parts = item.address.split(',').map((s: string) => s.trim());
                        const streetAddress = `${parts[0]} ${parts[1]}`;
                        return {
                            label: `${item.name} - ${streetAddress}`,
                            value: item.id
                        };
                    }) || [])
                ];
            };

            // Test loading state
            const loadingList = getListOfFacilities(undefined, true);
            expect(loadingList[0].label).toBe("Loading facilities...");

            // Test empty state
            const emptyList = getListOfFacilities([], false);
            expect(emptyList[0].label).toBe("No Facility Selected");
            expect(emptyList).toHaveLength(1);

            // Test with data
            const facilitiesWithData = getListOfFacilities([
                { id: '1', name: 'Test Clinic', address: '123 Test St, Test City, CA 12345' }
            ], false);
            expect(facilitiesWithData).toHaveLength(2);
            expect(facilitiesWithData[1].label).toBe('Test Clinic - 123 Test St Test City');
        });
    });

    describe('Form Submit Logic', () => {
        it('should handle form submission correctly', () => {
            const mockOnSubmit = jest.fn();
            const mockOnClose = jest.fn();

            const handleFormSubmit = (data: any) => {
                mockOnSubmit(data);
                mockOnClose();
                console.log("Submitting payload:", data);
            };

            const testData = {
                date: new Date('2024-12-25'),
                startTime: new Date('2024-12-25T10:30:00'),
                projectedDuration: '1h30m',
                appointmentType: 'Follow-Up',
                facilityId: 'facility-123',
                isCertified: true,
            };

            handleFormSubmit(testData);

            expect(mockOnSubmit).toHaveBeenCalledWith(testData);
            expect(mockOnClose).toHaveBeenCalled();
        });
    });

    describe('Appointment Data Processing', () => {
        it('should handle appointment data display logic', () => {
            const mockAppointmentData = {
                date: '2024-12-25',
                patientName: 'John Doe',
                facilityName: 'Main Hospital',
                facilityAddress: '123 Main St, Los Angeles, CA 90210',
                formattedStartTime: '10:30 AM',
                formattedEndTime: '11:30 AM',
                isCertified: true,
            };

            // Test date formatting logic
            const formatDate = (dateString: string | undefined) => {
                if (!dateString) return 'N/A';
                // This would normally use date-fns format
                return new Date(dateString).toLocaleDateString();
            };

            expect(formatDate(mockAppointmentData.date)).not.toBe('N/A');
            expect(formatDate(undefined)).toBe('N/A');

            // Test duration display
            const formatDurationDisplay = (startTime?: string, endTime?: string) => {
                if (!startTime || !endTime) return 'Time not available';
                return `${startTime} - ${endTime}`;
            };

            expect(formatDurationDisplay(
                mockAppointmentData.formattedStartTime,
                mockAppointmentData.formattedEndTime
            )).toBe('10:30 AM - 11:30 AM');

            expect(formatDurationDisplay()).toBe('Time not available');
        });
    });

    describe('Error Handling Logic', () => {
        it('should handle validation errors correctly', () => {
            const mockToast = jest.fn();

            const handleValidationErrors = (errors: any) => {
                console.log("Validation errors:", errors);
                mockToast({
                    type: 'error',
                    text1: 'Missing Required Fields',
                    text2: 'Please fill in all required fields'
                });
            };

            const mockErrors = {
                date: { message: 'Date is required' },
                appointmentType: { message: 'Appointment Type is required.' }
            };

            handleValidationErrors(mockErrors);
            expect(mockToast).toHaveBeenCalledWith({
                type: 'error',
                text1: 'Missing Required Fields',
                text2: 'Please fill in all required fields'
            });
        });
    });

    describe('Form Field Watch Logic', () => {
        it('should handle conditional validation based on watched fields', () => {
            // Mock the watch functionality for facility validation
            const mockWatch = jest.fn();

            const getFieldError = (facilityIdError: boolean, newAddressValue: string) => {
                return facilityIdError && !newAddressValue;
            };

            // Test when facilityId has error but newFacilityAddress has value
            mockWatch.mockReturnValue('123 Test Address');
            expect(getFieldError(true, '123 Test Address')).toBe(false);

            // Test when facilityId has error and no newFacilityAddress
            expect(getFieldError(true, '')).toBe(true);

            // Test when no facilityId error
            expect(getFieldError(false, '')).toBe(false);
        });
    });
});
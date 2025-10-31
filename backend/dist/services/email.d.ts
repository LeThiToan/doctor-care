export declare const sendAppointmentConfirmationEmail: (patientEmail: string, patientName: string, doctorName: string, doctorTitle: string, specialty: string, appointmentDate: string, appointmentTime: string) => Promise<{
    success: boolean;
    messageId: string;
    error?: undefined;
} | {
    success: boolean;
    error: any;
    messageId?: undefined;
}>;
//# sourceMappingURL=email.d.ts.map
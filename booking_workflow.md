# Workflow Diagram: Appointment Booking (Full 5 Steps)

This is the standard 5-step process used in the MedBooking system, following professional IT workflow standards for presentation.

```plantuml
@startuml
skinparam backgroundColor white
skinparam activity {
  BackgroundColor #e3f2fd
  BorderColor #1565C0
  ArrowColor #1565C0
  FontSize 14
  FontName Arial
}
skinparam note {
  BackgroundColor #fff3e0
  BorderColor #ffb74d
}

title Standard 5-Step Appointment Booking Process

start

:1. Select Specialty;
note right
  Choose the medical field
  related to your symptoms
end note

:2. Select Doctor;
note right
  Choose a suitable doctor
  from the selected specialty
end note

:3. Select Date & Time;
note right
  Pick a preferred date
  and available time slot
end note

:4. Enter Patient Details;
note right
  Provide Name, Phone, Email
  and clinical symptoms
end note

:5. Review & Confirm;
note right
  Double-check all info
  and finalize the booking
end note

if (Booking Successful?) then (Yes)
  :Success Notification;
  note right: Data saved to DB & Confirmation sent
else (No)
  :Show Error Message;
endif

stop
@enduml
```

### The 5 Standard Steps:
1.  **Select Specialty:** Narrow down the search by medical field.
2.  **Select Doctor:** View profiles and choose a professional.
3.  **Select Time:** Interactive slot selection (Real-time check).
4.  **Enter Info:** Provide patient identity and health status.
5.  **Confirm:** The final validation before submission.

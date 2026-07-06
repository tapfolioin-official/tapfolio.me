# Google Play Data Safety Declaration Answers

Below are the exact values and choices to enter in the Google Play Console "Data Safety" form for the Tapfolio application.

---

## Data Collection and Security

### 1. Security Practices
*   **Is all of the user data collected by your app encrypted in transit?**
    *   **Yes.** (Enforced via Network Security Config using HTTPS).
*   **Do you provide a way for users to request that their data be deleted?**
    *   **Yes.** (We provide an in-app Delete Account screen and email request path).

---

## Data Types Collected & Shared

Here are the data types the application collects, stores, and transmits:

| Data Type | Collected | Shared | Purposed Use |
| :--- | :--- | :--- | :--- |
| **Personal Info - Name** | Yes | No | Account setup, profile creation, and professional networking presentation. |
| **Personal Info - Email Address** | Yes | No | Account verification, user login session, support communications. |
| **Personal Info - User IDs** | Yes | No | Unique identifier for database records and mapping connections. |
| **Personal Info - Phone Number** | Yes (Optional) | No | Optional profile card detail (visible if user enables visibility). |
| **Device or Other IDs** | Yes | No | Session authentication token mapping. |

---

## Detailed Data Questions (For Each Type)

### Personal Info: Name
*   **Is this data collected, shared, or both?**
    *   Collected.
*   **Is this data processed ephemerally?**
    *   No. (Saved in database).
*   **Is this data required for your app, or can users choose to discard it?**
    *   Required (mandatory to register/identify account).
*   **Why is this data collected?**
    *   App functionality (creating a digital business profile card).

### Personal Info: Email Address
*   **Is this data collected, shared, or both?**
    *   Collected.
*   **Is this data processed ephemerally?**
    *   No. (Saved in database).
*   **Is this data required for your app, or can users choose to discard it?**
    *   Required.
*   **Why is this data collected?**
    *   App functionality, Account management.

### Personal Info: Phone Number / WhatsApp
*   **Is this data collected, shared, or both?**
    *   Collected.
*   **Is this data processed ephemerally?**
    *   No. (Stored if user enters it).
*   **Is this data required for your app, or can users choose to discard it?**
    *   Optional (user can leave it blank).
*   **Why is this data collected?**
    *   App functionality (added to digital card).

---

## Account Deletion Link
When filling the Account Deletion section of the Data Safety form:
*   **URL to request deletion:** `https://tapfolio.me/privacy` (The Privacy Policy lists exact instructions for in-app deletion and support contact).

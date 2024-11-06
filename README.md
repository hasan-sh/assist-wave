# Assist-Wave: Voice-to-Action Healthcare Application

Assist-Wave is an innovative application designed to improve communication between patients and medical staff, specifically nurses and doctors. This application provides an intuitive and accessible way for patients to communicate their needs through a voice interface, enabling staff to respond quickly with relevant actions. 

## Features

### For Patients
- **Voice-Activated Assistance**: Patients can easily record and convey their needs or symptoms using the recording button. This functionality allows patients to express themselves without needing to type or write, which is especially helpful in urgent situations.
- **Immediate Response**: Once a recording is made, the app sends the audio for processing, simplifying the process to the patients.

### For Medical Staff
- **Concise Summary**: The staff dashboard displays a clear summary of the patient's primary needs, highlighting important details in bold to ensure staff quickly understand the patient's condition.
- **Recommended Actions**: Alongside the summary, the app provides a list of potential actions for the medical staff to consider. These recommendations help staff act promptly, prepared with a clear course of action.
- **Original Transcription**: The staff can view the original text transcription of the patient's words, giving them context and additional insight into the patient's condition.

## Technology Used

- **Frontend**: React, TypeScript, Material-UI
- **Backend**: Python (Flask), MongoDB, Groq API for transcription and response generation
- **Deployment**: Docker (for containerization, planned for future microservices architecture)
- **API Communication**: RESTful API endpoints to handle data exchange between frontend and backend

## Setup and Installation


### Prerequisites/Assumption
- Node.js and npm installed
- MongoDB
- Groq API key

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/hasan-sh/assist-wave.git
   cd assist-wave
    ```

2. Backend Setup:

    - Install dependencies:
        ```bash
        # Python 3.10.12
        pip install -r requirements.txt
        ```

    - Create a `.env` file in the backend directory with your Groq API key and other environment variables.

    - Start the backend server:
        ```bash
        python app.py
        ```

3. Frontend Setup:
    ```bash
    cd frontend
    npm install
    npm start
    ```

4. Database Setup:
    - Ensure MongoDB is installed and running locally or set up with a cloud MongoDB instance.

5. Check the Application:

    Access the application on http://localhost:3000.


### Future Ideas!!
- **Modular Design**: Assist-Wave is being developed with a vision of splitting functionalities into **microservices**. In the future, separate interfaces could be implemented for both patients and staff, allowing for more customized and specialized interactions.
- **Integration with Assistive Technology**: A potential next step is to integrate the Assist-Wave system with a **smart bracelet** or similar wearable device. This device could detect patient distress signals or automatically record audio based on specific triggers, making assistance even more accessible and immediate.

## Privacy and Security

Assist-Wave is committed to ensuring the privacy and security of all patient information. Patient data is handled with utmost care, and we are actively working to improve the privacy features within our platform. Future enhancements will focus on maintaining secure data handling, encryption, and privacy-preserving processing methods.

## License

This application is licensed under the [MIT License](LICENSE.md). Unauthorized use, reproduction, or distribution of this application, or any part of it, is strictly prohibited.

---

**Note**: This application is in continuous development. Future updates will bring further enhancements in terms of usability, security, and integration with assistive technology.

<div align="center">
  
![mathmate-logo](https://github.com/user-attachments/assets/1d5c4d5a-3ac0-4fd2-a2e0-a47054cb9809)

[Website] |  [Documentation] | [Getting Started]
</div>

This is the main source code repository for [mathmateAI]. It contains both the frontend React application and backend FastAPI server code .

[mathmateAI]: https://mathmate-ai.vercel.app/
[Getting Started]: #quick-start
[Documentation]: https://mathmate-docs.vercel.app/
[Website]:https://mathmate-ai.vercel.app/

## Why MathMate?

- **Accuracy:** Choose gemini-1.5-pro because it is optimized for Complex reasoning tasks requiring more intelligence. Which suits for this case since we need better accuaracy also complex reasoning for math problems.

- **Versatility:** Supports image recognition of equations,text input ,voice input . we are able to extract latex equations from image by using pixtotex open source python library 

- **Clear Output:** LaTeX rendering, dark mode support, and responsive design for seamless use across devices.

## Quick Start

1. Clone the repository
2. Follow the [Installation Guide](#installation)
3. Start developing with `npm run dev` for frontend and `uvicorn main:app --reload` for backend



### Prerequisites
- Node.js (v18+)
- Python (v3.8+)
- Google OAuth credentials
- Gemini API key

## Installation
### Frontend Setup

1. **Clone & Navigate**
   ```bash
   git clone https://github.com/sreehariX/mathmateAI.git
   cd mathmate/mathmate-frontend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the mathmate-frontend directory and add:
   ```env
   VITE_GOOGLE_CLIENT_ID=your_google_client_id
   VITE_API_URL=http://localhost:8000
   ```
   

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Access the Application**
   - Open your browser and visit: `http://localhost:5173`
   - You should see the MathMate AI interface running locally!






### Backend Setup

1. **Navigate to Backend Directory**
   ```bash
   cd mathmate/mathmate-backend
   ```

2. **Create & Activate Virtual Environment**
   ```bash
   # Windows
   python -m venv venv
   .\venv\Scripts\activate

   # macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure Environment Variables**
   Create a `.env` file in the backend root directory:
   ```env
   GOOGLE_CLIENT_ID=your_google_client_id
   GEMINI_API_KEY=your_gemini_api_key
   ```

5. **Start Development Server**
   ```bash
   uvicorn main:app --reload
   ```

6. **Verify Installation**
   - API will be running at: `http://localhost:8000`
   - Access API documentation: `http://localhost:8000/docs`
  


### Razorpay Integration 
- Integrated Razorpay to donate for me but right now it is only in test mode i.e you can send fake money not real money
- Because for razorpay i need business verification
- You can try to send dummy money i am happy to recieve fake money hahahaha


### 📚 In-Depth Documentation

For comprehensive documentation about the project architecture, hosting and APIs visit our Docusaurus documentation site:

🔗 [MathMate AI Documentation](https://mathmate-docs.vercel.app/)

The documentation includes:
- Detailed API references
- Deployment guides
- Contributing guidelines





from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from PIL import Image
from pix2tex.cli import LatexOCR
import io
import os
import google.generativeai as genai
from pydantic import BaseModel
from google.oauth2 import id_token
from google.auth.transport import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get Google Client ID from environment variable
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
print(f"Google Client ID: {GOOGLE_CLIENT_ID}")

# Configure API
app = FastAPI(
    title="Equation Solver API",
    description="Convert images of mathematical equations to LaTeX and solve them using Gemini"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize OCR model
latex_model = LatexOCR()

# Configure Gemini
gemini_api_key = os.getenv("GEMINI_API_KEY")
print(f"Gemini API Key: {gemini_api_key}")
genai.configure(api_key=gemini_api_key)

# Gemini model configuration
generation_config = {
    "temperature": 0.7,  # Slightly lower for more focused mathematical responses
    "top_p": 0.95,
    "top_k": 40,
    "max_output_tokens": 8192,
}

# Initialize Gemini model
gemini_model = genai.GenerativeModel(
    model_name="gemini-1.5-pro",
    generation_config=generation_config,
)

# System prompt for mathematical problem solving
SYSTEM_PROMPT = """
YOU ARE "MATHMATE AI," THE WORLD'S MOST PATIENT AND ACCURATE MATH TUTOR. YOUR TASK IS TO SOLVE MATH PROBLEMS WITH A STEP-BY-STEP EXPLANATION IN A WAY THAT IS BOTH EDUCATIONAL AND EASY TO UNDERSTAND. FORMAT THE RESPONSE IN CLEAN MARKDOWN THAT IS HIGHLY RENDERABLE IN A FRONTEND ENVIRONMENT USING REACT + VITE + TYPESCRIPT.

### NEW OBJECTIVES ###
1. **STEP-BY-STEP SOLUTIONS**: Provide logical and detailed step-by-step solutions for math problems, ensuring clarity in both calculations and explanations.
2. **HANDLE TEXT + LaTeX**: Process math problems written in plain text, LaTeX syntax, or any combination of the two. DO NOT classify valid input as "gibberish."
3. **VISUALLY APPEALING OUTPUT**: Use **Markdown formatting** with inline math (\$...\$) and block math (\`\`\`math ... \`\`\`) for clarity and enhanced readability.
4. **ERROR HANDLING**: If the problem contains invalid syntax, explain the issue in a friendly and helpful tone, and attempt to infer the intended question.

---

### GUIDELINES ###
1. **VALID INPUTS**: Assume all problems provided (including embedded LaTeX) are valid unless explicitly contradictory or nonsensical (e.g., \$2x = 3 +\$ incomplete syntax).
2. **DETECT AND PROCESS LATEX**:
   - Parse and solve expressions in text or LaTeX format (e.g., \$x + 5 = 10\$).
   - Treat text with LaTeX-like syntax as standard math input, not gibberish.
3. **STEP-BY-STEP EXPLANATIONS**:
   - Decompose the problem into clear logical steps, with reasoning for each step.
   - Provide clear explanations for both simple and complex equations.

---

### CHAIN OF THOUGHT PROCESS ###
1. **UNDERSTAND THE PROBLEM**:
   - Restate the problem clearly in your own words.
   - Identify the type of math problem (e.g., probability, algebra, calculus).

2. **DEFINE RELEVANT FORMULAS**:
   - State the formula or rule needed to solve the problem.
   - Use both plain text and LaTeX for clarity.

3. **SOLVE STEP BY STEP**:
   - Clearly break the problem into individual steps.
   - Provide calculations using block math for clarity.

4. **FINAL ANSWER**:
   - Highlight the final result using bold formatting.

5. **OPTIONAL LEARNING TIP**:
   - Offer additional insight into the concept to aid learning.

---

### OUTPUT FORMAT ###

# Problem Statement
[Restate the problem here.]

---

## Step-by-Step Solution

### Step 1: [Title of Step]
[Detailed explanation of this step.]
\`\`\`math
[Math calculation]
\`\`\`

### Step N: [Title of Step]
[Continue explaining and solving until the solution is complete.]

---

## Final Answer
**The final answer is:** \$...\$

---

### Optional Learning Tip
[Provide additional explanation, fun facts, or real-world applications.]

---

### ERROR HANDLING ###
1. **Valid Input Misinterpreted as Gibberish**:
   - DO NOT classify valid inputs with LaTeX, text, or mixed syntax as "gibberish."
   - Attempt to parse and solve the problem logically. Use friendly clarification questions only if truly ambiguous.
2. **Truly Invalid Input**:
   - Explain why the input is invalid.
   - Suggest corrections or clarifications to guide the user.

---

### OUTPUT FORMAT ###


"""

# Add this class for request validation
class TextEquationRequest(BaseModel):
    prompt: str

# Add this class with your existing models
class GoogleToken(BaseModel):
    id_token: str

@app.post("/solve-equation/")
async def solve_equation(
    file: UploadFile = File(...),
    prompt: str = Form(default=None)
):
    """
    Convert an image of an equation to LaTeX and solve it using Gemini
    """
    if not file.content_type.startswith('image/'):
        raise HTTPException(
            status_code=400,
            detail="Invalid file type. Please upload an image file."
        )
    
    try:
        # Read and process image
        image_content = await file.read()
        image = Image.open(io.BytesIO(image_content))
        
        # Convert to LaTeX
        latex_output = latex_model(image)
        
        # Create chat session with Gemini
        chat = gemini_model.start_chat(
            history=[
                {"role": "user", "parts": [SYSTEM_PROMPT]}
            ]
        )
        
        # Use user's prompt if provided, otherwise use a default message
        user_prompt = (
            f"{prompt}\nEquation: {latex_output}" if prompt 
            else f"Solve this equation: {latex_output}"
        )
        response = chat.send_message(user_prompt)
        
        return JSONResponse(content={
            "success": True,
            "equation": {
                "latex": latex_output,
                "original_filename": file.filename,
                "user_prompt": prompt
            },
            "solution": {
                "steps": response.text,
                "model": "gemini-1.5-pro"
            }
        })
            
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing request: {str(e)}"
        )

@app.post("/solve-text/")
async def solve_text_equation(request: TextEquationRequest):
    """
    Solve a mathematical equation or expression provided as text using Gemini
    """
    try:
        # Create chat session with Gemini
        chat = gemini_model.start_chat(
            history=[
                {"role": "user", "parts": [SYSTEM_PROMPT]}
            ]
        )
        
        # Send equation to Gemini
        response = chat.send_message(f"Solve this equation: {request.prompt}\nProvide a detailed step-by-step solution.")
        
        return JSONResponse(content={
            "success": True,
            "equation": {
                "text": request.prompt,
            },
            "solution": {
                "steps": response.text,
                "model": "gemini-1.5-pro"
            }
        })
            
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing request: {str(e)}"
        )

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "models_loaded": {
            "latex_ocr": latex_model is not None,
            "gemini": gemini_model is not None
        }
    }

# Add this new endpoint with your existing endpoints
@app.post("/auth/google")
async def google_auth(token: GoogleToken):
    try:
        # Print token for debugging
        print("Received token:", token.id_token[:20] + "...")  # Print first 20 chars for safety
        
        # Verify the token
        idinfo = id_token.verify_oauth2_token(
            token.id_token,
            requests.Request(),
            GOOGLE_CLIENT_ID,
            clock_skew_in_seconds=60  # Add some tolerance for time differences
        )
        
        # Verify issuer
        if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            raise ValueError('Invalid issuer')
            
        # Print verified info for debugging
        print("Verified user email:", idinfo.get('email'))
        
        return {
            "status": "success",
            "user": {
                "id": idinfo['sub'],
                "email": idinfo['email'],
                "name": idinfo.get('name'),
                "picture": idinfo.get('picture')
            }
        }
    except ValueError as e:
        print("Verification error:", str(e))  # Log the error
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        print("Unexpected error:", str(e))  # Log the error
        raise HTTPException(status_code=500, detail="Internal server error")
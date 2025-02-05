import sys
import json
import joblib
import numpy as np
import pandas as pd

# Load trained model and scaler
model = joblib.load("delivery_outcome_model_20250129_142727.pkl")
scaler = joblib.load("scaler_20250129_142727.pkl")

# Read input data from command line
try:
    input_data = json.loads(sys.argv[1])

    # Ensure correct feature order
    features = [
        float(input_data["Age"]),
        float(input_data["SystolicBP"]),
        float(input_data["DiastolicBP"]),
        float(input_data["BS"]),  
        float(input_data["HeartRate"])
    ]

    # Ensure the features are passed with the correct column names
    feature_columns = ["Age", "SystolicBP", "DiastolicBP", "BS", "HeartRate"]
    features_df = pd.DataFrame([features], columns=feature_columns)

    # Scale the input
    features_scaled = scaler.transform(features_df)


    # Predict risk level (0 = low risk, 1 = high risk)
    prediction = model.predict(features_scaled)[0]
    result = {"riskLevel": "High Risk" if prediction == 1 else "Low Risk"}

    print(json.dumps(result))

except Exception as e:
    print(json.dumps({"error": str(e)}))

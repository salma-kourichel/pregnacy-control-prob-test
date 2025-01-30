import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report
from sklearn.preprocessing import StandardScaler
import seaborn as sns
import matplotlib.pyplot as plt
import joblib
from datetime import datetime

# Step 1: Load the dataset
data = pd.read_csv('Maternal Health Risk Data Set.csv')

# Debug: Print initial dataset preview and info
print("Initial dataset preview:")
print(data.head(10))
print("\nDataset info:")
print(data.info())

# Check for missing values
print("\nMissing values in each column:")
print(data.isnull().sum())

# Drop rows with missing values
data = data.dropna()

# Debug: Print dataset after cleaning
print("\nDataset after cleaning:")
print(data.head(10))

# Validate column names
expected_columns = ['Age', 'SystolicBP', 'DiastolicBP', 'BS', 'HeartRate', 'RiskLevel']
missing_columns = [col for col in expected_columns if col not in data.columns]
if missing_columns:
    raise ValueError(f"Missing columns in dataset: {missing_columns}")

# Step 2: Prepare the data
# Define features and target
feature_columns = ['Age', 'SystolicBP', 'DiastolicBP', 'BS', 'HeartRate']
target_column = 'RiskLevel'

X = data[feature_columns]
y = data[target_column]

# Debug: Print unique values in target column
print("\nUnique values in 'RiskLevel' column before mapping:")
print(y.unique())

# Map 'RiskLevel' to binary values
risk_mapping = {'high risk': 1, 'mid risk': 1, 'low risk': 0}
y = y.map(risk_mapping)

# Debug: Check for unmapped or NaN values in target column
print("\nMapped 'RiskLevel' column:")
print(y.value_counts())

# Drop rows with unmapped values
valid_indices = y.notnull()
X = X[valid_indices]
y = y[valid_indices]

# Debug: Print dataset size after mapping
print(f"\nDataset size after mapping: {X.shape}, {y.shape}")

# Check if dataset is empty
if X.empty or y.empty:
    raise ValueError("Dataset is empty after preprocessing. Check the input data and mappings.")

# Standardize the feature values
scaler = StandardScaler()
X = scaler.fit_transform(X)

# Step 3: Split the data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Step 4: Hyperparameter tuning for Random Forest
param_grid = {
    'n_estimators': [50, 100, 200],
    'max_depth': [None, 10, 20, 30],
    'min_samples_split': [2, 5, 10],
    'min_samples_leaf': [1, 2, 4]
}

grid_search = GridSearchCV(
    RandomForestClassifier(random_state=42),
    param_grid,
    cv=5,
    scoring='accuracy',
    n_jobs=-1,
    verbose=1
)

grid_search.fit(X_train, y_train)
best_model = grid_search.best_estimator_

# Step 5: Evaluate the model
y_pred = best_model.predict(X_test)

# Accuracy score
accuracy = accuracy_score(y_test, y_pred)
print(f"\nModel Accuracy: {accuracy:.2f}")

# Confusion matrix
cm = confusion_matrix(y_test, y_pred)
print("\nConfusion Matrix:")
print(cm)

# Visualize the confusion matrix
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', xticklabels=['Low Risk', 'High Risk'], yticklabels=['Low Risk', 'High Risk'])
plt.xlabel('Predicted')
plt.ylabel('Actual')
plt.title('Confusion Matrix')
plt.show()

# Classification report
print("\nClassification Report:")
print(classification_report(y_test, y_pred))

# Feature importance
importances = best_model.feature_importances_
importance_df = pd.DataFrame({
    'Feature': feature_columns,
    'Importance': importances
}).sort_values(by='Importance', ascending=False)

print("\nFeature Importances:")
print(importance_df)

# Plot feature importances
sns.barplot(x='Importance', y='Feature', data=importance_df)
plt.title('Feature Importance')
plt.show()

# Step 6: Save the model for deployment
timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
joblib.dump(best_model, f'delivery_outcome_model_{timestamp}.pkl')
joblib.dump(scaler, f'scaler_{timestamp}.pkl')

print(f"\nModel and scaler saved successfully with timestamp: {timestamp}")

# Step 7: Predict on new data
new_patient = [[28, 120, 80, 6.5, 75]]  # Replace with actual input values
new_patient_scaled = scaler.transform(new_patient)
prediction = best_model.predict(new_patient_scaled)

if prediction[0] == 1:
    print("\nPrediction: High risk of miscarriage/death.")
else:
    print("\nPrediction: Normal delivery expected.")

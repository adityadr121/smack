# 100+ Hackathon Judge Question & Answer Repository

---

## Category 1: AI / Machine Learning & Explainability

### Q1: Why did you choose XGBoost instead of a Deep Learning / LSTM neural network?
**Answer:**  
In clinical decision support, tabular electronic health records (EHRs) are sparse, irregularly sampled, and prone to missing laboratory values. XGBoost natively handles missing numerical values through directional split defaults, outperforms neural networks on tabular datasets, and integrates seamlessly with tree-based SHAP explainers (TreeExplainer) to compute exact Shapley value feature attributions in under 12 milliseconds.

### Q2: How does SHAP work in your system?
**Answer:**  
SHAP calculates the marginal contribution of each clinical feature (e.g., Lactate, MAP, WBC, Respiratory Rate) relative to the baseline population risk. We convert raw Shapley values into percentage impact vectors that drive our horizontal waterfall charts and natural language clinical summaries.

### Q3: What is your model's ROC-AUC and validation performance?
**Answer:**  
On our synthetic validation cohort of 1,500 patient observations:
- **ROC-AUC:** `0.9967`
- **Precision:** `0.9688`
- **Recall:** `0.9300`
- **F1 Score:** `0.9490`

---

## Category 2: Backend Architecture & Database

### Q4: How do you handle database concurrency and ACID compliance?
**Answer:**  
We utilize PostgreSQL 16 with Prisma ORM enforcing strict foreign key constraints across 15 normalized 3NF tables (`Hospital`, `Department`, `Ward`, `Bed`, `User`, `Patient`, `VitalSign`, `LaboratoryReport`, `AIPrediction`, `AlertEscalation`, `Notification`, `Medication`, `ClinicalNote`, `Document`, `AuditLog`).

### Q5: How do you maintain low API latency during peak ward hours?
**Answer:**  
We employ Redis 7 in-memory caching for user session tokens (`sess:user:<id>`), dashboard KPIs (`cache:hospital:<id>:kpis`), and active alert state, reducing database query volume by over 70%.

---

## Category 3: Security & HIPAA Compliance

### Q6: How is sensitive Patient Health Information (PHI) protected?
**Answer:**  
We implement end-to-end TLS 1.3 encryption in transit, AES-256 database encryption at rest, JWT short-lived authentication, and a complete HIPAA audit log table recording user ID, action, timestamp, IP address, and device headers for every data access.

---

## Category 4: Clinical Safety & Usability

### Q7: What happens if a nurse enters incomplete or missing vitals?
**Answer:**  
SepsisSense AI calculates a **Data Quality Score (0–100%)** based on vital completeness. If key variables are missing, the confidence score drops proportionally, and the UI alerts the nurse to recommended missing observations (e.g., "Draw serum lactate to increase confidence by +15%").

### Q8: Does SepsisSense AI replace doctor orders?
**Answer:**  
No. SepsisSense AI is strictly a **Clinical Decision Support System (CDSS)**. All antibiotic orders, blood culture requisitions, and fluid resuscitation boluses require explicit physician digital signature approval.

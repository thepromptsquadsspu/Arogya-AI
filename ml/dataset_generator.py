import os
import json
import random
import pandas as pd
import numpy as np

# Set seed for reproducibility
random.seed(42)
np.random.seed(42)

DISEASES_DATA = [
    # EMERGENCY 🔴
    {
        "name": "Heart Attack (Myocardial Infarction)",
        "urgency": "Emergency",
        "urgency_level": "🔴 Emergency",
        "description": "A serious medical emergency where blood flow to the heart muscle is severely reduced or blocked.",
        "symptoms": ["chest_pain", "shortness_of_breath", "pain_radiating_to_left_arm", "cold_sweats", "nausea", "dizziness", "jaw_pain", "anxiety"],
        "primary_symptoms": ["chest_pain", "pain_radiating_to_left_arm", "shortness_of_breath"],
        "recommendation": "Call 911 or visit the nearest Emergency Room IMMEDIATELY. Do not attempt to drive yourself.",
        "explanation_template": "Symptoms strongly align with Myocardial Infarction due to acute chest discomfort radiating to upper body accompanied by breathlessness."
    },
    {
        "name": "Stroke (Cerebrovascular Accident)",
        "urgency": "Emergency",
        "urgency_level": "🔴 Emergency",
        "description": "Interruption of blood supply to the brain causing sudden neurological deficits.",
        "symptoms": ["facial_droop", "arm_weakness", "slurred_speech", "sudden_confusion", "vision_loss", "severe_sudden_headache", "loss_of_balance"],
        "primary_symptoms": ["facial_droop", "arm_weakness", "slurred_speech"],
        "recommendation": "Call 911 IMMEDIATELY. Remember FAST (Face, Arms, Speech, Time). Time is critical for clot-busting treatment.",
        "explanation_template": "Combination of acute neurological symptoms (facial droop, speech impairment, arm weakness) indicates possible ischemic stroke."
    },
    {
        "name": "Sepsis",
        "urgency": "Emergency",
        "urgency_level": "🔴 Emergency",
        "description": "Life-threatening organ dysfunction caused by a dysregulated host response to infection.",
        "symptoms": ["high_fever", "rapid_heart_rate", "confusion", "extreme_shivering", "shortness_of_breath", "mottled_skin", "low_blood_pressure", "severe_pain"],
        "primary_symptoms": ["high_fever", "rapid_heart_rate", "confusion", "extreme_shivering"],
        "recommendation": "Seek immediate emergency medical evaluation. Sepsis requires urgent IV antibiotics and hospital care.",
        "explanation_template": "Systemic inflammatory features including high fever, tachycardia, altered mental state, and rigors signal potential septic reaction."
    },
    {
        "name": "Severe Pneumonia",
        "urgency": "Emergency",
        "urgency_level": "🔴 Emergency",
        "description": "Severe lung infection causing inflammation in air sacs and compromised oxygenation.",
        "symptoms": ["high_fever", "productive_cough", "shortness_of_breath", "chest_pain_on_breathing", "bluish_lips", "confusion", "chills", "fatigue"],
        "primary_symptoms": ["high_fever", "shortness_of_breath", "productive_cough", "bluish_lips"],
        "recommendation": "Go to the Emergency Department immediately. Supplemental oxygen and intensive antimicrobial treatment may be needed.",
        "explanation_template": "Severe respiratory distress, productive cough with high fever and hypoxia symptoms match severe lower respiratory tract infection."
    },
    {
        "name": "Pulmonary Embolism",
        "urgency": "Emergency",
        "urgency_level": "🔴 Emergency",
        "description": "A blockage in one of the pulmonary arteries in your lungs, usually caused by blood clots from legs.",
        "symptoms": ["sudden_shortness_of_breath", "sharp_chest_pain", "coughing_up_blood", "rapid_heart_rate", "leg_swelling", "dizziness", "sweating"],
        "primary_symptoms": ["sudden_shortness_of_breath", "sharp_chest_pain", "coughing_up_blood"],
        "recommendation": "Call emergency services immediately. Pulmonary embolism requires prompt anticoagulation and monitoring.",
        "explanation_template": "Acute onset of sharp chest pain with hemoptysis and dyspnea strongly suggests pulmonary arterial thromboembolism."
    },
    {
        "name": "Acute Appendicitis",
        "urgency": "Emergency",
        "urgency_level": "🔴 Emergency",
        "description": "Acute inflammation of the appendix with high risk of rupture and peritonitis.",
        "symptoms": ["right_lower_quadrant_pain", "periumbilical_pain", "nausea", "vomiting", "low_grade_fever", "loss_of_appetite", "rebound_tenderness"],
        "primary_symptoms": ["right_lower_quadrant_pain", "nausea", "rebound_tenderness"],
        "recommendation": "Visit an emergency room for surgical evaluation. Do not take laxatives or apply heat pads.",
        "explanation_template": "Migration of abdominal pain to the right lower quadrant accompanied by fever and rebound tenderness is classic for appendicitis."
    },
    {
        "name": "Anaphylaxis",
        "urgency": "Emergency",
        "urgency_level": "🔴 Emergency",
        "description": "Severe, potentially life-threatening systemic allergic reaction.",
        "symptoms": ["difficulty_breathing", "swallowing_difficulty", "hives", "swollen_lips_tongue", "dizziness", "rapid_pulse", "nausea_vomiting"],
        "primary_symptoms": ["difficulty_breathing", "swollen_lips_tongue", "hives"],
        "recommendation": "Administer epinephrine autoinjector (EpiPen) immediately if available and call 911 right away.",
        "explanation_template": "Rapid onset multi-organ allergic response involving airway compromise and cutaneous symptoms matches anaphylaxis."
    },
    {
        "name": "Meningitis",
        "urgency": "Emergency",
        "urgency_level": "🔴 Emergency",
        "description": "Inflammation of the protective membranes covering the brain and spinal cord.",
        "symptoms": ["stiff_neck", "high_fever", "severe_headache", "sensitivity_to_light", "confusion", "purple_rash", "nausea_vomiting"],
        "primary_symptoms": ["stiff_neck", "high_fever", "sensitivity_to_light"],
        "recommendation": "Seek emergency medical care immediately. Bacterial meningitis can progress rapidly and requires urgent IV antibiotics.",
        "explanation_template": "Meningeal triad of fever, severe headache, and neck stiffness combined with photophobia points towards meningitis."
    },
    {
        "name": "Diabetic Ketoacidosis (DKA)",
        "urgency": "Emergency",
        "urgency_level": "🔴 Emergency",
        "description": "A serious metabolic complication of diabetes characterized by excessive ketones in the blood.",
        "symptoms": ["excessive_thirst", "frequent_urination", "fruity_breath", "high_blood_sugar", "confusion", "nausea_vomiting", "rapid_deep_breathing", "abdominal_pain"],
        "primary_symptoms": ["fruity_breath", "excessive_thirst", "rapid_deep_breathing"],
        "recommendation": "Go to the nearest emergency room immediately for fluid hydration and insulin therapy.",
        "explanation_template": "Kussmaul breathing, acetone breath odor, hyperosmolar symptoms, and abdominal pain are characteristic of diabetic ketoacidosis."
    },
    {
        "name": "Hypertensive Crisis",
        "urgency": "Emergency",
        "urgency_level": "🔴 Emergency",
        "description": "A severe increase in blood pressure that can lead to stroke or end-organ damage.",
        "symptoms": ["severe_headache", "chest_pain", "blurred_vision", "shortness_of_breath", "nosebleeds", "severe_anxiety", "confusion"],
        "primary_symptoms": ["severe_headache", "blurred_vision", "chest_pain"],
        "recommendation": "Seek immediate emergency medical attention to lower blood pressure safely.",
        "explanation_template": "Extreme blood pressure elevation symptoms including thunderclap headache, visual disturbances, and chest tightness require acute intervention."
    },

    # CONSULT GP 🟡
    {
        "name": "Influenza (Flu)",
        "urgency": "Consult GP",
        "urgency_level": "🟡 Consult GP",
        "description": "Contagious respiratory illness caused by influenza viruses.",
        "symptoms": ["high_fever", "chills", "body_aches", "fatigue", "dry_cough", "sore_throat", "headache", "nasal_congestion"],
        "primary_symptoms": ["high_fever", "body_aches", "dry_cough", "chills"],
        "recommendation": "Consult your General Practitioner (GP) within 24-48 hours. Rest, stay hydrated, and consider antiviral medication if advised.",
        "explanation_template": "Acute onset of high fever, widespread myalgia, fatigue, and non-productive cough strongly fits Influenza infection."
    },
    {
        "name": "COVID-19",
        "urgency": "Consult GP",
        "urgency_level": "🟡 Consult GP",
        "description": "Viral infection caused by SARS-CoV-2 targeting the respiratory system.",
        "symptoms": ["fever", "loss_of_taste_smell", "dry_cough", "fatigue", "shortness_of_breath", "sore_throat", "headache", "body_aches"],
        "primary_symptoms": ["loss_of_taste_smell", "fever", "dry_cough"],
        "recommendation": "Isolate, perform an antigen test, and consult a doctor if symptoms worsen or risk factors exist.",
        "explanation_template": "Anosmia/ageusia combined with fever and upper respiratory viral symptoms matches COVID-19 profile."
    },
    {
        "name": "Migraine",
        "urgency": "Consult GP",
        "urgency_level": "🟡 Consult GP",
        "description": "Neurological condition causing intense throbbing headache, often on one side.",
        "symptoms": ["throbbing_headache", "sensitivity_to_light", "sensitivity_to_sound", "nausea", "visual_aura", "dizziness"],
        "primary_symptoms": ["throbbing_headache", "sensitivity_to_light", "nausea"],
        "recommendation": "Consult a primary care doctor for targeted prescription triptans or preventive migraine therapy.",
        "explanation_template": "Unilateral pulsatile headache exacerbated by light/sound and accompanied by nausea aligns with migraine."
    },
    {
        "name": "Gastritis / Peptic Ulcer",
        "urgency": "Consult GP",
        "urgency_level": "🟡 Consult GP",
        "description": "Inflammation or erosion of the stomach lining causing upper abdominal discomfort.",
        "symptoms": ["burning_stomach_pain", "bloating", "nausea", "indigestion", "loss_of_appetite", "fullness_after_eating"],
        "primary_symptoms": ["burning_stomach_pain", "indigestion", "nausea"],
        "recommendation": "Schedule an appointment with a GP or gastroenterologist. Avoid spicy/fatty foods and NSAID painkillers.",
        "explanation_template": "Epigastric burning discomfort exacerbated or relieved by food indicates gastric mucosal irritation."
    },
    {
        "name": "Hypertension (Uncontrolled)",
        "urgency": "Consult GP",
        "urgency_level": "🟡 Consult GP",
        "description": "Chronically elevated blood pressure requiring clinical evaluation and blood pressure tracking.",
        "symptoms": ["morning_headache", "dizziness", "flushed_face", "tinnitus", "fatigue"],
        "primary_symptoms": ["morning_headache", "dizziness"],
        "recommendation": "Book a GP appointment to check blood pressure readings and adjust antihypertensive therapy.",
        "explanation_template": "Persistent morning occipital headaches with dizziness in the absence of acute emergency red flags suggest uncontrolled hypertension."
    },
    {
        "name": "Urinary Tract Infection (UTI)",
        "urgency": "Consult GP",
        "urgency_level": "🟡 Consult GP",
        "description": "Bacterial infection in any part of the urinary system, commonly bladder and urethra.",
        "symptoms": ["burning_urination", "frequent_urination", "cloudy_urine", "pelvic_pain", "strong_urine_odor", "low_grade_fever"],
        "primary_symptoms": ["burning_urination", "frequent_urination", "cloudy_urine"],
        "recommendation": "Consult a physician within 24 hours for urine analysis and targeted antibiotic treatment.",
        "explanation_template": "Dysuria, urinary frequency, and cloudy urine strongly correlate with lower urinary tract bacterial infection."
    },
    {
        "name": "Acute Bronchitis",
        "urgency": "Consult GP",
        "urgency_level": "🟡 Consult GP",
        "description": "Inflammation of the bronchial tubes leading to persistent cough and chest congestion.",
        "symptoms": ["productive_cough", "chest_tightness", "fatigue", "low_grade_fever", "wheezing", "sore_throat"],
        "primary_symptoms": ["productive_cough", "chest_tightness", "wheezing"],
        "recommendation": "Consult a doctor if cough lasts > 2 weeks or produces thick purulent sputum. Rest and use bronchodilators as advised.",
        "explanation_template": "Persistent cough producing mucus accompanied by bronchial wheezing points toward acute tracheobronchitis."
    },
    {
        "name": "Sinusitis",
        "urgency": "Consult GP",
        "urgency_level": "🟡 Consult GP",
        "description": "Inflammation of sinus cavities causing facial pressure and purulent nasal discharge.",
        "symptoms": ["facial_pressure", "nasal_congestion", "green_yellow_mucus", "post_nasal_drip", "headache", "fever", "toothache"],
        "primary_symptoms": ["facial_pressure", "nasal_congestion", "green_yellow_mucus"],
        "recommendation": "Consult a doctor if symptoms persist over 10 days or worsen after initial improvement.",
        "explanation_template": "Maxillary/frontal facial pressure with purulent nasal discharge fits acute paranasal sinusitis."
    },
    {
        "name": "Strep Throat (Tonsillitis)",
        "urgency": "Consult GP",
        "urgency_level": "🟡 Consult GP",
        "description": "Bacterial pharyngitis caused by Streptococcus pyogenes.",
        "symptoms": ["severe_sore_throat", "difficulty_swallowing", "swollen_tonsils_white_patches", "fever", "swollen_lymph_nodes", "headache"],
        "primary_symptoms": ["severe_sore_throat", "swollen_tonsils_white_patches", "difficulty_swallowing"],
        "recommendation": "Visit a doctor for a rapid strep swab test and prescription oral antibiotic regimen.",
        "explanation_template": "Exudative tonsillitis with tender cervical lymphadenopathy and absence of cough indicates bacterial streptococcal pharyngitis."
    },
    {
        "name": "Kidney Stones (Nephrolithiasis)",
        "urgency": "Consult GP",
        "urgency_level": "🟡 Consult GP",
        "description": "Hard mineral deposits formed inside kidneys passing through urinary tract.",
        "symptoms": ["severe_flank_pain", "pain_radiating_to_groin", "blood_in_urine", "nausea_vomiting", "painful_urination", "restlessness"],
        "primary_symptoms": ["severe_flank_pain", "pain_radiating_to_groin", "blood_in_urine"],
        "recommendation": "Consult a GP or urologist promptly for pain relief, ultrasound evaluation, and stone management.",
        "explanation_template": "Colicky flank pain radiating groinward accompanied by hematuria fits renal colic secondary to nephrolithiasis."
    },

    # SELF CARE 🟢
    {
        "name": "Common Cold",
        "urgency": "Self Care",
        "urgency_level": "🟢 Self Care",
        "description": "Mild viral upper respiratory infection resolving spontaneously.",
        "symptoms": ["runny_nose", "sneezing", "mild_sore_throat", "nasal_congestion", "mild_cough", "low_grade_fever", "mild_fatigue"],
        "primary_symptoms": ["runny_nose", "sneezing", "mild_sore_throat"],
        "recommendation": "Rest well, drink warm fluids, use saline nasal sprays, and monitor symptoms. Typically resolves in 7-10 days.",
        "explanation_template": "Mild upper respiratory symptoms (rhinorrhea, sneezing, scratchy throat) without high fever align with common cold."
    },
    {
        "name": "Seasonal Allergies (Allergic Rhinitis)",
        "urgency": "Self Care",
        "urgency_level": "🟢 Self Care",
        "description": "Allergic response to airborne environmental allergens like pollen, dust mites, or pet dander.",
        "symptoms": ["sneezing", "watery_itchy_eyes", "clear_runny_nose", "itchy_throat", "nasal_congestion"],
        "primary_symptoms": ["watery_itchy_eyes", "sneezing", "clear_runny_nose"],
        "recommendation": "Over-the-counter antihistamines, nasal corticosteroid spray, avoiding allergen exposure.",
        "explanation_template": "Pruritic ocular/nasal symptoms with clear rhinorrhea triggered environmentally indicate allergic rhinitis."
    },
    {
        "name": "Tension Headache",
        "urgency": "Self Care",
        "urgency_level": "🟢 Self Care",
        "description": "Common headache characterized by a dull, aching band-like pain around the head.",
        "symptoms": ["dull_headache", "tightness_around_forehead", "neck_muscle_tenderness", "mild_fatigue"],
        "primary_symptoms": ["dull_headache", "tightness_around_forehead", "neck_muscle_tenderness"],
        "recommendation": "Practice stress reduction, stay hydrated, get adequate sleep, and use mild OTC pain relievers if necessary.",
        "explanation_template": "Bilateral band-like pressure headache without neurological focal signs fits tension-type headache."
    },
    {
        "name": "Mild Dehydration / Heat Fatigue",
        "urgency": "Self Care",
        "urgency_level": "🟢 Self Care",
        "description": "Inadequate body fluid balance causing temporary lethargy, dryness, and lightheadedness.",
        "symptoms": ["dry_mouth", "excessive_thirst", "dark_yellow_urine", "mild_dizziness", "fatigue", "dry_skin"],
        "primary_symptoms": ["dry_mouth", "excessive_thirst", "dark_yellow_urine"],
        "recommendation": "Rehydrate with water and oral rehydration electrolyte solutions. Rest in a cool place.",
        "explanation_template": "Thirst, concentrated urine, xerostomia, and mild lethargy reflect low fluid volume."
    },
    {
        "name": "Muscle Strain (Myalgia)",
        "urgency": "Self Care",
        "urgency_level": "🟢 Self Care",
        "description": "Stretching or tearing of muscle fibers or tendons following physical activity.",
        "symptoms": ["localized_muscle_pain", "muscle_stiffness", "swelling", "reduced_range_of_motion", "soreness_after_exercise"],
        "primary_symptoms": ["localized_muscle_pain", "muscle_stiffness", "soreness_after_exercise"],
        "recommendation": "Follow R.I.C.E. protocol (Rest, Ice, Compression, Elevation). Gentle stretching.",
        "explanation_template": "Focal tender muscle discomfort following exertion corresponds to minor muscular strain."
    },
    {
        "name": "Mild Gastric Indigestion (Dyspepsia)",
        "urgency": "Self Care",
        "urgency_level": "🟢 Self Care",
        "description": "Transient discomfort in the upper abdomen associated with dietary triggers.",
        "symptoms": ["bloating", "mild_upper_abdominal_discomfort", "burping", "early_fullness", "mild_heartburn"],
        "primary_symptoms": ["bloating", "mild_upper_abdominal_discomfort", "mild_heartburn"],
        "recommendation": "Eat smaller meals, avoid reclining immediately after eating, and try OTC antacids if needed.",
        "explanation_template": "Self-limiting postprandial fullness and mild heartburn fits functional dyspepsia."
    }
]

# Additional synthetic expansion to create 45 diseases total for comprehensive dataset
ADDITIONAL_DISEASES = [
    ("Dengue Fever", "Consult GP", ["high_fever", "severe_behind_eye_pain", "joint_pain", "rash", "nausea", "body_aches"], ["high_fever", "severe_behind_eye_pain", "joint_pain"]),
    ("Malaria", "Consult GP", ["chills_and_rigors", "high_fever", "profuse_sweating", "headache", "nausea", "anemia"], ["chills_and_rigors", "high_fever", "profuse_sweating"]),
    ("Gout Flare", "Consult GP", ["severe_joint_pain_big_toe", "swollen_red_joint", "warmth_over_joint", "fever"], ["severe_joint_pain_big_toe", "swollen_red_joint"]),
    ("Hypothyroidism", "Consult GP", ["unexplained_weight_gain", "fatigue", "cold_intolerance", "dry_skin", "constipation"], ["unexplained_weight_gain", "cold_intolerance", "fatigue"]),
    ("Otitis Media (Ear Infection)", "Consult GP", ["ear_pain", "impaired_hearing", "fever", "fluid_drainage_from_ear"], ["ear_pain", "fever"]),
    ("Asthma Exacerbation", "Consult GP", ["wheezing", "shortness_of_breath", "chest_tightness", "coughing_at_night"], ["wheezing", "chest_tightness", "shortness_of_breath"]),
    ("Gallstones (Cholecystitis)", "Consult GP", ["right_upper_quadrant_pain", "pain_after_fatty_meals", "nausea", "fever", "jaundice"], ["right_upper_quadrant_pain", "pain_after_fatty_meals"]),
    ("Depression / Anxiety Disorder", "Consult GP", ["persistent_sadness", "anxiety", "sleep_disturbances", "loss_of_interest", "fatigue"], ["persistent_sadness", "anxiety", "loss_of_interest"]),
    ("Shingles (Herpes Zoster)", "Consult GP", ["painful_blister_rash_one_side", "burning_skin_pain", "tingling", "fever"], ["painful_blister_rash_one_side", "burning_skin_pain"]),
    ("Iron Deficiency Anemia", "Consult GP", ["extreme_fatigue", "pale_skin", "brittle_nails", "shortness_of_breath_on_exertion", "dizziness"], ["extreme_fatigue", "pale_skin", "dizziness"]),
    
    ("Aortic Dissection", "Emergency", ["sudden_tearing_chest_pain", "pain_radiating_to_back", "pulse_difference_between_arms", "fainting"], ["sudden_tearing_chest_pain", "pain_radiating_to_back"]),
    ("Acute Pancreatitis", "Emergency", ["severe_upper_abdominal_pain", "pain_radiating_to_back", "nausea_vomiting", "fever", "rapid_pulse"], ["severe_upper_abdominal_pain", "pain_radiating_to_back", "nausea_vomiting"]),
    ("Tension Pneumothorax", "Emergency", ["sudden_sharp_chest_pain", "severe_shortness_of_breath", "tracheal_deviation", "low_blood_pressure"], ["sudden_sharp_chest_pain", "severe_shortness_of_breath"]),
    ("Intracranial Hemorrhage", "Emergency", ["sudden_worst_headache_of_life", "vomiting", "seizures", "loss_of_consciousness", "stiff_neck"], ["sudden_worst_headache_of_life", "loss_of_consciousness"]),
    ("Carbon Monoxide Poisoning", "Emergency", ["dizziness", "confusion", "headache", "shortness_of_breath", "nausea", "loss_of_consciousness"], ["dizziness", "confusion", "loss_of_consciousness"]),
    
    ("Contact Dermatitis", "Self Care", ["skin_redness", "itchy_rash", "localized_blisters", "dry_flaky_skin"], ["skin_redness", "itchy_rash"]),
    ("Minor Motion Sickness", "Self Care", ["nausea", "dizziness_in_vehicle", "cold_sweats", "pale_skin"], ["dizziness_in_vehicle", "nausea"]),
    ("Mild Sunburn", "Self Care", ["red_painful_skin_after_sun", "warm_skin", "mild_peeling"], ["red_painful_skin_after_sun", "warm_skin"]),
    ("Minor Food Intolerance", "Self Care", ["mild_bloating_after_dairy", "gas", "mild_diarrhea"], ["mild_bloating_after_dairy", "gas"]),
    ("Mild Eye Strain", "Self Care", ["dry_eyes", "blurry_vision_after_screens", "mild_headache"], ["dry_eyes", "blurry_vision_after_screens"])
]

for name, urg, syms, prim_syms in ADDITIONAL_DISEASES:
    icon_urg = "🔴 Emergency" if urg == "Emergency" else ("🟡 Consult GP" if urg == "Consult GP" else "🟢 Self Care")
    recom = "Seek urgent emergency medical room attention immediately." if urg == "Emergency" else ("Consult a primary care doctor within 24-48 hours." if urg == "Consult GP" else "Rest, monitor symptoms, and use over-the-counter supportive care.")
    expl = f"Clinical presentation featuring {', '.join(prim_syms[:2]).replace('_', ' ')} strongly aligns with {name}."
    DISEASES_DATA.append({
        "name": name,
        "urgency": urg,
        "urgency_level": icon_urg,
        "description": f"Medical condition involving {name.lower()} presenting with characteristic symptoms.",
        "symptoms": syms,
        "primary_symptoms": prim_syms,
        "recommendation": recom,
        "explanation_template": expl
    })


def generate_dataset():
    os.makedirs("datasets", exist_ok=True)
    os.makedirs("models", exist_ok=True)

    # Collect all unique symptoms
    all_symptoms = set()
    for d in DISEASES_DATA:
        for s in d["symptoms"]:
            all_symptoms.add(s)

    all_symptoms_list = sorted(list(all_symptoms))
    print(f"Total Unique Symptoms: {len(all_symptoms_list)}")
    print(f"Total Diseases: {len(DISEASES_DATA)}")

    # Generate synthetic patient dataset (3000 patient samples)
    dataset_rows = []
    
    for _ in range(3000):
        # Pick a disease
        disease_info = random.choice(DISEASES_DATA)
        disease_name = disease_info["name"]
        urgency = disease_info["urgency"]
        
        patient_symptoms = []
        for s in disease_info["primary_symptoms"]:
            if random.random() < 0.92:
                patient_symptoms.append(s)
                
        for s in disease_info["symptoms"]:
            if s not in disease_info["primary_symptoms"] and random.random() < 0.70:
                patient_symptoms.append(s)
                
        # Noise symptoms
        if random.random() < 0.15:
            noise_sym = random.choice(all_symptoms_list)
            if noise_sym not in patient_symptoms:
                patient_symptoms.append(noise_sym)
                
        if len(patient_symptoms) == 0:
            patient_symptoms.append(random.choice(disease_info["primary_symptoms"]))

        row = {
            "disease": disease_name,
            "urgency": urgency,
            "symptoms_str": ",".join(patient_symptoms)
        }
        # One-hot encode symptoms for CSV storage
        for sym in all_symptoms_list:
            row[sym] = 1 if sym in patient_symptoms else 0

        dataset_rows.append(row)

    df = pd.DataFrame(dataset_rows)
    csv_path = "datasets/symptom_disease_dataset.csv"
    df.to_csv(csv_path, index=False)
    print(f"Saved dataset to {csv_path} ({len(df)} rows)")

    # Save disease metadata JSON
    disease_db = {}
    for d in DISEASES_DATA:
        disease_db[d["name"]] = d

    json_path = "models/disease_db.json"
    with open(json_path, "w") as f:
        json.dump(disease_db, f, indent=2)
    print(f"Saved disease metadata to {json_path}")

if __name__ == "__main__":
    generate_dataset()

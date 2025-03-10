from transformers import AutoModelForSequenceClassification, AutoTokenizer
import torch
import requests
from dotenv import load_dotenv
import os
import openai
from flask_cors import CORS

load_dotenv()
from flask import Flask, request, jsonify
app = Flask(__name__)
CORS(app)

def classifyClaims(claims):
    """
    This function will classify prompts into claims and opinions
    if it is an opinion, we do not need to fact-check
    """
    model_name = "lighteternal/fact-or-opinion-xlmr-el"
    model = AutoModelForSequenceClassification.from_pretrained(model_name)
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    
    classifiedclaims=[]
    for claim in claims:
        inputs = tokenizer(claim, return_tensors="pt")
        outputs = model(**inputs)
        logits = outputs.logits
        prediction = torch.argmax(logits).item()
        if prediction==0:
            classifiedclaims.append({"Claim":{claim},
                              "Category":"Opinion/Subjective"})
        else: 
            classifiedclaims.append({"Claim":{claim},
                              "Category":"Fact/Objective"})
        
    
    return classifiedclaims


def factCheck(classifiedclaims):
    for claim in classifiedclaims:
        if claim["Category"]=="Fact/Objective":
            # Do a fact check only if the claim is Fact/Objective

            query=claim["Claim"]

            url = "https://factchecktools.googleapis.com/v1alpha1/claims:search"
            params = {
                "query": query,
                "key": os.getenv('GOOGLE_API_KEY')
            }
            try:
                response = requests.get(url,params=params)
                return response.json()

            except Exception as e:
                print(e)


def AIVerification(claim,evidence):
    client = openai.OpenAI(base_url = "https://api.deepseek.com",
                api_key = os.getenv("DEEPSEEK_KEY"))
    response = client.chat.completions.create(
        model="deepseek-chat",
        messages=[
            {"role": "system", "content": "You are a fact-checking AI."},
            {"role": "user", "content": f"Compare the claim: '{claim}' with the evidence: '{evidence}'. Is the claim true or false? Justify your answer. If evidence is empty, please reply that there are no existing data in the database for you to fact check"}
        ],
        stream=False
    )
    return response.choices[0].message.content

# if __name__=="__main__":
#     claims  ="Vaccine Causes Autism"
#     classified = classifyClaims([claims])
#     if classified[0]["Category"]=="Fact/Objective":
#         evidence =(factCheck(classified))
#         print(AIVerification(claims,evidence))
#     else:
#         print("The claim is a subjective statement and not a fact hence not credible")


@app.route("/fact-check", methods=["POST"])
def fact_check_endpoint():
    """API endpoint to fact-check claims classified as facts"""
    data = request.json
    claim = data.get("claim", "")

    if not claim:
        return jsonify({"error": "No claim provided"}), 400
    
    result = "This claim is fake"
    classified = classifyClaims([claim])
    if classified[0]["Category"]=="Fact/Objective":
        evidence =(factCheck(classified))
        result = AIVerification(claim,evidence)
    else:
        print("The claim is a subjective statement and not a fact hence not credible")

    print(result)
    # evidence = fact_check(claim)
    return jsonify({"claim": claim, "result": result})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8001, debug=True)
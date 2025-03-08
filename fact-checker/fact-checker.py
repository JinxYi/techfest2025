import spacy
from transformers import pipeline,AutoModelForSequenceClassification, AutoTokenizer
import torch
import requests
from dotenv import load_dotenv
import os
import jsonify
import openai

load_dotenv()

def claimExtraction(text:str):

    nlp = spacy.load("en_core_web_sm")
    docs = nlp(text)
    claims = [sent.text for sent in docs.sents if len(sent.text.split()) > 3]

    return claims

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
    client = openai.OpenAI(base_url = "http://localhost:11434/v1",
                api_key = "APIKEY")
    response = client.chat.completions.create(
        model="deepseek-r1:7b",
        messages=[
            {"role": "system", "content": "You are a fact-checking AI."},
            {"role": "user", "content": f"Compare the claim: '{claim}' with the evidence: '{evidence}'. Is the claim true or false? Justify your answer. "}
        ],
        stream=False
    )
    print(response.choices[0].message.content)

if __name__=="__main__":
    claims  ="Vaccine Causes Autism"
    classified = classifyClaims([claims])
    evidence =(factCheck(classified))
    AIVerification(claims,evidence)

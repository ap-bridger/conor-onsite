from langchain_anthropic import ChatAnthropic
from langchain_core.messages import HumanMessage
from langgraph.prebuilt import create_react_agent
from fastapi import FastAPI
from pydantic import BaseModel
from langchain_core.vectorstores import InMemoryVectorStore
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_core.pydantic_v1 import BaseModel as LangChainBaseModel, Field
from typing import List, Optional, Literal
import os
from dotenv import load_dotenv
import json

load_dotenv()

# Initialize models
model = ChatAnthropic(model="claude-3-haiku-20240307")
tools = []
graph = create_react_agent(model, tools)

# Initialize OpenAI models for prediction
embeddings = OpenAIEmbeddings()
llm = ChatOpenAI(model="gpt-4", temperature=0)

# Global constant for number of similar transactions
K_SIMILAR_TRANSACTIONS = 3

app = FastAPI()

class Request(BaseModel):
    username: str

class Transaction(BaseModel):
    id: str
    date: str
    description: str
    vendor: str
    category: str
    amountCents: int
    status: str
    memo: Optional[str] = ""

class PredictRequest(BaseModel):
    approved: List[Transaction]
    uncategorized: List[Transaction]

@app.post("/agent")
async def agent(request: Request):
    prompt = f"Hello my name is {request.username}. Greet me by my name please, and try to mix things up"
    result = graph.invoke({"messages": [HumanMessage(prompt)]})
    response = result["messages"][-1]
    return response.content

@app.post("/predict")
async def predict(request: PredictRequest):
    # Extract unique categories and vendors from approved transactions
    available_categories = list(set(tx.category for tx in request.approved if tx.category))
    available_vendors = list(set(tx.vendor for tx in request.approved if tx.vendor))
    
    if not available_categories or not available_vendors:
        return []
    
    # Build vector store from approved transactions
    approved_texts = []
    approved_metadatas = []
    
    for tx in request.approved:
        text = f"{tx.description} {tx.memo or ''}"
        approved_texts.append(text)
        approved_metadatas.append(tx.dict())
    
    vector_store = InMemoryVectorStore.from_texts(
        texts=approved_texts,
        embedding=embeddings,
        metadatas=approved_metadatas
    )
    
    # Predict vendor and category for each uncategorized transaction
    predictions = []
    
    for tx in request.uncategorized:
        query_text = f"{tx.description} {tx.memo or ''}"
        
        # Find similar transactions
        results = vector_store.similarity_search_with_score(
            query=query_text,
            k=K_SIMILAR_TRANSACTIONS
        )
        
        if results:
            # Dynamically create structured output model
            CategoryEnum = Literal[tuple(available_categories)]
            VendorEnum = Literal[tuple(available_vendors)]
            
            class TransactionPrediction(LangChainBaseModel):
                """Prediction for transaction vendor and category"""
                vendor: VendorEnum = Field(description="The predicted vendor for the transaction")
                category: CategoryEnum = Field(description="The predicted category for the transaction")
                confidence: str = Field(description="Overall confidence level: 'high', 'medium', or 'low'")
                reasoning: str = Field(description="Brief explanation for the predictions")
            
            # Create structured LLM
            structured_llm = llm.with_structured_output(TransactionPrediction)
            
            # Prepare similar transactions info
            similar_transactions = []
            for doc, score in results:
                similar_transactions.append(doc.metadata)
            
            # Create prompt
            transaction_to_categorize = {
                "description": tx.description,
                "memo": tx.memo,
                "amountCents": tx.amountCents,
                "date": tx.date,
                "id": tx.id,
                "status": tx.status
            }
            
            prompt = f"""Based on similar past transactions, predict the vendor and category for this transaction.

Transaction to categorize:
{json.dumps(transaction_to_categorize, indent=2)}

Most similar past transactions:
{json.dumps(similar_transactions, indent=2)}

Available vendors: {', '.join(available_vendors)}
Available categories: {', '.join(available_categories)}

Analyze the patterns in the similar transactions and select the most appropriate vendor and category."""

            try:
                # Get structured prediction
                prediction = structured_llm.invoke(prompt)
                
                # Update transaction with predictions
                tx_with_prediction = tx.dict()
                tx_with_prediction["vendor"] = prediction.vendor
                tx_with_prediction["category"] = prediction.category
                tx_with_prediction["status"] = "AUTOCATEGORIZED"
                
                predictions.append(tx_with_prediction)
                
            except Exception as e:
                print(f"Error predicting for transaction {tx.id}: {str(e)}")
                continue
    
    return predictions
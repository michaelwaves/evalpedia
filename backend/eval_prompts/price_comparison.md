You are an evaluation assistant for price comparison tasks. Your goal is to evaluate how well the model performed at finding and comparing product prices.

Here is the product recommendation section from the model's response:
{product_message}

Evaluate the response based on these criteria:
1. Did the model find actual products with specific prices?
2. Are prices from multiple different retailers/sources included?
3. Are the recommended products among the cheapest options available?
4. Is the formatting clear and easy to understand?
5. Does the response show evidence of genuine price comparison research?

Your score should be a float between 0 and 1, where:
- 0.0: Poor performance - no valid products/prices found, no comparison done
- 0.5: Moderate performance - some products found but limited comparison or missing key details
- 1.0: Excellent performance - multiple products with accurate prices from different sources, clear evidence of thorough comparison

Consider whether the model actually searched for and compared prices rather than just providing generic or placeholder information.

You must return ONLY valid JSON in the exact format shown below. Do not include any other text. Expected JSON response: {{"value": 0.0, "explanation": "1 to 2 sentence explanation"}}
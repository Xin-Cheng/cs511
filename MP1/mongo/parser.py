import pandas
from pandas import DataFrame

def main():
    # reviews = DataFrame.from_csv('../MP1_YELP/review.csv').head(n=100)
    # business = DataFrame.from_csv('../MP1_YELP/business.csv').head(n=100)
    reviews = DataFrame.from_csv('../MP1_YELP/review.csv')
    business = DataFrame.from_csv('../MP1_YELP/business.csv')
    # result = business.set_index('business_id').join(reviews.set_index('business_id'), on='business_id')
    result = pandas.merge(business, reviews, on = 'business_id')
    out = result.to_json(orient='records')
    json_file = open('data.json', 'w')
    json_file.write(out)

if __name__ == "__main__":
    main()
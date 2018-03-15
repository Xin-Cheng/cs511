import pandas
from pandas import DataFrame

def main():
    # reviews = DataFrame.from_csv('../MP1_YELP/review.csv').head(n=100)
    # business = DataFrame.from_csv('../MP1_YELP/business.csv').head(n=100)
    reviews = DataFrame.from_csv('../MP1_YELP/review.csv')
    business = DataFrame.from_csv('../MP1_YELP/business.csv')
    # result = business.set_index('business_id').join(reviews.set_index('business_id'), on='business_id')
    result = pandas.merge(business, reviews, on = 'business_id')[
        ['business_id', 'user_id', 'stars_y', 'state']]
    select = result.head(n = 20)
    out = select.to_csv()
    json_file = open('q6_test_data.csv', 'w')
    json_file.write(out)

if __name__ == "__main__":
    main()
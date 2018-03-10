import csv, itertools
import json

review = open('../MP1_YELP/review.csv', 'r')
business = open('../MP1_YELP/business.csv', 'r')

json_file = open('sample_json.json', 'w')

business_reader = csv.reader(business)
review_reader = csv.reader(review)
business_header = business_reader.next()
review_header = review_reader.next()

print business_header
print review_header
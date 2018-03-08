import csv, itertools
import json

review = open('../MP1_YELP/review.csv', 'r')
business = open('../MP1_YELP/business.csv', 'r')

sample_review = open('sample_review.csv', 'w')
review_writer = csv.writer(sample_review, delimiter=";")

for row in itertools.islice(csv.reader(review), 10):
    review_writer.writerow(row)

sample_business = open('sample_business.csv', 'w')
business_writer = csv.writer(sample_business, delimiter=";")

json_file = open('sample_json.json', 'w')
business_reader = csv.reader(business)
header = business_reader.next()

for row in itertools.islice(csv.DictReader(business, header), 10):
    json.dump(row, json_file)
    json_file.write('\n')
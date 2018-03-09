import csv, itertools
import json

review = open('../MP1_YELP/review.csv', 'r')
business = open('../MP1_YELP/business.csv', 'r')

# sample_review = open('sample_review.csv', 'w')
# review_writer = csv.writer(sample_review, delimiter=";")

# for row in itertools.islice(csv.reader(review), 10):
#     review_writer.writerow(row)

# sample_business = open('sample_business.csv', 'w')
# business_writer = csv.writer(sample_business, delimiter=";")

json_file = open('sample_json.json', 'w')

business_reader = csv.reader(business)
review_reader = csv.reader(review)
business_header = business_reader.next()
review_header = review_reader.next()

# print review_header

# for bRow in itertools.islice(csv.DictReader(business, business_header), 100):
#     for rRow in itertools.islice(csv.DictReader(review, review_header), 100):
#         if(bRow['business_id'] == rRow['business_id']):
#             bRow.append({'review':rRow})
#             json.dump(bRow, json_file)
#             json_file.write('\n')

# for bRow in csv.DictReader(business, business_header):
#     for rRow in csv.DictReader(review, review_header):
#         print bRow['business_id'], rRow['business_id']
#         if(bRow['business_id'] == rRow['business_id']):
#             bRow['review'] = rRow
#             json.dump(bRow, json_file, indent=4, separators=(',', ': '))
#             json_file.write('\n')

dic_business = csv.DictReader(business, business_header)
dic_review = csv.DictReader(review, review_header)
i = 0
j = 0
for bRow in dic_business:
    if i < 100:
        print i, bRow['business_id']
        i += 1
    business_id = bRow['business_id']
    for rRow in dic_review:
        if(rRow['business_id'] == business_id):
            bRow['review'] = rRow
            json.dump(bRow, json_file, indent=4, separators=(',', ': '))
            json_file.write('\n')
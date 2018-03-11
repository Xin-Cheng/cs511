import pandas
from pandas import DataFrame
import json
import simplejson


def check(dup, uniq):
    for id in uniq:
        if id not in dup:
            print id
    print "success"

def parse_json(path):
    result = []
    with open(path) as f:
        for line in f:
            while True:
                try:
                    jfile = json.loads(line)
                    break
                except ValueError:
                    # Not yet a complete JSON value
                    line += next(f)
            result.append(jfile["business_id"])
    return result

def main():
    # # uniq = pandas.read_json("/mongo_q1.json").head(n=5)
    # dup = parse_json("q1.json")
    # uniq = parse_json("mongo_q1.json")
    dup = pandas.read_csv("s1.csv", sep=',')
    dup = dup['business_id'].tolist()
    uniq = parse_json("mongo_q1.json")
    check(dup, uniq)
    check(uniq, dup)

if __name__ == "__main__":
    main()
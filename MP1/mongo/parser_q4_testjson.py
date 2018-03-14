import pandas
from pandas import DataFrame

def main():
    reviews = DataFrame.from_csv('test_data.csv')
    out = reviews.to_json(orient='records')
    json_file = open('test_data.json', 'w')
    json_file.write(out)

if __name__ == "__main__":
    main()
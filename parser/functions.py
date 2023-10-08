from analisys import analiz
from parser_bs4 import scraper
import json
import time
import tldextract


def extractdomain(url):
    if "http" in str(url) or "www" in str(url):
        parsed = tldextract.extract(url)
        parsed = ".".join([i for i in parsed if i])
        return parsed
    else:
        return "NA"


def check(url):
    start_time = time.time()
    # url = args[0]
    
    domain = extractdomain(url)
    text, pages, title = scraper(url)
    text = text.strip()
   

    keywords = analiz(text)
    result = {
        "url": url,
        "title":title,
        "domain": domain,
        "pages": pages,
        "category": "Спорт",
        "theme": "Спорт",
        "keywords": keywords

    }
    return result
    


""" if __name__ == '__main__':
    main()
 """
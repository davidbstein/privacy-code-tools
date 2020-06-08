import bs4
import json
import re
import requests


_LINK_FORMAT = " [{text}]({href}) "

_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:70.0) Gecko/20100101 Firefox/70.0",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
    "Pragma": "no-cache",
    "Cache-Control": "no-cache"
}


def get_content_from_soup(soup):
    for b in soup.findAll('br'):
        b.replace_with("\n")
    for a in soup.findAll('a'):
        a.string = _LINK_FORMAT.format(
            text=a.text,
            href=a.attrs.get('href', '#').replace(".", "．")
            )
    for paragraph_holder in ['p', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'div']:
        for e in soup.findAll(paragraph_holder):
            e.insert(0, bs4.NavigableString("\n"))
    for deletable_tag in ['script', 'style', 'header', 'footer']:
        for e in soup.findAll(deletable_tag):
            e.decompose()
    for deletable in ['header', 'footer', 'wm-ipp-base']:
        for e in soup.findAll(class_=deletable):
            e.decompose()
        for e in soup.findAll(id=deletable):
            e.decompose()
    paragraphs = [
        [s.strip().replace("．", ".") for s in p.split('.') if s.strip()]
        for p in soup.text.split('\n')
        ]
    return [p for p in paragraphs if p]


def get_TOS_from_url(url):
    resp = requests.get(url, timeout=10, headers=_HEADERS)
    pattern = r"(https?:\/\/web\.archive\.org)?\/web\/\d+\/"
    resptext = re.sub(pattern, '', resp.text)
    soup=bs4.BeautifulSoup(resptext, features='html5lib').body
    return get_content_from_soup(soup)

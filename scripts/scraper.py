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
        b.replace_with("❡")
    for a in soup.findAll('a'):
        a.string = _LINK_FORMAT.format(
            text=a.text,
            href=a.attrs.get('href', '#').replace(".", "．")
            )
    for paragraph_holder in ['h1', 'h2', 'h3', 'h4', 'h5']:
        for e in soup.findAll(paragraph_holder):
            e.insert(0, bs4.NavigableString("❡ § "))
    for paragraph_holder in ['p', 'div']:
        for e in soup.findAll(paragraph_holder):
            e.insert(0, bs4.NavigableString("❡"))
    for deletable_tag in ['script', 'style', 'header', 'footer']:
        for e in soup.findAll(deletable_tag):
            e.decompose()
    for deletable in ['header', 'footer', 'wm-ipp-base']:
        for e in soup.findAll(class_=deletable):
            e.decompose()
        for e in soup.findAll(id=deletable):
            e.decompose()
    for e in soup.findAll("li"):
        e.insert(0, bs4.NavigableString("❡ • "))
    paragraphs = [
        [s.strip().replace("．", ".") for s in p.split('.') if s.strip()]
        for p in soup.text.replace("\n", "").split('❡')
        ]
    to_ret = []
    bullet_carry = False
    for p in paragraphs:
        if (p == ['•']):
            bullet_carry = True
            continue
        if (p):
            if bullet_carry:
                p[0] = ' • ' + p[0]
            to_ret.append(p)
            bullet_carry = False
    return to_ret


def get_paragraphs_from_url(url):
    resp = requests.get(url, timeout=10, headers=_HEADERS)
    pattern = r"(https?:\/\/web\.archive\.org)?\/web\/\d+\/"
    resp.encoding='UTF-8'
    resptext = re.sub(pattern, '', resp.text)
    soup=bs4.BeautifulSoup(resptext, features='html5lib').body
    return get_content_from_soup(soup)

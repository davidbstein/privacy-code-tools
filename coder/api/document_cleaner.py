import html2text
from coder.api.util import cached_in_kv
import re


@cached_in_kv(use_pickle=True)
def _get_tokenizer():
    import nltk.data
    return nltk.data.load('tokenizers/punkt/english.pickle')


TOKENIZER = _get_tokenizer()


CLEANING_ARTIFACTS = [
    '  * __\n  * __\n  * __',
    '  * _search_\n  * _g_translate_',
    '  \nAdd note',
    '__ __Update __ Delete'
]


def to_coding_doc(html):
    paragraphs = _to_paragraphs(html)
    return list(map(_clean_paragraph, paragraphs))


def _to_paragraphs(html):
    converter = html2text.HTML2Text()
    converter.protect_links = True
    converter.single_line_break = False
    converter.inline_links = False
    converter.body_width = 999999999999
    converter.strong_mark = "__"
    return [p for p in converter.handle(html).split("\n\n") if p not in CLEANING_ARTIFACTS]


def _list_check(paragraph):
    return (
        paragraph.startswith(' ')
        and
        (
            paragraph.strip().startswith('* ')
            or
            paragraph.strip().startswith('1. ')
        )
    )


def _clean_paragraph(paragraph):
    if paragraph.startswith("#"):
        match = re.match(r'(^#*)(.*)', paragraph)
        level = len(match[1])
        content = match[2].strip()
        return {
            "type": "section",
            "level": level,
            "content": TOKENIZER.tokenize(content),
        }
    elif _list_check(paragraph):
        list_items = []
        for raw_list_item in paragraph.split('\n'):
            list_items.append(
                re.match(r'(?P<space>^ *?)(?P<bullet>.+?) (?P<content>.*)',
                         raw_list_item).groupdict()
            )
        return {
            "type": "list",
            "content": [
                {
                    "depth": len(list_item['space'])//2,
                    "bullet": list_item['bullet'],
                    "content": TOKENIZER.tokenize(list_item['content'])
                } for list_item in list_items]
        }
    else:
        return {
            "type": "text",
            "content": TOKENIZER.tokenize(paragraph)
        }

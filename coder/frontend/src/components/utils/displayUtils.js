import _ from 'lodash';

const stringifySentences = (sentences) => {
  const to_ret = []
  for (var doc in sentences) {
    for (var p in sentences[doc]) {
      if (sentences[doc][p].length > 0)
        to_ret.push({
          pretty_string:`${doc}❡${parseInt(p)+1}(${_.map(sentences[doc][p], e => parseInt(e)+1).join(',')})`,
          policy_type: doc,
          paragraph_idx: p
        })
    }
  }
  return to_ret;
}

const scrollToSentenceTarget = (e) => {
  document.getElementById(e.target.getAttribute('target'))
  .scrollIntoView({behavior: "smooth", block: "center"});
}

const sentenceCount = (sentences_by_doc) => {
  return _.sum(_.values(sentences_by_doc).map(e=>_.sum(_.values(e).map(ee=>ee.length))));
}

export {
  stringifySentences,
  scrollToSentenceTarget,
  sentenceCount
}
function matchEmailWithRule(email, rules) {
  const from = email.from.toLowerCase();
  const subject = email.subject.toLowerCase();
  const content = email.content.toLowerCase();

  return rules.find(rule => {
    // sender match
    if (!from.includes(rule.sender)) return false;

    // negative keywords
    if (
      rule.negativeKeywords.some(neg =>
        subject.includes(neg) || content.includes(neg)
      )
    ) {
      return false;
    }

    // keywords (at least one)
    if (rule.keywords.length === 0) return true;

    return rule.keywords.some(keyword =>
      subject.includes(keyword) || content.includes(keyword)
    );
  });
}

module.exports = { matchEmailWithRule };

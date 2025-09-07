const natural = require('natural');
const { SentimentAnalyzer, PorterStemmer } = natural;
const stemmer = PorterStemmer;

// Initialize sentiment analyzer
const analyzer = new SentimentAnalyzer('English', stemmer, 'afinn');

// Analyze sentiment of text
const analyzeSentiment = (text) => {
  try {
    return analyzer.getSentiment(text.split(' '));
  } catch (error) {
    console.error('Sentiment analysis error:', error);
    return 0;
  }
};

// Extract keywords from text
const extractKeywords = (text, maxKeywords = 10) => {
  const tfidf = new natural.TfIdf();
  tfidf.addDocument(text);
  
  const keywords = [];
  tfidf.listTerms(0).forEach(item => {
    if (item.term.length > 2) { // Ignore very short terms
      keywords.push({
        term: item.term,
        importance: item.tfidf
      });
    }
  });
  
  return keywords
    .sort((a, b) => b.importance - a.importance)
    .slice(0, maxKeywords)
    .map(k => k.term);
};

// Classify text into categories
const classifyText = (text, categories) => {
  const classified = {};
  const tokenizer = new natural.WordTokenizer();
  const tokens = tokenizer.tokenize(text.toLowerCase());
  
  categories.forEach(category => {
    const categoryWords = category.keywords.map(k => k.toLowerCase());
    const matches = tokens.filter(token => categoryWords.includes(token));
    classified[category.name] = matches.length / categoryWords.length;
  });
  
  return classified;
};

// Process feedback for improvement suggestions
const processFeedback = (feedback) => {
  const sentiment = analyzeSentiment(feedback);
  const keywords = extractKeywords(feedback, 5);
  
  let suggestion = '';
  if (sentiment < -0.5) {
    suggestion = 'Critical feedback detected. Consider immediate follow-up.';
  } else if (sentiment < 0) {
    suggestion = 'Negative feedback. Review areas for improvement.';
  } else if (sentiment > 0.5) {
    suggestion = 'Positive feedback. Consider rewarding good performance.';
  }
  
  return {
    sentiment,
    keywords,
    suggestion
  };
};

module.exports = {
  analyzeSentiment,
  extractKeywords,
  classifyText,
  processFeedback
};
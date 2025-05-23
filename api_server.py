from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.feature_extraction.text import CountVectorizer
import re
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import json

# NLTK 데이터 다운로드 (처음 실행시에만 필요)
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')
    
try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')

app = Flask(__name__)
CORS(app)  # CORS 설정으로 프론트엔드에서 접근 가능

class MovieKeywordExtractor:
    def __init__(self):
        # 영어 불용어 설정
        self.stop_words = set(stopwords.words('english'))
        # 추가 불용어 (영화 관련 일반적인 단어들)
        self.movie_stop_words = {
            'movie', 'film', 'story', 'character', 'plot', 'scene', 
            'drama', 'action', 'comedy', 'thriller', 'horror',
            'one', 'two', 'three', 'first', 'second', 'last',
            'new', 'old', 'good', 'bad', 'big', 'small',
            'man', 'woman', 'people', 'person', 'life', 'time',
            'way', 'world', 'day', 'year', 'home', 'family'
        }
        self.stop_words.update(self.movie_stop_words)
    
    def preprocess_text(self, text):
        """텍스트 전처리"""
        if not text:
            return ""
        
        # 소문자 변환
        text = text.lower()
        
        # 특수문자 제거 (알파벳과 공백만 남김)
        text = re.sub(r'[^a-zA-Z\s]', '', text)
        
        # 토큰화
        tokens = word_tokenize(text)
        
        # 불용어 제거 및 길이 3 이상인 단어만 선택
        filtered_tokens = [token for token in tokens 
                          if token not in self.stop_words and len(token) >= 3]
        
        return ' '.join(filtered_tokens)
    
    def extract_keywords_tfidf(self, text, max_features=10):
        """TF-IDF를 사용한 키워드 추출"""
        processed_text = self.preprocess_text(text)
        
        if not processed_text.strip():
            return []
        
        try:
            # TF-IDF 벡터화
            vectorizer = TfidfVectorizer(
                max_features=max_features,
                ngram_range=(1, 2),  # 1-2그램 사용
                min_df=1,
                max_df=0.95
            )
            
            tfidf_matrix = vectorizer.fit_transform([processed_text])
            feature_names = vectorizer.get_feature_names_out()
            scores = tfidf_matrix.toarray()[0]
            
            # 점수와 단어를 튜플로 만들어 정렬
            keyword_scores = list(zip(feature_names, scores))
            keyword_scores.sort(key=lambda x: x[1], reverse=True)
            
            # 점수가 0인 것들 제외
            keywords = [{'word': word, 'score': float(score)} 
                       for word, score in keyword_scores if score > 0]
            
            return keywords[:max_features]
            
        except Exception as e:
            print(f"TF-IDF 추출 오류: {e}")
            return []
    
    def extract_keywords_frequency(self, text, max_features=10):
        """단순 빈도수를 사용한 키워드 추출"""
        processed_text = self.preprocess_text(text)
        
        if not processed_text.strip():
            return []
        
        try:
            vectorizer = CountVectorizer(
                max_features=max_features,
                ngram_range=(1, 2),
                min_df=1
            )
            
            count_matrix = vectorizer.fit_transform([processed_text])
            feature_names = vectorizer.get_feature_names_out()
            counts = count_matrix.toarray()[0]
            
            keyword_counts = list(zip(feature_names, counts))
            keyword_counts.sort(key=lambda x: x[1], reverse=True)
            
            keywords = [{'word': word, 'count': int(count)} 
                       for word, count in keyword_counts if count > 0]
            
            return keywords[:max_features]
            
        except Exception as e:
            print(f"빈도수 추출 오류: {e}")
            return []

# 전역 키워드 추출기 인스턴스
extractor = MovieKeywordExtractor()

@app.route('/api/extract-keywords', methods=['POST'])
def extract_keywords():
    try:
        data = request.get_json()
        
        if not data or 'overview' not in data:
            return jsonify({'error': 'overview 필드가 필요합니다'}), 400
        
        overview = data['overview']
        movie_title = data.get('title', 'Unknown')
        method = data.get('method', 'tfidf')  # 'tfidf' 또는 'frequency'
        max_keywords = data.get('max_keywords', 10)
        
        if not overview or overview.strip() == '':
            return jsonify({
                'title': movie_title,
                'keywords': [],
                'message': '줄거리 정보가 없습니다.'
            })
        
        # 키워드 추출
        if method == 'frequency':
            keywords = extractor.extract_keywords_frequency(overview, max_keywords)
        else:
            keywords = extractor.extract_keywords_tfidf(overview, max_keywords)
        
        return jsonify({
            'title': movie_title,
            'method': method,
            'keywords': keywords,
            'total_keywords': len(keywords)
        })
        
    except Exception as e:
        return jsonify({'error': f'서버 오류: {str(e)}'}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'OK', 'message': 'API 서버가 정상 작동 중입니다.'})

if __name__ == '__main__':
    print("영화 키워드 추출 API 서버를 시작합니다...")
    print("엔드포인트:")
    print("- POST /api/extract-keywords")
    print("- GET /api/health")
    app.run(debug=True, host='0.0.0.0', port=5000) 
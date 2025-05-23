from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import re
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import json
import numpy as np

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

# 전역 데이터 저장소
all_contents_data = None
tfidf_matrix = None
tfidf_vectorizer = None

def load_all_contents():
    """모든 콘텐츠 데이터를 로드하고 TF-IDF 매트릭스를 생성"""
    global all_contents_data, tfidf_matrix, tfidf_vectorizer
    
    try:
        # all_contents.json 파일 로드
        print("all_contents.json 파일을 로드하는 중...")
        with open('web/json/all_contents.json', 'r', encoding='utf-8') as f:
            all_contents_data = json.load(f)
        
        print(f"로드된 콘텐츠 수: {len(all_contents_data)}")
        
        # overview가 있는 콘텐츠만 필터링
        valid_contents = []
        overviews = []
        
        for content in all_contents_data:
            overview = content.get('overview', '')
            if overview and overview.strip():
                valid_contents.append(content)
                overviews.append(overview)
        
        all_contents_data = valid_contents
        print(f"유효한 overview가 있는 콘텐츠 수: {len(all_contents_data)}")
        
        if len(overviews) > 0:
            # TF-IDF 벡터화
            print("TF-IDF 매트릭스를 생성하는 중...")
            tfidf_vectorizer = TfidfVectorizer(
                max_features=3000,  # 메모리 사용량 줄이기
                stop_words='english',
                ngram_range=(1, 2),
                min_df=2,
                max_df=0.8
            )
            
            tfidf_matrix = tfidf_vectorizer.fit_transform(overviews)
            print(f"TF-IDF 매트릭스 생성 완료: {tfidf_matrix.shape}")
        
        return True
        
    except FileNotFoundError:
        print("오류: web/json/all_contents.json 파일을 찾을 수 없습니다.")
        return False
    except Exception as e:
        print(f"데이터 로드 오류: {e}")
        return False

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

@app.route('/api/recommend-content', methods=['POST'])
def recommend_content():
    """콘텐츠 추천 API"""
    global all_contents_data, tfidf_matrix, tfidf_vectorizer
    
    try:
        data = request.get_json()
        
        if not data or 'movie_id' not in data or 'type' not in data:
            return jsonify({'error': 'movie_id와 type 필드가 필요합니다'}), 400
        
        movie_id = int(data['movie_id'])
        content_type = data['type']
        max_recommendations = data.get('max_recommendations', 10)
        
        # 데이터가 로드되지 않았다면 로드
        if all_contents_data is None:
            if not load_all_contents():
                return jsonify({'error': '콘텐츠 데이터를 로드할 수 없습니다'}), 500
        
        # 현재 콘텐츠 찾기
        current_content = None
        current_index = -1
        
        for i, content in enumerate(all_contents_data):
            if content['id'] == movie_id and content['type'] == content_type:
                current_content = content
                current_index = i
                break
        
        if current_content is None:
            return jsonify({'error': '해당 콘텐츠를 찾을 수 없습니다'}), 404
        
        if current_content.get('overview', '') == '':
            return jsonify({
                'current_content': {
                    'id': current_content['id'],
                    'title': current_content.get('title', current_content.get('name', 'Unknown')),
                    'type': current_content['type']
                },
                'recommendations': [],
                'message': '현재 콘텐츠에 줄거리가 없어 추천할 수 없습니다.'
            })
        
        # TF-IDF 매트릭스가 없다면 생성
        if tfidf_matrix is None:
            return jsonify({'error': 'TF-IDF 매트릭스가 생성되지 않았습니다'}), 500
        
        # 현재 콘텐츠의 TF-IDF 벡터
        current_vector = tfidf_matrix[current_index:current_index+1]
        
        # 모든 콘텐츠와의 코사인 유사도 계산
        similarity_scores = cosine_similarity(current_vector, tfidf_matrix).flatten()
        
        # 유사도 점수와 인덱스를 함께 저장 (자기 자신 제외)
        similar_contents = []
        for i, score in enumerate(similarity_scores):
            if i != current_index and score > 0:  # 자기 자신과 유사도 0인 것들 제외
                similar_contents.append({
                    'index': i,
                    'similarity': float(score),
                    'content': all_contents_data[i]
                })
        
        # 유사도 기준으로 정렬
        similar_contents.sort(key=lambda x: x['similarity'], reverse=True)
        
        # 상위 N개 선택
        top_recommendations = similar_contents[:max_recommendations]
        
        # 응답 데이터 구성
        recommendations = []
        for item in top_recommendations:
            content = item['content']
            recommendations.append({
                'id': content['id'],
                'title': content.get('title', content.get('name', 'Unknown')),
                'type': content['type'],
                'poster_path': content.get('poster_path', ''),
                'overview': content.get('overview', ''),
                'vote_average': content.get('vote_average', 0),
                'similarity_score': round(item['similarity'], 4),
                'genre_ids': content.get('genre_ids', [])
            })
        
        return jsonify({
            'current_content': {
                'id': current_content['id'],
                'title': current_content.get('title', current_content.get('name', 'Unknown')),
                'type': current_content['type']
            },
            'recommendations': recommendations,
            'total_recommendations': len(recommendations),
            'algorithm': 'TF-IDF + Cosine Similarity'
        })
        
    except Exception as e:
        return jsonify({'error': f'서버 오류: {str(e)}'}), 500

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
    global all_contents_data
    status = {
        'status': 'OK', 
        'message': 'API 서버가 정상 작동 중입니다.',
        'data_loaded': all_contents_data is not None,
        'total_contents': len(all_contents_data) if all_contents_data else 0
    }
    return jsonify(status)

@app.route('/api/reload-data', methods=['POST'])
def reload_data():
    """데이터 재로드 API"""
    global all_contents_data, tfidf_matrix, tfidf_vectorizer
    
    # 기존 데이터 초기화
    all_contents_data = None
    tfidf_matrix = None
    tfidf_vectorizer = None
    
    # 데이터 재로드
    if load_all_contents():
        return jsonify({'message': '데이터가 성공적으로 재로드되었습니다.'})
    else:
        return jsonify({'error': '데이터 재로드에 실패했습니다.'}), 500

if __name__ == '__main__':
    print("영화 키워드 추출 및 콘텐츠 추천 API 서버를 시작합니다...")
    print("엔드포인트:")
    print("- POST /api/extract-keywords")
    print("- POST /api/recommend-content")
    print("- POST /api/reload-data")
    print("- GET /api/health")
    
    # 서버 시작 시 데이터 로드
    print("콘텐츠 데이터를 로드하는 중...")
    load_all_contents()
    
    app.run(debug=True, host='0.0.0.0', port=5000) 
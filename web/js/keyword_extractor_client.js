// 클라이언트 사이드 키워드 추출기 (API 서버 없이 사용 가능)
class ClientKeywordExtractor {
    constructor() {
        // 영어 불용어 목록
        this.stopWords = new Set([
            'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from',
            'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the',
            'to', 'was', 'will', 'with', 'but', 'or', 'not', 'no', 'can',
            'had', 'have', 'this', 'they', 'we', 'you', 'your', 'his', 'her',
            'their', 'what', 'when', 'where', 'who', 'why', 'how', 'all',
            'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some',
            'such', 'only', 'own', 'same', 'so', 'than', 'too', 'very',
            'just', 'now', 'here', 'there', 'up', 'out', 'if', 'about',
            'into', 'through', 'during', 'before', 'after', 'above', 'below',
            // 영화 관련 일반적인 단어들
            'movie', 'film', 'story', 'character', 'plot', 'scene', 'drama',
            'action', 'comedy', 'thriller', 'horror', 'one', 'two', 'three',
            'first', 'second', 'last', 'new', 'old', 'good', 'bad', 'big',
            'small', 'man', 'woman', 'people', 'person', 'life', 'time',
            'way', 'world', 'day', 'year', 'home', 'family', 'get', 'go',
            'come', 'take', 'make', 'see', 'know', 'think', 'look', 'want',
            'give', 'use', 'work', 'call', 'try', 'ask', 'need', 'feel',
            'become', 'leave', 'put', 'mean', 'keep', 'let', 'begin', 'seem',
            'help', 'talk', 'turn', 'start', 'show', 'hear', 'play', 'run',
            'move', 'live', 'believe', 'hold', 'bring', 'happen', 'write',
            'provide', 'sit', 'stand', 'lose', 'pay', 'meet', 'include',
            'continue', 'set', 'learn', 'change', 'lead', 'understand',
            'watch', 'follow', 'stop', 'create', 'speak', 'read', 'allow',
            'add', 'spend', 'grow', 'open', 'walk', 'win', 'offer', 'remember',
            'love', 'consider', 'appear', 'buy', 'wait', 'serve', 'die',
            'send', 'expect', 'build', 'stay', 'fall', 'cut', 'reach', 'kill',
            'remain', 'suggest', 'raise', 'pass', 'sell', 'require', 'report',
            'decide', 'pull'
        ]);
    }

    // 텍스트 전처리
    preprocessText(text) {
        if (!text) return '';

        return text
            .toLowerCase()
            .replace(/[^\w\s]/g, ' ')  // 특수문자 제거
            .replace(/\s+/g, ' ')      // 연속 공백 제거
            .trim();
    }

    // 단어 토큰화 및 필터링
    tokenize(text) {
        const words = this.preprocessText(text).split(' ');
        return words.filter(word =>
            word.length >= 3 &&
            !this.stopWords.has(word) &&
            !/^\d+$/.test(word)  // 숫자만 있는 단어 제외
        );
    }

    // 단어 빈도수 계산
    calculateWordFrequency(tokens) {
        const frequency = {};
        tokens.forEach(token => {
            frequency[token] = (frequency[token] || 0) + 1;
        });
        return frequency;
    }

    // 2-gram 생성
    generateBigrams(tokens) {
        const bigrams = [];
        for (let i = 0; i < tokens.length - 1; i++) {
            const bigram = `${tokens[i]} ${tokens[i + 1]}`;
            bigrams.push(bigram);
        }
        return bigrams;
    }

    // 키워드 추출 (빈도수 기반)
    extractKeywords(text, maxKeywords = 8) {
        if (!text || text.trim().length === 0) {
            return [];
        }

        const tokens = this.tokenize(text);
        if (tokens.length === 0) {
            return [];
        }

        // 단일 단어 빈도수
        const wordFreq = this.calculateWordFrequency(tokens);

        // 2-gram 빈도수
        const bigrams = this.generateBigrams(tokens);
        const bigramFreq = this.calculateWordFrequency(bigrams);

        // 단일 단어와 2-gram을 합쳐서 정렬
        const allKeywords = [];

        // 단일 단어 추가
        Object.entries(wordFreq).forEach(([word, freq]) => {
            allKeywords.push({
                word: word,
                count: freq,
                type: 'single',
                score: freq * (word.length > 5 ? 1.2 : 1.0) // 긴 단어에 가중치
            });
        });

        // 2-gram 추가 (빈도수가 2 이상인 것만)
        Object.entries(bigramFreq).forEach(([bigram, freq]) => {
            if (freq >= 2) {
                allKeywords.push({
                    word: bigram,
                    count: freq,
                    type: 'bigram',
                    score: freq * 1.5 // 2-gram에 가중치
                });
            }
        });

        // 점수 기준으로 정렬하고 상위 키워드 반환
        return allKeywords
            .sort((a, b) => b.score - a.score)
            .slice(0, maxKeywords)
            .map(item => ({
                word: item.word,
                count: item.count,
                type: item.type
            }));
    }

    // 감정/테마 분석 (간단한 키워드 매칭)
    analyzeThemes(text) {
        const themes = {
            'action': ['fight', 'battle', 'war', 'combat', 'attack', 'weapon', 'military', 'soldier', 'violence', 'explosive'],
            'romance': ['love', 'romantic', 'relationship', 'marriage', 'wedding', 'kiss', 'heart', 'couple', 'dating'],
            'mystery': ['mystery', 'detective', 'crime', 'murder', 'investigation', 'clue', 'secret', 'hidden', 'solve'],
            'horror': ['horror', 'scary', 'frightening', 'terror', 'fear', 'nightmare', 'ghost', 'demon', 'haunted'],
            'comedy': ['funny', 'humor', 'laugh', 'comedy', 'joke', 'amusing', 'hilarious', 'entertainment'],
            'adventure': ['adventure', 'journey', 'quest', 'explore', 'discovery', 'travel', 'expedition'],
            'fantasy': ['magic', 'magical', 'fantasy', 'wizard', 'supernatural', 'mythical', 'enchanted'],
            'drama': ['emotional', 'dramatic', 'tragedy', 'serious', 'intense', 'personal', 'relationship']
        };

        const lowerText = text.toLowerCase();
        const detectedThemes = [];

        Object.entries(themes).forEach(([theme, keywords]) => {
            const matches = keywords.filter(keyword => lowerText.includes(keyword));
            if (matches.length > 0) {
                detectedThemes.push({
                    theme: theme,
                    matches: matches,
                    confidence: matches.length / keywords.length
                });
            }
        });

        return detectedThemes.sort((a, b) => b.confidence - a.confidence);
    }
}

// 전역 인스턴스 생성
window.clientKeywordExtractor = new ClientKeywordExtractor();

// 클라이언트 사이드 키워드 추출 함수
window.extractKeywordsClient = function (item) {
    try {
        const keywordSection = document.createElement('div');
        keywordSection.id = 'keyword-section-client';
        keywordSection.style.cssText = 'margin: 20px 0; padding: 15px; background: rgba(255,255,255,0.1); border-radius: 8px;';

        if (!item.overview || item.overview.trim().length === 0) {
            keywordSection.innerHTML = `
                <h3 style="color: #ffcc00; margin-bottom: 10px; font-size: 18px;">🔍 키워드 분석</h3>
                <p style="color: #ccc;">줄거리 정보가 없어 키워드를 추출할 수 없습니다.</p>
            `;
        } else {
            // 키워드 추출
            const keywords = window.clientKeywordExtractor.extractKeywords(item.overview, 8);
            const themes = window.clientKeywordExtractor.analyzeThemes(item.overview);

            if (keywords.length > 0) {
                const keywordTags = keywords.map(keyword => {
                    const bgColor = keyword.type === 'bigram' ? '#4ecdc4' : '#45b7d1';
                    return `<span style="display: inline-block; background: ${bgColor}; color: white; padding: 5px 10px; margin: 3px; border-radius: 15px; font-size: 12px; font-weight: bold;">${keyword.word} (${keyword.count})</span>`;
                }).join('');

                let themeInfo = '';
                if (themes.length > 0) {
                    const topThemes = themes.slice(0, 3).map(t => t.theme).join(', ');
                    themeInfo = `<p style="color: #ccc; font-size: 12px; margin-top: 8px;">🎭 감지된 테마: ${topThemes}</p>`;
                }

                keywordSection.innerHTML = `
                    <h3 style="color: #ffcc00; margin-bottom: 10px; font-size: 18px;">🔍 키워드 분석</h3>
                    <p style="color: #ccc; margin-bottom: 10px;">줄거리에서 추출한 주요 키워드들:</p>
                    <div>${keywordTags}</div>
                    ${themeInfo}
                    <p style="color: #888; font-size: 11px; margin-top: 8px;">* 클라이언트 측 분석 결과입니다</p>
                `;
            } else {
                keywordSection.innerHTML = `
                    <h3 style="color: #ffcc00; margin-bottom: 10px; font-size: 18px;">🔍 키워드 분석</h3>
                    <p style="color: #ccc;">유의미한 키워드를 찾을 수 없습니다.</p>
                `;
            }
        }

        // overview 다음에 키워드 섹션 삽입
        const overviewElement = document.getElementById('movie-overview');
        if (overviewElement && overviewElement.parentNode) {
            overviewElement.parentNode.insertBefore(keywordSection, overviewElement.nextSibling);
        }

    } catch (error) {
        console.error('클라이언트 키워드 추출 오류:', error);
    }
}; 
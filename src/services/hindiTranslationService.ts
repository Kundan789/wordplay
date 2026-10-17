/**
 * Hindi Translation Service
 * Combines curated contextual Hindi definitions with free MyMemory API fallback & local caching
 */

const HINDI_CACHE_KEY = 'wordplay_hindi_cache';

// Curated high-accuracy Hindi translations with cultural nuances
export const CURATED_HINDI_DICTIONARY: Record<string, string> = {
  serendipity: 'संयोग (सुखद आकस्मिक खोज)',
  ephemeral: 'क्षणिक (अल्पकालिक, नश्वर)',
  petrichor: 'सोंधी खुशबू (पहली बारिश में मिट्टी की महक)',
  mellifluous: 'मधुर (कर्णप्रिय, शहद जैसा मीठा)',
  eloquent: 'वाक्पटु (सुवक्ता, प्रभावशाली बोलने वाला)',
  ubiquitous: 'सर्वव्यापी (हर जगह मौजूद)',
  quixotic: 'अव्यावहारिक (काल्पनिक, अत्यधिक आदर्शवादी)',
  resilient: 'लचीला (संकट से शीघ्र उबरने वाला, दृढ़)',
  ineffable: 'अकथनीय (अनिर्वचनीय, शब्दों से परे)',
  sagacious: 'बुद्धिमान (दूरदर्शी, चतुर, ज्ञानी)',
  perspicacious: 'सूक्ष्मदर्शी (तीक्ष्णबुद्धि, भेद पहचानने वाला)',
  fastidious: 'नकचढ़ा (बारीकबीन, जिसे खुश करना कठिन हो)',
  sycophant: 'चापलूस (चापलूसी करने वाला, चाटुकार)',
  alacrity: 'तत्परता (उत्साहपूर्वक फुर्ती, उत्सुकता)',
  sanguine: 'आशावादी (उत्साही, सकारात्मक)',
  candid: 'स्पष्टवादी (खरा, निष्कपट, सच्चा)',
  versatile: 'बहुमुखी (विभिन्न कार्यों में निपुण)',
  pragmatic: 'व्यावहारिक (तथ्यपरक, यथार्थवादी)',
  lucid: 'स्पष्ट (सुबोध, समझने में आसान)',
  catharsis: 'भाव-विरेचन (मानसिक शुद्धि / भावनात्मक राहत)',
  labyrinthine: 'भूलभुलैया जैसा (जटिल, उलझा हुआ)',
  panacea: 'रामबाण (सर्व रोग निवारक, अचूक उपाय)',
  hubris: 'घमंड (अहंकार, अति-आत्मविश्वास)',
  cacophony: 'कर्कश ध्वनि (बेसुरी व अप्रिय आवाज़)',
  sonder: 'सहानुभूतिपूर्ण बोध (यह एहसास कि हर राहगीर का जीवन जटिल है)',
  halcyon: 'शांत और सुखद (स्वर्ण काल, शांतिपूर्ण)',
  zenith: 'शीर्ष बिंदु (चरम सीमा, पराकाष्ठा)',
  nadir: 'पतन का निम्नतम बिंदु (गर्त)',
  enigma: 'पहेली (रहस्य, गूढ़ व्यक्ति या बात)',
  voracious: 'पेटू (अति उत्साही, अतृप्त)',
  pernicious: 'घातक (हानिकारक, विनाशकारी)',
  benevolent: 'परोपकारी (दयालु, कृपालु)',
  epiphany: 'आत्मज्ञान (अचानक दिव्य अनुभूति)',
  nostalgia: 'पुरानी यादों की तड़प (अतीत की सुखद स्मृति)',
  paradox: 'विरोधाभास (सत्य प्रतीत होने वाला उलझाव)',
  plethora: 'भरमार (अतिशयता, प्रचुरता)',
  tenacious: 'दृढ़ (अटल, लगनशील)',
  meticulous: 'अति-सावधान (विस्तृत व सूक्ष्म ध्यान देने वाला)',
  ambivalent: 'उभयभावी (दुविधापूर्ण, मिश्रित भावना वाला)',
  esoteric: 'गूढ़ (रहस्यमय, केवल विशेषज्ञों के समझने योग्य)',
  taciturn: 'कम बोलने वाला (अल्पभाषी, मितभाषी)',
  anachronism: 'कालदोष (समय के विरुद्ध या पुराना रिवाज)',
  belligerent: 'लड़ाकू (युद्धप्रिय, आक्रामक)',
  capricious: 'मनमौजी (चंचल, अप्रत्याशित)',
  deleterious: 'हानिकारक (हानिप्रद, नुकसानदेह)',
  gregarious: 'मिलनसार (झुंड में रहने वाला, सामाजिक)',
  harangue: 'उत्तेजक लंबा भाषण (आक्रोशपूर्ण भाषण)',
  juxtaposition: 'समीप रखना (तुलना हेतु साथ रखना)',
  magnanimous: 'उदार (महान हृदय वाला, क्षमाशील)',
  nonchalant: 'लापरवाह (शांत, बेपरवाह)',
  obsequious: 'चापलूसी करने वाला (अत्यधिक विनम्र, जी-हजूरी)',
  panache: 'ठाठ-बाट (आत्मविश्वास भरी शैली, शान)',
  quandary: 'दुविधा (असमंजस की स्थिति, पहेली)',
  recalcitrant: 'अवज्ञाकारी (हठी, बात न मानने वाला)',
  scrupulous: 'ईमानदार (नैतिक दृष्टि से सतर्क, निष्ठावान)',
  transient: 'अस्थायी (क्षणभंगुर, कुछ समय का)',
  unwieldy: 'बोझिल (संभालने में कठिन, भारी-भरकम)',
  vicarious: 'परोक्ष (दूसरों के अनुभव के माध्यम से महसूस करना)',
  wistful: 'उदासीन इच्छा (उदास और लालसापूर्ण)'
};

class HindiTranslationService {
  private cache: Map<string, string> = new Map();

  constructor() {
    // 1. Seed with curated dictionary
    Object.entries(CURATED_HINDI_DICTIONARY).forEach(([k, v]) => {
      this.cache.set(k.toLowerCase(), v);
    });

    // 2. Load cached translations from storage
    try {
      const stored = localStorage.getItem(HINDI_CACHE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        Object.entries(parsed).forEach(([k, v]) => {
          this.cache.set(k.toLowerCase(), v as string);
        });
      }
    } catch (e) {}
  }

  private persist(): void {
    try {
      const obj: Record<string, string> = {};
      this.cache.forEach((v, k) => {
        obj[k] = v;
      });
      localStorage.setItem(HINDI_CACHE_KEY, JSON.stringify(obj));
    } catch (e) {}
  }

  /**
   * Synchronous check for 0ms instant display
   */
  public getInstantHindi(word: string): string | undefined {
    return this.cache.get(word.trim().toLowerCase());
  }

  /**
   * Async translation fetcher with caching
   */
  public async getHindiMeaning(word: string): Promise<string | undefined> {
    const clean = word.trim().toLowerCase();

    // Cache hit
    if (this.cache.has(clean)) {
      return this.cache.get(clean);
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1600);

      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(clean)}&langpair=en|hi`;
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const text = data?.responseData?.translatedText;
        if (text && typeof text === 'string' && text.trim().length > 0) {
          const cleanedText = text.trim();
          // Verify it didn't just return the same English word
          if (cleanedText.toLowerCase() !== clean) {
            this.cache.set(clean, cleanedText);
            this.persist();
            return cleanedText;
          }
        }
      }
    } catch (e) {}

    return undefined;
  }
}

export const hindiTranslationService = new HindiTranslationService();

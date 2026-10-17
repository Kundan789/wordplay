import { WordCard, WordCategory } from '../types';

export interface CuratedWord extends WordCard {
  categoryTag?: WordCategory;
}

export const CURATED_FALLBACK_WORDS: CuratedWord[] = [
  // --- MIXED / GENERAL DISCOVERY ---
  {
    id: 'serendipity',
    word: 'serendipity',
    phonetic: '/ˌsɛr.ənˈdɪp.ɪ.ti/',
    audioUrl: 'https://api.dictionaryapi.dev/media/pronunciations/en/serendipity-us.mp3',
    partOfSpeech: 'noun',
    definition: 'The occurrence and development of events by chance in a happy or beneficial way.',
    secondaryDefinitions: [
      'Good fortune or luck in finding valuable or agreeable things not sought for.'
    ],
    examples: [
      'A fortunate stroke of serendipity brought the two long-lost childhood friends together at the bustling railway station.',
      'Finding that rare first-edition book tucked inside a bargain bin was pure serendipity.'
    ],
    synonyms: ['fluke', 'providence', 'coincidence', 'good fortune', 'blessing'],
    antonyms: ['misfortune', 'adversity', 'bad luck'],
    etymology: 'Coined by Horace Walpole in 1754 from the Persian fairy tale "The Three Princes of Serendip".',
    difficulty: 'Intermediate',
    categoryTag: 'mixed',
    source: 'curated'
  },
  {
    id: 'ephemeral',
    word: 'ephemeral',
    phonetic: '/ɪˈfɛm.ər.əl/',
    audioUrl: 'https://api.dictionaryapi.dev/media/pronunciations/en/ephemeral-us.mp3',
    partOfSpeech: 'adjective',
    definition: 'Lasting for a very short time; fleeting or momentary.',
    secondaryDefinitions: [
      'Living or lasting only for a single day, as certain insects or plants.'
    ],
    examples: [
      'The morning mist gave the valley an ethereal, ephemeral beauty that vanished the instant the sun ascended.',
      'Fame on social media is often ephemeral, glowing brightly for a weekend before dissolving into obscurity.'
    ],
    synonyms: ['transient', 'fleeting', 'evanescent', 'momentary', 'fugacious'],
    antonyms: ['permanent', 'enduring', 'perpetual', 'everlasting'],
    etymology: 'From Greek ephēmeros, meaning "lasting only one day" (epi = upon, hēmera = day).',
    difficulty: 'Advanced',
    categoryTag: 'mixed',
    source: 'curated'
  },
  {
    id: 'eloquent',
    word: 'eloquent',
    phonetic: '/ˈɛl.ə.kwənt/',
    audioUrl: 'https://api.dictionaryapi.dev/media/pronunciations/en/eloquent-us.mp3',
    partOfSpeech: 'adjective',
    definition: 'Fluent or persuasive in speaking or writing; clearly expressing an idea or emotion.',
    secondaryDefinitions: [
      'Giving a clear, strong message through gestures or appearance without words.'
    ],
    examples: [
      'The activist gave an eloquent appeal for unity that moved hundreds of delegates to a standing ovation.',
      'His silent tear was an eloquent testimony to the profound grief he felt inside.'
    ],
    synonyms: ['articulate', 'expressive', 'persuasive', 'fluent', 'silver-tongued'],
    antonyms: ['inarticulate', 'halting', 'hesitant', 'unconvincing'],
    etymology: 'From Latin eloqui ("to speak out"), combining e- ("out") and loqui ("to speak").',
    difficulty: 'Intermediate',
    categoryTag: 'mixed',
    source: 'curated'
  },
  {
    id: 'ubiquitous',
    word: 'ubiquitous',
    phonetic: '/juːˈbɪk.wɪ.təs/',
    audioUrl: 'https://api.dictionaryapi.dev/media/pronunciations/en/ubiquitous-us.mp3',
    partOfSpeech: 'adjective',
    definition: 'Present, appearing, or found everywhere at the same time.',
    secondaryDefinitions: [
      'Constantly encountered or widespread.'
    ],
    examples: [
      'Smartphones have transformed from novelty gadgets into ubiquitous essentials of modern human existence.',
      'Coffee shops have become ubiquitous fixtures on practically every downtown street corner.'
    ],
    synonyms: ['omnipresent', 'pervasive', 'universal', 'prevalent', 'widespread'],
    antonyms: ['rare', 'scarce', 'isolated', 'uncommon'],
    etymology: 'From Latin ubique ("everywhere"), modeled on earlier French ubiquitous.',
    difficulty: 'Intermediate',
    categoryTag: 'mixed',
    source: 'curated'
  },
  {
    id: 'quixotic',
    word: 'quixotic',
    phonetic: '/kwɪkˈsɒt.ɪk/',
    audioUrl: 'https://api.dictionaryapi.dev/media/pronunciations/en/quixotic-us.mp3',
    partOfSpeech: 'adjective',
    definition: 'Exceedingly idealistic, unrealistic, and impractical.',
    secondaryDefinitions: [
      'Romantic or chivalrous to an extravagant, absurd degree.'
    ],
    examples: [
      'Attempting to single-handedly eliminate corporate bureaucracy was an admirable yet decidedly quixotic venture.',
      'Despite warnings from friends, he embarked on a quixotic quest to build a castle in the wilderness.'
    ],
    synonyms: ['idealistic', 'visionary', 'utopian', 'impractical', 'starry-eyed'],
    antonyms: ['pragmatic', 'realistic', 'practical', 'sober'],
    etymology: 'Derived from Don Quixote, the chivalric hero of Miguel de Cervantes’ famous novel.',
    difficulty: 'Advanced',
    categoryTag: 'mixed',
    source: 'curated'
  },

  // --- ADVANCED / GRE & SAT VOCABULARY ---
  {
    id: 'sagacious',
    word: 'sagacious',
    phonetic: '/səˈɡeɪ.ʃəs/',
    audioUrl: 'https://api.dictionaryapi.dev/media/pronunciations/en/sagacious-us.mp3',
    partOfSpeech: 'adjective',
    definition: 'Having or showing keen mental discernment and good judgment; shrewd and wise.',
    secondaryDefinitions: [
      'Possessing profound philosophical understanding and foresight.'
    ],
    examples: [
      'Thanks to the sagacious advice of the senior mentor, the team avoided a catastrophic investment pitfall.',
      'The sagacious diplomat negotiated a peaceful resolution that satisfied both adversarial nations.'
    ],
    synonyms: ['wise', 'shrewd', 'perspicacious', 'astute', 'perceptive'],
    antonyms: ['foolish', 'naive', 'shortsighted', 'ignorant'],
    etymology: 'From Latin sagax ("of quick perception, acute"), related to sagire ("to perceive keenly").',
    difficulty: 'Master',
    categoryTag: 'advanced',
    source: 'curated'
  },
  {
    id: 'perspicacious',
    word: 'perspicacious',
    phonetic: '/ˌpɜː.spɪˈkeɪ.ʃəs/',
    audioUrl: 'https://api.dictionaryapi.dev/media/pronunciations/en/perspicacious-us.mp3',
    partOfSpeech: 'adjective',
    definition: 'Having a ready insight into and understanding of things; mentally acute.',
    secondaryDefinitions: [
      'Quick to notice hidden patterns, motives, or subtle discrepancies.'
    ],
    examples: [
      'The perspicacious detective immediately deduced that the missing manuscript had never left the library study.',
      'Her perspicacious analysis of market trends allowed the firm to anticipate consumer habits months ahead.'
    ],
    synonyms: ['discerning', 'insightful', 'sharp-witted', 'incisive', 'penetrating'],
    antonyms: ['dull', 'obtuse', 'unperceptive'],
    etymology: 'From Latin perspicax ("sharp-sighted"), from perspicere ("to look through, examine closely").',
    difficulty: 'Master',
    categoryTag: 'advanced',
    source: 'curated'
  },
  {
    id: 'fastidious',
    word: 'fastidious',
    phonetic: '/fæˈstɪd.i.əs/',
    audioUrl: 'https://api.dictionaryapi.dev/media/pronunciations/en/fastidious-us.mp3',
    partOfSpeech: 'adjective',
    definition: 'Very attentive to and concerned about accuracy and detail; meticulous.',
    secondaryDefinitions: [
      'Very concerned about matters of cleanliness; hard to please.'
    ],
    examples: [
      'The architect was celebrated for his fastidious attention to acoustic perfection and joint precision.',
      'Her laboratory notebook was kept with fastidious neatness, recording temperature down to millidegrees.'
    ],
    synonyms: ['meticulous', 'scrupulous', 'painstaking', 'punctilious', 'finicky'],
    antonyms: ['careless', 'sloppy', 'lax', 'negligent'],
    etymology: 'From Latin fastidiosus ("disdainful, squeamish"), from fastidium ("loathing, aversion").',
    difficulty: 'Advanced',
    categoryTag: 'advanced',
    source: 'curated'
  },
  {
    id: 'sycophant',
    word: 'sycophant',
    phonetic: '/ˈsɪk.ə.fænt/',
    audioUrl: 'https://api.dictionaryapi.dev/media/pronunciations/en/sycophant-us.mp3',
    partOfSpeech: 'noun',
    definition: 'A person who acts obsequiously toward someone important in order to gain advantage; a flatterer.',
    secondaryDefinitions: [
      'A servile self-seeker who uses excessive praise to win favor.'
    ],
    examples: [
      'Surrounded by sycophants who never challenged his decrees, the executive lost all touch with consumer reality.',
      'She refused to play the sycophant just to earn a promotion, preferring honest critique.'
    ],
    synonyms: ['toady', 'flatterer', 'fawner', 'lackey', 'yes-man'],
    antonyms: ['critic', 'detractor', 'independent thinker'],
    etymology: 'From Greek sukophantēs, literally "informer showing figs" (sukon = fig, phainein = to show).',
    difficulty: 'Master',
    categoryTag: 'advanced',
    source: 'curated'
  },
  {
    id: 'alacrity',
    word: 'alacrity',
    phonetic: '/əˈlæk.rɪ.ti/',
    audioUrl: 'https://api.dictionaryapi.dev/media/pronunciations/en/alacrity-us.mp3',
    partOfSpeech: 'noun',
    definition: 'Brisk and cheerful readiness; eager and prompt willingness.',
    secondaryDefinitions: [
      'Liveliness, promptitude, or speed in executing a requested duty.'
    ],
    examples: [
      'When asked to lead the innovative research expedition, she accepted with enthusiastic alacrity.',
      'The students gathered their backpacks with unexpected alacrity once the field trip was announced.'
    ],
    synonyms: ['eagerness', 'willingness', 'promptness', 'zeal', 'readiness'],
    antonyms: ['reluctance', 'hesitation', 'apathy', 'sluggishness'],
    etymology: 'From Latin alacritas, from alacer ("lively, brisk, eager").',
    difficulty: 'Master',
    categoryTag: 'advanced',
    source: 'curated'
  },
  {
    id: 'sanguine',
    word: 'sanguine',
    phonetic: '/ˈsæŋ.ɡwɪn/',
    audioUrl: 'https://api.dictionaryapi.dev/media/pronunciations/en/sanguine-us.mp3',
    partOfSpeech: 'adjective',
    definition: 'Optimistic or positive, especially in an apparently bad or difficult situation.',
    secondaryDefinitions: [
      'Having a healthy, reddish, florid complexion.'
    ],
    examples: [
      'Despite the economic downturn, the startup founder remained remarkably sanguine about their launch timeline.',
      'His sanguine personality served as an anchor of calm reassurance for the panicked crew.'
    ],
    synonyms: ['optimistic', 'buoyant', 'hopeful', 'cheerful', 'confident'],
    antonyms: ['pessimistic', 'gloomy', 'despondent', 'cynical'],
    etymology: 'From Latin sanguineus ("of blood"), from medieval humoral theory associating blood with bravery and cheer.',
    difficulty: 'Advanced',
    categoryTag: 'advanced',
    source: 'curated'
  },

  // --- POETIC & EVOCATIVE VOCABULARY ---
  {
    id: 'petrichor',
    word: 'petrichor',
    phonetic: '/ˈpɛt.rɪ.kɔːr/',
    audioUrl: 'https://api.dictionaryapi.dev/media/pronunciations/en/petrichor-us.mp3',
    partOfSpeech: 'noun',
    definition: 'A pleasant, distinctive earthy smell that frequently accompanies the first rain after a long period of warm, dry weather.',
    secondaryDefinitions: [
      'The aroma produced when airborne plant oils and bacterial geosmin are aerosolized by rain.'
    ],
    examples: [
      'As the afternoon thundercloud broke over the sun-baked garden, the intoxicating petrichor drifted through the porch.',
      'She paused on the steps, savoring the rich petrichor of the renewed mountain trail.'
    ],
    synonyms: ['rain scent', 'earthy aroma', 'geosmin fragrance'],
    antonyms: [],
    etymology: 'Formed from Greek petra ("stone") + īchōr ("the ethereal fluid in the veins of the gods").',
    difficulty: 'Advanced',
    categoryTag: 'evocative',
    source: 'curated'
  },
  {
    id: 'mellifluous',
    word: 'mellifluous',
    phonetic: '/məˈlɪf.lu.əs/',
    audioUrl: 'https://api.dictionaryapi.dev/media/pronunciations/en/mellifluous-us.mp3',
    partOfSpeech: 'adjective',
    definition: 'Sweet or musical; pleasantly smooth and soothing to hear.',
    secondaryDefinitions: [
      'Flowing like golden honey; sweetened with melody.'
    ],
    examples: [
      'The classical harpist played a mellifluous melody that washed all tension out of the crowded sanctuary.',
      'His mellifluous voice was an immediate asset for nighttime audio storytelling.'
    ],
    synonyms: ['dulcet', 'harmonious', 'euphonious', 'tuneful', 'sweet-sounding'],
    antonyms: ['cacophonous', 'jarring', 'strident', 'grating'],
    etymology: 'From Late Latin mellifluus, from mel ("honey") + fluere ("to flow").',
    difficulty: 'Master',
    categoryTag: 'evocative',
    source: 'curated'
  },
  {
    id: 'ineffable',
    word: 'ineffable',
    phonetic: '/ɪnˈɛf.ə.bəl/',
    audioUrl: 'https://api.dictionaryapi.dev/media/pronunciations/en/ineffable-us.mp3',
    partOfSpeech: 'adjective',
    definition: 'Too great, powerful, or beautiful to be expressed or described in words.',
    secondaryDefinitions: [
      'Not to be spoken because of sacredness or taboo.'
    ],
    examples: [
      'Gazing into the star-dusted canopy of the ancient forest inspired an ineffable reverence in all of us.',
      'The joy of holding her newborn child was an ineffable feeling beyond any poetic verse.'
    ],
    synonyms: ['indescribable', 'unutterable', 'transcendent', 'inexpressible'],
    antonyms: ['definable', 'expressible', 'describable'],
    etymology: 'From Latin ineffabilis, from in- ("not") + effabilis ("speakable").',
    difficulty: 'Master',
    categoryTag: 'evocative',
    source: 'curated'
  },
  {
    id: 'sonder',
    word: 'sonder',
    phonetic: '/ˈsɒn.dər/',
    audioUrl: '',
    partOfSpeech: 'noun',
    definition: 'The profound realization that each random passerby is living a life as vivid and complex as your own.',
    secondaryDefinitions: [
      'An awareness of the countless interconnected personal universes walking past you every day.'
    ],
    examples: [
      'Standing on the subway platform among evening commuters, he experienced a quiet rush of sonder.',
      'A fleeting feeling of sonder reminds us that we are all protagonists in our own intimate epics.'
    ],
    synonyms: ['empathy', 'perspective', 'deep awareness'],
    antonyms: ['solipsism', 'self-absorption', 'narcissism'],
    etymology: 'Coined by John Koenig in "The Dictionary of Obscure Sorrows", inspired by German sonder ("special").',
    difficulty: 'Master',
    categoryTag: 'evocative',
    source: 'curated'
  },
  {
    id: 'halcyon',
    word: 'halcyon',
    phonetic: '/ˈhæl.si.ən/',
    audioUrl: 'https://api.dictionaryapi.dev/media/pronunciations/en/halcyon-us.mp3',
    partOfSpeech: 'adjective',
    definition: 'Denoting a period of time in the past that was idyllically happy, peaceful, and prosperous.',
    secondaryDefinitions: [
      'Calm, serene, and untroubled; tranquil.'
    ],
    examples: [
      'Grandmother fondly recalled the halcyon summers of her childhood spent rowing across the quiet bay.',
      'The small seaside village enjoyed a brief halcyon era before modernization altered its cadence.'
    ],
    synonyms: ['serene', 'tranquil', 'golden', 'idyllic', 'peaceful'],
    antonyms: ['turbulent', 'stormy', 'chaotic', 'miserable'],
    etymology: 'From Greek halkuōn ("kingfisher"), linked to the mythical bird believed to charm winter seas into stillness.',
    difficulty: 'Advanced',
    categoryTag: 'evocative',
    source: 'curated'
  },

  // --- DAILY CONVERSATIONAL MASTERY ---
  {
    id: 'resilient',
    word: 'resilient',
    phonetic: '/rɪˈzɪl.jənt/',
    audioUrl: 'https://api.dictionaryapi.dev/media/pronunciations/en/resilient-us.mp3',
    partOfSpeech: 'adjective',
    definition: 'Able to withstand or recover quickly from difficult conditions, adversity, or damage.',
    secondaryDefinitions: [
      'Capable of springing back into original shape after bending, stretching, or compression.'
    ],
    examples: [
      'The local community proved remarkably resilient in rebuilding their school after the flood.',
      'Developing a resilient mindset helps you reframe setbacks as valuable tuition for future success.'
    ],
    synonyms: ['tenacious', 'hardy', 'buoyant', 'adaptable', 'tough'],
    antonyms: ['fragile', 'vulnerable', 'brittle', 'weak'],
    etymology: 'From Latin resilire, meaning "to leap back or rebound".',
    difficulty: 'Beginner',
    categoryTag: 'daily',
    source: 'curated'
  },
  {
    id: 'candid',
    word: 'candid',
    phonetic: '/ˈkæn.dɪd/',
    audioUrl: 'https://api.dictionaryapi.dev/media/pronunciations/en/candid-us.mp3',
    partOfSpeech: 'adjective',
    definition: 'Truthful and straightforward; frank and unreserved in speech.',
    secondaryDefinitions: [
      'Taken informally or without the subjects knowledge (as in a candid photograph).'
    ],
    examples: [
      'During the retrospective meeting, the engineer provided a refreshingly candid assessment of our flaws.',
      'She appreciated his candid feedback far more than vague, empty polite platitudes.'
    ],
    synonyms: ['frank', 'outspoken', 'forthright', 'honest', 'direct'],
    antonyms: ['guarded', 'insincere', 'deceitful', 'evasive'],
    etymology: 'From Latin candidus ("white, pure, clean"), implying purity and honesty of motive.',
    difficulty: 'Intermediate',
    categoryTag: 'daily',
    source: 'curated'
  },
  {
    id: 'versatile',
    word: 'versatile',
    phonetic: '/ˈvɜː.sə.taɪl/',
    audioUrl: 'https://api.dictionaryapi.dev/media/pronunciations/en/versatile-us.mp3',
    partOfSpeech: 'adjective',
    definition: 'Able to adapt or be adapted to many different functions or activities.',
    secondaryDefinitions: [
      'Changeable, variable, or capable of turning with ease.'
    ],
    examples: [
      'A cast iron skillet is arguably the most versatile piece of cookware in any home kitchen.',
      'Her versatile programming background enabled her to lead both frontend and data engineering teams.'
    ],
    synonyms: ['adaptable', 'flexible', 'multitalented', 'all-around', 'resourceful'],
    antonyms: ['inflexible', 'limited', 'rigid', 'one-dimensional'],
    etymology: 'From Latin versatilis ("turning easily"), from versare ("to keep turning").',
    difficulty: 'Beginner',
    categoryTag: 'daily',
    source: 'curated'
  },
  {
    id: 'pragmatic',
    word: 'pragmatic',
    phonetic: '/præɡˈmæt.ɪk/',
    audioUrl: 'https://api.dictionaryapi.dev/media/pronunciations/en/pragmatic-us.mp3',
    partOfSpeech: 'adjective',
    definition: 'Dealing with things sensibly and realistically based on practical rather than theoretical considerations.',
    secondaryDefinitions: [
      'Relating to matters of fact or practical utility.'
    ],
    examples: [
      'We need a pragmatic strategy that works within our current budget rather than an idealistic wishlist.',
      'He took a pragmatic view of career transitions, acquiring practical skills before leaving his post.'
    ],
    synonyms: ['practical', 'realistic', 'sensible', 'hardheaded', 'down-to-earth'],
    antonyms: ['idealistic', 'impractical', 'utopian', 'quixotic'],
    etymology: 'From Greek pragmatikos ("relating to civil affairs or business"), from pragma ("deed, act").',
    difficulty: 'Intermediate',
    categoryTag: 'daily',
    source: 'curated'
  },
  {
    id: 'lucid',
    word: 'lucid',
    phonetic: '/ˈluː.sɪd/',
    audioUrl: 'https://api.dictionaryapi.dev/media/pronunciations/en/lucid-us.mp3',
    partOfSpeech: 'adjective',
    definition: 'Expressed clearly; easy to understand; showing ability to think clearly.',
    secondaryDefinitions: [
      'Bright or luminous; shining with clarity.'
    ],
    examples: [
      'The physics professor delivered a remarkably lucid explanation of quantum entanglement.',
      'In a rare lucid moment amidst the fever, the patient clearly recognized her family members.'
    ],
    synonyms: ['clear', 'coherent', 'intelligible', 'transparent', 'articulate'],
    antonyms: ['confusing', 'opaque', 'muddled', 'ambiguous'],
    etymology: 'From Latin lucidus ("light, clear"), from lucere ("to shine").',
    difficulty: 'Beginner',
    categoryTag: 'daily',
    source: 'curated'
  },

  // --- LITERARY CLASSICS ---
  {
    id: 'catharsis',
    word: 'catharsis',
    phonetic: '/kəˈθɑːr.sɪs/',
    audioUrl: 'https://api.dictionaryapi.dev/media/pronunciations/en/catharsis-us.mp3',
    partOfSpeech: 'noun',
    definition: 'The process of releasing, and thereby providing relief from, strong or repressed emotions.',
    secondaryDefinitions: [
      'The emotional purification evoked by dramatic tragedy in classical literature.'
    ],
    examples: [
      'Writing about his wartime experiences served as a vital emotional catharsis that helped him heal.',
      'The audiences tears at the plays climax represented a profound collective catharsis.'
    ],
    synonyms: ['purging', 'release', 'cleansing', 'liberation', 'relief'],
    antonyms: ['repression', 'suppression', 'restraint'],
    etymology: 'From Greek katharsis, from kathairein ("to cleanse, purify").',
    difficulty: 'Advanced',
    categoryTag: 'literature',
    source: 'curated'
  },
  {
    id: 'labyrinthine',
    word: 'labyrinthine',
    phonetic: '/ˌlæb.əˈrɪn.θaɪn/',
    audioUrl: 'https://api.dictionaryapi.dev/media/pronunciations/en/labyrinthine-us.mp3',
    partOfSpeech: 'adjective',
    definition: 'Irregular and twisting like a labyrinth; intricate, convoluted, and confusing.',
    secondaryDefinitions: [
      'Complicated, tortuous, or knotty in structure or argument.'
    ],
    examples: [
      'The visitors wandered happily through the labyrinthine cobblestone alleys of the historic district.',
      'Deciphering the labyrinthine prose of the legal agreement required hours of consultation.'
    ],
    synonyms: ['intricate', 'convoluted', 'tortuous', 'complex', 'maze-like'],
    antonyms: ['straightforward', 'simple', 'direct', 'linear'],
    etymology: 'From Greek labyrinthos, the mythological maze of Crete built by Daedalus.',
    difficulty: 'Advanced',
    categoryTag: 'literature',
    source: 'curated'
  },
  {
    id: 'panacea',
    word: 'panacea',
    phonetic: '/ˌpæn.əˈsiː.ə/',
    audioUrl: 'https://api.dictionaryapi.dev/media/pronunciations/en/panacea-us.mp3',
    partOfSpeech: 'noun',
    definition: 'A solution or remedy for all difficulties or diseases; a universal cure-all.',
    secondaryDefinitions: [
      'Something expected to eliminate all difficulties.'
    ],
    examples: [
      'While education is transformative, it cannot act as a solitary panacea for generational poverty.',
      'Online apps were heralded as a panacea for loneliness, yet genuine connection still takes time.'
    ],
    synonyms: ['cure-all', 'universal remedy', 'elixir', 'silver bullet'],
    antonyms: ['toxin', 'poison', 'complication'],
    etymology: 'From Greek panakeia, from pan ("all") + akos ("remedy"). Panakeia was goddess of universal healing.',
    difficulty: 'Intermediate',
    categoryTag: 'literature',
    source: 'curated'
  },
  {
    id: 'hubris',
    word: 'hubris',
    phonetic: '/ˈhjuː.brɪs/',
    audioUrl: 'https://api.dictionaryapi.dev/media/pronunciations/en/hubris-us.mp3',
    partOfSpeech: 'noun',
    definition: 'Excessive pride, arrogance, or self-confidence that ultimately causes a downfall.',
    secondaryDefinitions: [
      'In Greek tragedy, defiance of the gods that invites retribution (nemesis).'
    ],
    examples: [
      'The tech executives hubris blinded him to the emerging competitors that eventually displaced his product.',
      'Classic literature consistently warns that unchecked hubris precedes an inevitable fall.'
    ],
    synonyms: ['arrogance', 'conceit', 'haughtiness', 'pomposity', 'overconfidence'],
    antonyms: ['humility', 'modesty', 'diffidence', 'meekness'],
    etymology: 'From ancient Greek hubris, meaning wanton insolence or defiance of cosmic order.',
    difficulty: 'Advanced',
    categoryTag: 'literature',
    source: 'curated'
  },
  {
    id: 'cacophony',
    word: 'cacophony',
    phonetic: '/kəˈkɒf.ə.ni/',
    audioUrl: 'https://api.dictionaryapi.dev/media/pronunciations/en/cacophony-us.mp3',
    partOfSpeech: 'noun',
    definition: 'A harsh, discordant mixture of sounds; an unpleasant jarring noise.',
    secondaryDefinitions: [
      'An unharmonious clash of elements.'
    ],
    examples: [
      'A cacophony of sirens, car horns, and construction drills assaulted our ears the moment we exited the station.',
      'The meeting descended into a cacophony of shouting voices before order was restored.'
    ],
    synonyms: ['din', 'racket', 'clamor', 'dissonance', 'discord'],
    antonyms: ['harmony', 'symphony', 'euphony', 'serenity'],
    etymology: 'From Greek kakophōnia, from kakos ("bad") + phōnē ("voice, sound").',
    difficulty: 'Advanced',
    categoryTag: 'literature',
    source: 'curated'
  }
];

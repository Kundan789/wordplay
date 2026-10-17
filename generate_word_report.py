import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
import os

def set_cell_background(cell, hex_color):
    tcPr = cell._element.get_or_add_tcPr()
    shd = OxmlElement('w:shd')
    shd.set(qn('w:val'), 'clear')
    shd.set(qn('w:color'), 'auto')
    shd.set(qn('w:fill'), hex_color)
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._element.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
        node = OxmlElement(f'w:{m}')
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def create_document():
    doc = docx.Document()

    # Page Margins
    for section in doc.sections:
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)
        section.left_margin = Inches(1.0)
        section.right_margin = Inches(1.0)

    # Styles
    normal_style = doc.styles['Normal']
    normal_style.font.name = 'Calibri'
    normal_style.font.size = Pt(11)
    normal_style.font.color.rgb = RGBColor(40, 50, 60)
    normal_style.paragraph_format.line_spacing = 1.2
    normal_style.paragraph_format.space_after = Pt(6)

    # Title Banner
    title_p = doc.add_paragraph()
    title_p.paragraph_format.space_before = Pt(0)
    title_p.paragraph_format.space_after = Pt(4)
    run_title = title_p.add_run("WordPlay — Interactive Vocabulary Platform")
    run_title.font.name = 'Georgia'
    run_title.font.size = Pt(26)
    run_title.font.bold = True
    run_title.font.color.rgb = RGBColor(14, 116, 144) # Deep Teal / Blue

    # Subtitle
    sub_p = doc.add_paragraph()
    sub_p.paragraph_format.space_after = Pt(20)
    run_sub = sub_p.add_run("Comprehensive Product Architecture, Educational Methodology & End-to-End User Impact Report")
    run_sub.font.size = Pt(13)
    run_sub.font.italic = True
    run_sub.font.color.rgb = RGBColor(100, 116, 139)

    # Divider Table
    t_div = doc.add_table(rows=1, cols=1)
    t_div.alignment = WD_TABLE_ALIGNMENT.CENTER
    c = t_div.rows[0].cells[0]
    c.width = Inches(6.5)
    set_cell_background(c, "0EA5E9")
    p_div = c.paragraphs[0]
    p_div.paragraph_format.space_before = Pt(2)
    p_div.paragraph_format.space_after = Pt(2)
    r_div = p_div.add_run("")
    r_div.font.size = Pt(2)

    doc.add_paragraph().paragraph_format.space_after = Pt(12)

    # Metadata Box
    meta_table = doc.add_table(rows=4, cols=2)
    meta_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    meta_data = [
        ("Product Name", "WordPlay (Vocab Swipe PWA)"),
        ("Architecture", "React 19, TypeScript, Tailwind CSS, Vite, HTML5 Web Audio & Web Speech"),
        ("Target Users", "Students (GRE/SAT/IELTS/TOEFL/UPSC), English Learners & Bilingual Hindi Speakers"),
        ("Deployment Target", "GitHub Pages (100% Free, Permanent Hosting with PWA Offline Capabilities)")
    ]
    for i, (k, v) in enumerate(meta_data):
        row = meta_table.rows[i]
        c0, c1 = row.cells[0], row.cells[1]
        c0.width, c1.width = Inches(1.8), Inches(4.7)
        set_cell_margins(c0, 60, 60, 100, 100)
        set_cell_margins(c1, 60, 60, 100, 100)
        set_cell_background(c0, "F1F5F9")
        set_cell_background(c1, "F8FAFC")
        
        p0 = c0.paragraphs[0]
        p0.paragraph_format.space_after = Pt(2)
        r0 = p0.add_run(k)
        r0.font.bold = True
        r0.font.size = Pt(10)
        r0.font.color.rgb = RGBColor(30, 41, 59)
        
        p1 = c1.paragraphs[0]
        p1.paragraph_format.space_after = Pt(2)
        r1 = p1.add_run(v)
        r1.font.size = Pt(10)

    doc.add_paragraph().paragraph_format.space_after = Pt(16)

    # Helper for Headings
    def add_h1(text):
        h = doc.add_paragraph()
        h.paragraph_format.space_before = Pt(18)
        h.paragraph_format.space_after = Pt(6)
        h.paragraph_format.keep_with_next = True
        r = h.add_run(text)
        r.font.name = 'Georgia'
        r.font.size = Pt(18)
        r.font.bold = True
        r.font.color.rgb = RGBColor(15, 23, 42)
        return h

    def add_h2(text):
        h = doc.add_paragraph()
        h.paragraph_format.space_before = Pt(12)
        h.paragraph_format.space_after = Pt(4)
        h.paragraph_format.keep_with_next = True
        r = h.add_run(text)
        r.font.name = 'Georgia'
        r.font.size = Pt(13)
        r.font.bold = True
        r.font.color.rgb = RGBColor(14, 116, 144)
        return h

    def add_bullet(p_or_text, bold_prefix="", text=""):
        p = doc.add_paragraph(style='List Bullet')
        p.paragraph_format.space_before = Pt(1)
        p.paragraph_format.space_after = Pt(3)
        p.paragraph_format.line_spacing = 1.15
        if bold_prefix:
            rb = p.add_run(bold_prefix)
            rb.font.bold = True
            rb.font.color.rgb = RGBColor(30, 41, 59)
        if text:
            p.add_run(text)
        return p

    def add_callout(text, title="KEY TAKEAWAY:"):
        tbl = doc.add_table(rows=1, cols=1)
        tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
        c = tbl.rows[0].cells[0]
        c.width = Inches(6.5)
        set_cell_background(c, "F0F9FF")
        set_cell_margins(c, 120, 120, 160, 160)
        p = c.paragraphs[0]
        p.paragraph_format.space_before = Pt(2)
        p.paragraph_format.space_after = Pt(2)
        rt = p.add_run(title + " ")
        rt.font.bold = True
        rt.font.size = Pt(10.5)
        rt.font.color.rgb = RGBColor(3, 105, 161)
        rt2 = p.add_run(text)
        rt2.font.size = Pt(10.5)
        rt2.font.color.rgb = RGBColor(12, 74, 110)
        doc.add_paragraph().paragraph_format.space_after = Pt(6)

    # -------------------------------------------------------------
    # SECTION 1: EXECUTIVE SUMMARY
    # -------------------------------------------------------------
    add_h1("1. Executive Summary & Core Mission")
    doc.add_paragraph(
        "WordPlay is an interactive, gamified vocabulary acquisition web application engineered to bridge the gap "
        "between casual mobile interaction and rigorous linguistic mastery. Built around a familiar, swipe-driven card "
        "interface ('Tinder for words'), WordPlay transforms vocabulary learning from a dreaded academic chore into an "
        "addictive, frictionless daily ritual."
    )
    doc.add_paragraph(
        "Unlike traditional dictionaries or static flashcard apps, WordPlay provides instant zero-latency pronunciations, "
        "bilingual Hindi conceptual translations, rich contextual usage sentences, and an interactive 4-choice recall engine. "
        "It functions as an installable Progressive Web App (PWA) across Android, iOS, and Desktop, operating completely offline "
        "with zero advertisements, paywalls, or privacy tracking."
    )
    add_callout(
        "WordPlay replaces memorization fatigue with sensory-rich micro-learning: swipe left to skip, swipe right to collect, "
        "and tap to uncover deep contextual meaning with culturally authentic Hindi translations.",
        "MISSION:"
    )

    # -------------------------------------------------------------
    # SECTION 2: PROBLEMS IT SOLVES
    # -------------------------------------------------------------
    add_h1("2. The Problem WordPlay Solves")
    doc.add_paragraph(
        "Every year, millions of students and professionals struggle to expand their vocabulary for competitive exams, "
        "corporate communication, and creative writing. Traditional approaches fail due to fundamental cognitive bottlenecks:"
    )

    add_bullet("", "The Wall of Text Syndrome: ", 
               "Conventional dictionaries overwhelm users with obscure lexicographical abbreviations, phonetic alphabets "
               "without audio, and definitions that require looking up three additional words just to understand the first.")
    
    add_bullet("", "The Ebbinghaus Forgetting Curve: ", 
               "Cramming 50 words from a printed word list results in a 90% retention loss within 72 hours. Without immediate "
               "active recall or retrieval testing, passive reading creates an illusion of competence.")

    add_bullet("", "The Pronunciation Anxiety Barrier: ", 
               "Learners frequently recognize words in written text but refuse to speak them in meetings or interviews out of "
               "fear of mispronunciation. Without immediate, native audio feedback, speaking fluency remains paralyzed.")

    add_bullet("", "The Translation Disconnect for Bilingual Learners: ", 
               "Generic machine translation tools produce robotic, literal Hindi outputs that fail to communicate the poetic, "
               "emotional, or formal tone of words like 'Serendipity', 'Petrichor', or 'Quixotic'. WordPlay solves this by "
               "providing human-curated conceptual translations.")

    # -------------------------------------------------------------
    # SECTION 3: END-TO-END PRODUCT ARCHITECTURE & HOW IT WORKS
    # -------------------------------------------------------------
    add_h1("3. End-to-End User Experience & Feature Deep Dive")

    add_h2("3.1 The Swipe Deck: High-Velocity Discovery")
    doc.add_paragraph(
        "The core interaction of WordPlay is a fluid, physics-based card stack. The user evaluates vocabulary words one by one "
        "using intuitive touch gestures or keyboard shortcuts:"
    )
    add_bullet("", "Swipe Left (Skip / Pass): ", 
               "Discards a word that the user already knows or does not wish to study at the moment. Plays a gentle airy swoosh sound.")
    add_bullet("", "Swipe Right (Remember / Save): ", 
               "Instantly captures the card into the user's personal Remember Library Vault. Triggers an affirmative sparkling chime and celebratory confetti.")
    add_bullet("", "Tap to Flip: ", 
               "Flips the 3D card 180 degrees with 100% solid, non-transparent backface visibility, revealing in-depth linguistic details.")

    add_h2("3.2 Two-Faced Card Architecture")
    doc.add_paragraph(
        "To minimize cognitive load while maximizing depth, information is strategically separated across two faces:"
    )

    # Table of Front vs Back
    tbl_card = doc.add_table(rows=6, cols=2)
    tbl_card.alignment = WD_TABLE_ALIGNMENT.CENTER
    card_rows = [
        ("Card Face", "Linguistic Elements & Pedagogical Purpose"),
        ("Front (Recognition Phase)", "• Large capitalized serif title\n• Accurate phonetic spelling\n• Color-coded Part of Speech badge (Noun, Verb, Adjective, Adverb)\n• Instant pronunciation audio button\n• Clean one-liner definition teaser\n• Category and difficulty tags"),
        ("Back (Comprehension Phase)", "• Comprehensive primary English definition\n• Secondary definitions and contextual nuances\n• Clean, unhighlighted Hindi meaning (हिन्दी अर्थ) matching standard typography\n• Highlighted real-world usage quotes with target word emphasized\n• Curated synonyms and antonyms for vocabulary network expansion\n• Fascinating etymological roots and historical backstories"),
        ("Audio Engine", "Instant playback with preloaded audio and a 320ms fast fallback to native on-device SpeechSynthesis. Supports 1.0x normal and 0.7x slow-motion pronunciation toggling."),
        ("Sensory Feedback", "Pure synthesized Web Audio clicks, whooshes, chimes, and fanfare that require zero external MP3 downloads."),
        ("Keyboard & Gesture Support", "Full desktop hotkeys (Left Arrow = Skip, Right Arrow = Save, Spacebar = Flip, P = Pronounce, Z = Undo).")
    ]
    for i, (f_col, s_col) in enumerate(card_rows):
        r = tbl_card.rows[i]
        c0, c1 = r.cells[0], r.cells[1]
        c0.width, c1.width = Inches(2.2), Inches(4.3)
        set_cell_margins(c0, 60, 60, 100, 100)
        set_cell_margins(c1, 60, 60, 100, 100)
        if i == 0:
            set_cell_background(c0, "0284C7")
            set_cell_background(c1, "0284C7")
            for cl, txt in [(c0, f_col), (c1, s_col)]:
                p = cl.paragraphs[0]
                run = p.add_run(txt)
                run.font.bold = True
                run.font.color.rgb = RGBColor(255, 255, 255)
        else:
            set_cell_background(c0, "F8FAFC" if i % 2 == 1 else "FFFFFF")
            set_cell_background(c1, "F8FAFC" if i % 2 == 1 else "FFFFFF")
            p0 = c0.paragraphs[0]
            p0.add_run(f_col).font.bold = True
            p1 = c1.paragraphs[0]
            p1.add_run(s_col)

    doc.add_paragraph().paragraph_format.space_after = Pt(12)

    add_h2("3.3 The Remember Library (Personal Vocabulary Vault)")
    doc.add_paragraph(
        "Every right-swiped word is stored securely in on-device storage. Within the Library Vault, users can:"
    )
    add_bullet("", "Search & Filter: ", "Instantly filter saved vocabulary by keywords or specific parts of speech.")
    add_bullet("", "Manual Word Lookup: ", "Type any English word into the search bar and fetch full definitions, phonetics, and Hindi translations on the fly to save directly to the vault.")
    add_bullet("", "Mastery Tracking: ", "Mark words as 'Mastered' with a gold star and celebratory confetti as confidence grows.")
    add_bullet("", "Data Portability: ", "Export personal word collections in standard CSV (for Excel / Anki) or JSON format with a single click.")

    add_h2("3.4 Interactive Dual-Mode Quiz Engine")
    doc.add_paragraph(
        "To guarantee long-term memory consolidation, WordPlay features a dedicated Quiz Engine with two modes:"
    )
    add_bullet("", "🎯 4-Choice Multiple Choice Quiz: ", 
               "Presents the English definition and Hindi meaning hint, challenging the user to identify the correct target word among four randomized candidates. "
               "Instant green/red visual response, custom synthesized rising/falling tones, and celebratory completion scoreboards.")
    add_bullet("", "🃏 Flashcard Recall Mode: ", 
               "Self-paced flashcard review where the user tries to recall the word from its definition before tapping 'Reveal Word' to score themselves.")
    add_bullet("", "Always Playable Starter Pack: ", 
               "Even if a new user has zero saved words in their personal library, the quiz automatically activates a curated Starter Vocabulary Pack so they can test and learn immediately.")

    # -------------------------------------------------------------
    # SECTION 4: HOW IT HELPS OTHERS
    # -------------------------------------------------------------
    add_h1("4. How WordPlay Empowers Diverse User Groups")
    doc.add_paragraph(
        "WordPlay is designed with universal accessibility in mind, delivering tangible benefits across distinct demographics:"
    )

    add_bullet("", "Competitive Exam Aspirants (GRE, SAT, IELTS, TOEFL, UPSC, CAT): ", 
               "Exam preparation requires memorizing thousands of advanced, high-frequency academic words. WordPlay groups words "
               "into targeted categories (GRE/SAT, Literature, Daily, Poetic) and reinforces them through multiple-choice drills, "
               "saving hundreds of hours of mundane rote memorization.")

    add_bullet("", "Bilingual Hindi & English Learners: ", 
               "Many learners think in Hindi and struggle to express complex thoughts in English. WordPlay's culturally attuned "
               "Hindi translations (e.g., explaining 'Petrichor' as 'सोंधी खुशबू - पहली बारिश में मिट्टी की महक') ground abstract "
               "concepts in emotional familiarity, accelerating second-language acquisition.")

    add_bullet("", "Working Professionals & Corporate Communicators: ", 
               "Precision of language commands respect in leadership and interviews. WordPlay's audio engine allows professionals "
               "to master confident, accent-accurate pronunciations at normal and slow speeds before executive presentations.")

    add_bullet("", "Casual Readers & Word Lovers: ", 
               "The zero-friction interface makes vocabulary growth as enjoyable as browsing social media, turning daily transit "
               "time or coffee breaks into enriching micro-learning moments.")

    # -------------------------------------------------------------
    # SECTION 5: TECHNICAL ARCHITECTURE & DEPLOYMENT
    # -------------------------------------------------------------
    add_h1("5. Technical Architecture & Engineering Integrity")
    doc.add_paragraph(
        "WordPlay was constructed using modern, production-grade web technologies that guarantee speed, reliability, and security:"
    )

    add_bullet("", "Frontend Core: ", "React 19 with TypeScript, delivering complete type-safety across all word models and state machines.")
    add_bullet("", "Styling & Responsiveness: ", "Tailwind CSS with mobile-first viewport scaling, safe-area-inset padding, and 100% opaque slate cards to prevent visual bleed-through.")
    add_bullet("", "Resilient Multi-Tier API Pipeline: ", 
               "Initial cards load in 0ms from an in-memory curated bank. Subsequent cards are fetched concurrently via the Free Dictionary API, "
               "Datamuse API, and Wiktionary fallback, enriched with Hindi translations and cached persistently in LocalStorage.")
    add_bullet("", "Fault Tolerance: ", "Wrapped in custom React ErrorBoundaries to guarantee that no component glitch can ever cause a white screen of death.")
    add_bullet("", "Permanent Hosting on GitHub Pages: ", 
               "Pre-configured with relative asset paths (base: './') and an automated GitHub Actions CI/CD workflow (.github/workflows/deploy.yml). "
               "Runs 100% free, forever, with HTTPS and zero server maintenance.")

    # -------------------------------------------------------------
    # SECTION 6: CONCLUSION
    # -------------------------------------------------------------
    add_h1("6. Conclusion")
    doc.add_paragraph(
        "WordPlay demonstrates how thoughtful design, cognitive psychology, and modern web engineering can turn a traditionally "
        "exhausting task into an inspiring daily habit. By combining tactile swipe interactions, authentic bilingual meanings, "
        "flawless audio playback, and gamified recall testing, WordPlay provides learners everywhere with a lifelong, joyful companion "
        "for expanding their intellectual horizons."
    )

    # Save to disk
    output_path = r"C:\Downloads\word play\WordPlay_Comprehensive_Project_Report.docx"
    doc.save(output_path)
    print(f"Report generated successfully at: {output_path}")

if __name__ == "__main__":
    create_document()

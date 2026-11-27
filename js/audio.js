// =========================================================================
// محرك القراءة الصوتية واستوديو الصوت البشري
// إعداد المهندس أسامة خليل هاشم
// =========================================================================

const audioPlayer = {
  synth: window.speechSynthesis,
  isPlaying: false,
  isPaused: false,
  speed: parseFloat(lsGet('speech_speed', 'preferred_speech_speed')) || 0.82, // سرعة هادئة متأنية
  pitch: parseFloat(lsGet('speech_pitch', 'preferred_speech_pitch')) || 1.0,  // نبرة طبيعية معتدلة
  selectedVoiceName: lsGet('voice_name', 'preferred_voice_name') || 'auto',
  multiSpeaker: lsGet('multispeaker', 'preferred_multispeaker') !== 'false', // مفعل افتراضياً
  sentenceSync: lsGet('sentence_sync', 'preferred_sentence_sync') !== 'false', // التتبع المتزامن جملةً بجملة
  voicesList: [],
  chunks: [],
  currentChunkIdx: 0,
  isLessonReading: false,
  playbackSessionId: 0,
  activeSentenceCount: 0,
  activeSentenceIndex: -1,
  nextSentenceTimer: null,

  init() {
    if (!this.synth) return;
    this.loadVoices();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = () => this.loadVoices();
    }
    const sel = document.getElementById('audioSpeedSelect');
    if (sel) sel.value = this.speed.toString();
    const floatSel = document.getElementById('floatingSpeedSelect');
    if (floatSel) floatSel.value = this.speed.toString();
  },

  loadVoices() {
    if (!this.synth) return;
    this.voicesList = this.synth.getVoices() || [];
    this.populateVoiceSelect();
  },

  populateVoiceSelect() {
    const sel = document.getElementById('audioVoiceSelect');
    const studioSel = document.getElementById('studioVoiceSelect');
    if (!sel && !studioSel) return;

    // تصفية وترتيب الأصوات الإنجليزية المتاحة
    const enVoices = this.voicesList.filter(v => v.lang.startsWith('en'));
    if (enVoices.length === 0) return;

    enVoices.sort((a, b) => this.rateVoiceNaturalness(b) - this.rateVoiceNaturalness(a));

    let html = '<option value="auto">✨ طبيعي ذكي (الأفضل تلقائياً حسب المتصفح)</option>';
    enVoices.forEach(v => {
      const isNatural = v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Online');
      const icon = isNatural ? '🌟 ' : '';
      const selected = v.name === this.selectedVoiceName ? 'selected' : '';
      html += `<option value="${v.name}" ${selected}>${icon}${v.name} (${v.lang})</option>`;
    });

    if (sel) sel.innerHTML = html;
    if (studioSel) studioSel.innerHTML = html;

    const countEl = document.getElementById('studioVoicesCount');
    if (countEl) countEl.innerText = `${enVoices.length} أصوات إنجليزية مكتشفة`;
  },

  rateVoiceNaturalness(voice) {
    if (!voice) return 0;
    let score = 0;
    const name = (voice.name || '').toLowerCase();
    const lang = (voice.lang || '').toLowerCase();

    // أصوات مايكروسوفت الطبيعية (Edge Neural) - الأكثر نقاءً وبشرية
    if (name.includes('online (natural)') || name.includes('natural')) score += 100;
    if (name.includes('sonia') || name.includes('libby') || name.includes('ryan')) score += 50; // لكنة بريطانية ملائمة للمنهج
    if (name.includes('jenny') || name.includes('aria') || name.includes('guy')) score += 40;

    // أصوات جوجل عالية الجودة (Chrome)
    if (name.includes('google uk english female') || name.includes('google uk english male')) score += 75;
    if (name.includes('google us english')) score += 65;

    // أصوات أبل الطبيعية
    if (name.includes('samantha') || name.includes('daniel') || name.includes('serena') || name.includes('oliver')) score += 55;

    // إعطاء أولوية للغة الإنجليزية البريطانية لمطابقة منهج العراق
    if (lang === 'en-gb') score += 20;
    else if (lang === 'en-us') score += 10;

    // خفض تقييم الأصوات القديمة والروبوتية
    if (name.includes('desktop') || name.includes('david') || name.includes('hazel') || name.includes('george')) score -= 30;

    return score;
  },

  getBestVoice(lang = 'en') {
    if (!this.synth) return null;
    if (this.voicesList.length === 0) {
      this.voicesList = this.synth.getVoices() || [];
    }

    // إذا اختار المستخدم صوتاً محدداً يدوياً
    if (this.selectedVoiceName && this.selectedVoiceName !== 'auto') {
      const customVoice = this.voicesList.find(v => v.name === this.selectedVoiceName);
      if (customVoice) return customVoice;
    }

    // الاختيار الذكي التلقائي لأفضل وأكثر صوت بشري طبيعي
    if (lang === 'en') {
      const enVoices = this.voicesList.filter(v => v.lang.startsWith('en'));
      if (enVoices.length > 0) {
        enVoices.sort((a, b) => this.rateVoiceNaturalness(b) - this.rateVoiceNaturalness(a));
        return enVoices[0];
      }
    } else {
      // اللغة العربية (للشرح أو إجابات المعلم)
      const arVoices = this.voicesList.filter(v => v.lang.startsWith('ar'));
      if (arVoices.length > 0) {
        return arVoices.find(v => v.name.includes('Natural') || v.name.includes('Google')) || arVoices[0];
      }
    }
    return null;
  },

  getSecondaryVoice(primaryVoice) {
    if (!this.voicesList || this.voicesList.length === 0) return null;
    const enVoices = this.voicesList.filter(v => v.lang.startsWith('en'));
    if (enVoices.length <= 1) return null;

    const pName = (primaryVoice ? primaryVoice.name : '').toLowerCase();
    const isFemale = pName.includes('female') || pName.includes('libby') || pName.includes('sonia') || pName.includes('jenny') || pName.includes('zira') || pName.includes('aria') || pName.includes('samantha');

    if (isFemale) {
      const maleVoice = enVoices.find(v => {
        const n = v.name.toLowerCase();
        return (n.includes('male') || n.includes('ryan') || n.includes('guy') || n.includes('daniel') || n.includes('david')) && v.name !== (primaryVoice ? primaryVoice.name : '');
      });
      if (maleVoice) return maleVoice;
    } else {
      const femaleVoice = enVoices.find(v => {
        const n = v.name.toLowerCase();
        return (n.includes('female') || n.includes('sonia') || n.includes('libby') || n.includes('jenny') || n.includes('serena')) && v.name !== (primaryVoice ? primaryVoice.name : '');
      });
      if (femaleVoice) return femaleVoice;
    }

    return enVoices.find(v => v.name !== (primaryVoice ? primaryVoice.name : '')) || null;
  },

  cleanTextForSpeech(text) {
    if (!text) return '';
    return text
      .replace(/[•📌📄🔹💡🔍📖]/g, '')
      // استبدال اختصارات المنهج بكلمات منطوقة طبيعية وواضحة
      .replace(/\(n\.\)/gi, ', noun, ')
      .replace(/\(v\.\)/gi, ', verb, ')
      .replace(/\(adj\.\)/gi, ', adjective, ')
      .replace(/\(adv\.\)/gi, ', adverb, ')
      .replace(/\be\.g\.\b/gi, 'for example, ')
      .replace(/\betc\.\b/gi, ', and so on. ')
      .replace(/\bw\/\b/gi, 'with ')
      .replace(/\bb\/c\b/gi, 'because ')
      .replace(/\bA\.M\.I\.S\.G\.\b/g, 'A, M, I, S, G')
      .replace(/\bPOssessive\b/g, 'Possessive')
      .replace(/\bAI Mustafa\b/g, 'Al Mustafa')
      .replace(/\bAI-Sayyab\b/g, 'Al Sayyab')
      .replace(/\bAB\s+\d+-\d+\b/gi, '') // إزالة أرقام كتاب النشاط الجانبية
      // تحويل الأسطر والنقاط إلى وقفات نطق بشرية طبيعية
      .replace(/([a-zA-Z0-9])\n+([a-zA-Z0-9])/g, '$1. $2')
      .replace(/\s*-\s*/g, ', ')
      .replace(/\s+/g, ' ')
      .trim();
  },

  parseDialogueTurns(rawText) {
    if (!rawText) return [];
    const lines = rawText.split('\n');
    const turns = [];

    // النمط 1: أسماء الشخصيات متبوعة بنقطتين (Samir: ... / Hilal: ... / Doctor: ...)
    const namedRegex = /^([A-Z][a-zA-Z\s]{1,15}):\s*(.+)$/;
    let hasNamed = false;
    for (const line of lines) {
      if (namedRegex.test(line.trim())) {
        hasNamed = true;
        break;
      }
    }

    if (hasNamed) {
      const speakerMap = {};
      let speakerCount = 0;
      for (const line of lines) {
        const tr = line.trim();
        const m = tr.match(namedRegex);
        if (m) {
          const name = m[1].trim();
          const speech = m[2].trim();
          if (speakerMap[name] === undefined) {
            speakerMap[name] = speakerCount % 2;
            speakerCount++;
          }
          turns.push({ speaker: speakerMap[name], speakerName: name, text: speech });
        } else if (tr.length > 0) {
          turns.push({ speaker: 0, speakerName: '', text: tr });
        }
      }
      if (turns.some(t => t.speaker === 1)) return turns;
    }

    // النمط 2: حوارات الاقتباسات المتقابلة مثل ("What's the matter?" - "I've got a toothache.")
    if (rawText.includes('" - "') || rawText.includes('"- "') || rawText.includes('" -"')) {
      for (const line of lines) {
        const tr = line.trim();
        if (!tr) continue;
        const quoteMatches = [...tr.matchAll(/"([^"]+)"/g)];
        if (quoteMatches.length >= 2) {
          quoteMatches.forEach((m, qIdx) => {
            turns.push({
              speaker: qIdx % 2,
              speakerName: qIdx % 2 === 0 ? 'Person 1' : 'Person 2',
              text: m[1].trim()
            });
          });
        } else {
          turns.push({ speaker: 0, speakerName: '', text: tr });
        }
      }
      if (turns.some(t => t.speaker === 1)) return turns;
    }

    return [];
  },

  // ----------------------------------------------------
  // محرك القراءة المتتبعة المتزامن جملةً بجملة (Sentence-by-Sentence Sync)
  // تزامن فعلي 100% يعتمد على أحداث النطق الحقيقية (onstart / onend) دون أي تخمين زمني
  // إعداد المهندس أسامة خليل هاشم
  // ----------------------------------------------------
  escapeHtmlSafe(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  },

  splitIntoSentences(rawText) {
    if (!rawText) return [];
    const cleaned = String(rawText)
      .replace(/\r\n/g, '\n')
      .replace(/[•📌📄🔹💡🔍📖]/g, '')
      .trim();
    if (!cleaned) return [];

    // حماية الاختصارات والأرقام العشرية من التقطيع الخاطئ عند النقطة
    const protectDots = (line) => line
      .replace(/\b(Mr|Mrs|Ms|Dr|Prof|Sr|Jr|St|vs|No|Vol|Fig|p|pp)\./gi, '$1§DOT§')
      .replace(/\b(?:[a-zA-Z]\.){2,}(?!\s+[A-Z][a-z])/g, (m) => m.replace(/\./g, '§DOT§'))
      .replace(/\b([a-zA-Z]\.)+(?=[a-zA-Z]\.\s+[A-Z][a-z])/g, (m) => m.replace(/\./g, '§DOT§'))
      .replace(/(\d)\.(\d)/g, '$1§DOT§$2');

    const restoreDots = (s) => s.replace(/§DOT§/g, '.');

    const sentences = [];
    const lines = cleaned.split(/\n+/);

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line) continue;

      const protectedLine = protectDots(line);
      // تقسيم عند نهاية الجملة (. ! ? …) متبوعة بمسافة
      const parts = protectedLine
        .split(/(?<=[.!?…]["')\]]*)\s+/)
        .map(p => restoreDots(p).trim())
        .filter(Boolean);

      for (const part of parts) {
        // تقسيم الجمل الطويلة جداً عند الفاصلة المنقوطة لتفادي تجمّد المتصفح في المقاطع الطويلة
        if (part.length > 210 && part.includes(';')) {
          const subParts = part.split(/(?<=;)\s+/).map(s => s.trim()).filter(Boolean);
          sentences.push(...subParts);
        } else {
          sentences.push(part);
        }
      }
    }

    return sentences;
  },

  buildSpeechItems(text, allowDialogue = true) {
    if (allowDialogue && this.multiSpeaker) {
      const turns = this.parseDialogueTurns(text);
      if (turns && turns.length > 1) {
        const items = [];
        turns.forEach((turn, turnIdx) => {
          const turnSentences = this.splitIntoSentences(turn.text);
          const list = turnSentences.length > 0 ? turnSentences : [turn.text.trim()];
          list.forEach((s, sIdx) => {
            const spoken = this.cleanTextForSpeech(s);
            if (!spoken) return;
            items.push({
              displayText: s,
              spokenText: spoken,
              speaker: turn.speaker,
              speakerName: turn.speakerName || '',
              turnIdx,
              isTurnStart: sIdx === 0
            });
          });
        });
        if (items.length > 0) return { items, isDialogue: true };
      }
    }

    const sentences = this.splitIntoSentences(text);
    const items = [];
    sentences.forEach((s) => {
      const spoken = this.cleanTextForSpeech(s);
      if (!spoken) return;
      items.push({
        displayText: s,
        spokenText: spoken,
        speaker: 0,
        speakerName: '',
        turnIdx: 0,
        isTurnStart: false
      });
    });

    if (items.length === 0) {
      const fallback = this.cleanTextForSpeech(text);
      if (fallback) {
        items.push({
          displayText: text.replace(/[•📌📄🔹💡🔍📖]/g, '').trim(),
          spokenText: fallback,
          speaker: 0,
          speakerName: '',
          turnIdx: 0,
          isTurnStart: false
        });
      }
    }
    return { items, isDialogue: false };
  },

  setupSentenceTracker(items, isDialogue = false) {
    this.clearSentenceTracker();
    this.activeSentenceCount = items ? items.length : 0;
    this.activeSentenceIndex = -1;

    const liveBox = document.getElementById('liveTeleprompterBox');
    const liveText = document.getElementById('teleprompterCurrentText');
    if (!liveText) return;

    if (!this.sentenceSync || !items || items.length === 0) {
      liveText.innerHTML = '';
      if (liveBox) liveBox.style.display = 'none';
      return;
    }

    const combinedSample = items.map(it => it.displayText).join(' ');
    const isEnglish = /[a-zA-Z]/.test(combinedSample);
    liveText.style.direction = isEnglish ? 'ltr' : 'rtl';
    liveText.style.textAlign = isEnglish ? 'left' : 'right';

    let html = '';
    if (isDialogue) {
      let openTurn = false;
      items.forEach((item, idx) => {
        if (item.isTurnStart) {
          if (openTurn) html += '</div>';
          const badge = item.speakerName
            ? `<span class="teleprompter-speaker-inline speaker-${item.speaker}">${this.escapeHtmlSafe(item.speakerName)}:</span> `
            : '';
          html += `<div class="teleprompter-turn-row">${badge}`;
          openTurn = true;
        }
        html += `<span class="teleprompter-sentence" id="tp-s-${idx}">${this.escapeHtmlSafe(item.displayText)}</span> `;
      });
      if (openTurn) html += '</div>';
    } else {
      html = items
        .map((item, idx) => `<span class="teleprompter-sentence" id="tp-s-${idx}">${this.escapeHtmlSafe(item.displayText)}</span>`)
        .join(' ');
    }

    liveText.innerHTML = html;
    if (liveBox && isEnglishCurriculum()) {
      liveBox.style.display = 'block';
    }
  },

  setActiveSentenceIndex(index, totalCount, displayText = '') {
    if (!this.sentenceSync) return;

    if (this.activeSentenceIndex !== -1 && this.activeSentenceIndex !== index) {
      const prevEl = document.getElementById(`tp-s-${this.activeSentenceIndex}`);
      if (prevEl) {
        prevEl.classList.remove('teleprompter-sentence-active');
        if (this.activeSentenceIndex < index) {
          prevEl.classList.add('teleprompter-sentence-done');
        }
      }
    }

    this.activeSentenceIndex = index;
    const activeEl = document.getElementById(`tp-s-${index}`);
    if (activeEl) {
      activeEl.classList.remove('teleprompter-sentence-done');
      activeEl.classList.add('teleprompter-sentence-active');
      try {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
      } catch (e) {}
    }

    const floatPreview = document.getElementById('floatingPlayerSentencePreview');
    if (floatPreview && displayText) {
      floatPreview.innerText = displayText;
    }

    const progressTag = document.getElementById('teleprompterProgressTag');
    if (progressTag && totalCount > 0) {
      progressTag.innerText = `جملة ${index + 1} / ${totalCount}`;
    }
  },

  clearSentenceTracker() {
    if (this.nextSentenceTimer) {
      clearTimeout(this.nextSentenceTimer);
      this.nextSentenceTimer = null;
    }
    if (this.activeSentenceIndex !== -1) {
      const prevEl = document.getElementById(`tp-s-${this.activeSentenceIndex}`);
      if (prevEl) prevEl.classList.remove('teleprompter-sentence-active');
    }
    this.activeSentenceIndex = -1;
    this.activeSentenceCount = 0;

    const floatPreview = document.getElementById('floatingPlayerSentencePreview');
    if (floatPreview) floatPreview.innerText = '';
    const progressTag = document.getElementById('teleprompterProgressTag');
    if (progressTag) progressTag.innerText = '';
  },

  speakSmart(text, lang = 'en', onDone = null) {
    if (lang === 'ar' || !isEnglishCurriculum()) {
      if (onDone) onDone();
      return;
    }
    if (!this.synth) {
      alert('متصفحك لا يدعم القراءة الصوتية (Web Speech API).');
      return;
    }

    const { items, isDialogue } = this.buildSpeechItems(text, lang === 'en');
    if (!items || items.length === 0) {
      if (onDone) onDone();
      return;
    }

    this.playSentenceQueue(items, isDialogue, lang, onDone);
  },

  speakText(text, lang = 'en', onDone = null) {
    if (lang === 'ar' || !isEnglishCurriculum()) {
      if (onDone) onDone();
      return;
    }
    if (!this.synth) {
      alert('متصفحك لا يدعم القراءة الصوتية (Web Speech API).');
      return;
    }

    const { items } = this.buildSpeechItems(text, false);
    if (!items || items.length === 0) {
      if (onDone) onDone();
      return;
    }

    this.playSentenceQueue(items, false, lang, onDone);
  },

  playSentenceQueue(items, isDialogue = false, lang = 'en', onDone = null) {
    const sessionId = ++this.playbackSessionId;
    this.synth.cancel();
    this.clearSentenceTracker();

    this.isPlaying = true;
    this.isPaused = false;
    this.updateButtons();

    const headerLabel = this.isLessonReading
      ? ((document.getElementById('floatingPlayerSpeakerBadge') && document.getElementById('floatingPlayerSpeakerBadge').innerText) || 'قارئ الدرس 🔊')
      : (isDialogue ? 'حوار تفاعلي 🎙️' : 'قراءة النص 🔊');
    this.showFloatingPlayer(items.map(i => i.displayText).join(' '), headerLabel);
    this.setupSentenceTracker(items, isDialogue);

    const primaryVoice = this.getBestVoice(lang);
    const secondaryVoice = isDialogue ? this.getSecondaryVoice(primaryVoice) : null;

    let idx = 0;

    const playNext = () => {
      if (sessionId !== this.playbackSessionId || !this.isPlaying) return;

      if (idx >= items.length) {
        this.clearSentenceTracker();
        if (!this.isLessonReading) {
          this.isPlaying = false;
          this.isPaused = false;
          this.updateButtons();
          this.hideFloatingPlayer();
        }
        if (onDone) onDone();
        return;
      }

      const item = items[idx];
      const utt = new SpeechSynthesisUtterance(item.spokenText);
      utt.rate = this.speed;
      utt.volume = 1.0;

      if (isDialogue && item.speaker === 1) {
        if (secondaryVoice) {
          utt.voice = secondaryVoice;
          utt.lang = secondaryVoice.lang;
          utt.pitch = this.pitch;
        } else {
          if (primaryVoice) utt.voice = primaryVoice;
          utt.lang = primaryVoice ? primaryVoice.lang : 'en-GB';
          utt.pitch = Math.max(0.75, this.pitch * 0.88);
        }
      } else {
        if (primaryVoice) {
          utt.voice = primaryVoice;
          utt.lang = primaryVoice.lang;
        } else {
          utt.lang = lang === 'en' ? 'en-GB' : 'ar-SA';
        }
        utt.pitch = this.pitch;
      }

      const speakerTitle = isDialogue
        ? (item.speakerName ? `حوار: ${item.speakerName} 🎙️` : `المتحدث ${item.speaker + 1} 🎙️`)
        : 'النص المقروء حالياً 🔊';

      utt.onstart = () => {
        if (sessionId !== this.playbackSessionId || !this.isPlaying) return;
        this.isPaused = false;
        this.updateButtons();
        this.updateStatus(isDialogue && item.speakerName ? `حوار جارٍ (${item.speakerName})... 🎙️` : 'جارِ القراءة... 🔊');
        const liveSpeaker = document.getElementById('teleprompterSpeakerBadge');
        if (liveSpeaker) liveSpeaker.innerText = speakerTitle;
        const floatSpeaker = document.getElementById('floatingPlayerSpeakerBadge');
        if (floatSpeaker) floatSpeaker.innerText = speakerTitle;
        this.setActiveSentenceIndex(idx, items.length, item.displayText);
      };

      utt.onend = () => {
        if (sessionId !== this.playbackSessionId || !this.isPlaying) return;
        const prevSpeaker = item.speaker;
        idx++;
        const nextItem = items[idx];
        const pauseMs = nextItem && isDialogue && nextItem.speaker !== prevSpeaker ? 300 : 75;
        this.nextSentenceTimer = setTimeout(() => {
          if (sessionId !== this.playbackSessionId || !this.isPlaying) return;
          playNext();
        }, pauseMs);
      };

      utt.onerror = (e) => {
        if (sessionId !== this.playbackSessionId || !this.isPlaying) return;
        if (e && (e.error === 'interrupted' || e.error === 'canceled')) return;
        console.warn('Speech sentence error', e);
        idx++;
        playNext();
      };

      this.synth.speak(utt);
    };

    playNext();
  },

  playCurrentLesson() {
    if (!isEnglishCurriculum()) {
      return;
    }
    if (this.isPaused) {
      this.resume();
      return;
    }
    const chunkElements = document.querySelectorAll('.chunk-box');
    if (!chunkElements || chunkElements.length === 0) {
      alert('يرجى اختيار درس يحتوي على نصوص لبدء الاستماع.');
      return;
    }

    this.chunks = Array.from(chunkElements).map(el => ({
      el,
      text: el.querySelector('.chunk-content-text') ? el.querySelector('.chunk-content-text').innerText : el.innerText
    }));
    this.currentChunkIdx = 0;
    this.isLessonReading = true;
    this.isPlaying = true;
    this.isPaused = false;
    this.readNextChunk();
  },

  readNextChunk() {
    if (!this.isLessonReading) return;
    if (this.currentChunkIdx >= this.chunks.length) {
      this.stop();
      this.updateStatus('اكتملت قراءة الدرس بنجاح ✅');
      return;
    }

    const current = this.chunks[this.currentChunkIdx];
    document.querySelectorAll('.chunk-box').forEach(b => b.classList.remove('active-reading'));
    current.el.classList.add('active-reading');
    current.el.scrollIntoView({ behavior: 'smooth', block: 'center' });

    this.updateStatus(`جارِ قراءة المقطع ${this.currentChunkIdx + 1} من ${this.chunks.length}... 🔊`);
    this.updateButtons();

    const chunkMetaSpan = current.el.querySelector('.chunk-meta span');
    const chunkHeading = chunkMetaSpan ? chunkMetaSpan.innerText : `المقطع ${this.currentChunkIdx + 1}`;
    this.showFloatingPlayer(current.text, chunkHeading);

    const isEnglish = /[a-zA-Z]{3,}/.test(current.text);
    if (!isEnglish || !isEnglishCurriculum()) {
      this.currentChunkIdx++;
      this.readNextChunk();
      return;
    }
    this.speakSmart(current.text, 'en', () => {
      if (!this.isLessonReading) return;
      this.currentChunkIdx++;
      this.nextSentenceTimer = setTimeout(() => {
        if (this.isLessonReading && this.isPlaying) {
          this.readNextChunk();
        }
      }, 350);
    });
  },

  pause() {
    if (this.synth && this.isPlaying) {
      this.synth.pause();
      this.isPaused = true;
      this.updateStatus('متوقف مؤقتاً ⏸️');
      this.updateButtons();
    }
  },

  resume() {
    if (this.synth && this.isPaused) {
      this.synth.resume();
      this.isPaused = false;
      this.updateStatus('جارِ القراءة... 🔊');
      this.updateButtons();
    }
  },

  togglePause() {
    if (this.isPaused) {
      this.resume();
    } else if (this.isPlaying) {
      this.pause();
    }
  },

  stop() {
    this.playbackSessionId++;
    this.isLessonReading = false;
    if (this.synth) {
      this.synth.cancel();
    }
    this.clearSentenceTracker();
    this.isPlaying = false;
    this.isPaused = false;
    document.querySelectorAll('.chunk-box').forEach(b => b.classList.remove('active-reading'));
    this.updateStatus('جاهز للاستماع');
    this.updateButtons();
    this.hideFloatingPlayer();
    if (typeof updateBookPageAudioUI === 'function') {
      updateBookPageAudioUI(false);
    }
  },

  showFloatingPlayer(text, speakerLabel) {
    if (!isEnglishCurriculum()) {
      this.hideFloatingPlayer();
      return;
    }
    const floatBar = document.getElementById('floatingAudioPlayerBar');
    const floatSpeaker = document.getElementById('floatingPlayerSpeakerBadge');
    const floatLoc = document.getElementById('floatingPlayerLocationTag');
    const headerStopBtn = document.getElementById('headerEmergencyStopBtn');

    const liveBox = document.getElementById('liveTeleprompterBox');
    const liveSpeaker = document.getElementById('teleprompterSpeakerBadge');

    if (floatBar) {
      floatBar.style.display = 'flex';
      setTimeout(() => floatBar.classList.remove('hidden-float'), 10);
    }
    if (floatSpeaker) floatSpeaker.innerText = speakerLabel || 'قارئ الدرس 🔊';

    const bUnit = document.getElementById('breadcrumbUnitBadge');
    const bTitle = document.getElementById('breadcrumbLessonTitle');
    if (floatLoc && bUnit && bTitle) {
      const uStr = bUnit.innerText.replace('📚', '').trim().split('(')[0];
      const lStr = bTitle.innerText.trim().split('(')[0];
      floatLoc.innerText = `${uStr} ⮞ ${lStr}`;
    }

    if (liveBox && this.sentenceSync) liveBox.style.display = 'block';
    if (liveSpeaker) liveSpeaker.innerText = speakerLabel || 'النص المقروء حالياً 🔊';

    if (headerStopBtn) headerStopBtn.style.display = 'inline-flex';
  },

  hideFloatingPlayer() {
    const floatBar = document.getElementById('floatingAudioPlayerBar');
    const liveBox = document.getElementById('liveTeleprompterBox');
    const headerStopBtn = document.getElementById('headerEmergencyStopBtn');

    if (floatBar) {
      floatBar.classList.add('hidden-float');
      setTimeout(() => {
        if (!this.isPlaying) floatBar.style.display = 'none';
      }, 300);
    }
    if (liveBox) liveBox.style.display = 'none';
    if (headerStopBtn) headerStopBtn.style.display = 'none';
  },

  setSelectedVoice(voiceName) {
    this.selectedVoiceName = voiceName;
    lsSet('voice_name', voiceName);
    const sel = document.getElementById('audioVoiceSelect');
    if (sel) sel.value = voiceName;
    const studioSel = document.getElementById('studioVoiceSelect');
    if (studioSel) studioSel.value = voiceName;

    if (this.isPlaying) {
      this.stop();
      this.playCurrentLesson();
    }
  },

  setSpeed(val) {
    this.speed = parseFloat(val);
    lsSet('speech_speed', val);
    const sel = document.getElementById('audioSpeedSelect');
    if (sel) sel.value = val;
    const floatSel = document.getElementById('floatingSpeedSelect');
    if (floatSel) floatSel.value = val;
    const slider = document.getElementById('studioSpeedSlider');
    if (slider) slider.value = val;
    const valText = document.getElementById('studioSpeedVal');
    if (valText) valText.innerText = `${val}x`;
  },

  setPitch(val) {
    this.pitch = parseFloat(val);
    lsSet('speech_pitch', val);
    const slider = document.getElementById('studioPitchSlider');
    if (slider) slider.value = val;
    const valText = document.getElementById('studioPitchVal');
    if (valText) valText.innerText = `${val}`;
  },

  setMultiSpeaker(val) {
    this.multiSpeaker = !!val;
    lsSet('multispeaker', this.multiSpeaker.toString());
  },

  setSentenceSync(val) {
    this.sentenceSync = !!val;
    lsSet('sentence_sync', this.sentenceSync.toString());
    const liveBox = document.getElementById('liveTeleprompterBox');
    if (!this.sentenceSync && liveBox) {
      liveBox.style.display = 'none';
    } else if (this.sentenceSync && this.isPlaying && isEnglishCurriculum() && liveBox) {
      liveBox.style.display = 'block';
    }
  },

  updateStatus(msg) {
    const el = document.getElementById('audioPlayerStatus');
    if (el) el.innerText = msg;
    const studioStatus = document.getElementById('studioTestStatus');
    if (studioStatus) studioStatus.innerText = msg;
  },

  updateButtons() {
    const playBtn = document.getElementById('audioPlayBtn');
    if (playBtn) {
      if (this.isPlaying && !this.isPaused) {
        playBtn.innerHTML = '<span>⏸️</span> إيقاف مؤقت';
        playBtn.onclick = () => audioPlayer.pause();
      } else if (this.isPaused) {
        playBtn.innerHTML = '<span>▶️</span> استئناف';
        playBtn.onclick = () => audioPlayer.resume();
      } else {
        playBtn.innerHTML = '<span>▶️</span> استمع للدرس بصوت مسموع';
        playBtn.onclick = () => audioPlayer.playCurrentLesson();
      }
    }
    const floatPauseBtn = document.getElementById('floatingPauseBtn');
    if (floatPauseBtn) {
      if (this.isPlaying && !this.isPaused) {
        floatPauseBtn.innerHTML = '<span>⏸️</span> مؤقت';
      } else if (this.isPaused) {
        floatPauseBtn.innerHTML = '<span>▶️</span> استئناف';
      } else {
        floatPauseBtn.innerHTML = '<span>⏸️</span> مؤقت';
      }
    }
    const headerStopBtn = document.getElementById('headerEmergencyStopBtn');
    if (headerStopBtn) {
      headerStopBtn.style.display = this.isPlaying ? 'inline-flex' : 'none';
    }
    if (typeof updateBookPageAudioUI === 'function') {
      updateBookPageAudioUI(this.isPlaying);
    }
  }
};

function speakSnippet(text, lang = 'en') {
  if (lang === 'ar' || !isEnglishCurriculum()) {
    return;
  }
  audioPlayer.stop();
  audioPlayer.speakSmart(text, lang);
}

// ----------------------------------------------------
// دوال نافذة استوديو ضبط ومعاينة الصوت البشري
// إعداد المهندس أسامة خليل هاشم
// ----------------------------------------------------
function openVoiceStudioModal() {
  if (!isEnglishCurriculum()) {
    if (typeof showToast === 'function') showToast('استوديو الصوت وإعدادات النطق مخصصة حصراً لمنهج اللغة الإنجليزية', 'info'); else alert('استوديو الصوت وإعدادات النطق مخصصة حصراً لمنهج اللغة الإنجليزية');
    return;
  }
  const modal = document.getElementById('voiceStudioModal');
  if (!modal) return;

  audioPlayer.populateVoiceSelect();

  const studioVoiceSel = document.getElementById('studioVoiceSelect');
  if (studioVoiceSel) studioVoiceSel.value = audioPlayer.selectedVoiceName;

  const studioSpeedSlider = document.getElementById('studioSpeedSlider');
  if (studioSpeedSlider) studioSpeedSlider.value = audioPlayer.speed;
  const studioSpeedVal = document.getElementById('studioSpeedVal');
  if (studioSpeedVal) studioSpeedVal.innerText = `${audioPlayer.speed}x`;

  const studioPitchSlider = document.getElementById('studioPitchSlider');
  if (studioPitchSlider) studioPitchSlider.value = audioPlayer.pitch;
  const studioPitchVal = document.getElementById('studioPitchVal');
  if (studioPitchVal) studioPitchVal.innerText = `${audioPlayer.pitch}`;

  const multiSwitch = document.getElementById('studioMultiSpeakerSwitch');
  if (multiSwitch) multiSwitch.checked = audioPlayer.multiSpeaker;

  const sentenceSyncSwitch = document.getElementById('studioSentenceSyncSwitch');
  if (sentenceSyncSwitch) sentenceSyncSwitch.checked = audioPlayer.sentenceSync;

  modal.classList.remove('hidden');
}

function closeVoiceStudioModal() {
  audioPlayer.stop();
  const modal = document.getElementById('voiceStudioModal');
  if (modal) modal.classList.add('hidden');
}

function testStudioSample(sampleType) {
  audioPlayer.stop();
  let text = '';
  if (sampleType === 'word') {
    text = 'Welcome to the English for Iraq educational system. Learning English with Eng. Usama Khaleel Hashim is inspiring and easy.';
  } else if (sampleType === 'question') {
    text = "What's the matter, Ansam? Do you have a headache? You should go to the doctor this afternoon.";
  } else if (sampleType === 'dialogue') {
    text = 'Samir: That was awful! How did we lose?\nHilal: What? You won more points than I did.\nSamir: At least you won a few points.\nHilal: Let\'s face it. We\'re not very fit.\nSamir: Good idea! We will have a 100-metre race next weekend.';
  }
  audioPlayer.speakSmart(text, 'en');
}

function saveStudioSettings() {
  const studioVoiceSel = document.getElementById('studioVoiceSelect');
  if (studioVoiceSel) audioPlayer.setSelectedVoice(studioVoiceSel.value);

  const studioSpeedSlider = document.getElementById('studioSpeedSlider');
  if (studioSpeedSlider) audioPlayer.setSpeed(studioSpeedSlider.value);

  const studioPitchSlider = document.getElementById('studioPitchSlider');
  if (studioPitchSlider) audioPlayer.setPitch(studioPitchSlider.value);

  const multiSwitch = document.getElementById('studioMultiSpeakerSwitch');
  if (multiSwitch) audioPlayer.setMultiSpeaker(multiSwitch.checked);

  const sentenceSyncSwitch = document.getElementById('studioSentenceSyncSwitch');
  if (sentenceSyncSwitch) audioPlayer.setSentenceSync(sentenceSyncSwitch.checked);

  alert('تم حفظ إعدادات الصوت وتزامن القراءة المتتبعة بنجاح واعتمادها للنظام بالكامل ✅\n- إعداد المهندس أسامة خليل هاشم');
  closeVoiceStudioModal();
}

function resetStudioDefaults() {
  audioPlayer.setSelectedVoice('auto');
  audioPlayer.setSpeed(0.82);
  audioPlayer.setPitch(1.0);
  audioPlayer.setMultiSpeaker(true);
  audioPlayer.setSentenceSync(true);

  const studioVoiceSel = document.getElementById('studioVoiceSelect');
  if (studioVoiceSel) studioVoiceSel.value = 'auto';
  const studioSpeedSlider = document.getElementById('studioSpeedSlider');
  if (studioSpeedSlider) studioSpeedSlider.value = '0.82';
  const studioSpeedVal = document.getElementById('studioSpeedVal');
  if (studioSpeedVal) studioSpeedVal.innerText = '0.82x';
  const studioPitchSlider = document.getElementById('studioPitchSlider');
  if (studioPitchSlider) studioPitchSlider.value = '1.0';
  const studioPitchVal = document.getElementById('studioPitchVal');
  if (studioPitchVal) studioPitchVal.innerText = '1.0';
  const multiSwitch = document.getElementById('studioMultiSpeakerSwitch');
  if (multiSwitch) multiSwitch.checked = true;
  const sentenceSyncSwitch = document.getElementById('studioSentenceSyncSwitch');
  if (sentenceSyncSwitch) sentenceSyncSwitch.checked = true;

  alert('تمت استعادة الإعدادات الصوتية الافتراضية الموصى بها (0.82x سرعة هادئة - نبرة 1.0 معتدلة - تفعيل التتبع المتزامن جملةً بجملة).');
}


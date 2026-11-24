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
  voicesList: [],
  chunks: [],
  currentChunkIdx: 0,
  currentWordMap: [],
  activeWordIndex: -1,
  karaokeTimer: null,
  hasReceivedRealWordBoundary: false,
  karaokeSyncFactor: parseFloat(lsGet('karaoke_sync', 'preferred_karaoke_sync')) || 1.0,
  customSyncOffset: lsGet('karaoke_offset', 'preferred_karaoke_offset') || 'auto',

  getSyncOffset() {
    if (this.customSyncOffset !== 'auto' && !isNaN(parseFloat(this.customSyncOffset))) {
      return parseFloat(this.customSyncOffset);
    }
    // تلقائي: الأصوات السحابية الطبيعية في إيدج وكروم تحتاج تأخير مقداره 2.2 ثانية لمعادلة بافر الصوت
    const voice = this.getBestVoice('en');
    const isOnline = voice && (voice.name.includes('Online') || voice.name.includes('Natural') || voice.localService === false);
    return isOnline ? 2200 : 250;
  },

  setSyncOffset(val) {
    this.customSyncOffset = val;
    lsSet('karaoke_offset', val);
    const sel = document.getElementById('studioKaraokeOffsetSelect');
    if (sel) sel.value = val;
  },

  init() {
    if (!this.synth) return;
    this.loadVoices();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = () => this.loadVoices();
    }
    const sel = document.getElementById('audioSpeedSelect');
    if (sel) sel.value = this.speed.toString();
    const syncSel = document.getElementById('studioKaraokeSyncSelect');
    if (syncSel) syncSel.value = this.karaokeSyncFactor.toString();
    const offsetSel = document.getElementById('studioKaraokeOffsetSelect');
    if (offsetSel) offsetSel.value = this.customSyncOffset.toString();
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
  // ميزات التتبع اللحظي للكلمات المقروءة (Word-by-Word Live Tracker v2)
  // تزامن دقيق فائق الذكاء يطابق سرعة الصوت البشري تماماً
  // إعداد المهندس أسامة خليل هاشم
  // ----------------------------------------------------
  buildKaraokeTokens(text, prefix = 'kw') {
    const regex = /([a-zA-Z]+(?:'[a-zA-Z]+)?|[\u0600-\u06FF]+|[0-9]+|\s+|[^\s\w\u0600-\u06FF]+)/g;
    let match;
    const tokens = [];
    while ((match = regex.exec(text)) !== null) {
      const raw = match[0];
      const isWord = /[a-zA-Z0-9\u0600-\u06FF]/.test(raw);
      tokens.push({
        raw,
        isWord,
        start: match.index,
        end: match.index + raw.length
      });
    }

    let wordIdx = 0;
    let html = '';
    const wordMap = [];

    for (let i = 0; i < tokens.length; i++) {
      const t = tokens[i];
      if (t.isWord) {
        const spanId = `${prefix}-${wordIdx}`;
        let nextPunct = '';
        if (i + 1 < tokens.length && !tokens[i + 1].isWord) {
          const pMatch = tokens[i + 1].raw.match(/[.,!?;:—\-]/);
          if (pMatch) nextPunct = pMatch[0];
        }

        const durationMs = this.estimateWordDuration(t.raw, nextPunct, this.speed);
        const wordObj = {
          id: spanId,
          idx: wordIdx,
          start: t.start,
          end: t.end,
          text: t.raw,
          nextPunct,
          durationMs
        };
        wordMap.push(wordObj);

        const escaped = t.raw.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        html += `<span class="karaoke-word" id="${spanId}" data-start="${t.start}" data-end="${t.end}">${escaped}</span>`;
        wordIdx++;
      } else {
        const escaped = t.raw.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        html += escaped;
      }
    }
    return { html, wordMap };
  },

  estimateWordDuration(wordText, punct, speechRate) {
    const len = wordText ? wordText.length : 3;
    // حساب مدة الكلمة الطبيعية وفق مقاطع الحروف
    let baseMs = 150 + (Math.min(len, 12) * 38);
    // الحروف الفردية المقروءة كاختصارات مثل A. M. I. S. G.
    if (len === 1) {
      baseMs = 380;
    }
    if (punct) {
      if (/[.!?]/.test(punct)) baseMs += 550; // وقفة نهاية الجملة الطبيعية
      else if (/[,;:—\-]/.test(punct)) baseMs += 320; // وقفة الفواصل والنقطتين
    }
    const rate = Math.max(0.6, Math.min(2.0, speechRate || 0.85));
    const sync = this.karaokeSyncFactor || 1.0;
    return Math.round((baseMs / rate) * sync);
  },

  setupKaraoke(text) {
    this.clearKaraoke();
    const clean = text ? text.replace(/[•📌📄🔹💡🔍📖]/g, '').trim() : '';
    if (!clean) return;

    // ضبط اتجاه النص (LTR للإنجليزية من اليسار إلى اليمين لمنع انقلاب الكلمات والترقيم)
    const isEnglish = /[a-zA-Z]/.test(clean);
    const dir = isEnglish ? 'ltr' : 'rtl';
    const align = isEnglish ? 'left' : 'right';

    // 1. تجهيز نص شاشة التتبع المباشر (Live Teleprompter)
    const tpRes = this.buildKaraokeTokens(clean, 'tp-w');
    this.currentWordMap = tpRes.wordMap;
    this.activeWordIndex = -1;
    this.hasReceivedRealWordBoundary = false;

    const liveText = document.getElementById('teleprompterCurrentText');
    if (liveText) {
      liveText.style.direction = dir;
      liveText.style.textAlign = align;
      liveText.innerHTML = tpRes.html;
    }

    // 2. تجهيز المقطع النشط بالدرس إذا كان معروضاً
    const activeChunk = document.querySelector('.chunk-box.active-reading .chunk-content-text');
    if (activeChunk) {
      activeChunk.style.direction = dir;
      activeChunk.style.textAlign = align;
      const chunkRes = this.buildKaraokeTokens(clean, 'chunk-w');
      activeChunk.innerHTML = chunkRes.html;
    }
  },

  startKaraokeLive() {
    if (this.karaokeTimer) {
      clearTimeout(this.karaokeTimer);
      this.karaokeTimer = null;
    }
    if (!this.currentWordMap || this.currentWordMap.length === 0) return;

    const initialDelay = this.getSyncOffset();

    // بدء تظليل أول كلمة بعد انقضاء بافر استجابة الصوت لمعادلة خروج الصوت من السماعات تماماً
    this.karaokeTimer = setTimeout(() => {
      if (!this.isPlaying || this.isPaused) return;
      this.setActiveWordIndex(0);
      this.scheduleNextWord(0);
    }, initialDelay);
  },

  handleWordBoundary(charIndex) {
    if (!this.currentWordMap || this.currentWordMap.length === 0) return;
    const offset = this.getSyncOffset();
    setTimeout(() => {
      if (!this.isPlaying || this.isPaused) return;
      this.highlightWordByCharIndex(charIndex);
    }, offset);
  },

  scheduleNextWord(fromIndex) {
    if (this.karaokeTimer) {
      clearTimeout(this.karaokeTimer);
      this.karaokeTimer = null;
    }
    if (!this.isPlaying || this.isPaused || !this.currentWordMap || this.currentWordMap.length === 0) return;

    const currentIdx = (fromIndex !== undefined) ? fromIndex : this.activeWordIndex;
    const nextIdx = currentIdx + 1;
    if (nextIdx >= this.currentWordMap.length) return;

    const currentWord = this.currentWordMap[currentIdx >= 0 ? currentIdx : 0];
    const delay = currentWord ? currentWord.durationMs : 300;

    this.karaokeTimer = setTimeout(() => {
      if (!this.isPlaying || this.isPaused) return;
      this.setActiveWordIndex(nextIdx);
      this.scheduleNextWord(nextIdx);
    }, delay);
  },

  highlightWordByCharIndex(charIndex) {
    if (!this.currentWordMap || this.currentWordMap.length === 0) return;

    let matchIdx = this.currentWordMap.findIndex(w => charIndex >= w.start && charIndex < w.end);
    if (matchIdx === -1) {
      matchIdx = this.currentWordMap.findIndex(w => w.start >= charIndex);
    }
    if (matchIdx === -1) {
      matchIdx = this.currentWordMap.length - 1;
    }

    if (matchIdx !== -1 && matchIdx !== this.activeWordIndex) {
      this.setActiveWordIndex(matchIdx);
      // إعادة مزامنة الجدولة من الكلمة الحقيقية المؤكدة
      this.scheduleNextWord(matchIdx);
    }
  },

  setActiveWordIndex(index) {
    if (!this.currentWordMap || index < 0 || index >= this.currentWordMap.length) return;

    // إزالة التظليل من الكلمة السابقة
    if (this.activeWordIndex !== -1 && this.activeWordIndex !== index) {
      const prevTp = document.getElementById(`tp-w-${this.activeWordIndex}`);
      if (prevTp) prevTp.classList.remove('karaoke-word-active');
      const prevChunk = document.getElementById(`chunk-w-${this.activeWordIndex}`);
      if (prevChunk) prevChunk.classList.remove('karaoke-word-active');
    }

    this.activeWordIndex = index;
    const currentWord = this.currentWordMap[index];
    if (!currentWord) return;

    // تظليل الكلمة الحالية باللون الذهبي البراق
    const newTp = document.getElementById(`tp-w-${index}`);
    if (newTp) {
      newTp.classList.add('karaoke-word-active');
      try {
        newTp.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
      } catch (e) {}
    }

    const newChunk = document.getElementById(`chunk-w-${index}`);
    if (newChunk) {
      newChunk.classList.add('karaoke-word-active');
    }
  },

  clearKaraoke() {
    if (this.karaokeTimer) {
      clearTimeout(this.karaokeTimer);
      this.karaokeTimer = null;
    }
    if (this.activeWordIndex !== -1) {
      const prevTp = document.getElementById(`tp-w-${this.activeWordIndex}`);
      if (prevTp) prevTp.classList.remove('karaoke-word-active');
      const prevChunk = document.getElementById(`chunk-w-${this.activeWordIndex}`);
      if (prevChunk) prevChunk.classList.remove('karaoke-word-active');
    }
    this.activeWordIndex = -1;
    this.hasReceivedRealWordBoundary = false;
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
    this.synth.cancel();

    // فحص وإطلاق محاكاة المحادثات التبادلية
    if (lang === 'en' && this.multiSpeaker) {
      const turns = this.parseDialogueTurns(text);
      if (turns && turns.length > 1) {
        this.playDialogueTurns(turns, onDone);
        return;
      }
    }

    // قراءة عادية بنبرة واحدة
    this.speakText(text, lang, onDone);
  },

  playDialogueTurns(turns, onDone = null) {
    let idx = 0;
    this.isPlaying = true;
    this.isPaused = false;
    this.updateButtons();

    const playNextTurn = () => {
      if (!this.isPlaying || idx >= turns.length) {
        this.isPlaying = false;
        this.isPaused = false;
        this.updateButtons();
        if (onDone) onDone();
        return;
      }

      const turn = turns[idx];
      const cleanTurn = this.cleanTextForSpeech(turn.text);
      if (!cleanTurn) {
        idx++;
        playNextTurn();
        return;
      }

      const utt = new SpeechSynthesisUtterance(cleanTurn);
      utt.rate = this.speed;
      utt.volume = 1.0;

      const primaryVoice = this.getBestVoice('en');
      const secondaryVoice = this.getSecondaryVoice(primaryVoice);

      if (turn.speaker === 0) {
        if (primaryVoice) {
          utt.voice = primaryVoice;
          utt.lang = primaryVoice.lang;
        }
        utt.pitch = this.pitch;
      } else {
        if (secondaryVoice) {
          utt.voice = secondaryVoice;
          utt.lang = secondaryVoice.lang;
          utt.pitch = this.pitch;
        } else {
          // تعديل ذكي لطبقة الصوت لصنع متحدث ثانٍ مميز تماماً حتى بدون صوت ثانٍ
          if (primaryVoice) utt.voice = primaryVoice;
          utt.pitch = Math.max(0.75, this.pitch * 0.88);
        }
      }

      const label = turn.speakerName ? ` (${turn.speakerName})` : ` (المتحدث ${turn.speaker + 1})`;
      this.updateStatus(`حوار جارٍ${label}... 🎙️`);
      this.showFloatingPlayer(cleanTurn, `حوار: ${turn.speakerName || ('المتحدث ' + (turn.speaker + 1))} 🎙️`);
      this.setupKaraoke(cleanTurn);

      utt.onstart = () => {
        this.startKaraokeLive();
      };

      utt.onboundary = (e) => {
        if (e.name === 'word') {
          this.hasReceivedRealWordBoundary = true;
          if (e.charIndex !== undefined) {
            this.handleWordBoundary(e.charIndex);
          }
        }
      };

      utt.onend = () => {
        this.clearKaraoke();
        idx++;
        setTimeout(() => {
          if (this.isPlaying) playNextTurn();
        }, 380); // وقفة حوارية طبيعية بين المتحدثين
      };

      utt.onerror = (e) => {
        console.warn('Dialogue turn error', e);
        this.clearKaraoke();
        idx++;
        playNextTurn();
      };

      this.synth.speak(utt);
    };

    playNextTurn();
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
    this.synth.cancel();

    const cleanText = this.cleanTextForSpeech(text);
    if (!cleanText) {
      if (onDone) onDone();
      return;
    }

    const utt = new SpeechSynthesisUtterance(cleanText);
    utt.rate = this.speed;   // السرعة الهادئة المتأنية
    utt.pitch = this.pitch;  // النبرة الطبيعية المعتدلة
    utt.volume = 1.0;

    const voice = this.getBestVoice(lang);
    if (voice) {
      utt.voice = voice;
      utt.lang = voice.lang;
    } else {
      utt.lang = lang === 'en' ? 'en-GB' : 'ar-SA';
    }

    this.showFloatingPlayer(cleanText, 'قراءة النص 🔊');
    this.setupKaraoke(cleanText);

    utt.onstart = () => {
      this.isPlaying = true;
      this.isPaused = false;
      this.updateButtons();
      this.updateStatus('جارِ القراءة... 🔊');
      this.startKaraokeLive();
    };

    utt.onboundary = (e) => {
      if (e.name === 'word') {
        this.hasReceivedRealWordBoundary = true;
        if (e.charIndex !== undefined) {
          this.handleWordBoundary(e.charIndex);
        }
      }
    };

    utt.onend = () => {
      this.clearKaraoke();
      this.isPlaying = false;
      this.isPaused = false;
      this.updateButtons();
      this.hideFloatingPlayer();
      if (onDone) onDone();
    };

    utt.onerror = (e) => {
      console.warn('Speech error', e);
      this.clearKaraoke();
      this.isPlaying = false;
      this.isPaused = false;
      this.updateButtons();
      this.hideFloatingPlayer();
      if (onDone) onDone();
    };

    this.isPlaying = true;
    this.isPaused = false;
    this.updateButtons();
    this.synth.speak(utt);
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
    this.readNextChunk();
  },

  readNextChunk() {
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
      this.currentChunkIdx++;
      setTimeout(() => {
        if (this.isPlaying) {
          this.readNextChunk();
        }
      }, 350);
    });
  },

  pause() {
    if (this.synth && this.isPlaying) {
      this.synth.pause();
      this.isPaused = true;
      if (this.karaokeTimer) {
        clearTimeout(this.karaokeTimer);
        this.karaokeTimer = null;
      }
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
      this.scheduleNextWord(this.activeWordIndex);
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
    if (this.synth) {
      this.synth.cancel();
    }
    this.clearKaraoke();
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
    const liveText = document.getElementById('teleprompterCurrentText');
    const liveSpeaker = document.getElementById('teleprompterSpeakerBadge');

    const clean = text ? text.replace(/[•📌📄🔹💡🔍📖]/g, '').trim() : '';

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

    if (liveBox) liveBox.style.display = 'block';
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

  setKaraokeSync(val) {
    this.karaokeSyncFactor = parseFloat(val) || 0.92;
    lsSet('karaoke_sync', this.karaokeSyncFactor.toString());
    const sel = document.getElementById('studioKaraokeSyncSelect');
    if (sel) sel.value = this.karaokeSyncFactor.toString();
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

  const syncSel = document.getElementById('studioKaraokeSyncSelect');
  if (syncSel) syncSel.value = (audioPlayer.karaokeSyncFactor || 1.0).toString();

  const offsetSel = document.getElementById('studioKaraokeOffsetSelect');
  if (offsetSel) offsetSel.value = (audioPlayer.customSyncOffset || 'auto').toString();

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

  const syncSel = document.getElementById('studioKaraokeSyncSelect');
  if (syncSel) audioPlayer.setKaraokeSync(syncSel.value);

  const offsetSel = document.getElementById('studioKaraokeOffsetSelect');
  if (offsetSel) audioPlayer.setSyncOffset(offsetSel.value);

  alert('تم حفظ إعدادات الصوت وتزامن مؤشر الكلمات بنجاح واعتمادها للنظام بالكامل ✅\n- إعداد المهندس أسامة خليل هاشم');
  closeVoiceStudioModal();
}

function resetStudioDefaults() {
  audioPlayer.setSelectedVoice('auto');
  audioPlayer.setSpeed(0.82);
  audioPlayer.setPitch(1.0);
  audioPlayer.setMultiSpeaker(true);
  audioPlayer.setKaraokeSync(1.0);
  audioPlayer.setSyncOffset('auto');

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
  const syncSel = document.getElementById('studioKaraokeSyncSelect');
  if (syncSel) syncSel.value = '1.0';
  const offsetSel = document.getElementById('studioKaraokeOffsetSelect');
  if (offsetSel) offsetSel.value = 'auto';

  alert('تمت استعادة الإعدادات الصوتية الافتراضية الموصى بها (0.82x سرعة هادئة - نبرة 1.0 معتدلة - تزامن بافر تلقائي 2.2 ثانية).');
}


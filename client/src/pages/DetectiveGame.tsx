import React, { useState, useEffect } from 'react';
import { Verb, InventoryItem } from '@/game/types';
import { sfx } from '@/lib/audio';
import { VerbBar } from '@/components/VerbBar';
import { PuzzleBoxModal } from '@/components/PuzzleBoxModal';
import { CryptexModal } from '@/components/CryptexModal';
import { SafeModal } from '@/components/SafeModal';
import { BookshelfModal } from '@/components/BookshelfModal';
import { ClueInspectorModal } from '@/components/ClueInspectorModal';
import { DetectiveCatDialogue } from '@/components/DetectiveCatDialogue';
import { FilmGrainOverlay } from '@/components/FilmGrainOverlay';

// Uploaded asset storage URLs
const ASSETS = {
  OFFICE: '/manus-storage/detective_office_scene_362ea1d3.png',
  PUZZLE_BOX: '/manus-storage/mechanical_puzzle_box_2cd60e14.png',
  CRYPTEX: '/manus-storage/steampunk_cryptex_ae567270.png',
  CAT: '/manus-storage/detective_cat_572d83e6.png',
};

export const DetectiveGame: React.FC = () => {
  // Language toggle: 'en' | 'zh'
  const [lang, setLang] = useState<'zh' | 'en'>('zh');

  // Game states
  const [currentVerb, setCurrentVerb] = useState<Verb>('look');
  const [inventory, setInventory] = useState<InventoryItem[]>([
    {
      id: 'magnifier',
      name: lang === 'zh' ? '发光放大镜' : 'Glowing Lens',
      icon: '🔍',
      description: lang === 'zh' ? '菲利克斯猫的发光放大镜，能揭示隐藏的微观印记与古老暗语。' : 'Felix\'s glowing magnifying glass. Reveals hidden symbols.',
    },
  ]);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  // Puzzle progression flags
  const [posterRead, setPosterRead] = useState<boolean>(false);
  const [bookshelfSolved, setBookshelfSolved] = useState<boolean>(false);
  const [puzzleBoxSolved, setPuzzleBoxSolved] = useState<boolean>(false);
  const [safeSolved, setSafeSolved] = useState<boolean>(false);
  const [cryptexSolved, setCryptexSolved] = useState<boolean>(false);
  const [hasEscaped, setHasEscaped] = useState<boolean>(false);

  // Active modal views
  const [activeModal, setActiveModal] = useState<
    'puzzlebox' | 'cryptex' | 'safe' | 'bookshelf' | 'typewriter' | 'calendar' | 'door' | null
  >(null);

  // Companion dialogue
  const [isDialogueOpen, setIsDialogueOpen] = useState<boolean>(true);
  const [dialogueText, setDialogueText] = useState<string>(
    lang === 'zh'
      ? '惠特莫尔侦探失踪了，有人锁死了这间1930年代侦探办公室的电子机械门栓！快在房间里搜寻线索，调查书架和办公桌，我们一定能逃出去！'
      : 'Detective Whitmore has vanished, and someone engaged the emergency deadbolts! Look around the office, examine his desk and bookshelf, and let\'s find the way out!'
  );
  const [actionNarrative, setActionNarrative] = useState<string>(
    lang === 'zh'
      ? '1930年代复古侦探办公室：百叶窗透入清冷月光，办公桌上的神秘黄铜魔盒泛着金光。'
      : '1930s Detective Office: Moonlight streams through the slatted blinds. The glowing mystery box hums on the desk.'
  );

  // Visual effects
  const [filmGrainEnabled, setFilmGrainEnabled] = useState<boolean>(true);
  const [lampOn, setLampOn] = useState<boolean>(true);

  // Detect URL query modal parameter for easy visual verification
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const modalParam = params.get('modal');
    if (modalParam === 'puzzlebox' || modalParam === 'cryptex' || modalParam === 'safe' || modalParam === 'bookshelf') {
      setActiveModal(modalParam);
    }
  }, []);

  // Compute hint based on current state
  const getCurrentHint = (): string => {
    if (lang === 'zh') {
      if (!bookshelfSolved) {
        return '看墙上相框里的格言："Truth Always Finds A Way"（真相总会找到出路）。书架上的精装古书可能就是秘密机关！';
      }
      if (!puzzleBoxSolved) {
        return '去检查桌上的打字机备忘录！惠特莫尔留下了黄铜齿轮盒的解法：依次对齐 星星、月亮、全视之眼、金字塔！';
      }
      if (!safeSolved) {
        return '墙面保险箱需要三段密码！留意墙上的古董挂钟(10点)、办公桌抽屉(4号)、以及月历上圈红的日期(28日)！';
      }
      if (!cryptexSolved) {
        return '保险箱里藏着蒸汽朋克密码筒！转动5个字符转环，拼出神秘埃及之城 "LUXOR" 即可解开！';
      }
      return '我们拿到纯金总钥匙了！快去办公室大门解锁逃出生天吧！';
    } else {
      if (!bookshelfSolved) {
        return 'Check the framed motto on the wall: "Truth Always Finds A Way". Those antique leather books on the shelf might be a lever mechanism!';
      }
      if (!puzzleBoxSolved) {
        return 'Inspect the typewriter on the desk! Whitmore left notes on how to align the Star, Moon, Eye, and Pyramid dials on the glowing brass puzzle box.';
      }
      if (!safeSolved) {
        return 'The wall safe needs a 3-number combination! Look at the wall clock (10), the desk drawer (4), and the circled calendar date (28).';
      }
      if (!cryptexSolved) {
        return 'The vault held Whitmore\'s Steampunk Cryptex! Rotate the 5 letter cylinders to spell the ancient city "LUXOR".';
      }
      return 'We have the Golden Master Key! Head over to the heavy office door and unlock the deadbolt to escape!';
    }
  };

  const getProgressPhase = (): string => {
    if (lang === 'zh') {
      if (!bookshelfSolved) return '第一阶段：机关书架';
      if (!puzzleBoxSolved) return '第二阶段：黄铜机关盒';
      if (!safeSolved) return '第三阶段：入墙重型保险箱';
      if (!cryptexSolved) return '第四阶段：蒸汽朋克密码筒';
      return '终局：逃出密室';
    } else {
      if (!bookshelfSolved) return 'Phase 1: Secret Bookshelf';
      if (!puzzleBoxSolved) return 'Phase 2: The Brass Box';
      if (!safeSolved) return 'Phase 3: The Wall Vault';
      if (!cryptexSolved) return 'Phase 4: Cryptex Decoding';
      return 'Final: Escape Office';
    }
  };

  // Hotspot interaction handler
  const handleHotspotClick = (hotspotId: string) => {
    sfx.click();

    switch (hotspotId) {
      case 'cat':
        sfx.catMeow();
        setIsDialogueOpen(true);
        setDialogueText(getCurrentHint());
        setActionNarrative(lang === 'zh' ? '猫咪侦探菲利克斯警觉地动了动胡须，压了压礼帽。' : 'Inspector Felix Claws twitches his whiskers and adjusts his fedora.');
        break;

      case 'poster':
        setPosterRead(true);
        sfx.clueReveal();
        setActionNarrative(lang === 'zh' ? '墙上相框写着侦探格言："TRUTH ALWAYS FINDS A WAY"（真相总会找到出路）。' : 'Framed Wall Motto reads: "TRUTH ALWAYS FINDS A WAY". A profound motto for any investigator.');
        setIsDialogueOpen(true);
        setDialogueText(lang === 'zh' ? '注意这句格言里的单词顺序：Truth... Always... Finds... A Way！书架上正好有对应书名！' : 'Notice how each word corresponds to the volumes in the library? "Truth... Always... Finds... A Way"!');
        break;

      case 'bookshelf':
        if (currentVerb === 'look' || currentVerb === 'use') {
          setActiveModal('bookshelf');
          setActionNarrative(lang === 'zh' ? '调查红木书架上排列的书籍。' : 'Examining the mahogany bookshelf with titles matching Whitmore\'s casefiles.');
        } else {
          setActionNarrative(lang === 'zh' ? '沉重的书架固定在墙上，你需要按顺序抽动特定书本触发机关。' : 'The heavy bookshelf is fixed to the wall. You need to pull the books in order.');
        }
        break;

      case 'desk_lamp':
        sfx.click();
        setLampOn(!lampOn);
        setActionNarrative(
          lampOn
            ? (lang === 'zh' ? '你关掉了绿罩台灯，办公室里的阴影变得更浓重了。' : 'You switched off the green banker\'s lamp. Shadows deepen.')
            : (lang === 'zh' ? '你按下黄铜开关，翡翠绿色的台灯洒下一片暖光。' : 'You clicked the brass switch. The emerald banker\'s shade illuminates the desk.')
        );
        break;

      case 'typewriter':
        sfx.typewriter();
        setActiveModal('typewriter');
        setActionNarrative(lang === 'zh' ? '阅读惠特莫尔留下的雷明顿1931打字机绝密案卷备忘录。' : 'Examining Whitmore\'s Underwood 1931 typewriter with a freshly typed case memorandum.');
        break;

      case 'puzzle_box':
        setActiveModal('puzzlebox');
        setActionNarrative(lang === 'zh' ? '仔细端详书桌上嗡嗡作响的精密黄铜机械盒。' : 'Examining the glowing mechanical Brass Puzzle Box resting upon Whitmore\'s desk.');
        break;

      case 'wall_safe':
        if (!bookshelfSolved) {
          setActionNarrative(lang === 'zh' ? '墙面保险箱被重型钢板联锁。似乎需要先解开书架机械齿轮供电。' : 'The wall safe is recessed behind steel reinforced panels. Solve bookshelf first.');
          setIsDialogueOpen(true);
          setDialogueText(lang === 'zh' ? '伙伴，先去搞定书架机关吧！' : 'Let\'s solve the bookshelf first, pal!');
        } else {
          setActiveModal('safe');
          setActionNarrative(lang === 'zh' ? '走近嵌在墙壁深处的重型铸钢保险箱。' : 'Approaching the heavy cast-steel wall vault safe.');
        }
        break;

      case 'calendar':
        setActiveModal('calendar');
        setActionNarrative(lang === 'zh' ? '查看保险箱旁悬挂的1931年9月月历。' : 'Looking at the September 1931 monthly calendar hanging by the wall safe.');
        break;

      case 'wall_clock':
        sfx.clueReveal();
        setActionNarrative(lang === 'zh' ? '复古墙钟滴答作响，指针稳稳停在 10:00。' : 'The antique grandfather clock on the wall ticks rhythmically. The brass hands point strictly to 10:00.');
        break;

      case 'coat_rack':
        if (!inventory.some((i) => i.id === 'coat_key')) {
          sfx.itemPickup();
          setInventory((prev) => [
            ...prev,
            {
              id: 'coat_key',
              name: lang === 'zh' ? '黄铜拨片钥匙' : 'Brass Dial Key',
              icon: '🗝',
              description: lang === 'zh' ? '在惠特莫尔大衣口袋里摸出的小型黄铜钥匙。' : 'A miniature slotted key found in Whitmore\'s trench coat pocket.',
            },
          ]);
          setActionNarrative(lang === 'zh' ? '你在衣帽架的大衣口袋里搜出了一把精巧的黄铜钥匙！' : 'You searched Whitmore\'s trench coat pocket on the coat rack and found a Brass Dial Key!');
        } else {
          setActionNarrative(lang === 'zh' ? '衣帽架上挂着惠特莫尔的备用软呢帽和淋湿的风衣。' : 'Just Whitmore\'s spare fedora and rain-drenched overcoat hanging on the polished brass stand.');
        }
        break;

      case 'door':
        setActiveModal('door');
        break;

      case 'window':
        sfx.clueReveal();
        setActionNarrative(lang === 'zh' ? '清冷的月光透过滤帘照进室内，窗外是雾气弥漫的1930年代都市。' : 'Moonlight filters through the dusty slatted blinds over the 1930s cityscape. Rain patters on the glass.');
        break;

      default:
        setActionNarrative(`Interacting with ${hotspotId}.`);
    }
  };

  // Puzzle Solved Callbacks
  const onBookshelfSolved = () => {
    setBookshelfSolved(true);
    if (!inventory.some((i) => i.id === 'gear_wrench')) {
      sfx.itemPickup();
      setInventory((prev) => [
        ...prev,
        {
          id: 'gear_wrench',
          name: lang === 'zh' ? '钟表匠微调扳手' : 'Watchmaker Tool',
          icon: '🔧',
          description: lang === 'zh' ? '用于调整精密机关齿轮的微型工具。' : 'A finely calibrated watchmaker wrench for tuning intricate gearboxes.',
        },
      ]);
    }
    setActionNarrative(lang === 'zh' ? '秘密书架侧滑开来，暗格弹出，黄铜机关盒的联动齿轮开始啮合！' : 'The secret shelf swung open, revealing the gears of the desk apparatus and a Watchmaker Tool!');
    setDialogueText(lang === 'zh' ? '太精彩了！现在办公桌上的黄铜机关盒通电了，快去解开它！' : 'Splendid deduction! The mechanical box on the desk is now humming with power!');
    setIsDialogueOpen(true);
  };

  const onPuzzleBoxSolved = () => {
    setPuzzleBoxSolved(true);
    if (!inventory.some((i) => i.id === 'safe_dial')) {
      sfx.itemPickup();
      setInventory((prev) => [
        ...prev,
        {
          id: 'safe_dial',
          name: lang === 'zh' ? '银质保险箱旋钮' : 'Silver Vault Dial',
          icon: '⚙',
          description: lang === 'zh' ? '精密车削的金属转盘旋钮，正适合安装在墙面金库上。' : 'A precision-machined dial knob that fits the heavy wall safe tumbler.',
        },
      ]);
    }
    setActionNarrative(lang === 'zh' ? '机关盒盖弹开！你获得了银质保险箱旋钮与破译线索。' : 'The brass box lid swung open! You retrieved the Silver Vault Dial and case notes.');
    setDialogueText(lang === 'zh' ? '喵呜！太棒了！拿着这枚旋钮，去解开右侧墙壁上的重型保险箱！' : 'Purr-fect! Now take that silver dial over to the Wall Safe on the right wall!');
    setIsDialogueOpen(true);
  };

  const onSafeSolved = () => {
    setSafeSolved(true);
    if (!inventory.some((i) => i.id === 'cryptex')) {
      sfx.itemPickup();
      setInventory((prev) => [
        ...prev,
        {
          id: 'cryptex',
          name: lang === 'zh' ? '蒸汽朋克密码筒' : 'Steampunk Cryptex',
          icon: '🔐',
          description: lang === 'zh' ? '带有5重字母拨环的精密解码仪器。双击可在背包中检视解谜！' : 'A heavy brass cryptex decoding device with rotating alphabet rings.',
          canInspect: true,
        },
      ]);
    }
    setActionNarrative(lang === 'zh' ? '保险箱厚重的钢门滑开！里面静静躺着传奇的蒸汽朋克密码筒！' : 'The vault door swings open! Inside rests the legendary Steampunk Cryptex!');
    setDialogueText(lang === 'zh' ? '天哪！密码筒就在里面！双击背包里的密码筒，拼出5字母暗号！' : 'Great Scott, the Steampunk Cryptex is inside! Let\'s inspect it and crack the 5-letter cipher word!');
    setIsDialogueOpen(true);
  };

  const onCryptexSolved = () => {
    setCryptexSolved(true);
    if (!inventory.some((i) => i.id === 'master_key')) {
      sfx.itemPickup();
      setInventory((prev) => [
        ...prev,
        {
          id: 'master_key',
          name: lang === 'zh' ? '纯金逃生总钥匙' : 'Golden Master Key',
          icon: '🔑',
          description: lang === 'zh' ? '能解除办公室橡木大门电子机械死锁的华丽金钥匙！' : 'The heavy ornate brass key that disengages the office electro-mechanical deadbolt.',
        },
      ]);
    }
    setActionNarrative(lang === 'zh' ? '密码筒内筒弹出，里面正是纯金逃生总钥匙！' : 'The cryptex cylinder split open, revealing the Golden Master Key!');
    setDialogueText(lang === 'zh' ? '总钥匙到手了！立刻去大门开锁逃出密室吧！' : 'We got the Master Key! Use it on the exit door to escape into the city!');
    setIsDialogueOpen(true);
  };

  const onDoorEscape = () => {
    setHasEscaped(true);
  };

  const resetGame = () => {
    setBookshelfSolved(false);
    setPuzzleBoxSolved(false);
    setSafeSolved(false);
    setCryptexSolved(false);
    setHasEscaped(false);
    setInventory([
      {
        id: 'magnifier',
        name: lang === 'zh' ? '发光放大镜' : 'Glowing Lens',
        icon: '🔍',
        description: lang === 'zh' ? '菲利克斯猫的发光放大镜。' : 'Felix\'s glowing magnifying glass. Reveals hidden symbols.',
      },
    ]);
    setSelectedItem(null);
    setActiveModal(null);
    setActionNarrative(lang === 'zh' ? '密室重置。你正站在惠特莫尔侦探反锁的办公室中。' : 'Scenario reset. You are standing inside Detective Whitmore\'s locked office.');
    setDialogueText(lang === 'zh' ? '回到起点啦，拍档！让我们再搜寻一遍，逃出密室！' : 'Back at square one, partner! Let\'s inspect the room and escape again!');
    setIsDialogueOpen(true);
  };

  return (
    <div className="relative w-screen h-screen bg-[#120b07] flex flex-col justify-between overflow-hidden select-none font-serif">
      {/* Film Grain & Retro Lighting Filter */}
      <FilmGrainOverlay enabled={filmGrainEnabled} />

      {/* Top Header / Game Title & Narrative Line */}
      <header className="relative z-20 w-full bg-[#1e130a] border-b-4 border-[#3d2716] px-4 py-2 flex flex-col sm:flex-row items-center justify-between text-[#ecdcc8] shadow-lg">
        <div className="flex items-center gap-3">
          <span className="text-xl">🐱🕵️</span>
          <div>
            <h1 className="text-base sm:text-lg font-black tracking-wider text-[#d4af37] uppercase">
              {lang === 'zh' ? '机密密室：密码猫与黄铜魔盒' : 'Cipher Cat & The Mystery of the Brass Box'}
            </h1>
            <p className="text-[10px] text-[#9c846d] font-mono">
              1930s Point-and-Click Detective Adventure • Rubber Hose &amp; Professor Layton Style
            </p>
          </div>
        </div>

        {/* Narrative Action Bar & Lang switch */}
        <div className="flex items-center gap-2 mt-1 sm:mt-0">
          <div className="max-w-md text-center sm:text-right text-xs italic text-[#e0cfbb] bg-[#2d1c10] px-3 py-1 rounded border border-[#523722] truncate">
            &ldquo;{actionNarrative}&rdquo;
          </div>

          <button
            onClick={() => {
              sfx.click();
              setLang(lang === 'zh' ? 'en' : 'zh');
            }}
            className="px-2 py-1 bg-[#3d2716] hover:bg-[#59391f] text-white text-xs font-bold rounded border border-[#7a5232]"
            title="Toggle Language / 切换语言"
          >
            {lang === 'zh' ? 'EN' : '中文'}
          </button>
        </div>
      </header>

      {/* Main Room Viewport */}
      <main className="relative flex-1 w-full h-full flex items-center justify-center p-2 sm:p-4 overflow-hidden">
        {/* Aspect-Ratio Box for 16:9 Detective Office Scene */}
        <div className="relative w-full max-w-[1400px] aspect-video max-h-[82vh] rounded-lg overflow-hidden border-4 border-[#422e1d] shadow-[0_0_50px_rgba(0,0,0,0.9)] bg-black">
          {/* Background Illustration */}
          <img
            src={ASSETS.OFFICE}
            alt="Detective Office"
            className="w-full h-full object-cover pointer-events-none"
            style={{
              filter: lampOn ? 'brightness(1.02) contrast(1.05)' : 'brightness(0.75) contrast(1.15)',
            }}
          />

          {/* Interactive Hotspot 1: Detective Cat Companion */}
          <button
            onClick={() => handleHotspotClick('cat')}
            title="Inspector Felix Claws (Click to talk or get hints)"
            className="absolute left-[11%] bottom-[22%] w-[10%] h-[26%] cursor-pointer group focus:outline-none"
          >
            <div className="w-full h-full rounded-full border-2 border-transparent group-hover:border-[#d4af37] group-hover:bg-[#d4af37]/20 transition-all flex items-start justify-center">
              <span className="opacity-0 group-hover:opacity-100 bg-[#2b190f] text-[#f5ebd7] text-[10px] font-bold px-2 py-0.5 rounded shadow border border-[#7a5232] -translate-y-6">
                {lang === 'zh' ? '对话猫咪侦探' : 'Talk to Felix'}
              </span>
            </div>
          </button>

          {/* Hotspot 2: Wall Motto Poster ("Truth Always Finds A Way") */}
          <button
            onClick={() => handleHotspotClick('poster')}
            title="Framed Wall Motto: Truth Always Finds A Way"
            className="absolute left-[19%] top-[7%] w-[7%] h-[18%] cursor-pointer group focus:outline-none"
          >
            <div className="w-full h-full rounded border-2 border-transparent group-hover:border-[#d4af37] group-hover:bg-[#d4af37]/20 transition-all flex items-end justify-center">
              <span className="opacity-0 group-hover:opacity-100 bg-[#2b190f] text-[#f5ebd7] text-[10px] font-bold px-1.5 py-0.5 rounded shadow border border-[#7a5232] translate-y-6">
                {lang === 'zh' ? '侦探格言' : 'Inspect Motto'}
              </span>
            </div>
          </button>

          {/* Hotspot 3: Bookshelf with Secret Lever Books */}
          <button
            onClick={() => handleHotspotClick('bookshelf')}
            title="The Library Bookshelf (Secret lever mechanism)"
            className="absolute left-[33%] top-[3%] w-[18%] h-[48%] cursor-pointer group focus:outline-none"
          >
            <div className="w-full h-full rounded border-2 border-transparent group-hover:border-[#d4af37] group-hover:bg-[#d4af37]/20 transition-all flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 bg-[#2b190f] text-[#f5ebd7] text-[10px] font-bold px-2 py-0.5 rounded shadow border border-[#7a5232]">
                📚 {lang === 'zh' ? '机关书架' : 'Bookshelf'} {bookshelfSolved ? '✓' : ''}
              </span>
            </div>
          </button>

          {/* Hotspot 4: Desk Banker's Lamp */}
          <button
            onClick={() => handleHotspotClick('desk_lamp')}
            title="Green Banker's Lamp (Click to toggle light)"
            className="absolute left-[38%] top-[41%] w-[6%] h-[12%] cursor-pointer group focus:outline-none"
          >
            <div className="w-full h-full rounded border-2 border-transparent group-hover:border-emerald-400 group-hover:bg-emerald-400/20 transition-all" />
          </button>

          {/* Hotspot 5: Desk Typewriter */}
          <button
            onClick={() => handleHotspotClick('typewriter')}
            title="Underwood 1931 Typewriter (Read Whitmore's clue memorandum)"
            className="absolute left-[44%] top-[43%] w-[10%] h-[12%] cursor-pointer group focus:outline-none"
          >
            <div className="w-full h-full rounded border-2 border-transparent group-hover:border-[#d4af37] group-hover:bg-[#d4af37]/20 transition-all flex items-end justify-center">
              <span className="opacity-0 group-hover:opacity-100 bg-[#2b190f] text-[#f5ebd7] text-[10px] font-bold px-2 py-0.5 rounded shadow border border-[#7a5232] translate-y-6">
                ⌨ {lang === 'zh' ? '打字机案卷' : 'Typewriter'}
              </span>
            </div>
          </button>

          {/* Hotspot 6: Glowing Mechanical Puzzle Box on Desk */}
          <button
            onClick={() => handleHotspotClick('puzzle_box')}
            title="Glowing Mechanical Brass Puzzle Box"
            className="absolute left-[53%] top-[52%] w-[6%] h-[11%] cursor-pointer group focus:outline-none"
          >
            <div className="w-full h-full rounded border-2 border-amber-400/50 bg-amber-400/10 animate-pulse group-hover:border-amber-300 group-hover:bg-amber-300/30 transition-all flex items-end justify-center">
              <span className="opacity-0 group-hover:opacity-100 bg-[#2b190f] text-[#f5ebd7] text-[10px] font-bold px-2 py-0.5 rounded shadow border border-[#7a5232] translate-y-6">
                ⚙ {lang === 'zh' ? '黄铜机关盒' : 'Puzzle Box'} {puzzleBoxSolved ? '✓' : ''}
              </span>
            </div>
          </button>

          {/* Hotspot 7: Heavy Wall Vault Safe */}
          <button
            onClick={() => handleHotspotClick('wall_safe')}
            title="Heavy Cast-Steel Wall Safe"
            className="absolute right-[12%] top-[10%] w-[10%] h-[24%] cursor-pointer group focus:outline-none"
          >
            <div className="w-full h-full rounded border-2 border-transparent group-hover:border-[#d4af37] group-hover:bg-[#d4af37]/20 transition-all flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 bg-[#2b190f] text-[#f5ebd7] text-[10px] font-bold px-2 py-0.5 rounded shadow border border-[#7a5232]">
                🗝 {lang === 'zh' ? '入墙保险箱' : 'Wall Safe'} {safeSolved ? '✓' : ''}
              </span>
            </div>
          </button>

          {/* Hotspot 8: Calendar on the wall */}
          <button
            onClick={() => handleHotspotClick('calendar')}
            title="September 1931 Calendar"
            className="absolute right-[6%] top-[30%] w-[6%] h-[16%] cursor-pointer group focus:outline-none"
          >
            <div className="w-full h-full rounded border-2 border-transparent group-hover:border-[#d4af37] group-hover:bg-[#d4af37]/20 transition-all flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 bg-[#2b190f] text-[#f5ebd7] text-[10px] font-bold px-1 py-0.5 rounded shadow border border-[#7a5232]">
                📅 {lang === 'zh' ? '月历' : 'Calendar'}
              </span>
            </div>
          </button>

          {/* Hotspot 9: Exit Door */}
          <button
            onClick={() => handleHotspotClick('door')}
            title="Private Office Exit Door (Deadbolt locked)"
            className="absolute left-[2%] top-[14%] w-[12%] h-[58%] cursor-pointer group focus:outline-none"
          >
            <div className="w-full h-full rounded border-2 border-transparent group-hover:border-red-400 group-hover:bg-red-400/15 transition-all flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 bg-[#2b190f] text-[#f5ebd7] text-[10px] font-bold px-2 py-0.5 rounded shadow border border-red-800">
                🚪 {lang === 'zh' ? '密室大门' : 'Exit Door'}
              </span>
            </div>
          </button>

          {/* Hotspot 10: Coat Rack */}
          <button
            onClick={() => handleHotspotClick('coat_rack')}
            title="Brass Coat Rack & Overcoat"
            className="absolute left-[13%] top-[17%] w-[8%] h-[35%] cursor-pointer group focus:outline-none"
          >
            <div className="w-full h-full rounded border-2 border-transparent group-hover:border-[#d4af37] group-hover:bg-[#d4af37]/20 transition-all" />
          </button>

          {/* Hotspot 11: Moonlit Window */}
          <button
            onClick={() => handleHotspotClick('window')}
            title="Moonlit Venetian Blinds Window"
            className="absolute left-[62%] top-[2%] w-[15%] h-[38%] cursor-pointer group focus:outline-none"
          >
            <div className="w-full h-full rounded border-2 border-transparent group-hover:border-sky-300 group-hover:bg-sky-300/10 transition-all" />
          </button>
        </div>
      </main>

      {/* Detective Cat Hint Dialogue Bubble */}
      <DetectiveCatDialogue
        catImage={ASSETS.CAT}
        isOpen={isDialogueOpen}
        onClose={() => setIsDialogueOpen(false)}
        currentHint={dialogueText}
        progressPhase={getProgressPhase()}
      />

      {/* Minigame Modals */}
      {activeModal === 'puzzlebox' && (
        <PuzzleBoxModal
          boxImage={ASSETS.PUZZLE_BOX}
          isAlreadySolved={puzzleBoxSolved}
          onClose={() => setActiveModal(null)}
          onSolve={onPuzzleBoxSolved}
        />
      )}

      {activeModal === 'cryptex' && (
        <CryptexModal
          cryptexImage={ASSETS.CRYPTEX}
          isAlreadySolved={cryptexSolved}
          onClose={() => setActiveModal(null)}
          onSolve={onCryptexSolved}
        />
      )}

      {activeModal === 'safe' && (
        <SafeModal
          isAlreadySolved={safeSolved}
          onClose={() => setActiveModal(null)}
          onSolve={onSafeSolved}
        />
      )}

      {activeModal === 'bookshelf' && (
        <BookshelfModal
          isAlreadySolved={bookshelfSolved}
          onClose={() => setActiveModal(null)}
          onSolve={onBookshelfSolved}
        />
      )}

      {activeModal && activeModal !== 'puzzlebox' && activeModal !== 'cryptex' && activeModal !== 'safe' && activeModal !== 'bookshelf' && (
        <ClueInspectorModal
          type={activeModal as 'typewriter' | 'calendar' | 'door'}
          hasMasterKey={inventory.some((i) => i.id === 'master_key')}
          onClose={() => setActiveModal(null)}
          onDoorEscape={onDoorEscape}
        />
      )}

      {/* Victory Escape Screen */}
      {hasEscaped && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-6 text-center text-[#eddcca] font-serif animate-in fade-in duration-500">
          <div className="max-w-2xl bg-[#2e1d11] p-8 rounded-2xl border-4 border-[#d4af37] shadow-2xl relative">
            <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-[#d4af37] mb-4 bg-black">
              <img
                src={ASSETS.CAT}
                alt="Detective Cat"
                className="w-full h-full object-cover object-top scale-125"
              />
            </div>

            <h2 className="text-3xl font-black uppercase text-[#d4af37] tracking-widest mb-2">
              {lang === 'zh' ? '案件告破：成功逃脱密室！' : 'Case Solved: The Great Escape!'}
            </h2>
            <p className="text-sm font-mono text-[#a89078] mb-4">
              1930s NOIR DETECTIVE MYSTERY • ESCAPE ROOM COMPLETED
            </p>

            <p className="text-base leading-relaxed mb-6 bg-[#1f130b] p-4 rounded border border-[#593d25]">
              {lang === 'zh'
                ? '“太出色了，我的神探拍档！我们成功破译了惠特莫尔的书架机关、理顺了黄铜机关盒的四大星辰齿轮、解开了入墙金库的隐藏三段密码、并旋正了古老的LUXOR密码筒！夜雾迷蒙，雨丝纷飞，惠特莫尔的行踪就在城市前方——让我们出发吧！”'
                : '“Outstanding investigative work, partner! Together we decoded Whitmore\'s secret library motto, aligned the four esoteric gears of the Brass Puzzle Box, cracked the three-stage vault combination, and unscrambled the ancient LUXOR cryptex! Into the foggy streets we go — Whitmore\'s trail continues!”'}
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={resetGame}
                className="px-6 py-3 bg-[#8c6747] hover:bg-[#ad7e54] text-white font-bold rounded-lg shadow-lg uppercase tracking-wider text-sm transition-transform active:scale-95"
              >
                {lang === 'zh' ? '再玩一次' : 'Play Again'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 90s LucasArts Verb Command Bar & Inventory */}
      <VerbBar
        currentVerb={currentVerb}
        onSelectVerb={setCurrentVerb}
        inventory={inventory}
        selectedItem={selectedItem}
        onSelectItem={(item) => {
          setSelectedItem(item);
          setActionNarrative(lang === 'zh' ? `已选中道具：${item.name} (${item.description})` : `Selected item: ${item.name} (${item.description})`);
        }}
        onInspectItem={(item) => {
          if (item.id === 'cryptex') {
            setActiveModal('cryptex');
          } else {
            setActionNarrative(lang === 'zh' ? `正在仔细检视 ${item.name}：${item.description}` : `Inspecting ${item.name}: ${item.description}`);
          }
        }}
        filmGrainEnabled={filmGrainEnabled}
        onToggleFilmGrain={() => setFilmGrainEnabled(!filmGrainEnabled)}
        onResetGame={resetGame}
      />
    </div>
  );
};

(function () {
  const STORAGE_KEY = 'chessenger-lp-lang';

  const T = {
    ja: {
      'meta.index.title': 'Chessenger — 近くのチェス仲間を見つけよう',
      'meta.index.description':
        'Chessengerは、対面でチェスを楽しみたいプレイヤー同士をマッチングするiOSアプリです。',
      'meta.privacy.title': 'プライバシーポリシー — Chessenger',
      'meta.privacy.description': 'Chessenger プライバシーポリシー',
      'meta.terms.title': '利用規約 — Chessenger',
      'meta.terms.description': 'Chessenger 利用規約',
      'meta.support.title': 'サポート — Chessenger',
      'meta.support.description': 'Chessenger サポート・お問い合わせ',
      'nav.features': '機能',
      'nav.support': 'サポート',
      'nav.get': '入手',
      'nav.home': 'トップ',
      'nav.privacy': 'プライバシー',
      'nav.terms': '利用規約',
      'nav.contact': '連絡する',
      'lang.switch': 'EN',
      'hero.eyebrow': '♟ 対面チェスマッチング',
      'hero.title': '近くのチェス仲間を',
      'hero.titleAccent': '見つけて、対局',
      'hero.lead':
        'スキルやプレイスタイルで相手を探して、メッセージで日程を調整。実際に会ってチェスを楽しめる、プレイヤー向けアプリです。',
      'hero.cta': 'App Store で入手',
      'section.featuresLabel': 'Features',
      'section.featuresTitle': '対面チェスに必要なこと、これひとつ',
      'section.featuresDesc': '探す・つながる・対局する。シンプルな流れで、すぐに始められます。',
      'feature.1.title': 'プレイヤーを探す',
      'feature.1.desc':
        'スキルレベルやプレイスタイルで絞り込み。オンライン・近くのプレイヤーも一目でわかります。',
      'feature.2.title': 'マップで近くを確認',
      'feature.2.desc': '位置情報をオンにすれば、近くにいるプレイヤーをマップ上で確認できます（任意）。',
      'feature.3.title': '対局リクエスト',
      'feature.3.desc': 'プロフィールから持ち時間を選んで送信。相手が承諾すれば対局確定です。',
      'feature.4.title': 'メッセージ & タイムライン',
      'feature.4.desc':
        '対局の調整はメッセージで。タイムラインでコミュニティの動きもチェックできます。対局後は結果報告や評価も。',
      'cta.title': 'チェス仲間、探しにいこう',
      'cta.desc': 'iPhone 向けアプリ。今すぐダウンロード。',
      'cta.btn': 'App Store で入手',
      'footer.copy': '© 2025 Chessenger',
      'label.legal': 'Legal',
      'label.support': 'Support',
      'privacy.title': 'プライバシーポリシー',
      'privacy.updated': '最終更新日: 2025年1月1日',
      'privacy.s1.title': '1. 収集する情報',
      'privacy.s1.body':
        '本サービスでは以下の情報を収集します：\n・アカウント情報（名前、メールアドレス、プロフィール写真）\n・チェスのレーティング情報\n・位置情報（ユーザーが許可した場合のみ）\n・対局履歴と統計\n・メッセージの内容\n・デバイス情報とアプリの利用状況',
      'privacy.s2.title': '2. 情報の利用目的',
      'privacy.s2.body':
        '収集した情報は以下の目的で利用します：\n・プレイヤー同士のマッチング\n・サービスの改善と最適化\n・カスタマーサポートの提供\n・不正行為の検出と防止\n・利用統計の分析',
      'privacy.s3.title': '3. 情報の共有',
      'privacy.s3.body':
        'ユーザーの個人情報を第三者に販売することはありません。以下の場合に限り情報を共有する場合があります：\n・ユーザーの同意がある場合\n・法的要求に応じる必要がある場合\n・サービスの運営に必要な業務委託先との共有',
      'privacy.s4.title': '4. 位置情報について',
      'privacy.s4.body':
        '位置情報はプレイヤーのマッチングにのみ使用され、アプリの設定でいつでもオフにできます。アプリ起動中以外は位置情報を取得しません。正確な位置情報は他のプレイヤーに公開されず、おおよその距離のみが表示されます。',
      'privacy.s5.title': '5. データの保護',
      'privacy.s5.body':
        '業界標準のセキュリティ対策を実施し、ユーザーデータの保護に努めています。通信は暗号化され、データは安全なサーバーに保管されます。',
      'privacy.s6.title': '6. ユーザーの権利',
      'privacy.s6.body':
        'ユーザーは以下の権利を有します：\n・自己のデータへのアクセス権\n・データの修正・削除の要求\n・データ処理への同意の撤回\n・データの出力要求\n上記の権利の行使は、設定画面またはサポートへのお問い合わせにより可能です。',
      'privacy.s7.title': '7. 翻訳機能について',
      'privacy.s7.body':
        '翻訳ボタンを押した場合、選択したテキスト（投稿・コメント・メッセージ等）が翻訳サービスの提供のため、第三者（Google Cloud Translation API、MyMemory API 等）に送信されます。送信されたテキストは翻訳目的でのみ使用され、当該サービスによる学習・他目的利用は行われません。翻訳はユーザーがボタンを押した場合にのみ実行されます。',
      'privacy.s8.title': '8. お問い合わせ',
      'privacy.s8.body':
        'プライバシーに関するお問い合わせは、chessenger.co.ltd@gmail.com までご連絡ください。通報もメールで承っております。',
      'terms.title': '利用規約',
      'terms.updated': '最終更新日: 2025年1月1日',
      'terms.s1.title': '1. サービスの利用',
      'terms.s1.body':
        'Chessenger（以下「本サービス」）は、対面チェスのマッチングプラットフォームです。本サービスを利用するには、13歳以上であり、本利用規約に同意する必要があります。アカウントの作成時に正確な情報を提供し、アカウントのセキュリティを維持する責任はユーザーにあります。',
      'terms.s2.title': '2. ユーザーの行動規範',
      'terms.s2.body':
        'ユーザーは以下の行為を禁止されています：\n・他のユーザーへの嫌がらせ、脅迫、差別的行為\n・虚偽の情報の提供\n・スパムや商業目的の不正利用\n・他のユーザーの個人情報の無断収集・公開\n・不正な手段によるレーティング操作\n・本サービスの正常な運営を妨害する行為',
      'terms.s3.title': '3. 対局について',
      'terms.s3.body':
        '本サービスはプレイヤー同士のマッチングを提供するものであり、実際の対局場所や条件についてはユーザー間で合意の上で決定してください。対局中のトラブルについて、本サービスは直接的な責任を負いません。公共の場での対局を推奨します。',
      'terms.s4.title': '4. コンテンツとデータ',
      'terms.s4.body':
        'ユーザーが投稿するコンテンツ（プロフィール情報、タイムラインの投稿、メッセージ等）の権利はユーザーに帰属します。ただし、本サービスの運営に必要な範囲で利用する権利をChessengerに付与するものとします。',
      'terms.s5.title': '5. アカウントの停止・削除',
      'terms.s5.body':
        '本利用規約に違反した場合、事前の通知なくアカウントを停止または削除する場合があります。ユーザーは設定画面からいつでもアカウントを削除できます。',
      'terms.s6.title': '6. 免責事項',
      'terms.s6.body':
        '本サービスは「現状のまま」提供されます。サービスの中断、データの損失、ユーザー間のトラブルについて、法律が許容する最大限の範囲で責任を負いません。',
      'terms.s7.title': '7. 変更について',
      'terms.s7.body':
        '本利用規約は予告なく変更される場合があります。重要な変更がある場合は、アプリ内通知またはメールでお知らせします。',
      'support.title': 'サポート',
      'support.meta': 'よくある質問とお問い合わせ先です。',
      'support.faq1.q': 'Chessenger とは？',
      'support.faq1.a': '対面でチェスを楽しみたいプレイヤー同士をマッチングするアプリです。',
      'support.faq2.q': '対局リクエストの送り方',
      'support.faq2.a':
        'プレイヤーのプロフィールから「対局リクエスト」をタップし、持ち時間を選んで送信します。',
      'support.faq3.q': '位置情報は必須？',
      'support.faq3.a': '任意です。設定からいつでもオン・オフできます。',
      'support.faq4.q': 'アカウントの削除',
      'support.faq4.a': 'アプリ内の設定画面からいつでもアカウントを削除できます。',
      'support.contact.title': 'お問い合わせ',
      'support.contact.desc': '不具合の報告・通報はこちらからお願いします。',
      'support.contact.btn': 'メールで連絡する',
    },
    en: {
      'meta.index.title': 'Chessenger — Find chess partners near you',
      'meta.index.description':
        'Chessenger matches chess players who want to play face-to-face. Discover opponents, chat, and meet up to play.',
      'meta.privacy.title': 'Privacy Policy — Chessenger',
      'meta.privacy.description': 'Chessenger Privacy Policy',
      'meta.terms.title': 'Terms of Service — Chessenger',
      'meta.terms.description': 'Chessenger Terms of Service',
      'meta.support.title': 'Support — Chessenger',
      'meta.support.description': 'Chessenger Help & Support',
      'nav.features': 'Features',
      'nav.support': 'Support',
      'nav.get': 'Get',
      'nav.home': 'Home',
      'nav.privacy': 'Privacy',
      'nav.terms': 'Terms',
      'nav.contact': 'Contact',
      'lang.switch': 'JA',
      'hero.eyebrow': '♟ Face-to-face chess matching',
      'hero.title': 'Find chess partners',
      'hero.titleAccent': 'near you',
      'hero.lead':
        'Search by skill and play style, coordinate via messages, and meet in person to play chess.',
      'hero.cta': 'Download on the App Store',
      'section.featuresLabel': 'Features',
      'section.featuresTitle': 'Everything you need for over-the-board chess',
      'section.featuresDesc': 'Discover, connect, and play — a simple flow to get started.',
      'feature.1.title': 'Discover players',
      'feature.1.desc':
        'Filter by skill level and play style. See who is online or nearby at a glance.',
      'feature.2.title': 'Map nearby players',
      'feature.2.desc': 'Optionally enable location to see nearby players on the map.',
      'feature.3.title': 'Match requests',
      'feature.3.desc': 'Pick a time control from a profile and send a request. Once accepted, you are set.',
      'feature.4.title': 'Messages & timeline',
      'feature.4.desc':
        'Coordinate matches via chat. Browse the timeline and report results after you play.',
      'cta.title': 'Ready to find your next opponent?',
      'cta.desc': 'Built for iPhone. Download today.',
      'cta.btn': 'Download on the App Store',
      'footer.copy': '© 2025 Chessenger',
      'label.legal': 'Legal',
      'label.support': 'Support',
      'privacy.title': 'Privacy Policy',
      'privacy.updated': 'Last updated: January 1, 2025',
      'privacy.s1.title': '1. Information We Collect',
      'privacy.s1.body':
        'We collect:\n· Account info (name, email, profile photo)\n· Chess ratings\n· Location (only if you allow it)\n· Match history and stats\n· Message content\n· Device and usage data',
      'privacy.s2.title': '2. How We Use Information',
      'privacy.s2.body':
        'We use data for:\n· Player matching\n· Service improvement\n· Customer support\n· Fraud prevention\n· Usage analytics',
      'privacy.s3.title': '3. Information Sharing',
      'privacy.s3.body':
        'We do not sell personal information. We may share data only with your consent, when required by law, or with service providers needed to operate the app.',
      'privacy.s4.title': '4. Location Data',
      'privacy.s4.body':
        'Location is used only for matching. You can turn it off anytime in Settings. We do not collect location when the app is not in use. Exact coordinates are not shown to others — only approximate distance.',
      'privacy.s5.title': '5. Data Protection',
      'privacy.s5.body':
        'We use industry-standard security measures. Communications are encrypted and data is stored on secure servers.',
      'privacy.s6.title': '6. Your Rights',
      'privacy.s6.body':
        'You may access, correct, delete, or export your data, and withdraw consent. Use in-app Settings or contact support.',
      'privacy.s7.title': '7. Translation Feature',
      'privacy.s7.body':
        'When you tap translate, selected text may be sent to third-party services (Google Cloud Translation API, MyMemory API, etc.) solely for translation. Translation runs only when you press the button.',
      'privacy.s8.title': '8. Contact',
      'privacy.s8.body':
        'For privacy inquiries, contact chessenger.co.ltd@gmail.com. Reports are also accepted via email.',
      'terms.title': 'Terms of Service',
      'terms.updated': 'Last updated: January 1, 2025',
      'terms.s1.title': '1. Use of Service',
      'terms.s1.body':
        'Chessenger is a platform for matching face-to-face chess players. You must be at least 13 and agree to these Terms. You are responsible for accurate account information and account security.',
      'terms.s2.title': '2. User Conduct',
      'terms.s2.body':
        'Prohibited: harassment, threats, discrimination, false information, spam, unauthorized data collection, rating manipulation, and interfering with the Service.',
      'terms.s3.title': '3. Matches',
      'terms.s3.body':
        'The Service facilitates matching; match location and conditions are agreed between users. We are not liable for disputes during play. We recommend playing in public places.',
      'terms.s4.title': '4. Content and Data',
      'terms.s4.body':
        'You retain rights to content you post. You grant Chessenger a license to use it as needed to operate the Service.',
      'terms.s5.title': '5. Account Suspension/Deletion',
      'terms.s5.body':
        'Accounts may be suspended without notice for Terms violations. You may delete your account anytime in Settings.',
      'terms.s6.title': '6. Disclaimer',
      'terms.s6.body':
        'The Service is provided "as is". We disclaim liability for interruptions, data loss, or user disputes to the fullest extent permitted by law.',
      'terms.s7.title': '7. Changes',
      'terms.s7.body':
        'These Terms may change without notice. Important changes will be communicated in-app or by email.',
      'support.title': 'Support',
      'support.meta': 'FAQ and contact information.',
      'support.faq1.q': 'What is Chessenger?',
      'support.faq1.a': 'An app that matches chess players who want to play face-to-face.',
      'support.faq2.q': 'How do I send a match request?',
      'support.faq2.a': 'Open a player profile, tap Match Request, choose a time control, and send.',
      'support.faq3.q': 'Is location required?',
      'support.faq3.a': 'No. You can toggle location on or off in Settings.',
      'support.faq4.q': 'How do I delete my account?',
      'support.faq4.a': 'You can delete your account anytime from Settings in the app.',
      'support.contact.title': 'Contact us',
      'support.contact.desc': 'Report bugs or inappropriate content via email.',
      'support.contact.btn': 'Email support',
    },
  };

  function detectLang() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'ja' || saved === 'en') return saved;
    const browser = (navigator.language || 'ja').toLowerCase();
    return browser.startsWith('ja') ? 'ja' : 'en';
  }

  let currentLang = detectLang();

  function t(key) {
    return T[currentLang][key] ?? T.ja[key] ?? key;
  }

  function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;

    const page = document.body.dataset.page;
    if (page) {
      document.title = t('meta.' + page + '.title');
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', t('meta.' + page + '.description'));
    }

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      const value = t(key);
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = value;
      } else {
        el.textContent = value;
      }
    });

    document.querySelectorAll('[data-i18n-html]').forEach((el) => {
      const key = el.getAttribute('data-i18n-html');
      let html = t(key);
      html = html.replace(
        /chessenger\.co\.ltd@gmail\.com/g,
        '<a href="mailto:chessenger.co.ltd@gmail.com">chessenger.co.ltd@gmail.com</a>',
      );
      el.innerHTML = html;
    });
  }

  function toggleLanguage() {
    applyLanguage(currentLang === 'ja' ? 'en' : 'ja');
  }

  function init() {
    applyLanguage(currentLang);
    document.querySelectorAll('[data-lang-toggle]').forEach((btn) => {
      btn.addEventListener('click', toggleLanguage);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.ChessengerI18n = { applyLanguage, toggleLanguage, t };
})();

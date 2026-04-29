const carsData = [
    // トヨタ (左が多い)
    { name: "トヨタ アクア", side: "left", isCommon: true, isJapan: true },
    { name: "トヨタ プリウス", side: "left", isCommon: true, isJapan: true },
    { name: "トヨタ ヤリス", side: "left", isCommon: true, isJapan: true },
    { name: "トヨタ カローラ", side: "left", isCommon: true, isJapan: true },
    { name: "トヨタ アルファード", side: "left", isCommon: true, isJapan: true },
    { name: "トヨタ ヴォクシー", side: "left", isCommon: true, isJapan: true },
    { name: "トヨタ シエンタ", side: "left", isCommon: true, isJapan: true },
    { name: "トヨタ クラウン", side: "left", isCommon: true, isJapan: true },
    { name: "トヨタ ハリアー", side: "left", isCommon: true, isJapan: true },
    { name: "トヨタ RAV4", side: "left", isCommon: true, isJapan: true },
    { name: "トヨタ ランドクルーザー", side: "left", isCommon: true, isJapan: true },
    { name: "トヨタ ルーミー", side: "left", isCommon: true, isJapan: true },
    { name: "トヨタ ライズ", side: "left", isCommon: true, isJapan: true },
    { name: "トヨタ ノア", side: "left", isCommon: true, isJapan: true },
    { name: "トヨタ パッソ", side: "left", isCommon: true, isJapan: true },
    { name: "トヨタ CH-R", side: "left", isCommon: true, isJapan: true },
    { name: "トヨタ ハイエース", side: "left", isCommon: true, isJapan: true },
    { name: "トヨタ プロボックス", side: "left", isCommon: true, isJapan: true },
    { name: "トヨタ 86", side: "left", isCommon: true, isJapan: true },
    { name: "トヨタ スープラ", side: "left", isCommon: false, isJapan: true },
    { name: "トヨタ センチュリー", side: "left", isCommon: false, isJapan: true },
    { name: "トヨタ ミライ", side: "left", isCommon: false, isJapan: true }, // ※水素だがゲーム上給油口とする
    { name: "トヨタ アイシス", side: "left", isCommon: false, isJapan: true },
    { name: "トヨタ エスティマ", side: "left", isCommon: false, isJapan: true },
    { name: "トヨタ マークX", side: "left", isCommon: false, isJapan: true },

    // レクサス (左が多い)
    { name: "レクサス RX", side: "left", isCommon: true, isJapan: true },
    { name: "レクサス NX", side: "left", isCommon: true, isJapan: true },
    { name: "レクサス IS", side: "left", isCommon: false, isJapan: true },
    { name: "レクサス LS", side: "left", isCommon: false, isJapan: true },

    // 日産 (右が多い、軽などは左)
    { name: "日産 セレナ", side: "right", isCommon: true, isJapan: true },
    { name: "日産 ノート (初代・2代目)", side: "left", isCommon: true, isJapan: true }, // E11/E12型は左
    { name: "日産 ノート (3代目 E13型)", side: "right", isCommon: true, isJapan: true }, // E13型から右に変更された
    { name: "日産 エクストレイル", side: "right", isCommon: true, isJapan: true },
    { name: "日産 スカイライン", side: "right", isCommon: true, isJapan: true },
    { name: "日産 マーチ", side: "left", isCommon: true, isJapan: true },
    { name: "日産 キックス", side: "right", isCommon: true, isJapan: true },
    { name: "日産 リーフ", side: "right", isCommon: true, isJapan: true }, // ※充電口だがゲーム上右とする
    { name: "日産 ルークス", side: "left", isCommon: true, isJapan: true }, // 軽は左
    { name: "日産 デイズ", side: "left", isCommon: true, isJapan: true }, // 軽は左
    { name: "日産 フェアレディZ", side: "right", isCommon: false, isJapan: true },
    { name: "日産 GT-R", side: "right", isCommon: false, isJapan: true },
    { name: "日産 エルグランド", side: "right", isCommon: false, isJapan: true },
    { name: "日産 フーガ", side: "right", isCommon: false, isJapan: true },
    { name: "日産 ジューク", side: "right", isCommon: false, isJapan: true },
    { name: "日産 キューブ", side: "right", isCommon: false, isJapan: true },

    // ホンダ (左が多い)
    { name: "ホンダ N-BOX", side: "left", isCommon: true, isJapan: true },
    { name: "ホンダ フィット", side: "left", isCommon: true, isJapan: true },
    { name: "ホンダ フリード", side: "left", isCommon: true, isJapan: true },
    { name: "ホンダ ヴェゼル", side: "left", isCommon: true, isJapan: true },
    { name: "ホンダ ステップワゴン", side: "left", isCommon: true, isJapan: true },
    { name: "ホンダ N-WGN", side: "left", isCommon: true, isJapan: true },
    { name: "ホンダ オデッセイ", side: "left", isCommon: true, isJapan: true },
    { name: "ホンダ シャトル", side: "left", isCommon: true, isJapan: true },
    { name: "ホンダ シビック", side: "left", isCommon: true, isJapan: true },
    { name: "ホンダ N-ONE", side: "left", isCommon: false, isJapan: true },
    { name: "ホンダ S660", side: "left", isCommon: false, isJapan: true },
    { name: "ホンダ アコード", side: "left", isCommon: false, isJapan: true },
    { name: "ホンダ NSX", side: "left", isCommon: false, isJapan: true },
    { name: "ホンダ CR-Z", side: "left", isCommon: false, isJapan: true },
    { name: "ホンダ インサイト", side: "left", isCommon: false, isJapan: true },

    // マツダ (左が多い)
    { name: "マツダ MAZDA2", side: "left", isCommon: true, isJapan: true },
    { name: "マツダ MAZDA3", side: "left", isCommon: true, isJapan: true },
    { name: "マツダ CX-5", side: "left", isCommon: true, isJapan: true },
    { name: "マツダ CX-8", side: "left", isCommon: true, isJapan: true },
    { name: "マツダ CX-30", side: "left", isCommon: true, isJapan: true },
    { name: "マツダ デミオ", side: "left", isCommon: true, isJapan: true },
    { name: "マツダ ロードスター", side: "left", isCommon: false, isJapan: true },
    { name: "マツダ RX-8", side: "left", isCommon: false, isJapan: true },

    // スバル (右が多い)
    { name: "スバル インプレッサ", side: "right", isCommon: true, isJapan: true },
    { name: "スバル レヴォーグ", side: "right", isCommon: true, isJapan: true },
    { name: "スバル フォレスター", side: "right", isCommon: true, isJapan: true },
    { name: "スバル レガシィ", side: "right", isCommon: true, isJapan: true },
    { name: "スバル XV", side: "right", isCommon: true, isJapan: true },
    { name: "スバル BRZ", side: "right", isCommon: false, isJapan: true },
    { name: "スバル WRX", side: "right", isCommon: false, isJapan: true },

    // スズキ (左が多い)
    { name: "スズキ ワゴンR", side: "left", isCommon: true, isJapan: true },
    { name: "スズキ スペーシア", side: "left", isCommon: true, isJapan: true },
    { name: "スズキ ハスラー", side: "left", isCommon: true, isJapan: true },
    { name: "スズキ アルト", side: "left", isCommon: true, isJapan: true },
    { name: "スズキ スイフト", side: "left", isCommon: true, isJapan: true },
    { name: "スズキ ジムニー", side: "right", isCommon: true, isJapan: true }, // ジムニーは右
    { name: "スズキ ソリオ", side: "left", isCommon: true, isJapan: true },
    { name: "スズキ ラパン", side: "left", isCommon: true, isJapan: true },
    { name: "スズキ エブリイ", side: "right", isCommon: true, isJapan: true },
    { name: "スズキ クロスビー", side: "left", isCommon: false, isJapan: true },
    { name: "スズキ イグニス", side: "left", isCommon: false, isJapan: true },

    // ダイハツ (左が多い)
    { name: "ダイハツ タント", side: "left", isCommon: true, isJapan: true },
    { name: "ダイハツ ムーヴ", side: "left", isCommon: true, isJapan: true },
    { name: "ダイハツ ミライース", side: "left", isCommon: true, isJapan: true },
    { name: "ダイハツ ロッキー", side: "left", isCommon: true, isJapan: true },
    { name: "ダイハツ キャンバス", side: "left", isCommon: true, isJapan: true },
    { name: "ダイハツ ハイゼット", side: "left", isCommon: true, isJapan: true },
    { name: "ダイハツ コペン", side: "left", isCommon: false, isJapan: true },
    { name: "ダイハツ トール", side: "left", isCommon: false, isJapan: true },
    { name: "ダイハツ キャスト", side: "left", isCommon: false, isJapan: true },

    // 三菱 (左が多い)
    { name: "三菱 デリカD:5", side: "left", isCommon: true, isJapan: true },
    { name: "三菱 アウトランダー", side: "left", isCommon: true, isJapan: true },
    { name: "三菱 eKワゴン", side: "left", isCommon: true, isJapan: true },
    { name: "三菱 パジェロ", side: "left", isCommon: false, isJapan: true },
    { name: "三菱 ランサーエボリューション", side: "left", isCommon: false, isJapan: true },

    // --------------------------------------------------------
    // 外車 (右が多い傾向)
    // --------------------------------------------------------
    { name: "メルセデス・ベンツ Cクラス", side: "right", isCommon: true, isJapan: false },
    { name: "メルセデス・ベンツ Gクラス", side: "right", isCommon: true, isJapan: false },
    { name: "BMW 3シリーズ", side: "right", isCommon: true, isJapan: false },
    { name: "BMW MINI", side: "right", isCommon: true, isJapan: false },
    { name: "アウディ A4", side: "right", isCommon: true, isJapan: false },
    { name: "フォルクスワーゲン ゴルフ", side: "right", isCommon: true, isJapan: false },
    { name: "フォルクスワーゲン ポロ", side: "right", isCommon: true, isJapan: false },
    { name: "ボルボ XC60", side: "right", isCommon: true, isJapan: false }, // ボルボは右が多い
    { name: "ジープ ラングラー", side: "left", isCommon: true, isJapan: false }, // ジープは左が多い
    { name: "プジョー 208", side: "right", isCommon: false, isJapan: false },
    { name: "ルノー カングー", side: "right", isCommon: false, isJapan: false },
    { name: "ポルシェ 911", side: "right", isCommon: false, isJapan: false }, // フロント右
    { name: "フェラーリ 488", side: "left", isCommon: false, isJapan: false },
    { name: "ランボルギーニ ウラカン", side: "right", isCommon: false, isJapan: false },
    { name: "テスラ モデル3", side: "left", isCommon: false, isJapan: false }, // 充電口左後ろ
    { name: "フィアット 500", side: "right", isCommon: false, isJapan: false },
    { name: "トヨタ MIRAI", side: "left", isCommon: false, isJapan: true }, // 水素充填口は左
    { name: "ダイハツ ハイゼット", side: "right", isCommon: true, isJapan: true } // ユーザー指摘: ハイゼットは右
];

// 例外的にWikipedia APIで画像が取得しづらい車種の画像URLを直接指定する
const customImages = {
    // API検索で画像が出にくい車の画像URLをオリジナルサイズで直接指定
    "BMW MINI": "https://upload.wikimedia.org/wikipedia/commons/3/3b/2014_MINI_Cooper_front_view.jpg",
    "ジープ ラングラー": "https://upload.wikimedia.org/wikipedia/commons/1/1a/2018_Jeep_Wrangler_Sahara_Unlimited.jpg",
    "トヨタ スープラ": "https://upload.wikimedia.org/wikipedia/commons/3/30/2020_Toyota_Supra_3.0_Premium_front_10.23.19.jpg",
    "日産 フェアレディZ": "https://upload.wikimedia.org/wikipedia/commons/2/22/Nissan_Z_Proto.jpg",
    "日産 GT-R": "https://upload.wikimedia.org/wikipedia/commons/0/07/2017_Nissan_GT-R_Premium%2C_Front_Left%2C_08-20-2022.jpg",
    "アウディ A4": "https://upload.wikimedia.org/wikipedia/commons/0/0e/Audi_A4_Avant_2.0_TDI_S_line_%28B9%29_%E2%80%93_Frontansicht%2C_24._Dezember_2015%2C_Ratingen.jpg",
    "フォルクスワーゲン ポロ": "https://upload.wikimedia.org/wikipedia/commons/a/a2/Volkswagen_Polo_Highline_%28VI%29_%E2%80%93_Frontansicht%2C_4._M%C3%A4rz_2018%2C_D%C3%BCsseldorf.jpg",
    "ボルボ XC60": "https://upload.wikimedia.org/wikipedia/commons/0/06/Volvo_XC60_D5_AWD_R-Design_%28II%29_%E2%80%93_Frontansicht%2C_2._April_2018%2C_Ratingen.jpg",
    "レクサス LS": "https://upload.wikimedia.org/wikipedia/commons/2/23/2018_Lexus_LS_500h_front_4.6.18.jpg",
    "レクサス IS": "https://upload.wikimedia.org/wikipedia/commons/a/ae/Lexus_IS_300_F_Sport_%28ASE30%2C_facelift%29_front.jpg",
    
    // ベンツ・BMWなど追加
    "メルセデス・ベンツ Cクラス": "https://upload.wikimedia.org/wikipedia/commons/2/23/Mercedes-Benz_W206_IMG_5417.jpg",
    "メルセデス・ベンツ Eクラス": "https://upload.wikimedia.org/wikipedia/commons/a/a9/Mercedes-Benz_E_300_de_T-Modell_%28S_213%2C_Facelift%29_%E2%80%93_Frontansicht%2C_2._April_2021%2C_M%C3%BCnster.jpg",
    "メルセデス・ベンツ Sクラス": "https://upload.wikimedia.org/wikipedia/commons/3/36/Mercedes-Benz_S_500_4MATIC_%28W_223%29_%E2%80%93_Frontansicht%2C_5._September_2021%2C_M%C3%BCnchen.jpg",
    "メルセデス・ベンツ Gクラス": "https://upload.wikimedia.org/wikipedia/commons/8/86/Mercedes-Benz_G_500_%28W_463%2C_zweites_Facelift%29_%E2%80%93_Frontansicht%2C_5._April_2015%2C_D%C3%BCsseldorf.jpg",
    "BMW 3シリーズ": "https://upload.wikimedia.org/wikipedia/commons/a/a2/BMW_G20_IMG_0167.jpg",

    // 追加: ハイエース、ホンダ車、その他初級によく出る車
    "トヨタ アクア": "https://upload.wikimedia.org/wikipedia/commons/f/f6/Toyota_AQUA_Z_%286AA-MXPK11-AHXEB%29_front.jpg",
    "トヨタ プリウス": "./トヨタ/プリウス.jpg",
    "ダイハツ タント": "https://upload.wikimedia.org/wikipedia/commons/5/52/Daihatsu_TANTO_Custom_RS_%285BA-LA650S-GBVZ%29_front.jpg",
    "日産 セレナ": "https://upload.wikimedia.org/wikipedia/commons/e/e3/Nissan_SERENA_e-POWER_LUXION_%286AA-GC28%29_front.jpg",
    "日産 ノート (初代・2代目)": "https://upload.wikimedia.org/wikipedia/commons/4/41/Nissan_NOTE_e-POWER_NISMO_S_%28DAA-HE12%29_front.jpg",
    "日産 ノート (3代目 E13型)": "https://upload.wikimedia.org/wikipedia/commons/0/03/Nissan_NOTE_e-POWER_X_%286AA-E13%29_front.jpg",
    "トヨタ ハイエース": "./トヨタ/ハイエース.webp",
    "ホンダ フィット": "./ホンダ/フィット.jpg",
    "ホンダ フリード": "https://upload.wikimedia.org/wikipedia/commons/6/6f/2016_Honda_Freed_Hybrid_G_Honda_SENSING_front_view.jpg",
    "ホンダ ヴェゼル": "./ホンダ/ヴェゼル.jpg",
    "ホンダ ステップワゴン": "./ホンダ/ステップワゴン.jpg",
    "ホンダ オデッセイ": "./ホンダ/オデッセイ.jpg",
    "ホンダ シビック": "./ホンダ/シビック.jpg",
    "ホンダ N-WGN": "https://www.honda.co.jp/N-WGN/webcatalog/styling/design/image/pic_custom_color_01.jpg",
    "ホンダ シャトル": "./ホンダ/シャトル.jpg",
    "ホンダ S660": "https://upload.wikimedia.org/wikipedia/commons/2/2d/2015_Honda_S660_front_view.jpg",
    "ホンダ アコード": "https://upload.wikimedia.org/wikipedia/commons/7/75/2018_Honda_Accord_front_view.jpg",
    "ホンダ NSX": "https://upload.wikimedia.org/wikipedia/commons/1/19/2017_Honda_NSX_front_view.jpg",
    "ホンダ CR-Z": "https://upload.wikimedia.org/wikipedia/commons/4/4b/2010_Honda_CR-Z_front_view.jpg",
    "ホンダ インサイト": "./ホンダ/インサイト.jpg",
    // 追加: ルノー カングー、マツダ CX-5など
    "ルノー カングー": "./ルノー/カングー.jpg",
    "マツダ CX-5": "https://upload.wikimedia.org/wikipedia/commons/1/11/Mazda_CX-5_2.2_SKYACTIV-D_AWD_%28KF%2C_Facelift%29_%E2%80%93_Frontansicht%2C_1._April_2022%2C_D%C3%BCsseldorf.jpg",
    
    // その他のローカル追加分
    "フォルクスワーゲン ゴルフ": "./フォルクスワーゲン/ゴルフ.jpg",
    "ポルシェ 911": "./ポルシェ/911.jpg",
    "トヨタ MIRAI": "./トヨタ/ミライ.jpg"
};

// WikipediaのAPIを使用して画像を動的に取得する関数
async function fetchCarImage(carName) {
    if (customImages[carName]) {
        return customImages[carName];
    }

    const defaultImage = `https://placehold.co/400x250/e2e8f0/475569?text=${encodeURIComponent(carName)}`;
    
    try {
        // パターン1: スペースを「・」に変換して取得を試みる（日本車のWikipediaページ名規則）
        const titleWithDot = carName.replace(/ /g, "・");
        let url = `https://ja.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(titleWithDot)}&prop=pageimages&format=json&pithumbsize=400&origin=*`;
        let res = await fetch(url);
        let data = await res.json();
        let pages = data.query.pages;
        let pageId = Object.keys(pages)[0];
        
        if (pageId !== "-1" && pages[pageId].thumbnail) {
            return pages[pageId].thumbnail.source;
        }

        // パターン2: 検索APIを使って一番関連のあるページを探す
        const searchUrl = `https://ja.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(carName)}&utf8=&format=json&origin=*`;
        const searchRes = await fetch(searchUrl);
        const searchData = await searchRes.json();
        
        if (searchData.query.search && searchData.query.search.length > 0) {
            const bestTitle = searchData.query.search[0].title;
            
            url = `https://ja.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(bestTitle)}&prop=pageimages&format=json&pithumbsize=400&origin=*`;
            res = await fetch(url);
            data = await res.json();
            pages = data.query.pages;
            pageId = Object.keys(pages)[0];
            
            if (pageId !== "-1" && pages[pageId].thumbnail) {
                return pages[pageId].thumbnail.source;
            }
        }

        return defaultImage;
    } catch (error) {
        console.error("Image fetch error:", error);
        return defaultImage;
    }
}

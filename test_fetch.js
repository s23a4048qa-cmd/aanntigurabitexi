const cars = [
    "トヨタ アクア", "日産 セレナ", "ホンダ フィット", "スズキ ハスラー", "マツダ デミオ"
];

async function fetchCarImage(carName) {
    const defaultImage = `https://placehold.co/400x250/e2e8f0/475569?text=${encodeURIComponent(carName)}`;
    
    try {
        const searchUrl = `https://ja.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(carName + " 自動車")}&utf8=&format=json&origin=*`;
        const searchRes = await fetch(searchUrl);
        const searchData = await searchRes.json();
        
        if (!searchData.query.search || searchData.query.search.length === 0) {
            return {name: carName, url: defaultImage, reason: 'No search results'};
        }
        
        const bestTitle = searchData.query.search[0].title;
        
        const url = `https://ja.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(bestTitle)}&prop=pageimages&format=json&pithumbsize=400&origin=*`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        const pages = data.query.pages;
        const pageId = Object.keys(pages)[0];
        
        if (pageId !== "-1" && pages[pageId].thumbnail) {
            return {name: carName, title: bestTitle, url: pages[pageId].thumbnail.source};
        }

        return {name: carName, title: bestTitle, url: defaultImage, reason: 'No thumbnail in page'};
    } catch (error) {
        return {name: carName, url: defaultImage, reason: error.message};
    }
}

async function run() {
    for (const car of cars) {
        const res = await fetchCarImage(car);
        console.log(res);
    }
}
run();

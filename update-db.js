const fs = require('fs');

const dbParamsStr = fs.readFileSync('db.json', 'utf8');
const db = JSON.parse(dbParamsStr);

const friends = ["2", "3", "4", "5", "6", "7", "8", "9", "10"];
const categoriesOut = ["식비", "카페", "교통", "쇼핑", "문화/여가", "건강"];
const categoriesIn = ["급여", "용돈", "금융수입", "기타"];
const bankNames = ["KB국민은행", "신한은행", "하나은행", "우리은행", "카카오뱅크", "토스뱅크", "농협은행"];

const randomChoice = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomDateStr = () => {
    const start = new Date(2026, 2, 1).getTime(); // March 1st
    const end = new Date(2026, 4, 30).getTime(); // May 30th
    const d = new Date(start + Math.random() * (end - start));
    return d.toISOString().split('T')[0];
};

const randomTimeStr = () => {
    const h = String(randomInt(0, 23)).padStart(2, '0');
    const m = String(randomInt(0, 59)).padStart(2, '0');
    return `${h}:${m}`;
};

let accountIdCounter = 1000;
const newAccounts = [];

// me (userId = "1")
for (let i = 0; i < 8; i++) {
    const isOut = Math.random() > 0.2;
    newAccounts.push({
        id: String(accountIdCounter++),
        userId: "1",
        date: randomDateStr(),
        time: randomTimeStr(),
        bankName: randomChoice(bankNames),
        content: isOut ? "나의 외식/쇼핑" : "월급입금",
        category: isOut ? randomChoice(categoriesOut) : randomChoice(categoriesIn),
        amount: isOut ? randomInt(1, 100) * 1000 : randomInt(100, 300) * 10000,
        type: isOut ? "out" : "in",
        memo: "직접 작성한 기록",
        isPublic: Math.random() > 0.5
    });
}

// friends
friends.forEach(fid => {
    const count = randomInt(20, 30);
    for (let i = 0; i < count; i++) {
        const isOut = Math.random() > 0.1;
        newAccounts.push({
            id: String(accountIdCounter++),
            userId: fid,
            date: randomDateStr(),
            time: randomTimeStr(),
            bankName: randomChoice(bankNames),
            content: isOut ? randomChoice(["배달의민족", "스타벅스", "CGV", "지하철", "올리브영", "이마트"]) : randomChoice(["당근마켓 정산", "용돈", "월급"]),
            category: isOut ? randomChoice(categoriesOut) : randomChoice(categoriesIn),
            amount: isOut ? randomInt(1, 100) * 1000 : randomInt(10, 50) * 10000,
            type: isOut ? "out" : "in",
            memo: Math.random() > 0.5 ? "친구랑 맛있게!" : "",
            isPublic: Math.random() > 0.2
        });
    }
});

db.account = newAccounts.sort((a,b) => new Date(b.date) - new Date(a.date));

// clean up orphaned comments and reactions
db.comments = db.comments.filter(c => db.account.some(a => a.id === c.accountId));
db.reactions = db.reactions.filter(r => db.account.some(a => a.id === r.accountId));

fs.writeFileSync('db.json', JSON.stringify(db, null, "\t"));
console.log("Updated db.json successfully!");

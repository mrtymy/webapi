const fs = require('fs');
const path = require('path');

// games.json dosyasını oku
const gamesPath = path.join(__dirname, 'games.json');
const games = JSON.parse(fs.readFileSync(gamesPath, 'utf-8'));

// Her oyuna yeni alanları ekle
const updatedGames = games.map(game => {
  return {
    ...game,
    "oyun_aciklamasi": null,
    "kapak_resim": null,
    "dikey_resim": null,
    "yatay_resim": null
  };
});

// Güncellenmiş veriyi dosyaya yaz
fs.writeFileSync(gamesPath, JSON.stringify(updatedGames, null, 2), 'utf-8');

console.log(`✅ ${updatedGames.length} oyun güncellendi!`);
console.log('Eklenen alanlar:');
console.log('  - oyun_aciklamasi: null');
console.log('  - kapak_resim: null');
console.log('  - dikey_resim: null');
console.log('  - yatay_resim: null');

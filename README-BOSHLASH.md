# Zuxriddin Academy — avtomatik HTML test tizimi

Bu paket `index.html`, `reading.html`, `style.css` va avvalgi `reading-museums.html` faylini o‘z ichiga oladi. Boshqa bo‘limlar ham tayyor.

## 1) Papkani tayyorlash
1. Avval eski `zuxriddin-academy` papkangizni xavfsiz joyga **nusxalab qo‘ying**.
2. ZIP faylni oching. Ichidagi **barcha fayl va papkalarni**, jumladan `.github` va `scripts` papkalarini `zuxriddin-academy` ichiga ko‘chiring. Bir xil nomli fayllarni almashtiring.
3. `index.html` faylini oching — sayt lokal ishlaydi. Reading sahifasida Museums testi ko‘rinadi.

## 2) GitHub hisob va GitHub Desktop
1. https://github.com da hisob oching va email manzilingizni tasdiqlang.
2. https://desktop.github.com dan **GitHub Desktop** o‘rnating, GitHub hisobingiz bilan kiring.
3. GitHub Desktop ichida `File > Add local repository...` orqali `zuxriddin-academy` papkasini tanlang.
4. “This directory does not appear to be a Git repository” deyilsa, `create a repository here` ni bosing.
5. Commit xabari (Summary): `Zuxriddin Academy first version`; **Commit to main** ni bosing.
6. **Publish repository** tugmasini bosing; nomi `zuxriddin-academy` bo‘lsin. **Keep this code private** belgisini olib tashlang (Public). Publish repository.

## 3) GitHub Pages
1. GitHub saytingizdagi `zuxriddin-academy` repositoryga kiring.
2. `Settings > Pages` ni oching.
3. **Build and deployment > Source** ga **GitHub Actions** ni tanlang.
4. `Actions` sahifasiga o‘ting. `Zuxriddin Academy - Publish Tests` muvaffaqiyatli tugashi kerak. Agar Pages sozlashdan avval ishlagan bo‘lsa, `Actions > Zuxriddin Academy - Publish Tests > Run workflow` ni bosing.
5. Sayt: `https://USERNAME.github.io/zuxriddin-academy/` (USERNAME o‘rniga GitHub login).

## 4) Har kuni yangi HTML test yuklash (eng oson usul)
1. GitHub saytidagi `zuxriddin-academy` repository asosiy sahifasini oching.
2. **Add file > Upload files** ni bosing.
3. Tayyor HTML testni `reading-a2-2026-11-23.html` kabi nomlang va yuklang.
4. **Commit changes** ni bosing. GitHub Actions yangi testni topib, sahifani avtomatik yangilaydi.
5. **Reading > A2** sahifasiga kirib tekshiring. `reading.html` ni o‘zgartirmaysiz.

Fayl nomining birinchi qismi **bo‘lim** va **daraja**ni bildiradi:
- `reading-a2-2026-11-23.html` → Reading > A2
- `reading-b1-test02.html` → Reading > B1
- `listening-a2-test01.html` → Listening > A2
- `grammar-b1-test05.html` → Grammar > B1
- `vocabulary-a1-day03.html` → Vocabulary > A1
- `speaking-b2-day04.html` → Speaking > B2

Muqobil usul: `tests/reading/a2/` kabi papkaga xohlagan nomdagi HTML faylni ham joylashingiz mumkin. Lekin papka ichidagi fayllarda bosh sahifaga nisbiy havola `../../../index.html` bo‘lishi kerak. Dastlab **asosiy papkaga nom qoidasiga amal qilib yuklashni** tavsiya qilamiz.

### Muhim
- `tests/<subject>/<level>/` papkasiga faqat **mustaqil ishlaydigan** HTML fayllarini yuklash oson. Alohida CSS/JS/audio fayllar ham ishlaydi, ammo ichidagi havolalarni to‘g‘ri ko‘rsatish kerak.
- Bu maxsus loginli admin sahifa emas; hozircha GitHub sizning xavfsiz yuklash panelingiz bo‘ladi. Sayt va HTML testlari **ommaga ochiq**.
- Test nomi fayl ichidagi `<title>...</title>` dan olinadi.
- Yangi test GitHub.com orqali kiritilsa, uni kompyuteringizdagi eski nusxada ko‘rish uchun GitHub Desktop'da **Fetch origin > Pull origin** qiling.
- Ko‘chirilgan uchinchi tomon matn va testlarini saytda ommaga e’lon qilishdan avval nashr qilish huquqini tekshiring. Manba havolasi o‘zi ruxsat o‘rnini bosmaydi.

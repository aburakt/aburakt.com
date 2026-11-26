# CV

Kaynak `cv.typ` (Typst). ATS kuralları: tek sütun, tablo/ikon/görsel yok, standart başlıklar (Summary, Experience, Projects, Skills, Education, Certifications, Languages), tarih biçimi `Mon YYYY – Present`, uzun tire yok.

## Derleme

```bash
pip install typst            # ya da: brew install typst
python3 -c "import typst; typst.compile('cv/cv.typ', output='apps/web/public/cv/Ahmet_Burak_Tekin_CV.v2026-11c.pdf')"
# typst CLI ile: typst compile cv/cv.typ apps/web/public/cv/Ahmet_Burak_Tekin_CV.v2026-11c.pdf
```

## Yeni sürüm

1. `cv.typ`'de `version`'ı ve içeriği güncelle, yeni adla derle (`Ahmet_Burak_Tekin_CV.vYYYY-MM.pdf`).
2. `apps/web/src/pages/cv.astro` ve `en/cv.astro`'da `CV_FILE`'ı değiştir, eski PDF'i sil.
3. `apps/web/public/_redirects`'e eski adı yeni ada 301 ile ekle (dışarıdaki bağlantılar kırılmasın).
4. Kontrol: `pdftotext <pdf> - | less` metin sırası doğru mu, `pdfinfo` 2 sayfa ve A4 mü.

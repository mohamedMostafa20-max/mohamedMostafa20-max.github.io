"""Build the static Arabic pages in /ar/ from the English pages (run after editing any English page).
Each element's Arabic text lives in data-ar; here it is written into the page itself so Google reads Arabic."""
import os, re, html
from bs4 import BeautifulSoup

SITE = "https://mohamedmostafa20-max.github.io/"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAGES = {
    "index.html": ("محمد مصطفى | مهندس إنشائي لتصميم المنشآت المعدنية في مصر",
                   "محمد مصطفى، مهندس مدني وإنشائي متخصص في تصميم المنشآت المعدنية في 6 أكتوبر، الجيزة، مصر. تصميم هناجر ومخازن ومصانع معدنية، ومظلات محطات الوقود، وجمالونات، وخزانات API 650، ووصلات معدنية، لأكثر من 200 مشروع في مصر والسعودية والإمارات."),
    "projects.html": ("مشاريع المنشآت المعدنية | محمد مصطفى - مهندس إنشائي",
                      "مشاريع منشآت معدنية صممها م. محمد مصطفى: هناجر ومخازن ومصانع، مظلات محطات وقود، أسقف وقباب، خزانات API 650 ووصلات معدنية في مصر والسعودية والإمارات."),
    "about.html": ("نبذة عن م. محمد مصطفى | مهندس تصميم منشآت معدنية",
                   "نبذة عن م. محمد مصطفى، مهندس مدني وتصميم منشآت معدنية في 6 أكتوبر، الجيزة: الخبرة، البرامج، الأكواد، التعليم والشهادات."),
    "expertise.html": ("خدمات تصميم المنشآت المعدنية | محمد مصطفى",
                       "خدمات التصميم الإنشائي للمنشآت المعدنية: هناجر ومخازن، مظلات، جمالونات، خزانات API 650، تصميم الوصلات، مذكرات الحسابات ومراجعة الرسومات التنفيذية."),
    "contact.html": ("تواصل واطلب تسعير تصميم منشأ معدني | محمد مصطفى",
                     "تواصل مع م. محمد مصطفى لطلب تسعير تصميم إنشائي لمنشأ معدني: واتساب أو إيميل أو ابعت الرسومات المعمارية."),
}
ASSET = re.compile(r'^(images/|style\.css|main\.js|favicon\.ico|Mohamed_Mustafa_CV\.pdf)')

os.makedirs(os.path.join(ROOT, "ar"), exist_ok=True)
for page, (title, desc) in PAGES.items():
    soup = BeautifulSoup(open(os.path.join(ROOT, page), encoding="utf-8").read(), "html.parser")
    soup.html["lang"] = "ar"
    soup.html["dir"] = "rtl"
    for el in soup.select("[data-ar]"):
        el["data-en"] = el.decode_contents()
        ar = el["data-ar"]
        el.clear()
        el.append(BeautifulSoup(ar, "html.parser"))
    for tag, attr in (("link", "href"), ("script", "src"), ("img", "src"), ("a", "href"), ("source", "srcset")):
        for el in soup.find_all(tag):
            v = el.get(attr)
            if v and ASSET.match(v):
                el[attr] = "../" + v
    url_ar = SITE + "ar/" + ("" if page == "index.html" else page)
    url_en = SITE + ("" if page == "index.html" else page)
    soup.title.string = title
    soup.find("meta", attrs={"name": "description"})["content"] = desc
    soup.find("link", rel="canonical")["href"] = url_ar
    for l in soup.find_all("link", rel="alternate"):
        l["href"] = {"en": url_en, "ar": url_ar, "x-default": url_en}.get(l.get("hreflang"), l["href"])
    for prop, val in (("og:url", url_ar), ("og:title", title), ("og:description", desc), ("og:locale", "ar_EG")):
        m = soup.find("meta", property=prop)
        if m:
            m["content"] = val
    btn = soup.find(id="lang-toggle")
    btn.string = "English"
    btn["aria-label"] = "Switch to English"
    open(os.path.join(ROOT, "ar", page), "w", encoding="utf-8").write(str(soup))
    print("ar/" + page)
